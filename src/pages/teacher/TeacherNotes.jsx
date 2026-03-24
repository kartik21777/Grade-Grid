import React, { useState } from 'react';
import { useDataContext } from '../../context/DataContext';

const TeacherNotes = () => {
  const { classes: mockClasses, subjects, addNotes } = useDataContext();
  const [step, setStep] = useState(1);
  const [notesName, setNotesName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [file, setFile] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);

  const classes = mockClasses.map(c => c.name);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!notesName || !selectedSubject || !file) {
      alert("Please fill all fields and attach a file before continuing.");
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
      alert("Please select at least one class to share these notes with.");
      return;
    }

    const fileName = file ? file.name : "No file attached";

    // Add to global state
    selectedClasses.forEach(clsName => {
      const cls = mockClasses.find(c => c.name === clsName);
      if (cls) {
        addNotes({
          title: notesName,
          subject: selectedSubject,
          classId: cls.id,
          file: fileName
        });
      }
    });

    alert(`Success! Notes "${notesName}" for "${selectedSubject}" shared with:\n${selectedClasses.join('\n')}`);

    // Reset form
    setStep(1);
    setNotesName('');
    setSelectedSubject('');
    setFile(null);
    setSelectedClasses([]);
  };

  if (step === 1) {
    return (
      <div className="card teacherClassesCard">
        <h3>Step 1: Upload Study Notes</h3>
        <p className="teacherClassesDesc">
          Provide a name and subject for your study material.
        </p>

        <form onSubmit={handleNextStep} className="form">
          <div className="formGroup">
            <label className="teacherClassesLabel">Notes Name:</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Data Structures - Unit 1 Notes"
              value={notesName}
              onChange={(e) => setNotesName(e.target.value)}
              required
            />
          </div>

          <div className="formGroup">
            <label className="teacherClassesLabel">Subject:</label>
            <select
              className="input"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              required
              style={{ color: 'white', backgroundColor: '#1c2534' }}
            >
              <option value="" disabled>Select a subject</option>
              {subjects.map(subj => (
                <option key={subj} value={subj} style={{ color: 'white' }}>{subj}</option>
              ))}
            </select>
          </div>

          <div className="formGroup">
            <label className="teacherClassesLabel">File Upload:</label>
            <input
              type="file"
              className="input"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>

          <button type="submit" className="submitBtn" style={{ width: '100%', marginTop: '20px' }}>
            Continue to Select Classes →
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="card teacherClassesCard">
      <h3>Step 2: Share with Classes</h3>

      <div className="fileInfoBox">
        <p>
          <strong>Notes Name:</strong> {notesName || <span className="errorText">Not named</span>}
        </p>
        <p>
          <strong>Subject:</strong> {selectedSubject || <span className="errorText">Not specified</span>}
        </p>
        <p>
          <strong>File:</strong> {file ? file.name : <span className="errorText">None attached</span>}
        </p>
      </div>

      <p className="teacherClassesDesc">
        Select the classes that should have access to these notes.
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
          className="backBtnOutline flex1"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          className="publishBtn flex2"
        >
          Share Notes
        </button>
      </div>
    </div>
  );
};

export default TeacherNotes;
