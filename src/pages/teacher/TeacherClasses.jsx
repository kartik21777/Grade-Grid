import React, { useState } from 'react';

const TeacherClasses = ({ styles }) => {
  const [step, setStep] = useState(1);
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [file, setFile] = useState(null); 
  const [selectedClasses, setSelectedClasses] = useState([]);

  const classes = ['Year 1 - CSE A', 'Year 2 - CSE A', 'Year 2 - CSE B', 'Year 3 - IT A'];

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!dueDate) {
      alert("Please select a due date before continuing.");
      return;
    }
    setStep(2);
  };

  const handleClassToggle = (cls) => {
    if (selectedClasses.includes(cls)) {
      setSelectedClasses(selectedClasses.filter(c => c !== cls));
    } else {
      setSelectedClasses([...selectedClasses, cls]);
    }
  };

  const handleSubmit = () => {
    if (selectedClasses.length === 0) {
      alert("Please select at least one class to assign this to.");
      return;
    }
    
    // USING THE FILE VARIABLE HERE:
    const fileName = file ? file.name : "No file attached";
    
    alert(`Success! Assignment "${fileName}" assigned to:\n${selectedClasses.join('\n')}`);
    
    // Reset form
    setStep(1);
    setDueDate('');
    setDueTime('');
    setFile(null);
    setSelectedClasses([]);
  };

  if (step === 1) {
    return (
      <div style={{ ...styles.card, width: '100%' }}>
        <h3>Step 1: Upload Assignment</h3>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>
          Attach your file and set a deadline.
        </p>
        
        <form onSubmit={handleNextStep} style={styles.form}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Assignment File:</label>
            <input 
              type="file" 
              style={styles.input} 
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Due Date:</label>
            <input 
              type="date" 
              style={styles.input} 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Due Time:</label>
              <input 
                type="time" 
                style={styles.input} 
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                required
              />
            </div>

          <button type="submit" style={styles.submitBtn}>
            Continue to Select Classes →
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ ...styles.card, width: '100%' }}>
      <h3>Step 2: Assign to Classes</h3>
      
      {/* USING THE FILE VARIABLE HERE AS WELL FOR A UX BOOST */}
      <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px', marginBottom: '15px', borderLeft: '4px solid #1a73e8' }}>
        <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}>
          <strong>File:</strong> {file ? file.name : <span style={{color: '#ea4335'}}>None attached</span>}
        </p>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          <strong>Due:</strong> {dueDate}
        </p>
      </div>

      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '15px' }}>
        Select one or more classes to receive this assignment.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {classes.map((cls) => (
          <label 
            key={cls} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px', 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '5px', 
              cursor: 'pointer',
              background: selectedClasses.includes(cls) ? '#e8f0fe' : 'white',
              borderLeft: selectedClasses.includes(cls) ? '4px solid #1a73e8' : '1px solid #ddd'
            }}
          >
            <input 
              type="checkbox" 
              checked={selectedClasses.includes(cls)}
              onChange={() => handleClassToggle(cls)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontWeight: selectedClasses.includes(cls) ? 'bold' : 'normal' }}>
              {cls}
            </span>
          </label>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setStep(1)} 
          style={{ ...styles.submitBtn, background: '#e0e0e0', color: '#333', flex: 1 }}
        >
          ← Back
        </button>
        <button 
          onClick={handleSubmit} 
          style={{ ...styles.submitBtn, background: '#34a853', flex: 2 }}
        >
          Publish Assignment
        </button>
      </div>
    </div>
  );
};

export default TeacherClasses;