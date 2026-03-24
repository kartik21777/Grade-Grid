import React, { useState } from 'react';
import { useDataContext } from '../../context/DataContext';

const AssignmentCard = ({ assignment, isBeforeDue, onSubmit }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    onSubmit(assignment.id, file, assignment.submitted);
    // Optionally reset file after submission, but alert happens in parent
  };

  return (
    <div className="card studentCard" style={{ width: '100%', boxSizing: 'border-box' }}>
      <div className="studentCardHeader">
        <div>
          <h3 className="studentCardTitle">{assignment.title}</h3>
          <p className="studentCardCourse"><strong>Course:</strong> {assignment.course}</p>
          <p className="studentCardDue">
            <strong>Due:</strong> {assignment.dueDate} at {assignment.dueTime}
          </p>
          {assignment.teacherFile && (
            <div style={{ marginTop: '10px' }}>
              <button 
                onClick={() => window.open(`http://localhost:5000${assignment.teacherFile}`, '_blank')}
                style={{
                  background: 'rgba(66, 202, 179, 0.1)',
                  color: '#42cab3ff',
                  border: '1px solid rgba(66, 202, 179, 0.3)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>📥</span> Download Assignment
              </button>
            </div>
          )}
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
        <form onSubmit={handleFormSubmit} className="submitWorkForm">
          <h4 className="submitWorkTitle" style={{ color: 'black' }}>
            {assignment.submitted ? 'Update Submission' : 'Submit Work'}
          </h4>
          
          <div className="file-upload-wrapper">
            <label htmlFor={`file-${assignment.id}`} className="file-upload-label">
              Choose File
            </label>
            <span className={`file-name-display ${file ? 'has-file' : ''}`}>
              {file ? file.name : 'No file chosen'}
            </span>
            <input 
              id={`file-${assignment.id}`}
              type="file" 
              className="hidden-file-input" 
              accept=".pdf"
              onChange={handleFileChange}
              required
            />
          </div>

          <div className="submitWorkControls">
            <button type="submit" className="submitBtn uploadBtn" style={{ width: '100%' }}>
              {assignment.submitted ? 'Update' : 'Upload'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const StudentAssignments = () => {
  const { currentUser, getStudentAssignmentsByRoll, submitWork } = useDataContext();
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Derive assignments from context to ensure reactivity
  const assignments = getStudentAssignmentsByRoll(currentUser.id);

  const isBeforeDue = (dueDate, dueTime) => {
    const due = new Date(`${dueDate}T${dueTime}`);
    return new Date() < due;
  };

  const handleAssignmentSubmit = (id, selectedFile, isUpdate) => {
    // Artificial delay to match previous UX
    setTimeout(() => {
      submitWork(id, currentUser.id, selectedFile);
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
          <AssignmentCard 
            key={assignment.id} 
            assignment={assignment} 
            isBeforeDue={isBeforeDue} 
            onSubmit={handleAssignmentSubmit} 
          />
        ))}
        {filteredAssignments.length === 0 && (
          <p>No assignments currently pending.</p>
        )}
      </div>
    </div>
  );
};

export default StudentAssignments;
