/**
 * Central Mock Data Source
 * This file contains the base data for classes, students, assignments, and submissions.
 * It also exports derived structures to maintain compatibility with existing components.
 */

// Base Data: Classes
export const CLASSES = [
  { id: 1, name: 'Year 2 - CSE A' },
  { id: 2, name: 'Year 3 - IT A' },
  { id: 3, name: 'Year 1 - CSE B' }
];

// Base Data: Students
export const STUDENTS = [
  { id: 'S1', rollNo: 'CS-101', name: 'Alice Smith', classId: 1 },
  { id: 'S2', rollNo: 'CS-102', name: 'Bob Jones', classId: 1 },
  { id: 'S3', rollNo: 'IT-201', name: 'Charlie Brown', classId: 2 },
  { id: 'S4', rollNo: 'IT-202', name: 'Diana Prince', classId: 2 },
  { id: 'S5', rollNo: 'CS-103', name: 'Evan Wright', classId: 3 },
  { id: 'S6', rollNo: 'CS-104', name: 'Fiona Gallagher', classId: 3 },
  { id: 'S7', rollNo: 'CS-105', name: 'George Miller', classId: 3 }
];

// Base Data: Assignments
export const ASSIGNMENTS = [
  // Class 1
  { id: 101, title: 'Data Structures Lab 3', subject: 'Data Structures', classId: 1, dueDate: '2026-03-20', dueTime: '23:59' },
  { id: 102, title: 'Data Structures Midterm', subject: 'Data Structures', classId: 1, dueDate: '2026-03-25', dueTime: '12:00' },
  { id: 103, title: 'Assignment 3', subject: 'Data Structures', classId: 1, dueDate: '2026-04-01', dueTime: '23:59' },
  { id: 104, title: 'Assignment 4', subject: 'Data Structures', classId: 1, dueDate: '2026-04-05', dueTime: '23:59' },
  { id: 105, title: 'Assignment 5', subject: 'Data Structures', classId: 1, dueDate: '2026-04-10', dueTime: '23:59' },
  { id: 106, title: 'Assignment 6', subject: 'Data Structures', classId: 1, dueDate: '2026-04-15', dueTime: '23:59' },
  { id: 107, title: 'Assignment 7', subject: 'Data Structures', classId: 1, dueDate: '2026-04-20', dueTime: '23:59' },
  { id: 108, title: 'Assignment 8', subject: 'Data Structures', classId: 1, dueDate: '2026-04-25', dueTime: '23:59' },
  { id: 109, title: 'Assignment 9', subject: 'Data Structures', classId: 1, dueDate: '2026-04-30', dueTime: '23:59' },
  { id: 110, title: 'Assignment 10', subject: 'Data Structures', classId: 1, dueDate: '2026-05-05', dueTime: '23:59' },
  { id: 111, title: 'Assignment 11', subject: 'Data Structures', classId: 1, dueDate: '2026-05-10', dueTime: '23:59' },
  { id: 112, title: 'Assignment 12', subject: 'Data Structures', classId: 1, dueDate: '2026-05-15', dueTime: '23:59' },
  // Class 2
  { id: 201, title: 'Web Dev Mini Project', subject: 'Web Development', classId: 2, dueDate: '2026-03-22', dueTime: '23:59' },
  { id: 202, title: 'Database Design', subject: 'Database Management', classId: 2, dueDate: '2026-03-25', dueTime: '23:59' },
  // Class 3
  { id: 301, title: 'Intro to Python Assignment 1', subject: 'Python', classId: 3, dueDate: '2026-03-24', dueTime: '10:00' },
  { id: 302, title: 'Intro to Python Assignment 2', subject: 'Python', classId: 3, dueDate: '2026-03-30', dueTime: '18:00' }
];

