/**
 * Central Mock Data Source
 * Updated for Grade Grid MongoDB Migration Testing
 */

export const USER_CREDENTIALS = {
  'admin1': { password: 'admin', role: 'admin' },
  '101': { password: 'password123', role: 'teacher' },
  '102': { password: 'password123', role: 'teacher' },
  'CS-101': { password: 'password123', role: 'student' },
  'CS-102': { password: 'password123', role: 'student' },
  'CS-103': { password: 'password123', role: 'student' },
  'CS-104': { password: 'password123', role: 'student' },
  'CS-105': { password: 'password123', role: 'student' },
  // Added credentials for scaling tests
  'CS-106': { password: 'password123', role: 'student' },
  'CS-107': { password: 'password123', role: 'student' },
  'CS-108': { password: 'password123', role: 'student' },
  'CS-109': { password: 'password123', role: 'student' },
  'CS-110': { password: 'password123', role: 'student' },
  'IT-201': { password: 'password123', role: 'student' },
  'IT-202': { password: 'password123', role: 'student' },
};

// Removed TEACHERS array - now fetched from MongoDB

// Base Data: Classes
export const CLASSES = [
  { id: 1, name: 'Year 2 - CSE A' },
  { id: 2, name: 'Year 3 - IT A' },
  { id: 3, name: 'Year 1 - CSE B' }
];

// Base Data: Students (Expanded Class 1 for UI scaling tests)
export const STUDENTS = [
  { id: 'S1', rollNo: 'CS-101', name: 'Alice Smith', classId: 1 },
  { id: 'S2', rollNo: 'CS-102', name: 'Bob Jones', classId: 1 },
  { id: 'S8', rollNo: 'CS-106', name: 'David Kim', classId: 1 },
  { id: 'S9', rollNo: 'CS-107', name: 'Emma Watson', classId: 1 },
  { id: 'S10', rollNo: 'CS-108', name: 'Frank Castle', classId: 1 },
  { id: 'S11', rollNo: 'CS-109', name: 'Grace Hopper', classId: 1 },
  { id: 'S12', rollNo: 'CS-110', name: 'Henry Ford', classId: 1 },
  { id: 'S3', rollNo: 'IT-201', name: 'Charlie Brown', classId: 2 },
  { id: 'S4', rollNo: 'IT-202', name: 'Diana Prince', classId: 2 },
  { id: 'S5', rollNo: 'CS-103', name: 'Evan Wright', classId: 3 },
  { id: 'S6', rollNo: 'CS-104', name: 'Fiona Gallagher', classId: 3 },
  { id: 'S7', rollNo: 'CS-105', name: 'George Miller', classId: 3 }
];

// Base Data: Assignments
export const ASSIGNMENTS = [];

// Base Data: Submissions and Grades 
export const SUBMISSIONS = [];


/* =========================================================================
   COMPATIBILITY EXPORTS (Updated to use dynamic feedback and dates)
   ========================================================================= */

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
        if (sub && sub.graded && sub.score) {
          return sub.score.code + sub.score.func + sub.score.doc;
        }
        return null; // Null for ungraded or unsubmitted
      });
      return { name: student.name, scores };
    })
  };
  return acc;
}, {});

export const classes = CLASSES.map(cls => cls.name);

export const classAssignments = CLASSES.reduce((acc, cls) => {
  acc[cls.id] = ASSIGNMENTS.filter(a => a.classId === cls.id);
  return acc;
}, {});

export const submissionsByAssignment = ASSIGNMENTS.reduce((acc, assignment) => {
  acc[assignment.id] = SUBMISSIONS
    .filter(s => s.assignmentId === assignment.id)
    .map(s => ({
      ...s,
      id: s.studentId + "_" + s.assignmentId,
      name: STUDENTS.find(stu => stu.id === s.studentId)?.name || 'Unknown'
    }));
  return acc;
}, {});

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
      score: sub ? sub.score : null,
      submissionDate: sub ? sub.submissionDate : null
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
      submissionDate: sub ? sub.submissionDate : null
    };
  });
};

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
      checkedDate: sub.submissionDate, // Fallback for checked date
      totalMarks: 100, // Assuming 25+50+25 max
      obtainedMarks: totalMarks,
      feedback: sub.feedback || 'Graded successfully.', // Dynamic feedback
      criteria: [
        { name: 'Code Quality', marks: sub.score.code, max: 25 },
        { name: 'Functionality', marks: sub.score.func, max: 50 },
        { name: 'Documentation', marks: sub.score.doc, max: 25 },
      ]
    };
  });
};

export const NOTES = [
  { id: 1, title: 'Introduction to Trees', subject: 'Data Structures', classId: 1, file: 'trees_intro.pdf' },
  { id: 2, title: 'Complexity Analysis Cheat Sheet', subject: 'Algorithms', classId: 1, file: 'complexity.pdf' },
  { id: 3, title: 'React Hooks Overview', subject: 'Web Development', classId: 2, file: 'hooks.pdf' }
];


