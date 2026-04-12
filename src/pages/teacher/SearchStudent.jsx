import { useState } from 'react';
import { useDataContext } from '../../context/DataContext';
import { useAlert } from '../../context/AlertContext';

const SearchStudent = () => {
  const { mockStudents, updateSubmission } = useDataContext();
  const { showAlert } = useAlert();
  const [searchTerm, setSearchTerm] = useState('');
  const [student, setStudent] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [grades, setGrades] = useState({});
  const [errorText, setErrorText] = useState('');
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
    if (assignment.graded && assignment.score) {
      // Pre-fill with existing scores
      const scoreEntries = Object.keys(assignment.rubrics || {}).map(k => [k, assignment.score[k] ?? '']);
      setGrades({
        ...Object.fromEntries(scoreEntries),
        remark: assignment.feedback || ''
      });
    } else {
      // Empty state for each rubric key
      setGrades({
        ...Object.fromEntries(Object.keys(assignment.rubrics || {}).map(k => [k, ''])),
        remark: ''
      });
    }
  };

  const handleGradeChange = (e, maxPoints) => {
    const { name, value } = e.target;
    if (value !== '' && Number(value) > maxPoints) return;
    setGrades({ ...grades, [name]: value });
  };

  const handleGradeSubmit = (e) => {
    e.preventDefault();
    const rubricKeys = Object.keys(editingAssignment.rubrics || {});
    const numericScores = Object.fromEntries(rubricKeys.map(k => [k, Number(grades[k] || 0)]));
    const payload = { ...numericScores, remark: grades.remark || '' };

    const updatedAssignments = student.assignments.map(a => {
      if (a.id === editingAssignment.id) {
        return { ...a, graded: true, score: numericScores };
      }
      return a;
    });

    setStudent({ ...student, assignments: updatedAssignments });
    updateSubmission(editingAssignment.id, student.id || student.rollNo, payload);
    setEditingAssignment(null);
    showAlert(`Grades updated for ${editingAssignment.title}!`, "success");
  };

  if (editingAssignment) {
    const rubrics = editingAssignment.rubrics || {};
    const maxTotal = Object.values(rubrics).reduce((a, b) => a + Number(b), 0);
    const totalScore = Object.entries(rubrics).reduce((a, [k]) => a + Number(grades[k] || 0), 0);

    return (
      <div className="card teacherClassesCard gradeAssignContainerSmall">
        <div className="gradeAssignHeader">
          <h3 className="gradeAssignTitle">Update Grades: {editingAssignment.title}</h3>
          <button onClick={() => setEditingAssignment(null)} className="backBtnOutline">
            ← Back to Profile
          </button>
        </div>

        <div className="fileInfoBox gradeAssignFileInfo">
          <p className="fileInfoText">
            <strong>Student:</strong> {student.name} ({student.rollNo})
          </p>
          <div className="fileInfoTextLast gradeAssignFileInfoRow" style={{ flexWrap: 'wrap', gap: '8px', alignItems: 'flex-start' }}>
            <span style={{ wordBreak: 'break-all', flex: '1 1 60%' }}><strong>Submitted File:</strong> <code>{editingAssignment.file || 'N/A'}</code></span>
            {editingAssignment.file && (
              <a href={`http://localhost:5000${editingAssignment.file.startsWith('/') ? '' : '/'}${editingAssignment.file}`} download style={{ flexShrink: 0 }}>
                <button className="submitBtn publishBtn gradeAssignDownloadBtn">Download Work</button>
              </a>
            )}
          </div>
        </div>

        <form onSubmit={handleGradeSubmit} className="form">
          <h4 className="gradeAssignRubricTitle">Evaluation Rubric</h4>

          {Object.entries(rubrics).map(([criterion, maxPoints]) => (
            <div key={criterion} className="gradeAssignInputRow">
              <label className="teacherClassesLabel gradeAssignInputLabel">
                {criterion.charAt(0).toUpperCase() + criterion.slice(1)} (Max: {maxPoints})
              </label>
              <input
                type="number"
                className="input gradeAssignInputNumber"
                name={criterion}
                value={grades[criterion] ?? ''}
                onChange={(e) => handleGradeChange(e, Number(maxPoints))}
                min="0"
                max={maxPoints}
                required
              />
            </div>
          ))}

          <div className="gradeAssignTotalBox">
            <strong className="gradeAssignTotalLabel">Calculated Total:</strong>
            <strong className="gradeAssignTotalValue">{totalScore}/{maxTotal}</strong>
          </div>

          <div className="gradeAssignInputRow" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <label className="teacherClassesLabel gradeAssignInputLabel" style={{ marginBottom: '8px' }}>Instructor Remarks (Optional)</label>
            <textarea
              className="input"
              name="remark"
              value={grades.remark || ''}
              onChange={(e) => setGrades({ ...grades, remark: e.target.value })}
              placeholder="Add a remark (e.g., Well done!, Needs improvement in...)"
              style={{ width: '100%', minHeight: '80px', paddingTop: '10px', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" className="submitBtn gradeAssignSubmitBtn">
            Save Grades
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="card teacherClassesCard searchStudentCard">
      <h3 >Student Search</h3>
      <p className="teacherClassesDesc">
        Search for a student by their University Roll Number to view their details and assignments.
      </p>

      <form onSubmit={handleSearch} className="searchForm">
        <input
          type="text"
          className="input searchInput"
          placeholder="Enter Roll No (e.g. CS-101)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          required
        />
        <button type="submit" className="submitBtn searchBtn">Search</button>
      </form>

      {errorText && <p className="errorText textCenter">{errorText}</p>}

      {student && (
        <div className="studentDetail">
          <div className="studentProfileHeader">
            <div>
              <h4 className="studentName">{student.name}</h4>
              <p>Roll No: <strong>{student.rollNo}</strong> | Branch: <strong>{student.branch || 'N/A'}</strong> | Class: <strong>{student.class}</strong></p>
            </div>
            <div className="studentStats">
              <p>Total Submissions</p>
              <h4 className="studentStatsValue">
                {student.assignments.filter(a => a.status === 'Submitted').length} / {student.assignments.length}
              </h4>
            </div>
          </div>

          <h4 className="gradeAssignTitle" style={{ marginBottom: '15px' }}>Assignment History</h4>
          <div className="gradeAssignTableContainer">
            <table className="teacherAssignTable">
              <thead>
                <tr>
                  <th className="teacherAssignTh">Title</th>
                  <th className="teacherAssignTh">Status</th>
                  <th className="teacherAssignTh">Score</th>
                  <th className="teacherAssignTh">Remarks</th>
                  <th className="teacherAssignTh">Action</th>
                </tr>
              </thead>
              <tbody>
                {student.assignments.map(assignment => (
                  <tr key={assignment.id}>
                    <td className=" gradeAssignTdLeft">
                      {assignment.title}
                    </td>
                    <td className=" gradeAssignTdCenter">
                      <span className={assignment.status === 'Submitted' ? 'statusSubmitted statusBadge' : 'statusPending statusBadge'}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className=" gradeAssignTdCenterBold">
                      {assignment.graded && assignment.score
                        ? `${Object.values(assignment.score).reduce((a, b) => a + Number(b), 0)}/${Object.values(assignment.rubrics || {}).reduce((a, b) => a + Number(b), 0)}`
                        : '-'}
                    </td>
                    <td className=" gradeAssignTdCenter">
                      {assignment.graded && assignment.feedback
                        ? <span title={assignment.feedback} style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', maxWidth: '140px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', verticalAlign: 'middle' }}>💬 {assignment.feedback}</span>
                        : <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>—</span>}
                    </td>
                    <td className=" gradeAssignTdCenter">
                      <button
                        className={`gradeAssignBtn ${assignment.status === 'Submitted' ? 'gradeAssignBtnActive' : 'gradeAssignBtnDisabled'}`}
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
