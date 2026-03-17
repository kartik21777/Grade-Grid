import React from 'react';

const StudentDashboard = ({ styles }) => {
  return (
    <section>
      <h2>Student Dashboard</h2>
      <div style={styles.card}>
        <h4>Submit Assignment</h4>
        <input type="file" style={{marginBottom: '10px'}} />
        <button style={styles.submitBtn}>Upload to Server</button>
      </div>
    </section>
  );
};

export default StudentDashboard;