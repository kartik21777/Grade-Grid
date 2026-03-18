import React, { useState } from 'react';

const TeacherClasses = () => {
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
      <div className="card teacherClassesCard">
        <h3>Step 1: Upload Assignment</h3>
        <p className="teacherClassesDesc">
          Attach your file and set a deadline.
        </p>
        
        <form onSubmit={handleNextStep} className="form">
          <div>
            <label className="teacherClassesLabel">Assignment File:</label>
            <input 
              type="file" 
              className="input" 
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          
          <div>
            <label className="teacherClassesLabel">Due Date:</label>
            <input 
              type="date" 
              className="input" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div className="flex1">
              <label className="teacherClassesLabel">Due Time:</label>
              <input 
                type="time" 
                className="input" 
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                required
              />
            </div>

          <button type="submit" className="submitBtn">
            Continue to Select Classes →
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="card teacherClassesCard">
      <h3>Step 2: Assign to Classes</h3>
      
      {/* USING THE FILE VARIABLE HERE AS WELL FOR A UX BOOST */}
      <div className="fileInfoBox">
        <p className="fileInfoText">
          <strong>File:</strong> {file ? file.name : <span className="errorText">None attached</span>}
        </p>
        <p className="fileInfoTextLast">
          <strong>Due:</strong> {dueDate}
        </p>
      </div>

      <p className="teacherClassesDesc">
        Select one or more classes to receive this assignment.
      </p>

      <div className="checkboxGroup">
        {classes.map((cls) => (
          <label 
            key={cls} 
            className={selectedClasses.includes(cls) ? 'teacherClassOptionSelected' : 'teacherClassOption'}
          >
            <input 
              type="checkbox" 
              checked={selectedClasses.includes(cls)}
              onChange={() => handleClassToggle(cls)}
              className="largeCheckbox"
            />
            <span className={selectedClasses.includes(cls) ? 'boldText' : 'normalText'}>
              {cls}
            </span>
          </label>
        ))}
      </div>

      <div className="btnGroup">
        <button 
          onClick={() => setStep(1)} 
          className="submitBtn backBtnOutline flex1"
        >
          ← Back
        </button>
        <button 
          onClick={handleSubmit} 
          className="submitBtn publishBtn flex2"
        >
          Publish Assignment
        </button>
      </div>
    </div>
  );
};

export default TeacherClasses;