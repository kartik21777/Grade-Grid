import React, { useState } from 'react';


const SearchStudent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [student, setStudent] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [grades, setGrades] = useState({ code: '', func: '', doc: '' });
  const [errorText, setErrorText] = useState('');

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

  if (editingAssignment) {
    const totalScore = Number(grades.code || 0) + Number(grades.func || 0) + Number(grades.doc || 0);

    return (
      <div className="card teacherClassesCard ss-grading-card">
        <div className="ss-header">
          <h3 className="ss-grading-title">Update Grades: {editingAssignment.title}</h3>
          <button onClick={() => setEditingAssignment(null)} className="backBtnOutline ss-back-btn">
            ← Back to Profile
          </button>
        </div>

        <div className="fileInfoBox ss-mb-20">
          <p className="fileInfoText">
            <strong>Student:</strong> {student.name} ({student.rollNo})
          </p>
          <div className="fileInfoTextLast ss-file-info-last">
            <span><strong>Submitted File:</strong> <code>{editingAssignment.file || 'N/A'}</code></span>
            {editingAssignment.file && <button className="submitBtn publishBtn ss-download-btn">Download Work</button>}
          </div>
        </div>

        <form onSubmit={handleGradeSubmit} className="form">
          <h4 className="ss-rubric-title">
            Evaluation Rubric
          </h4>

          <div className="ss-rubric-row">
            <label className="teacherClassesLabel ss-rubric-label">Code Quality (Max: 25)</label>
            <input
              type="number"
              className="input ss-rubric-input"
              name="code"
              value={grades.code}
              onChange={handleGradeChange}
              min="0"
              max="25"
              required
            />
          </div>

          <div className="ss-rubric-row">
            <label className="teacherClassesLabel ss-rubric-label">Functionality (Max: 50)</label>
            <input
              type="number"
              className="input ss-rubric-input"
              name="func"
              value={grades.func}
              onChange={handleGradeChange}
              min="0"
              max="50"
              required
            />
          </div>

          <div className="ss-rubric-row">
            <label className="teacherClassesLabel ss-rubric-label">Documentation (Max: 25)</label>
            <input
              type="number"
              className="input ss-rubric-input"
              name="doc"
              value={grades.doc}
              onChange={handleGradeChange}
              min="0"
              max="25"
              required
            />
          </div>

          <div className="ss-total-box">
            <strong className="ss-total-label">Calculated Total:</strong>
            <strong className="ss-total-value">{totalScore}/100</strong>
          </div>

          <button type="submit" className="submitBtn ss-save-btn">
            Save Grades
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="card teacherClassesCard ss-search-card">
      <h3 className="ss-mb-15">Student Search</h3>
      <p className="teacherClassesDesc ss-search-desc">
        Search for a student by their University Roll Number to view their details and assignments.
      </p>

      <form onSubmit={handleSearch} className="ss-search-form">
        <input
          type="text"
          className="input ss-search-input"
          placeholder="Enter Roll No (e.g. CS-101)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          required
        />
        <button type="submit" className="submitBtn ss-search-btn">Search</button>
      </form>

      {errorText && <p className="errorText ss-error-text">{errorText}</p>}

      {student && (
        <div className="ss-mt-30">
          <div className="ss-student-info">
            <div>
              <h4 className="ss-student-name">{student.name}</h4>
              <p className="ss-student-details">Roll No: <strong>{student.rollNo}</strong> | Class: <strong>{student.class}</strong></p>
            </div>
            <div className="ss-text-right">
              <p className="ss-submissions-label">Total Submissions</p>
              <h4 className="ss-submissions-count">
                {student.assignments.filter(a => a.status === 'Submitted').length} / {student.assignments.length}
              </h4>
            </div>
          </div>

          <h4 className="ss-mb-15">Assignment History</h4>
          <div className="ss-table-container">
            <table className="teacherAssignTable ss-w-100">
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
                    <td className="teacherAssignTd ss-td-title">
                      {assignment.title}
                    </td>
                    <td className="teacherAssignTd ss-td-normal">
                      <span className={assignment.status === 'Submitted' ? 'statusSubmitted statusBadge' : 'statusPending statusBadge'}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className="teacherAssignTd ss-td-bold">
                      {assignment.graded ? `${assignment.score.code + assignment.score.func + assignment.score.doc}/100` : '-'}
                    </td>
                    <td className="teacherAssignTd ss-td-normal">
                      <button
                        className={`submitBtn ss-action-btn ${assignment.status === 'Submitted' ? 'ss-action-btn-submitted' : 'ss-action-btn-disabled'}`}
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
