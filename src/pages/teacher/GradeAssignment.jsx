import React, { useState } from 'react';

const GradeAssignment = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Mock Data
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
    setSelectedStudent(null); // Reset student when class changes
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
    // Basic validation to prevent typing random huge numbers
    if (name === 'code' && value > 25) return;
    if (name === 'func' && value > 50) return;
    if (name === 'doc' && value > 25) return;
    setGrades({ ...grades, [name]: value });
  };

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    
    // Update the local state
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
    
    // Go back to student list
    setSelectedStudent(null);
  };

  // View 1: List of Classes
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
                <span className="smallText" style={{ display: 'block', color: '#666' }}>
                  Current Assignment: {cls.assignment}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // View 2: List of Students
  if (!selectedStudent) {
    const students = classStudents[selectedClass.id] || [];
    return (
      <div className="card teacherClassesCard" style={{ width: '100%', maxWidth: '800px' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>Submissions: {selectedClass.name}</h3>
            <button onClick={() => setSelectedClass(null)} className="backBtnOutline" style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
               ← Back Options
            </button>
         </div>
         <p className="teacherClassesDesc">
          Select a student to evaluate their work for "{selectedClass.assignment}".
        </p>

        <div style={{ overflowX: 'auto' }}>
            <table className="teacherAssignTable" style={{ width: '100%' }}>
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
                    <td className="teacherAssignTd" style={{ height: 'auto', padding: '15px 10px', verticalAlign: 'middle', textAlign: 'left', fontWeight: 'bold' }}>
                       {student.name}
                    </td>
                    <td className="teacherAssignTd" style={{ height: 'auto', padding: '15px 10px', verticalAlign: 'middle' }}>
                       <span className={student.status === 'Submitted' ? 'statusSubmitted statusBadge' : 'statusPending statusBadge'}>
                          {student.status}
                       </span>
                    </td>
                    <td className="teacherAssignTd" style={{ height: 'auto', padding: '15px 10px', verticalAlign: 'middle', fontWeight: 'bold' }}>
                       {student.graded ? `${student.score.code + student.score.func + student.score.doc}/100` : '-'}
                    </td>
                    <td className="teacherAssignTd" style={{ height: 'auto', padding: '15px 10px', verticalAlign: 'middle' }}>
                       <button 
                          className="submitBtn" 
                          style={{ 
                             padding: '8px 15px', 
                             backgroundColor: student.status === 'Submitted' ? '#1a73e8' : '#e0e0e0', 
                             color: student.status === 'Submitted' ? 'white' : '#777', 
                             cursor: student.status === 'Submitted' ? 'pointer' : 'not-allowed',
                             border: 'none',
                             fontWeight: 'bold'
                          }}
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

  // View 3: Grading Interface
  const totalScore = Number(grades.code || 0) + Number(grades.func || 0) + Number(grades.doc || 0);

  return (
    <div className="card teacherClassesCard" style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
         <h3 style={{ margin: 0 }}>Grading: {selectedStudent.name}</h3>
         <button onClick={() => setSelectedStudent(null)} className="backBtnOutline" style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
            ← Back to Roster
         </button>
      </div>

      <div className="fileInfoBox" style={{ marginBottom: '20px' }}>
         <p className="fileInfoText">
            <strong>Assignment:</strong> {selectedClass.assignment}
         </p>
         <div className="fileInfoTextLast" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <span><strong>Submitted File:</strong> <code>{selectedStudent.file}</code></span>
            <button className="submitBtn publishBtn" style={{ padding: '6px 12px', fontSize: '12px' }}>Download Work</button>
         </div>
      </div>

      <form onSubmit={handleGradeSubmit} className="form">
         <h4 style={{ margin: '0 0 15px 0', borderBottom: '2px solid #eee', paddingBottom: '10px', color: '#1a73e8' }}>
            Evaluation Rubric
         </h4>
         
         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label className="teacherClassesLabel" style={{ margin: 0, flex: 1 }}>Code Quality (Max: 25)</label>
            <input 
               type="number" 
               className="input" 
               style={{ width: '100px', marginLeft: '10px' }}
               name="code"
               value={grades.code}
               onChange={handleGradeChange}
               min="0"
               max="25"
               required
            />
         </div>

         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label className="teacherClassesLabel" style={{ margin: 0, flex: 1 }}>Functionality (Max: 50)</label>
            <input 
               type="number" 
               className="input" 
               style={{ width: '100px', marginLeft: '10px' }}
               name="func"
               value={grades.func}
               onChange={handleGradeChange}
               min="0"
               max="50"
               required
            />
         </div>

         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <label className="teacherClassesLabel" style={{ margin: 0, flex: 1 }}>Documentation (Max: 25)</label>
            <input 
               type="number" 
               className="input" 
               style={{ width: '100px', marginLeft: '10px' }}
               name="doc"
               value={grades.doc}
               onChange={handleGradeChange}
               min="0"
               max="25"
               required
            />
         </div>

         <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e6f4ea', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #1e8e3e' }}>
            <strong style={{ fontSize: '18px', color: '#1e8e3e' }}>Calculated Total:</strong>
            <strong style={{ fontSize: '24px', color: '#1e8e3e' }}>{totalScore}/100</strong>
         </div>

         <button type="submit" className="submitBtn" style={{ marginTop: '20px', fontSize: '16px', padding: '12px' }}>
            Submit Final Grades
         </button>
      </form>
    </div>
  );
};

export default GradeAssignment;
