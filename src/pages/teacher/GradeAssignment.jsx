import { useState } from 'react';
import { useDataContext } from '../../context/DataContext';

const GradeAssignment = () => {
  const { facultyClasses, classAssignmentsByClassId: classAssignments, submissionsByAssignment: submissions, updateSubmission } = useDataContext();

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [gradeData, setGradeData] = useState({});
  const [remark, setRemark] = useState('');

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
      const { remark: studentRemark, ...scores } = student.score || {};
      setGradeData(scores || {});
      setRemark(studentRemark || '');
    } else {
      setGradeData({});
      setRemark('');
    }
  };

  const handleGradeSubmit = (e) => {
    e.preventDefault();

    // Convert all grade values to numbers for submission
    const numericGradeData = {};
    for (const key in gradeData) {
      numericGradeData[key] = Number(gradeData[key]);
    }

    const submissionPayload = {
      ...numericGradeData,
      remark: remark
    };

    // Update global state
    updateSubmission(selectedAssignment.id, selectedStudent.studentId, submissionPayload);

    const totalCalculated = Object.values(gradeData).reduce((a, b) => Number(a) + Number(b), 0);
    alert(`Success! Grades submitted for ${selectedStudent.name}.\nTotal Score: ${totalCalculated}\nRemark: ${remark || 'N/A'}`);

    setSelectedStudent(null);
  };

  if (!selectedClass) {
    return (
      <div className="card teacherClassesCard">
        <h3>Assignment Grading: Select Class</h3>
        <p>
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
      <div className="card gradeAssignContainerLarge">
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
      <div className="card gradeAssignContainerLarge">
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
              {students.map(student => {
                let displayScore = '-';
                if (student.graded && student.score) {
                  const { remark: _, ...scores } = student.score;
                  const total = Object.values(scores).reduce((a, b) => Number(a) + Number(b), 0);
                  // Calculate max possible from rubrics
                  const maxTotal = Object.values(selectedAssignment.rubrics || {}).reduce((a, b) => Number(a) + Number(b), 0);
                  displayScore = `${total}/${maxTotal}`;
                }

                return (
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
                      {displayScore}
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
                );
              })}
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

  const totalScore = Object.values(gradeData).reduce((a, b) => Number(a) + Number(b), 0);
  const maxTotalScore = Object.values(selectedAssignment.rubrics || {}).reduce((a, b) => Number(a) + Number(b), 0);

  return (
    <div className="card gradeAssignContainerSmall">
      <div className="gradeAssignHeader">
        <h3 className="gradeAssignTitle">Grading: {selectedStudent.name}</h3>
        <button onClick={() => setSelectedStudent(null)} className="backBtnOutline">
          ← Back to Submissions
        </button>
      </div>

      <div className="gradeAssignFileInfo">
        <p>
          <strong>Assignment:</strong> {selectedAssignment.title}
        </p>
        <div className="fileInfoTextLast gradeAssignFileInfoRow">
          <span style={{ wordBreak: 'break-all' }}><strong>Submitted File:</strong> <code>{selectedStudent.file}</code></span>
          <a href={`http://localhost:5000${selectedStudent.file?.startsWith('/') ? '' : '/'}${selectedStudent.file}`} download>
            <button className="submitBtn publishBtn gradeAssignDownloadBtn">Download Work</button>
          </a>
        </div>
      </div>

      <form onSubmit={handleGradeSubmit} className="form">
        <h4 className="gradeAssignRubricTitle">
          Evaluation Rubric
        </h4>

        {Object.entries(selectedAssignment.rubrics || {}).map(([criterion, maxPoints]) => (
          <div key={criterion} className="gradeAssignInputRow">
            <label className="gradeAssignInputLabel">
              {criterion.charAt(0).toUpperCase() + criterion.slice(1)} (Max: {maxPoints})
            </label>
            <input
              type="number"
              className="input gradeAssignInputNumber"
              value={gradeData[criterion] || ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val !== '' && Number(val) > Number(maxPoints)) return;
                setGradeData({ ...gradeData, [criterion]: val });
              }}
              min="0"
              max={maxPoints}
              required
            />
          </div>
        ))}

        <div className="gradeAssignInputRow" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <label className="gradeAssignInputLabel" style={{ marginBottom: '8px' }}>Instructor Remarks</label>
          <textarea
            className="input"
            name="remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Add a remark (e.g., Well done!, Needs improvement in...)"
            style={{ width: '100%', minHeight: '80px', paddingTop: '10px' }}
          />
        </div>

        <div className="gradeAssignTotalBox">
          <strong className="gradeAssignTotalLabel">Calculated Total:</strong>
          <strong className="gradeAssignTotalValue">{totalScore}/{maxTotalScore}</strong>
        </div>

        <button type="submit" className="submitBtn gradeAssignSubmitBtn">
          Submit Final Grades
        </button>
      </form>
    </div>
  );
};

export default GradeAssignment;

