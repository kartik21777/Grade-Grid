import React, { useState } from 'react';

const StudentAssignments = () => {
  // Mock data for assignments
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Data Structures Lab 3',
      course: 'Year 2 - CSE A',
      dueDate: '2026-03-25',
      dueTime: '23:59',
      submitted: false,
    },
    {
      id: 2,
      title: 'Algorithms Homework 2',
      course: 'Year 2 - CSE A',
      dueDate: '2026-03-28',
      dueTime: '18:00',
      submitted: true,
      submissionDate: '2026-03-16'
    },
    {
      id: 3,
      title: 'DBMS Project Proposal',
      course: 'Year 2 - CSE A',
      dueDate: '2026-03-20',
      dueTime: '12:00',
      submitted: false,
    }
  ]);

  const handleSubmit = (id, e) => {
    e.preventDefault();
    // Simulate file submission
    setTimeout(() => {
      setAssignments(assignments.map(a => 
        a.id === id 
        ? { ...a, submitted: true, submissionDate: new Date().toISOString().split('T')[0] } 
        : a
      ));
      alert('Assignment submitted successfully!');
    }, 500);
  };

  return (
    <div className="contentWrapper">
      <h2>Pending Assignments</h2>
      <div className="card-container">
        {assignments.map(assignment => (
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

            {!assignment.submitted && (
              <form onSubmit={(e) => handleSubmit(assignment.id, e)} className="submitWorkForm">
                <h4 className="submitWorkTitle">Submit Work</h4>
                <div className="submitWorkControls">
                  <input type="file" className="fileInput zeroMarginFlex" required />
                  <button type="submit" className="submitBtn uploadBtn">Upload</button>
                </div>
              </form>
            )}
          </div>
        ))}
        {assignments.length === 0 && (
          <p>No assignments currently pending.</p>
        )}
      </div>
    </div>
  );
};

export default StudentAssignments;
