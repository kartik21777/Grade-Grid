import { useState } from 'react';
import { useDataContext } from '../../context/DataContext';

const SearchStudent = () => {
  const { mockStudents, updateSubmission } = useDataContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [student, setStudent] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [grades, setGrades] = useState({ code: '', func: '', doc: '', remark: '' });
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
            doc: Number(grades.doc),
            remark: grades.remark
          }
        };
      }

      return a;
    });

    setStudent({ ...student, assignments: updatedAssignments });
    
    // Update global state
    updateSubmission(editingAssignment.id, student.id || student.rollNo, {
      code: Number(grades.code),
      func: Number(grades.func),
      doc: Number(grades.doc),
      remark: grades.remark
    });

    setEditingAssignment(null);
    alert(`Grades updated for ${editingAssignment.title}!`);
  };

  if (editingAssignment) {
    const totalScore = Number(grades.code || 0) + Number(grades.func || 0) + Number(grades.doc || 0);

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
          <div className="fileInfoTextLast gradeAssignFileInfoRow">
            <span><strong>Submitted File:</strong> <code>{editingAssignment.file || 'N/A'}</code></span>
            {editingAssignment.file && (
              <>
                {console.log("SEARCH STUDENT DOWNLOAD HREF GENERATED:", `http://localhost:5000${editingAssignment.file.startsWith('/') ? '' : '/'}${editingAssignment.file}`)}
                <a href={`http://localhost:5000${editingAssignment.file.startsWith('/') ? '' : '/'}${editingAssignment.file}`} download>
                  <button className="submitBtn publishBtn gradeAssignDownloadBtn">Download Work</button>
                </a>
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleGradeSubmit} className="form">
          <h4 className="gradeAssignRubricTitle">Evaluation Rubric</h4>

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
              <p>Roll No: <strong>{student.rollNo}</strong> | Class: <strong>{student.class}</strong></p>
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
                      {assignment.graded ? `${assignment.score.code + assignment.score.func + assignment.score.doc}/100` : '-'}
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
