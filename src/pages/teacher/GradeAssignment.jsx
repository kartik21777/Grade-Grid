import React, { useState } from 'react';

const GradeAssignment = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const facultyClasses = [
    { id: 1, name: 'Year 2 - CSE A', assignment: 'Data Structures Lab 3' },
    { id: 2, name: 'Year 3 - IT A', assignment: 'Web Dev Mini Project' },
    { id: 3, name: 'Year 1 - CSE B', assignment: 'Intro to Python Assignment 1' }
  ];

  const [classStudents, setClassStudents] = useState({
    1: [
      { id: 101, name: 'Alice Smith', status: 'Submitted', file: 'alice_lab3.zip', graded: false },
      { id: 102, name: 'Bob Jones', status: 'Submitted', file: 'bob_lab3.zip', graded: true, score: { code: 20, func: 45, doc: 20 } },
    ],
    2: [
      { id: 201, name: 'Charlie Brown', status: 'Submitted', file: 'charlie_project.rar', graded: false },
      { id: 202, name: 'Diana Prince', status: 'Submitted', file: 'diana_webapp.zip', graded: false },
    ],
    3: [
      { id: 301, name: 'Evan Wright', status: 'Pending', file: null, graded: false },
      { id: 302, name: 'Fiona Gallagher', status: 'Submitted', file: 'fiona_python.py', graded: false },
    ]
  });

  const [grades, setGrades] = useState({ code: '', func: '', doc: '' });

  const handleClassSelect = (cls) => {
    setSelectedClass(cls);
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
    
    const currentClassStudents = classStudents[selectedClass.id];
    const updatedStudents = currentClassStudents.map(student => {
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

    setClassStudents({
      ...classStudents,
      [selectedClass.id]: updatedStudents
    });

    alert(`Success! Grades submitted for ${selectedStudent.name}.\nCode: ${grades.code}/25\nFunctionality: ${grades.func}/50\nDocumentation: ${grades.doc}/25\nTotal: ${Number(grades.code) + Number(grades.func) + Number(grades.doc)}/100`);
    
    setSelectedStudent(null);
  };

  if (!selectedClass) {
    return (
      <div className="card teacherClassesCard">
        <h3>Assignment Grading: Select Class</h3>
        <p className="teacherClassesDesc">
          Select a class to view student submissions for grading.
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
                <span className="smallText gradeAssignSubtext">
                  Current Assignment: {cls.assignment}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedStudent) {
    const students = classStudents[selectedClass.id] || [];
    return (
      <div className="card teacherClassesCard gradeAssignContainerLarge">
         <div className="gradeAssignHeader">
            <h3 className="gradeAssignTitle">Submissions: {selectedClass.name}</h3>
            <button onClick={() => setSelectedClass(null)} className="backBtnOutline">
               ← Back Options
            </button>
         </div>
         <p className="teacherClassesDesc">
          Select a student to evaluate their work for "{selectedClass.assignment}".
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
            ← Back to Roster
         </button>
      </div>

      <div className="fileInfoBox gradeAssignFileInfo">
         <p className="fileInfoText">
            <strong>Assignment:</strong> {selectedClass.assignment}
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
