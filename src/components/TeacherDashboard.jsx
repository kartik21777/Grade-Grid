import React from 'react';

const TeacherDashboard = ({ styles }) => {
  return (
    <section>
      <h2>Teacher Dashboard</h2>
      <div style={styles.card}>
        <h4>Evaluate Submissions</h4>
        <p>Student ID: 23021752 | <a href="#">View Lab_1.pdf</a></p>
        <input type="number" placeholder="Marks" style={styles.input} />
        <textarea placeholder="Teacher Remarks" style={{...styles.input, minHeight: '60px'}}></textarea>
        <button style={styles.submitBtn}>Submit Evaluation</button>
      </div>
    </section>
  );
};

export default TeacherDashboard;