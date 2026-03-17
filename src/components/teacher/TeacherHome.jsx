import React from 'react';
import { Link } from 'react-router-dom';

const TeacherHome = ({ styles }) => (
  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
    <Link to="schedule" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ ...styles.card, borderTop: '4px solid #1a73e8' }}>
        <h3>📅 Schedule</h3>
        <p>View your weekly timetable</p>
      </div>
    </Link>
    <Link to="classes" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ ...styles.card, borderTop: '4px solid #34a853' }}>
        <h3>📚 Classes</h3>
        <p>Manage sections & assignments</p>
      </div>
    </Link>
    <Link to="assignments" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div style={{ ...styles.card, borderTop: '4px solid #ea4335' }}>
        <h3>⏰ Assignments</h3>
        <p>Track upcoming due dates</p>
      </div>
    </Link>
  </div>
);

export default TeacherHome;