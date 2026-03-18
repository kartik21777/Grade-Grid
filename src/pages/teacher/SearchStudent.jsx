import React, { useState } from 'react';

const SearchStudent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [student, setStudent] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [grades, setGrades] = useState({ code: '', func: '', doc: '' });
  const [errorText, setErrorText] = useState('');

  // Mock Data
  const mockStudents = {
    'CS-101': {
      rollNo: 'CS-101',
      name: 'Alice Smith',
      class: 'Year 2 - CSE A',
      assignments: [
        { id: 'a1', title: 'Data Structures Lab 3', status: 'Submitted', file: 'alice_lab3.zip', graded: true, score: { code: 20, func: 45, doc: 20 } },
        { id: 'a2', title: 'OS Assignment 1', status: 'Pending', file: null, graded: false },
        { id: 'a3', title: 'Algorithm Analysis', status: 'Submitted', file: 'alice_algo.pdf', graded: true, score: { code: 25, func: 48, doc: 22 } },
      ]
    },
    'IT-201': {
      rollNo: 'IT-201',
      name: 'Charlie Brown',
      class: 'Year 3 - IT A',
      assignments: [
        { id: 'b1', title: 'Web Dev Mini Project', status: 'Submitted', file: 'charlie_project.rar', graded: false },
        { id: 'b2', title: 'Database Design', status: 'Submitted', file: 'db_charlie.sql', graded: true, score: { code: 18, func: 40, doc: 15 } },
      ]
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchTerm.trim().toUpperCase();
    if (mockStudents[query]) {
      // Deep clone to allow editing mock data in memory without issues
      setStudent(JSON.parse(JSON.stringify(mockStudents[query])));
      setErrorText('');
      setEditingAssignment(null);
    } else {
      setStudent(null);
      setErrorText('Student not found. Try "CS-101" or "IT-201".');
    }
  };

  const handleEditClick = (assignment) => {
    setEditingAssignment(assignment);
    if (assignment.graded) {
      setGrades(assignment.score);
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
    
    // Update the student object in state
    const updatedAssignments = student.assignments.map(a => {
      if (a.id === editingAssignment.id) {
        return {
          ...a,
          graded: true,
          score: {
            code: Number(grades.code),
            func: Number(grades.func),
            doc: Number(grades.doc)
          }
        };
      }
      return a;
    });

    setStudent({ ...student, assignments: updatedAssignments });
    setEditingAssignment(null);
    alert(`Grades updated for ${editingAssignment.title}!`);
  };

  // View 1: Grading Interface (Inline)
  if (editingAssignment) {
    const totalScore = Number(grades.code || 0) + Number(grades.func || 0) + Number(grades.doc || 0);

    return (
      <div className="card teacherClassesCard" style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0 }}>Update Grades: {editingAssignment.title}</h3>
          <button onClick={() => setEditingAssignment(null)} className="backBtnOutline" style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
              ← Back to Profile
          </button>
        </div>

        <div className="fileInfoBox" style={{ marginBottom: '20px' }}>
          <p className="fileInfoText">
              <strong>Student:</strong> {student.name} ({student.rollNo})
          </p>
          <div className="fileInfoTextLast" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
              <span><strong>Submitted File:</strong> <code>{editingAssignment.file || 'N/A'}</code></span>
              {editingAssignment.file && <button className="submitBtn publishBtn" style={{ padding: '6px 12px', fontSize: '12px' }}>Download Work</button>}
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
              Save Grades
          </button>
        </form>
      </div>
    );
  }

  // View 2: Search & Detail
  return (
    <div className="card teacherClassesCard" style={{ width: '100%', maxWidth: '800px' }}>
      <h3 style={{ marginBottom: '15px' }}>Student Search</h3>
      <p className="teacherClassesDesc" style={{ marginBottom: '20px' }}>
        Search for a student by their University Roll Number to view their details and assignments.
      </p>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          className="input" 
          placeholder="Enter Roll No (e.g. CS-101)" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          required
          style={{ flex: 1 }}
        />
        <button type="submit" className="submitBtn" style={{ padding: '10px 20px' }}>Search</button>
      </form>

      {errorText && <p className="errorText" style={{ textAlign: 'center' }}>{errorText}</p>}

      {student && (
        <div style={{ marginTop: '30px' }}>
          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #1a73e8' }}>
            <div>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#111' }}>{student.name}</h4>
              <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>Roll No: <strong>{student.rollNo}</strong> | Class: <strong>{student.class}</strong></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>Total Submissions</p>
              <h4 style={{ margin: '0', fontSize: '24px', color: '#1a73e8' }}>
                {student.assignments.filter(a => a.status === 'Submitted').length} / {student.assignments.length}
              </h4>
            </div>
          </div>

          <h4 style={{ marginBottom: '15px' }}>Assignment History</h4>
          <div style={{ overflowX: 'auto' }}>
            <table className="teacherAssignTable" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th className="teacherAssignTh">Title</th>
                  <th className="teacherAssignTh">Status</th>
                  <th className="teacherAssignTh">Score</th>
                  <th className="teacherAssignTh">Action</th>
                </tr>
              </thead>
              <tbody>
                {student.assignments.map(assignment => (
                  <tr key={assignment.id}>
                    <td className="teacherAssignTd" style={{ height: 'auto', padding: '15px 10px', verticalAlign: 'middle', textAlign: 'left', fontWeight: 'bold' }}>
                        {assignment.title}
                    </td>
                    <td className="teacherAssignTd" style={{ height: 'auto', padding: '15px 10px', verticalAlign: 'middle' }}>
                        <span className={assignment.status === 'Submitted' ? 'statusSubmitted statusBadge' : 'statusPending statusBadge'}>
                          {assignment.status}
                        </span>
                    </td>
                    <td className="teacherAssignTd" style={{ height: 'auto', padding: '15px 10px', verticalAlign: 'middle', fontWeight: 'bold' }}>
                        {assignment.graded ? `${assignment.score.code + assignment.score.func + assignment.score.doc}/100` : '-'}
                    </td>
                    <td className="teacherAssignTd" style={{ height: 'auto', padding: '15px 10px', verticalAlign: 'middle' }}>
                        <button 
                          className="submitBtn" 
                          style={{ 
                              padding: '8px 15px', 
                              backgroundColor: assignment.status === 'Submitted' ? '#1a73e8' : '#e0e0e0', 
                              color: assignment.status === 'Submitted' ? 'white' : '#777', 
                              cursor: assignment.status === 'Submitted' ? 'pointer' : 'not-allowed',
                              border: 'none',
                              fontWeight: 'bold'
                          }}
                          onClick={() => handleEditClick(assignment)}
                          disabled={assignment.status !== 'Submitted'}
                        >
                          {assignment.graded ? 'Edit Grade' : 'Grade'}
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchStudent;
