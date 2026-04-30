import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useAlert } from './AlertContext';
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
  const [notes, setNotes] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();
  const currentUser = user;
  const calculateTotal = (score) => {
    if (!score) return 0;
    return Object.values(score).reduce((sum, val) => sum + (Number(val) || 0), 0);
  };

  // Exclude mock definitions here for length, but dynamically generate them if needed dynamically

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/data');
      const data = await res.json();
      setClasses(data.classes || []);
      setStudents(data.students || []);
      setAssignments(data.assignments || []);
      setSubmissions(data.submissions || []);
      setNotes(data.notes || []);
      setTeachers(data.teachers || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = () => fetchData();


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

  const updateSubmission = async (assignmentId, studentIdRaw, gradeData) => {
    try {
      // Resolve studentId internal vs rollNo
      const student = students.find(s => s.rollNo === studentIdRaw || String(s.id) === String(studentIdRaw));
      const internalStudentId = student ? student.id : studentIdRaw;

      const { remark, feedback: gradeFeedback, ...scoreObj } = gradeData;
      const feedbackMessage = remark || gradeFeedback;

      const payload = { 
        graded: true, 
        status: 'Submitted', 
        score: scoreObj,
        ...(feedbackMessage && { feedback: feedbackMessage })
      };
      
      const res = await fetch(`http://localhost:5000/api/submissions/${internalStudentId}/${assignmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (res.ok && data.updatedScore) {
        setSubmissions(prev => {
          const existingIdx = prev.findIndex(s => String(s.assignmentId) === String(assignmentId) && String(s.studentId) === String(internalStudentId));
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
    const submissionDate = new Date().toISOString().split('T')[0];
    const fileName = typeof fileOrString === 'object' && fileOrString?.name
      ? fileOrString.name
      : (fileOrString || 'submission.zip');

    // Find student internal ID from rollNo if needed
    const student = students.find(s => s.rollNo === studentId || s.id === studentId);
    const internalStudentId = student?.id || studentId;

    // Optimistic local state update — happens immediately so UI reflects the change
    setSubmissions(prev => {
      const existingIdx = prev.findIndex(
        s => String(s.assignmentId) === String(assignmentId) && (s.studentId === internalStudentId || s.studentId === studentId)
      );
      const newEntry = {
        assignmentId: Number(assignmentId) || assignmentId,
        studentId: internalStudentId,
        status: 'Submitted',
        file: fileName,
        submissionDate,
        graded: false,
        score: null
      };
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...newEntry };
        return updated;
      }
      return [...prev, newEntry];
    });

    // Backend sync (best-effort, won't block UI)
    try {
      const formData = new FormData();
      formData.append('status', 'Submitted');
      formData.append('submissionDate', submissionDate);
      formData.append('file', fileOrString);

      await fetch(`http://localhost:5000/api/submissions/${studentId}/${assignmentId}`, {
        method: 'PUT',
        body: formData
      });
    } catch (err) {
      console.warn("Backend sync failed (submission recorded locally):", err.message);
    }
  };

  // Derived Data (Memoized for performance)
  const facultyClasses = useMemo(() => {
    if (!currentUser || currentUser.role !== 'teacher') return [];
    const teacherProfile = teachers.find(t => t.empId === currentUser.id);
    if (!teacherProfile) return [];
    
    // Ensure all IDs are strings for safe comparison
    const assignedClassIds = (teacherProfile.assignedClasses || []).map(id => String(id));
    return classes.filter(c => assignedClassIds.includes(String(c.id)));
  }, [currentUser, teachers, classes]);

  const classData = useMemo(() => {
    const now = new Date();
    const isBeforeDue = (dueDate, dueTime) => new Date(`${dueDate}T${dueTime}`) > now;

    return classes.reduce((acc, cls) => {
      const clsAssignments = assignments.filter(a => a.classId == cls.id);
      const clsStudents = students.filter(s => s.classId == cls.id);

      acc[cls.id] = {
        assignments: clsAssignments.map(a => a.title),
        students: clsStudents.map(student => {
          const studentSubmissions = submissions.filter(s => String(s.studentId) === String(student.id));
          const scores = clsAssignments.map(assignment => {
            const sub = studentSubmissions.find(s => String(s.assignmentId) === String(assignment.id));
            
            if (sub && sub.graded && sub.score) {
              return { value: calculateTotal(sub.score), status: 'Graded' };
            }

            const isSubmitted = sub && sub.status === 'Submitted';
            const isMissed = !isSubmitted && !isBeforeDue(assignment.dueDate, assignment.dueTime);
            
            return { 
              value: 0, 
              status: isMissed ? 'Missed' : 'Pending' 
            };
          });
          return { name: student.name, scores };
        })
      };
      return acc;
    }, {});
  }, [classes, students, assignments, submissions]);

  const classAssignmentsByClassId = useMemo(() => {
    return classes.reduce((acc, cls) => {
      acc[cls.id] = assignments.filter(a => String(a.classId) === String(cls.id));
      return acc;
    }, {});
  }, [classes, assignments]);

  const submissionsByAssignment = useMemo(() => {
    return assignments.reduce((acc, assignment) => {
      const classStudents = students.filter(stu => String(stu.classId) === String(assignment.classId));

      acc[assignment.id] = classStudents.map(student => {
        const sub = submissions.find(s =>
          String(s.assignmentId) === String(assignment.id) &&
          String(s.studentId) === String(student.id)
        );

        if (sub) {
          return {
            ...sub,
            id: student.id + "_" + assignment.id,
            name: student.name
          };
        }

        // Virtual "Pending" submission for roster completeness
        return {
          id: student.id + "_" + assignment.id,
          studentId: student.id,
          assignmentId: assignment.id,
          name: student.name,
          status: 'Pending',
          graded: false,
          score: null,
          file: null
        };
      });
      return acc;
    }, {});
  }, [assignments, submissions, students]);

  const mockStudents = useMemo(() => {
    return students.reduce((acc, student) => {
      const studentSubmissions = submissions.filter(s => String(s.studentId) === String(student.id));
      const studentAssignments = assignments.filter(a => String(a.classId) === String(student.classId)).map(a => {
        const sub = studentSubmissions.find(s => String(s.assignmentId) === String(a.id));
        return {
          id: a.id,
          title: a.title,
          rubrics: a.rubrics || { code: 25, func: 50, doc: 25 },
          status: sub ? sub.status : 'Pending',
          file: sub ? sub.file : null,
          graded: sub ? sub.graded : false,
          score: sub ? sub.score : null,
          feedback: sub ? (sub.feedback || null) : null,
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

    return assignments.filter(a => String(a.classId) === String(student.classId)).map(a => {
      const sub = submissions.find(s => String(s.studentId) === String(student.id) && String(s.assignmentId) === String(a.id));
      return {
        id: a.id,
        title: a.title,
        subject: a.subject,
        course: classes.find(c => c.id === a.classId)?.name || 'Unknown',
        dueDate: a.dueDate,
        dueTime: a.dueTime,
        submitted: sub ? sub.status === 'Submitted' : false,
        submissionDate: sub ? (sub.submissionDate || '2026-03-20') : null,
        teacherFile: a.file
      };
    });
  };

  const getStudentNotesByRoll = (rollNo) => {
    const student = students.find(s => s.rollNo === rollNo);
    if (!student) return [];

    return notes.filter(n => String(n.classId) === String(student.classId)).map(n => ({
      ...n,
      course: classes.find(c => String(c.id) === String(n.classId))?.name || 'Unknown'
    }));
  };

  const addNotes = async (noteData) => {
    try {
      const formData = new FormData();
      formData.append('title', noteData.title);
      formData.append('subject', noteData.subject);
      formData.append('classId', noteData.classId);
      formData.append('file', noteData.file); // The actual File object

      const res = await fetch('http://localhost:5000/api/notes', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setNotes(prev => [...prev, data.note]);
        showAlert('Notes shared successfully!', 'success');
      } else {
        showAlert('Failed to share notes: ' + data.message, 'error');
      }
    } catch (error) {
      console.error("Error adding notes:", error);
      showAlert('Error connecting to server while sharing notes.', 'error');
    }
  };

  const getStudentResultsByRoll = (rollNo) => {
    const student = students.find(s => s.rollNo === rollNo);
    if (!student) return [];

    const now = new Date();
    const isBeforeDue = (dueDate, dueTime) => new Date(`${dueDate}T${dueTime}`) > now;

    // Filter assignments for the student's class
    const studentAssignments = assignments.filter(a => String(a.classId) === String(student.classId));

    return studentAssignments.map(assignment => {
      const sub = submissions.find(s => String(s.studentId) === String(student?.id) && String(s.assignmentId) === String(assignment.id));
      const assignmentRubric = assignment?.rubrics || { code: 25, func: 50, doc: 25 };

      const isSubmitted = sub && sub.status === 'Submitted';
      const isGraded = sub && sub.graded && sub.score;
      const isMissed = !isSubmitted && !isBeforeDue(assignment.dueDate, assignment.dueTime);

      const obtainedScore = isGraded ? sub.score : null;

      return {
        id: assignment.id,
        title: assignment.title || 'Unknown Assignment',
        subject: assignment.subject || 'General',
        course: classes.find(c => String(c.id) === String(assignment.classId))?.name || 'Unknown',
        checkedDate: sub?.submissionDate || (isMissed ? 'N/A' : 'TBD'),
        feedback: isMissed ? 'Deadline missed' : (sub?.feedback || (isGraded ? 'Graded successfully.' : 'Pending Grade')),
        totalMarks: calculateTotal(assignmentRubric),
        obtainedMarks: isGraded ? calculateTotal(obtainedScore) : 0,
        isMissed,
        criteria: Object.keys(assignmentRubric).map(key => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          marks: obtainedScore?.[key] || 0,
          max: assignmentRubric[key]
        }))
      };
    });
  };

  const value = {
    currentUser,
    classes,
    students,
    teachers,
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
    submitWork,
    refreshData
  };

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
