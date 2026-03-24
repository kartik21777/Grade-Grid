import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { NOTES } from '../data/mockData';

// SUBJECTS can remain static since it's just strings
const SUBJECTS = [
  'Data Structures',
  'Algorithms',
  'Web Development',
  'Database Management',
  'Python',
  'Operating Systems',
  'Computer Networks'
];

const DataContext = createContext();

export const DataProvider = ({ children, user }) => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [notes, setNotes] = useState(NOTES || []);
  const [loading, setLoading] = useState(true);
  const currentUser = user;

  // Exclude mock definitions here for length, but dynamically generate them if needed dynamically

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/data');
        const data = await res.json();

        setClasses(data.classes || []);
        setStudents(data.students || []);
        setAssignments(data.assignments || []);
        setSubmissions(data.submissions || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Actions
  const addAssignment = async (newAssignment) => {
    try {
      const id = Date.now();
      const formData = new FormData();
      formData.append('id', id);
      formData.append('title', newAssignment.title);
      formData.append('subject', newAssignment.subject);
      formData.append('classId', newAssignment.classId);
      formData.append('dueDate', newAssignment.dueDate);
      formData.append('dueTime', newAssignment.dueTime);
      formData.append('rubrics', JSON.stringify(newAssignment.rubrics || { code: 25, func: 50, doc: 25 }));

      if (newAssignment.file) {
        formData.append('file', newAssignment.file);
      }

      const res = await fetch('http://localhost:5000/api/assignments', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      // Update local state to immediately reflect the change
      if (data.newAssignment) {
        setAssignments(prev => [...prev, data.newAssignment]);
      }
      return id;
    } catch (err) {
      console.error("Failed to add assignment", err);
    }
  };

  const updateSubmission = async (assignmentId, studentId, gradeData) => {
    try {
      const payload = { graded: true, status: 'Submitted', score: gradeData };
      const res = await fetch(`http://localhost:5000/api/submissions/${studentId}/${assignmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.updatedScore) {
        setSubmissions(prev => {
          const existingIdx = prev.findIndex(s => s.assignmentId == assignmentId && s.studentId == studentId);
          if (existingIdx > -1) {
            const updated = [...prev];
            updated[existingIdx] = data.updatedScore;
            return updated;
          } else {
            return [...prev, data.updatedScore];
          }
        });
      }
    } catch (err) {
      console.error("Failed to update submission grade", err);
    }
  };

  const submitWork = async (assignmentId, studentId, fileOrString) => {
    try {
      const submissionDate = new Date().toISOString().split('T')[0];
      const formData = new FormData();
      formData.append('status', 'Submitted');
      formData.append('submissionDate', submissionDate);

      if (typeof fileOrString === 'object' && fileOrString !== null) {
        formData.append('file', fileOrString);
      } else {
        formData.append('file', fileOrString);
      }

      const res = await fetch(`http://localhost:5000/api/submissions/${studentId}/${assignmentId}`, {
        method: 'PUT',
        body: formData
      });
      const data = await res.json();

      if (res.ok && data.updatedScore) {
        setSubmissions(prev => {
          const existingIdx = prev.findIndex(s => s.assignmentId == assignmentId && s.studentId == studentId);
          if (existingIdx > -1) {
            const updated = [...prev];
            updated[existingIdx] = data.updatedScore;
            return updated;
          } else {
            return [...prev, data.updatedScore];
          }
        });
      }

    } catch (err) {
      console.error("Failed to submit work", err);
    }
  };

  // Derived Data (Memoized for performance)
  const facultyClasses = useMemo(() => classes, [classes]);

  const classData = useMemo(() => {
    return classes.reduce((acc, cls) => {
      const clsAssignments = assignments.filter(a => a.classId == cls.id);
      const clsStudents = students.filter(s => s.classId == cls.id);

      acc[cls.id] = {
        assignments: clsAssignments.map(a => a.title),
        students: clsStudents.map(student => {
          const studentSubmissions = submissions.filter(s => s.studentId === student.id);
          const scores = clsAssignments.map(assignment => {
            const sub = studentSubmissions.find(s => s.assignmentId === assignment.id);
            if (sub && sub.graded && sub.score) {
              return (sub.score.code || 0) + (sub.score.func || 0) + (sub.score.doc || 0);
            }
            return null;
          });
          return { name: student.name, scores };
        })
      };
      return acc;
    }, {});
  }, [classes, students, assignments, submissions]);

  const classAssignmentsByClassId = useMemo(() => {
    return classes.reduce((acc, cls) => {
      acc[cls.id] = assignments.filter(a => a.classId == cls.id);
      return acc;
    }, {});
  }, [classes, assignments]);

  const submissionsByAssignment = useMemo(() => {
    return assignments.reduce((acc, assignment) => {
      acc[assignment.id] = submissions
        .filter(s => s.assignmentId == assignment.id)
        .map(s => ({
          ...s,
          id: s.studentId + "_" + s.assignmentId,
          name: s.studentName || students.find(stu => stu.id == s.studentId)?.name || 'Unknown'
        }));
      return acc;
    }, {});
  }, [assignments, submissions, students]);

  const mockStudents = useMemo(() => {
    return students.reduce((acc, student) => {
      const studentSubmissions = submissions.filter(s => s.studentId == student.id);
      const studentAssignments = assignments.filter(a => a.classId == student.classId).map(a => {
        const sub = studentSubmissions.find(s => s.assignmentId == a.id);
        return {
          id: a.id,
          title: a.title,
          status: sub ? sub.status : 'Pending',
          file: sub ? sub.file : null,
          graded: sub ? sub.graded : false,
          score: sub ? sub.score : null,
          submissionDate: sub ? sub.submissionDate : null
        };
      });

      acc[student.rollNo] = {
        rollNo: student.rollNo,
        name: student.name,
        class: classes.find(c => c.id == student.classId)?.name || 'Unknown',
        assignments: studentAssignments
      };
      return acc;
    }, {});
  }, [classes, students, assignments, submissions]);

  const getStudentAssignmentsByRoll = (rollNo) => {
    const student = students.find(s => s.rollNo === rollNo);
    if (!student) return [];

    return assignments.filter(a => a.classId == student.classId).map(a => {
      const sub = submissions.find(s => s.studentId == student.id && s.assignmentId == a.id);
      return {
        id: a.id,
        title: a.title,
        subject: a.subject,
        course: classes.find(c => c.id === a.classId)?.name || 'Unknown',
        dueDate: a.dueDate,
        dueTime: a.dueTime,
        submitted: sub ? sub.status === 'Submitted' : false,
        submissionDate: sub ? (sub.submissionDate || '2026-03-20') : null
      };
    });
  };

  const getStudentNotesByRoll = (rollNo) => {
    const student = students.find(s => s.rollNo === rollNo);
    if (!student) return [];

    return notes.filter(n => n.classId === student.classId).map(n => ({
      ...n,
      course: classes.find(c => c.id === n.classId)?.name || 'Unknown'
    }));
  };

  const addNotes = (newNote) => {
    // Basic mock implementation array push
    setNotes(prev => [...prev, { ...newNote, id: Date.now() }]);
  };

  const getStudentResultsByRoll = (rollNo) => {
    const student = students.find(s => s.rollNo === rollNo);
    if (!student) return [];

    const studentSubmissions = submissions.filter(s => s.studentId == student.id && s.graded);
    return studentSubmissions.map(sub => {
      const assignment = assignments.find(a => a.id == sub.assignmentId);
      const totalMarks = (sub.score?.code || 0) + (sub.score?.func || 0) + (sub.score?.doc || 0);
      return {
        id: sub.assignmentId,
        title: assignment?.title || 'Unknown Assignment',
        course: classes.find(c => c.id === assignment?.classId)?.name || 'Unknown',
        checkedDate: sub.submissionDate || '2026-03-24',
        totalMarks: 100,
        obtainedMarks: totalMarks,
        feedback: sub.feedback || 'Graded successfully.',
        criteria: [
          { name: 'Code Quality', marks: sub.score?.code || 0, max: 25 },
          { name: 'Functionality', marks: sub.score?.func || 0, max: 50 },
          { name: 'Documentation', marks: sub.score?.doc || 0, max: 25 },
        ]
      };
    });
  };

  const value = {
    currentUser,
    classes,
    students,
    subjects: SUBJECTS,
    assignments,
    submissions,
    notes,
    facultyClasses,
    classData,
    classAssignmentsByClassId,
    submissionsByAssignment,
    mockStudents,
    getStudentAssignmentsByRoll,
    getStudentResultsByRoll,
    getStudentNotesByRoll,
    addAssignment,
    addNotes,
    updateSubmission,
    submitWork
  };

  if (loading) {
    return <div style={{ color: 'white', padding: '20px', textAlign: 'center' }}>Loading Data from MongoDB...</div>;
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};
