import React from 'react';
import { useLocation } from 'react-router-dom';

const CreateAssignment = () => {
  const location = useLocation();
  const className = location.state?.className || "General";

  return (
    <div className='card'>
      <h3>New Assignment: {className}</h3>
      <div className='form'>
        <input type="file" className='input' />
        <input type="date" className='input' /> 
        <button className='submitBtn'>Upload to Server</button>
      </div>
    </div>
  );
};

export default CreateAssignment;