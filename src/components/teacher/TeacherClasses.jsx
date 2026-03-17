import React from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherClasses = ({ styles }) => {
  const navigate = useNavigate();
  const classes = ['Year 2 - CSE A', 'Year 2 - CSE B', 'Year 3 - IT A'];

  return (
    <div style={styles.card}>
      <h3>Select a Class</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
        {classes.map((cls) => (
          <button 
            key={cls} 
            style={{ ...styles.input, textAlign: 'left', cursor: 'pointer' }}
            onClick={() => navigate('/teacher/create-assignment', { state: { className: cls } })}
          >
            {cls}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TeacherClasses;