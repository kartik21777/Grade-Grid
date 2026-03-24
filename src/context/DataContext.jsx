import React, { createContext, useContext, useState, useMemo } from 'react';
import { CLASSES, STUDENTS, ASSIGNMENTS as INITIAL_ASSIGNMENTS, SUBMISSIONS as INITIAL_SUBMISSIONS } from '../data/mockData';

export const SUBJECTS = [
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
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState(INITIAL_SUBMISSIONS);
  const currentUser = user;

  // Actions
  const addAssignment = (newAssignment) => {
    const id = Date.now();
    setAssignments(prev => [...prev, { ...newAssignment, id }]);
    return id;
  };

  const updateSubmission = (assignmentId, studentId, gradeData) => {
    setSubmissions(prev => {
      const existingIdx = prev.findIndex(s => s.assignmentId === assignmentId && s.studentId === studentId);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = { 
          ...updated[existingIdx], 
          status: 'Submitted', 
          graded: true, 
          score: gradeData 
        };
        return updated;
      } else {
        return [...prev, { 
          assignmentId, 
          studentId, 
          status: 'Submitted', 
          graded: true, 
          score: gradeData,
          file: 'manual_entry.pdf'
        }];
      }
    });
  };

  const submitWork = (assignmentId, studentId, file) => {
    setSubmissions(prev => {
      const existingIdx = prev.findIndex(s => s.assignmentId === assignmentId && s.studentId === studentId);
      const submissionDate = new Date().toISOString().split('T')[0];
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = { 
          ...updated[existingIdx], 
          status: 'Submitted', 
          file, 
          submissionDate 
        };
        return updated;
      } else {
        return [...prev, { 
          assignmentId, 
          studentId, 
          status: 'Submitted', 
          file, 
          submissionDate, 
          graded: false 
        }];
      }
    });
  };

  // Derived Data (Memoized for performance)
  const facultyClasses = useMemo(() => CLASSES, []);

  const classData = useMemo(() => {
    return CLASSES.reduce((acc, cls) => {
      const clsAssignments = assignments.filter(a => a.classId === cls.id);
      const clsStudents = STUDENTS.filter(s => s.classId === cls.id);

      acc[cls.id] = {
        assignments: clsAssignments.map(a => a.title),
        students: clsStudents.map(student => {
          const studentSubmissions = submissions.filter(s => s.studentId === student.id);
          const scores = clsAssignments.map(assignment => {
            const sub = studentSubmissions.find(s => s.assignmentId === assignment.id);
            if (sub && sub.graded) {
              return (sub.score.code || 0) + (sub.score.func || 0) + (sub.score.doc || 0);
            }
            return null;
          });
          return { name: student.name, scores };
        })
      };
      return acc;
    }, {});
  }, [assignments, submissions]);

  const classAssignmentsByClassId = useMemo(() => {
    return CLASSES.reduce((acc, cls) => {
      acc[cls.id] = assignments.filter(a => a.classId === cls.id);
      return acc;
    }, {});
  }, [assignments]);

  const submissionsByAssignment = useMemo(() => {
    return assignments.reduce((acc, assignment) => {
      acc[assignment.id] = submissions
        .filter(s => s.assignmentId === assignment.id)
        .map(s => ({
          ...s,
          id: s.studentId + "_" + s.assignmentId,
          name: STUDENTS.find(stu => stu.id === s.studentId)?.name || 'Unknown'
        }));
      return acc;
    }, {});
  }, [assignments, submissions]);

  const mockStudents = useMemo(() => {
    return STUDENTS.reduce((acc, student) => {
      const studentSubmissions = submissions.filter(s => s.studentId === student.id);
      const studentAssignments = assignments.filter(a => a.classId === student.classId).map(a => {
        const sub = studentSubmissions.find(s => s.assignmentId === a.id);
        return {
          id: a.id,
          title: a.title,
          status: sub ? sub.status : 'Pending',
          file: sub ? sub.file : null,
          graded: sub ? sub.graded : false,
          score: sub ? sub.score : null
        };
      });

      acc[student.rollNo] = {
        rollNo: student.rollNo,
        name: student.name,
        class: CLASSES.find(c => c.id === student.classId)?.name || 'Unknown',
        assignments: studentAssignments
      };
      return acc;
    }, {});
  }, [assignments, submissions]);

  const getStudentAssignmentsByRoll = (rollNo) => {
    const student = STUDENTS.find(s => s.rollNo === rollNo);
    if (!student) return [];

    return assignments.filter(a => a.classId === student.classId).map(a => {
      const sub = submissions.find(s => s.studentId === student.id && s.assignmentId === a.id);
      return {
        id: a.id,
        title: a.title,
        subject: a.subject,
        course: CLASSES.find(c => c.id === a.classId)?.name || 'Unknown',
        dueDate: a.dueDate,
        dueTime: a.dueTime,
        submitted: sub ? sub.status === 'Submitted' : false,
        submissionDate: sub ? (sub.submissionDate || '2026-03-20') : null
      };
    });
  };

  const getStudentResultsByRoll = (rollNo) => {
    const student = STUDENTS.find(s => s.rollNo === rollNo);
    if (!student) return [];

    const studentSubmissions = submissions.filter(s => s.studentId === student.id && s.graded);
    return studentSubmissions.map(sub => {
      const assignment = assignments.find(a => a.id === sub.assignmentId);
      const totalMarks = (sub.score.code || 0) + (sub.score.func || 0) + (sub.score.doc || 0);
      return {
        id: sub.assignmentId,
        title: assignment?.title || 'Unknown Assignment',
        course: CLASSES.find(c => c.id === assignment?.classId)?.name || 'Unknown',
        checkedDate: '2026-03-24',
        totalMarks: 100,
        obtainedMarks: totalMarks,
        feedback: sub.score.remark || 'Good effort, keep it up!',
        criteria: [
          { name: 'Code Quality', marks: sub.score.code, max: 25 },
          { name: 'Functionality', marks: sub.score.func, max: 50 },
          { name: 'Documentation', marks: sub.score.doc, max: 25 },
        ]
      };
    });
  };

  const value = {
    currentUser,
    classes: CLASSES,
    students: STUDENTS,
    subjects: SUBJECTS,
    assignments,
    submissions,
    facultyClasses,
    classData,
    classAssignmentsByClassId,
    submissionsByAssignment,
    mockStudents,
    getStudentAssignmentsByRoll,
    getStudentResultsByRoll,
    addAssignment,
    updateSubmission,
    submitWork
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
