import React, { useState } from 'react';

const StudentAssignments = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Data Structures Lab 3',
      subject: 'Data Structures',
      course: 'Year 2 - CSE A',
      dueDate: '2026-03-20',
      dueTime: '23:59',
      submitted: false,
    },
    {
      id: 2,
      title: 'Algorithms Homework 2',
      subject: 'Algorithms',
      course: 'Year 2 - CSE A',
      dueDate: '2026-03-28',
      dueTime: '18:00',
      submitted: true,
      submissionDate: '2026-03-16'
    },
    {
      id: 3,
      title: 'DBMS Project Proposal',
      subject: 'Database Management',
      course: 'Year 2 - CSE A',
      dueDate: '2026-03-20',
      dueTime: '12:00',
      submitted: false,
    },
    {
      id: 4,
      title: 'Binary Search Trees Assignment',
      subject: 'Data Structures',
      course: 'Year 2 - CSE A',
      dueDate: '2026-04-05',
      dueTime: '11:59',
      submitted: false,
    }
  ]);

  const isBeforeDue = (dueDate, dueTime) => {
    const due = new Date(`${dueDate}T${dueTime}`);
    return new Date() < due;
  };

  const handleSubmit = (id, e, isUpdate) => {
    e.preventDefault();
    setTimeout(() => {
      setAssignments(assignments.map(a =>
        a.id === id
          ? { ...a, submitted: true, submissionDate: new Date().toISOString().split('T')[0] }
          : a
      ));
      alert(isUpdate ? 'Assignment updated successfully!' : 'Assignment submitted successfully!');
    }, 500);
  };

  // Extract unique subjects
  const subjects = [...new Set(assignments.map(a => a.subject))];

  // View 1: Subject List
  if (!selectedSubject) {
    return (
      <div className="contentWrapper">
        <h2 style={{ marginBottom: '5px' }}>My Subjects</h2>
        <p style={{ color: '#666', marginBottom: '25px', fontSize: '15px' }}>Select a subject to view its assignments.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {subjects.map(subject => {
            const subjectAssignments = assignments.filter(a => a.subject === subject);
            const pendingCount = subjectAssignments.filter(a => !a.submitted).length;
            
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
                   width: 'auto'
                }}
                onClick={() => setSelectedSubject(subject)}
              >
                <h3 style={{ margin: '0 0 12px 0', color: '#1a73e8', fontSize: '20px' }}>{subject}</h3>
                <p style={{ margin: '0 0 8px 0', color: '#555', fontSize: '14px' }}>
                  <strong>{subjectAssignments.length}</strong> total assignments
                </p>
                {pendingCount > 0 ? (
                  <p style={{ margin: 0, color: '#d93025', fontWeight: 'bold', fontSize: '14px' }}>
                    {pendingCount} pending
                  </p>
                ) : (
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

  // View 2: Assignments for selected subject
  const filteredAssignments = assignments.filter(a => a.subject === selectedSubject);

  return (
    <div className="contentWrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
           <h2 style={{ margin: '0 0 5px 0' }}>{selectedSubject}</h2>
           <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Assignments and coursework</p>
        </div>
        <button 
          onClick={() => setSelectedSubject(null)} 
          className="backBtnOutline" 
          style={{ padding: '8px 15px', borderRadius: '5px', border: 'none', cursor: 'pointer', background: '#e0e0e0', fontWeight: 'bold' }}
        >
          ← Back to Subjects
        </button>
      </div>
      
      <div className="card-container">
        {filteredAssignments.map(assignment => (
          <div key={assignment.id} className="card studentCard">
            <div className="studentCardHeader">
              <div>
                <h3 className="studentCardTitle">{assignment.title}</h3>
                <p className="studentCardCourse"><strong>Course:</strong> {assignment.course}</p>
                <p className="studentCardDue">
                  <strong>Due:</strong> {assignment.dueDate} at {assignment.dueTime}
                </p>
              </div>

              <div className="studentCardMeta">
                <span className={`statusBadge ${assignment.submitted ? 'statusSubmitted' : 'statusPending'}`}>
                  {assignment.submitted ? 'Submitted' : 'Pending'}
                </span>

                {assignment.submitted && (
                  <p className="submissionDate">
                    on {assignment.submissionDate}
                  </p>
                )}
              </div>
            </div>

            {(!assignment.submitted || isBeforeDue(assignment.dueDate, assignment.dueTime)) && (
              <form onSubmit={(e) => handleSubmit(assignment.id, e, assignment.submitted)} className="submitWorkForm">
                <h4 className="submitWorkTitle">
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