// Base Data: Submissions and Grades
export const SUBMISSIONS = [
  // Alice Smith (S1) - Class 1
  { studentId: 'S1', assignmentId: 101, status: 'Submitted', file: 'alice_lab3.zip', graded: true, score: { code: 25, func: 45, doc: 22 } },
  { studentId: 'S1', assignmentId: 102, status: 'Submitted', file: 'alice_midterm.zip', graded: true, score: { code: 24, func: 48, doc: 20 } },
  { studentId: 'S1', assignmentId: 103, status: 'Submitted', file: 'alice_a3.zip', graded: true, score: { code: 23, func: 45, doc: 22 } },
  { studentId: 'S1', assignmentId: 104, status: 'Submitted', file: 'alice_a4.zip', graded: true, score: { code: 22, func: 44, doc: 22 } },
  { studentId: 'S1', assignmentId: 105, status: 'Submitted', file: 'alice_a5.zip', graded: true, score: { code: 25, func: 48, doc: 22 } },
  { studentId: 'S1', assignmentId: 106, status: 'Submitted', file: 'alice_a6.zip', graded: true, score: { code: 20, func: 40, doc: 20 } },
  { studentId: 'S1', assignmentId: 107, status: 'Submitted', file: 'alice_a7.zip', graded: true, score: { code: 21, func: 42, doc: 22 } },
  { studentId: 'S1', assignmentId: 108, status: 'Submitted', file: 'alice_a8.zip', graded: true, score: { code: 22, func: 43, doc: 22 } },
  { studentId: 'S1', assignmentId: 109, status: 'Submitted', file: 'alice_a9.zip', graded: true, score: { code: 23, func: 44, doc: 22 } },
  { studentId: 'S1', assignmentId: 110, status: 'Submitted', file: 'alice_a10.zip', graded: true, score: { code: 24, func: 45, doc: 22 } },
  { studentId: 'S1', assignmentId: 111, status: 'Submitted', file: 'alice_a11.zip', graded: true, score: { code: 25, func: 48, doc: 22 } },
  { studentId: 'S1', assignmentId: 112, status: 'Submitted', file: 'alice_a12.zip', graded: true, score: { code: 25, func: 49, doc: 25 } },

  // Bob Jones (S2) - Class 1
  { studentId: 'S2', assignmentId: 101, status: 'Submitted', file: 'bob_lab3.zip', graded: true, score: { code: 20, func: 45, doc: 20 } },
  { studentId: 'S2', assignmentId: 102, status: 'Submitted', file: 'bob_midterm.zip', graded: true, score: { code: 18, func: 40, doc: 18 } },
  { studentId: 'S2', assignmentId: 103, status: 'Submitted', file: 'bob_a3.zip', graded: true, score: { code: 20, func: 42, doc: 18 } },
  { studentId: 'S2', assignmentId: 104, status: 'Submitted', file: 'bob_a4.zip', graded: true, score: { code: 21, func: 43, doc: 21 } },
  { studentId: 'S2', assignmentId: 105, status: 'Submitted', file: 'bob_a5.zip', graded: true, score: { code: 20, func: 42, doc: 20 } },
  { studentId: 'S2', assignmentId: 106, status: 'Submitted', file: 'bob_a6.zip', graded: true, score: { code: 15, func: 35, doc: 20 } },
  { studentId: 'S2', assignmentId: 107, status: 'Submitted', file: 'bob_a7.zip', graded: true, score: { code: 18, func: 38, doc: 19 } },
  { studentId: 'S2', assignmentId: 108, status: 'Submitted', file: 'bob_a8.zip', graded: true, score: { code: 19, func: 40, doc: 20 } },
  { studentId: 'S2', assignmentId: 109, status: 'Submitted', file: 'bob_a9.zip', graded: true, score: { code: 21, func: 42, doc: 18 } },
  { studentId: 'S2', assignmentId: 110, status: 'Submitted', file: 'bob_a10.zip', graded: true, score: { code: 20, func: 45, doc: 20 } },
  { studentId: 'S2', assignmentId: 111, status: 'Submitted', file: 'bob_a11.zip', graded: true, score: { code: 22, func: 45, doc: 20 } },
  { studentId: 'S2', assignmentId: 112, status: 'Submitted', file: 'bob_a12.zip', graded: true, score: { code: 25, func: 45, doc: 20 } },

  // Charlie Brown (S3) - Class 2
  { studentId: 'S3', assignmentId: 201, status: 'Submitted', file: 'charlie_project.rar', graded: false },
  { studentId: 'S3', assignmentId: 202, status: 'Submitted', file: 'db_charlie.sql', graded: true, score: { code: 18, func: 40, doc: 15 } },

  // Diana Prince (S4) - Class 2
  { studentId: 'S4', assignmentId: 201, status: 'Submitted', file: 'diana_webapp.zip', graded: true, score: { code: 24, func: 48, doc: 23 } },

  // Evan Wright (S5) - Class 3
  { studentId: 'S5', assignmentId: 301, status: 'Pending', file: null, graded: false },

  // Fiona Gallagher (S6) - Class 3
  { studentId: 'S6', assignmentId: 301, status: 'Submitted', file: 'fiona_python.py', graded: true, score: { code: 22, func: 45, doc: 23 } },
  { studentId: 'S6', assignmentId: 302, status: 'Submitted', file: 'fiona_a2.py', graded: true, score: { code: 20, func: 43, doc: 22 } },

  // George Miller (S7) - Class 3
  { studentId: 'S7', assignmentId: 301, status: 'Submitted', file: 'george_p1.py', graded: true, score: { code: 15, func: 35, doc: 20 } }
];

