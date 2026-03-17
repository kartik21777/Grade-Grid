import React from 'react';

const StudentDashboard = () => {
  return (
    <section>
      <h2>Student Dashboard</h2>
      <div className="card">
        <h4>Submit Assignment</h4>
        <input type="file" className="fileInput" />
        <button className="submitBtn">Upload to Server</button>
      </div>
    </section>
  );
};

export default StudentDashboard;