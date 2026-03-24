import React, { useState } from 'react';
import { useDataContext } from '../../context/DataContext';

const StudentAssignments = () => {
  const { currentUser, getStudentAssignmentsByRoll, submitWork } = useDataContext();
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Derive assignments from context to ensure reactivity
  const assignments = getStudentAssignmentsByRoll(currentUser.id);

  const isBeforeDue = (dueDate, dueTime) => {
    const due = new Date(`${dueDate}T${dueTime}`);
    return new Date() < due;
  };

  const handleSubmit = (id, e, isUpdate) => {
    e.preventDefault();
    setTimeout(() => {
      // Update global state via context
      submitWork(id, currentUser.id, 'submission.zip');
      
      alert(isUpdate ? 'Assignment updated successfully!' : 'Assignment submitted successfully!');
    }, 500);
  };

  const subjects = [...new Set(assignments.map(a => a.subject))];

  if (!selectedSubject) {
    return (
      <div className="contentWrapper">
        <h2 style={{ color: 'white', marginBottom: '5px' }}>My Subjects</h2>
        <p style={{ color: '#42cab3ff', marginBottom: '25px', fontSize: '15px' }}>Select a subject to view its assignments.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {subjects.map(subject => {
            const subjectAssignments = assignments.filter(a => a.subject === subject);
            const pendingCount = subjectAssignments.filter(a => !a.submitted && isBeforeDue(a.dueDate, a.dueTime)).length;
            const missedCount = subjectAssignments.filter(a => !a.submitted && !isBeforeDue(a.dueDate, a.dueTime)).length;

            return (
              <div
                key={subject}
                className="card studentCard"
                style={{
                  cursor: 'pointer',
                  borderLeft: '4px solid #1a73e8',
                  padding: '25px',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  margin: 0,
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onClick={() => setSelectedSubject(subject)}
              >
                <h3 style={{ margin: '0 0 12px 0', color: '#a4b9d5ff', fontSize: '20px' }}>{subject}</h3>
                <p style={{ margin: '0 0 8px 0', color: '#d265b3ff', fontSize: '14px' }}>
                  <strong>{subjectAssignments.length}</strong> total assignments
                </p>
                {pendingCount > 0 && (
                  <p style={{ margin: '0 0 4px 0', color: '#d93025', fontWeight: 'bold', fontSize: '14px' }}>
                    {pendingCount} pending
                  </p>
                )}
                {missedCount > 0 && (
                  <p style={{ margin: 0, color: '#f43f5e', fontWeight: 'bold', fontSize: '14px' }}>
                    {missedCount} missed deadline
                  </p>
                )}
                {pendingCount === 0 && missedCount === 0 && (
                  <p style={{ margin: 0, color: '#1e8e3e', fontWeight: 'bold', fontSize: '14px' }}>
                    All caught up!
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const filteredAssignments = assignments.filter(a => a.subject === selectedSubject);

  return (
    <div className="contentWrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ color: 'white', margin: '0 0 5px 0' }}>{selectedSubject}</h2>
          <p style={{ margin: 0, color: '#94e1e6ff', fontSize: '14px' }}>Assignments and coursework</p>
        </div>
        <button
          onClick={() => setSelectedSubject(null)}
          className="backBtnOutline"

        >
          ← Back to Subjects
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredAssignments.map(assignment => (
          <div key={assignment.id} className="card studentCard" style={{ width: '100%', boxSizing: 'border-box' }}>
            <div className="studentCardHeader">
              <div>
                <h3 className="studentCardTitle">{assignment.title}</h3>
                <p className="studentCardCourse"><strong>Course:</strong> {assignment.course}</p>
                <p className="studentCardDue">
                  <strong>Due:</strong> {assignment.dueDate} at {assignment.dueTime}
                </p>
              </div>

              <div className="studentCardMeta">
                <span className={`statusBadge ${assignment.submitted ? 'statusSubmitted' : (!isBeforeDue(assignment.dueDate, assignment.dueTime) ? 'statusLate' : 'statusPending')}`}>
                  {assignment.submitted ? 'Submitted' : (!isBeforeDue(assignment.dueDate, assignment.dueTime) ? 'Late' : 'Pending')}
                </span>

                {assignment.submitted && (
                  <p className="submissionDate">
                    on {assignment.submissionDate}
                  </p>
                )}
              </div>
            </div>

            {(isBeforeDue(assignment.dueDate, assignment.dueTime)) && (
              <form onSubmit={(e) => handleSubmit(assignment.id, e, assignment.submitted)} className="submitWorkForm">
                <h4 className="submitWorkTitle" style={{ color: 'black' }}>
                  {assignment.submitted ? 'Update Submission' : 'Submit Work'}
                </h4>
                <div className="submitWorkControls">
                  <input type="file" className="fileInput zeroMarginFlex" required />
                  <button type="submit" className="submitBtn uploadBtn">
                    {assignment.submitted ? 'Update' : 'Upload'}
                  </button>
                </div>
              </form>
            )}
          </div>
        ))}
        {filteredAssignments.length === 0 && (
          <p>No assignments currently pending.</p>
        )}
      </div>
    </div>
  );
};

export default StudentAssignments;