// Compatibility Exports for ClassResults.jsx
export const facultyClasses = CLASSES;

export const classData = CLASSES.reduce((acc, cls) => {
  const clsAssignments = ASSIGNMENTS.filter(a => a.classId === cls.id);
  const clsStudents = STUDENTS.filter(s => s.classId === cls.id);

  acc[cls.id] = {
    assignments: clsAssignments.map(a => a.title),
    students: clsStudents.map(student => {
      const studentSubmissions = SUBMISSIONS.filter(s => s.studentId === student.id);
      const scores = clsAssignments.map(assignment => {
        const sub = studentSubmissions.find(s => s.assignmentId === assignment.id);
        if (sub && sub.graded) {
          return sub.score.code + sub.score.func + sub.score.doc;
        }
        return null;
      });
      return { name: student.name, scores };
    })
  };
  return acc;
}, {});

// Compatibility Exports for TeacherClasses.jsx
export const classes = CLASSES.map(cls => cls.name);

// Compatibility Exports for GradeAssignment.jsx
export const classAssignments = CLASSES.reduce((acc, cls) => {
  acc[cls.id] = ASSIGNMENTS.filter(a => a.classId === cls.id);
  return acc;
}, {});

export const submissionsByAssignment = ASSIGNMENTS.reduce((acc, assignment) => {
  acc[assignment.id] = SUBMISSIONS
    .filter(s => s.assignmentId === assignment.id)
    .map(s => ({
      ...s,
      id: s.studentId + "_" + s.assignmentId, // Generating unique ID
      name: STUDENTS.find(stu => stu.id === s.studentId).name
    }));
  return acc;
}, {});

// Compatibility Exports for SearchStudent.jsx
export const mockStudents = STUDENTS.reduce((acc, student) => {
  const studentSubmissions = SUBMISSIONS.filter(s => s.studentId === student.id);
  const studentAssignments = ASSIGNMENTS.filter(a => a.classId === student.classId).map(a => {
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
    class: CLASSES.find(c => c.id === student.classId).name,
    assignments: studentAssignments
  };
  return acc;
}, {});

// Compatibility Exports for StudentAssignments.jsx
// Filter for a specific student (e.g., Alice Smith) for initial state
export const getStudentAssignments = (rollNo) => {
  const student = STUDENTS.find(s => s.rollNo === rollNo);
  if (!student) return [];

  return ASSIGNMENTS.filter(a => a.classId === student.classId).map(a => {
    const sub = SUBMISSIONS.find(s => s.studentId === student.id && s.assignmentId === a.id);
    return {
      id: a.id,
      title: a.title,
      subject: a.subject,
      course: CLASSES.find(c => c.id === a.classId).name,
      dueDate: a.dueDate,
      dueTime: a.dueTime,
      submitted: sub ? sub.status === 'Submitted' : false,
      submissionDate: sub ? (sub.submissionDate || '2026-03-20') : null
    };
  });
};

// Compatibility Exports for StudentResults.jsx
export const getStudentResults = (rollNo) => {
  const student = STUDENTS.find(s => s.rollNo === rollNo);
  if (!student) return [];

  const studentSubmissions = SUBMISSIONS.filter(s => s.studentId === student.id && s.graded);
  return studentSubmissions.map(sub => {
    const assignment = ASSIGNMENTS.find(a => a.id === sub.assignmentId);
    const totalMarks = (sub.score.code || 0) + (sub.score.func || 0) + (sub.score.doc || 0);
    return {
      id: sub.assignmentId,
      title: assignment.title,
      course: CLASSES.find(c => c.id === assignment.classId).name,
      checkedDate: '2026-03-24', // Mock date
      totalMarks: 100,
      obtainedMarks: totalMarks,
      feedback: 'Good effort, keep it up!', // Mock feedback
      criteria: [
        { name: 'Code Quality', marks: sub.score.code, max: 25 },
        { name: 'Functionality', marks: sub.score.func, max: 50 },
        { name: 'Documentation', marks: sub.score.doc, max: 25 },
      ]
    };
  });
};
