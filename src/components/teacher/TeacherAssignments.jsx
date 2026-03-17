import React from 'react';

const TeacherAssignments = ({ styles }) => {
  return (
    <div style={{ ...styles.card, width: '100%' }}>
      <h3>Assignment Tracker</h3>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>
        Select a date to see what is due, or view upcoming deadlines below.
      </p>
      
      <div style={{ marginBottom: '20px' }}>
        {/* The native HTML date input acts as our interactive calendar */}
        <input type="date" style={{ ...styles.input, width: 'auto' }} />
      </div>

      <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
        <li style={{ padding: '15px', borderLeft: '4px solid #ea4335', background: '#f8f9fa', marginBottom: '10px', borderRadius: '4px' }}>
          <strong>Tomorrow:</strong> Lab Report 3 <br/>
          <span style={{ fontSize: '0.85rem', color: '#555' }}>Year 2 - CSE Section A</span>
        </li>
        <li style={{ padding: '15px', borderLeft: '4px solid #fbbc05', background: '#f8f9fa', marginBottom: '10px', borderRadius: '4px' }}>
          <strong>Next Week:</strong> Mid-term Project Phase 1 <br/>
          <span style={{ fontSize: '0.85rem', color: '#555' }}>Year 3 - IT Section A</span>
        </li>
      </ul>
    </div>
  );
};

export default TeacherAssignments;