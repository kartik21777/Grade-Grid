import React from 'react';
import { useLocation } from 'react-router-dom';

const CreateAssignment = ({ styles }) => {
  const location = useLocation();
  const className = location.state?.className || "General";

  return (
    <div style={styles.card}>
      <h3>New Assignment: {className}</h3>
      <div style={styles.form}>
        <input type="file" style={styles.input} />
        <input type="date" style={styles.input} /> 
        <button style={styles.submitBtn}>Upload to Server</button>
      </div>
    </div>
  );
};

export default CreateAssignment;