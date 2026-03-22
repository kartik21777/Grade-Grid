import React, { useState } from 'react';

const GradeAssignment = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const facultyClasses = [
    { id: 1, name: 'Year 2 - CSE A' },
    { id: 2, name: 'Year 3 - IT A' },
    { id: 3, name: 'Year 1 - CSE B' }
  ];

  const classAssignments = {
    1: [
      { id: 101, title: 'Data Structures Lab 3' },
      { id: 102, title: 'Data Structures Midterm' }
    ],
    2: [
      { id: 201, title: 'Web Dev Mini Project' }
    ],
    3: [
      { id: 301, title: 'Intro to Python Assignment 1' },
      { id: 302, title: 'Intro to Python Assignment 2' }
    ]
  };

  const [submissions, setSubmissions] = useState({
    101: [
      { id: 1011, name: 'Alice Smith', status: 'Submitted', file: 'alice_lab3.zip', graded: false },
      { id: 1012, name: 'Bob Jones', status: 'Submitted', file: 'bob_lab3.zip', graded: true, score: { code: 20, func: 45, doc: 20 } },
    ],
    102: [
      { id: 1021, name: 'Alice Smith', status: 'Pending', file: null, graded: false },
    ],
    201: [
      { id: 2011, name: 'Charlie Brown', status: 'Submitted', file: 'charlie_project.rar', graded: false },
      { id: 2012, name: 'Diana Prince', status: 'Submitted', file: 'diana_webapp.zip', graded: false },
    ],
    301: [
      { id: 3011, name: 'Evan Wright', status: 'Pending', file: null, graded: false },
      { id: 3012, name: 'Fiona Gallagher', status: 'Submitted', file: 'fiona_python.py', graded: false },
    ],
    302: []
  });

  const [grades, setGrades] = useState({ code: '', func: '', doc: '' });

  const handleClassSelect = (cls) => {
    setSelectedClass(cls);
    setSelectedAssignment(null);
    setSelectedStudent(null);
  };

  const handleAssignmentSelect = (assignment) => {
    setSelectedAssignment(assignment);
    setSelectedStudent(null);
  };

  const handleStudentSelect = (student) => {
    if (student.status !== 'Submitted') {
      alert("This student has not submitted the assignment yet.");
      return;
    }
    setSelectedStudent(student);
    if (student.graded) {
      setGrades(student.score);
    } else {
      setGrades({ code: '', func: '', doc: '' });
    }
  };

  const handleGradeChange = (e) => {
    const { name, value } = e.target;
    if (name === 'code' && value > 25) return;
    if (name === 'func' && value > 50) return;
    if (name === 'doc' && value > 25) return;
    setGrades({ ...grades, [name]: value });
  };

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    
    const currentSubmissions = submissions[selectedAssignment.id] || [];
    const updatedStudents = currentSubmissions.map(student => {
      if (student.id === selectedStudent.id) {
        return {
          ...student,
          graded: true,
          score: {
            code: Number(grades.code),
            func: Number(grades.func),
            doc: Number(grades.doc)
          }
        };
      }
      return student;
    });

    setSubmissions({
      ...submissions,
      [selectedAssignment.id]: updatedStudents
    });

    alert(`Success! Grades submitted for ${selectedStudent.name}.\nCode: ${grades.code}/25\nFunctionality: ${grades.func}/50\nDocumentation: ${grades.doc}/25\nTotal: ${Number(grades.code) + Number(grades.func) + Number(grades.doc)}/100`);
    
    setSelectedStudent(null);
  };

  if (!selectedClass) {
    return (
      <div className="card teacherClassesCard">
        <h3>Assignment Grading: Select Class</h3>
        <p className="teacherClassesDesc">
          Select a class to view assignments and student submissions for grading.
        </p>
        <div className="form">
          {facultyClasses.map(cls => (
            <div 
              key={cls.id} 
              className="teacherClassOption"
              onClick={() => handleClassSelect(cls)}
            >
              <div>
                <span className="boldText">{cls.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedAssignment) {
    const assignments = classAssignments[selectedClass.id] || [];
    return (
      <div className="card teacherClassesCard gradeAssignContainerLarge">
        <div className="gradeAssignHeader">
          <h3 className="gradeAssignTitle">Assignments: {selectedClass.name}</h3>
          <button onClick={() => setSelectedClass(null)} className="backBtnOutline">
            ← Back to Classes
          </button>
        </div>
        <p className="teacherClassesDesc">
          Select an assignment to view student submissions.
        </p>
        <div className="form" style={{ marginTop: '20px' }}>
          {assignments.length > 0 ? assignments.map(assignment => (
            <div 
              key={assignment.id} 
              className="teacherClassOption"
              onClick={() => handleAssignmentSelect(assignment)}
              style={{ padding: '15px', marginBottom: '10px' }}
            >
              <div>
                <span className="boldText">{assignment.title}</span>
              </div>
            </div>
          )) : (
            <p style={{ color: '#94a3b8' }}>No assignments found for this class.</p>
          )}
        </div>
      </div>
    );
  }

  if (!selectedStudent) {
    const students = submissions[selectedAssignment.id] || [];
    return (
      <div className="card teacherClassesCard gradeAssignContainerLarge">
         <div className="gradeAssignHeader">
            <h3 className="gradeAssignTitle">Submissions for: {selectedAssignment.title}</h3>
            <button onClick={() => setSelectedAssignment(null)} className="backBtnOutline">
               ← Back to Assignments
            </button>
         </div>
         <p className="teacherClassesDesc">
          Select a student to evaluate their work for "{selectedAssignment.title}".
        </p>

        <div className="gradeAssignTableContainer">
            <table className="teacherAssignTable">
              <thead>
                <tr>
                  <th className="teacherAssignTh">Student Name</th>
                  <th className="teacherAssignTh">Status</th>
                  <th className="teacherAssignTh">Score</th>
                  <th className="teacherAssignTh">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td className="teacherAssignTd gradeAssignTdLeft">
                       {student.name}
                    </td>
                    <td className="teacherAssignTd gradeAssignTdCenter">
                       <span className={student.status === 'Submitted' ? 'statusSubmitted statusBadge' : 'statusPending statusBadge'}>
                          {student.status}
                       </span>
                    </td>
                    <td className="teacherAssignTd gradeAssignTdCenterBold">
                       {student.graded ? `${student.score.code + student.score.func + student.score.doc}/100` : '-'}
                    </td>
                    <td className="teacherAssignTd gradeAssignTdCenter">
                       <button 
                          className={`gradeAssignBtn ${student.status === 'Submitted' ? 'gradeAssignBtnActive' : 'gradeAssignBtnDisabled'}`}
                          onClick={() => handleStudentSelect(student)}
                       >
                          {student.graded ? 'Edit Grade' : 'Grade'}
                       </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="4" className="teacherAssignTd gradeAssignTdCenter" style={{ color: '#94a3b8' }}>
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
        </div>
      </div>
    );
  }

  const totalScore = Number(grades.code || 0) + Number(grades.func || 0) + Number(grades.doc || 0);

  return (
    <div className="card teacherClassesCard gradeAssignContainerSmall">
      <div className="gradeAssignHeader">
         <h3 className="gradeAssignTitle">Grading: {selectedStudent.name}</h3>
         <button onClick={() => setSelectedStudent(null)} className="backBtnOutline">
            ← Back to Submissions
         </button>
      </div>

      <div className="fileInfoBox gradeAssignFileInfo">
         <p className="fileInfoText">
            <strong>Assignment:</strong> {selectedAssignment.title}
         </p>
         <div className="fileInfoTextLast gradeAssignFileInfoRow">
            <span><strong>Submitted File:</strong> <code>{selectedStudent.file}</code></span>
            <button className="submitBtn publishBtn gradeAssignDownloadBtn">Download Work</button>
         </div>
      </div>

      <form onSubmit={handleGradeSubmit} className="form">
         <h4 className="gradeAssignRubricTitle">
            Evaluation Rubric
         </h4>
         
         <div className="gradeAssignInputRow">
            <label className="teacherClassesLabel gradeAssignInputLabel">Code Quality (Max: 25)</label>
            <input 
               type="number" 
               className="input gradeAssignInputNumber" 
               name="code"
               value={grades.code}
               onChange={handleGradeChange}
               min="0"
               max="25"
               required
            />
         </div>

         <div className="gradeAssignInputRow">
            <label className="teacherClassesLabel gradeAssignInputLabel">Functionality (Max: 50)</label>
            <input 
               type="number" 
               className="input gradeAssignInputNumber" 
               name="func"
               value={grades.func}
               onChange={handleGradeChange}
               min="0"
               max="50"
               required
            />
         </div>

         <div className="gradeAssignInputRow">
            <label className="teacherClassesLabel gradeAssignInputLabel">Documentation (Max: 25)</label>
            <input 
               type="number" 
               className="input gradeAssignInputNumber" 
               name="doc"
               value={grades.doc}
               onChange={handleGradeChange}
               min="0"
               max="25"
               required
            />
         </div>

         <div className="gradeAssignTotalBox">
            <strong className="gradeAssignTotalLabel">Calculated Total:</strong>
            <strong className="gradeAssignTotalValue">{totalScore}/100</strong>
         </div>

         <button type="submit" className="submitBtn gradeAssignSubmitBtn">
            Submit Final Grades
         </button>
      </form>
    </div>
  );
};

export default GradeAssignment;
