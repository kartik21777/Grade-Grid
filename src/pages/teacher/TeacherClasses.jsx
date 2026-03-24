import { useState } from 'react';
import { useDataContext } from '../../context/DataContext';

const TeacherClasses = () => {
  const { classes: mockClasses, subjects, addAssignment } = useDataContext();
  const [step, setStep] = useState(1);
  const [assignmentName, setAssignmentName] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [file, setFile] = useState(null);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [criteria, setCriteria] = useState([{ name: '', maxMarks: '' }]);

  const classes = mockClasses.map(c => c.name);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!assignmentName || !selectedSubject || !dueDate || !dueTime) {
      alert("Please fill all fields before continuing.");
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

  const handleCriteriaChange = (index, field, value) => {
    const newCriteria = [...criteria];
    newCriteria[index][field] = value;
    setCriteria(newCriteria);
  };

  const handleAddCriteria = () => {
    setCriteria([...criteria, { name: '', maxMarks: '' }]);
  };

  const handleRemoveCriteria = (index) => {
    const newCriteria = criteria.filter((_, i) => i !== index);
    setCriteria(newCriteria);
  };

  const handleSubmit = () => {
    if (selectedClasses.length === 0) {
      alert("Please select at least one class to assign this to.");
      return;
    }

    const fileName = file ? file.name : "No file attached";

    // Format criteria into rubrics object expected by backend
    const rubricsObj = {};
    criteria.forEach(c => {
      const key = c.name.trim();
      if (key !== '') {
        rubricsObj[key] = Number(c.maxMarks) || 0;
      }
    });

    // Add to global state
    selectedClasses.forEach(clsName => {
      const cls = mockClasses.find(c => c.name === clsName);
      if (cls) {
        addAssignment({
          title: assignmentName,
          subject: selectedSubject,
          classId: cls.id,
          dueDate: dueDate,
          dueTime: dueTime,
          file: file,
          rubrics: Object.keys(rubricsObj).length > 0 ? rubricsObj : undefined
        });
      }
    });

    alert(`Success! Assignment "${assignmentName}" for "${selectedSubject}" assigned to:\n${selectedClasses.join('\n')}\n\nCriteria:\n${criteria.map(c => `- ${c.name} (${c.maxMarks} marks)`).join('\n')}`);

    setStep(1);
    setAssignmentName('');
    setSelectedSubject('');
    setDueDate('');
    setDueTime('');
    setFile(null);
    setSelectedClasses([]);
    setCriteria([{ name: '', maxMarks: '' }]);
  };

  if (step === 1) {
    return (
      <div className="card teacherClassesCard">
        <h3>Step 1: Upload Assignment</h3>
        <p className="teacherClassesDesc">
          Attach your file and set a deadline.
        </p>

        <form onSubmit={handleNextStep} className="form">
          <div className="formGroup">
            <label className="teacherClassesLabel">Assignment Name:</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. Data Structures Lab 3"
              value={assignmentName}
              onChange={(e) => setAssignmentName(e.target.value)}
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
            <label className="teacherClassesLabel">Assignment File:</label>
            <input
              type="file"
              className="input"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              required
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

          <div style={{ marginTop: '10px', marginBottom: '25px' }}>
            <label className="teacherClassesLabel">Grading Criteria:</label>
            {criteria.map((crit, index) => (
              <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  placeholder="Criteria Name (e.g., Code Quality)"
                  className="input"
                  style={{ flex: 2, marginBottom: 0 }}
                  value={crit.name}
                  onChange={(e) => handleCriteriaChange(index, 'name', e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Max Marks"
                  className="input"
                  style={{ flex: 1, marginBottom: 0 }}
                  value={crit.maxMarks}
                  onChange={(e) => handleCriteriaChange(index, 'maxMarks', e.target.value)}
                  required
                  min="1"
                />
                {criteria.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCriteria(index)}
                    style={{ padding: '0 15px', background: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.5)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddCriteria}
              style={{ padding: '10px 16px', background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: '1px dashed rgba(59, 130, 246, 0.5)', borderRadius: '8px', cursor: 'pointer', width: '100%', marginTop: '5px', fontWeight: '600', transition: 'all 0.2s' }}
            >
              + Add Criterion
            </button>
          </div>

          <button type="submit" className="submitBtn" style={{ width: '100%' }}>
            Continue to Select Classes →
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="card teacherClassesCard">
      <h3>Step 2: Assign to Classes</h3>

      <div className="fileInfoBox">
        <p>
          <strong>Name:</strong> {assignmentName || <span className="errorText">Not named</span>}
        </p>
        <p>
          <strong>Subject:</strong> {selectedSubject || <span className="errorText">Not specified</span>}
        </p>
        <p>
          <strong>File:</strong> {file ? file.name : <span className="errorText">None attached</span>}
        </p>
        <p>
          <strong>Due:</strong> {dueDate} at {dueTime}
        </p>
        <p>
          <strong>Total Marks:</strong> {criteria.reduce((sum, c) => sum + (Number(c.maxMarks) || 0), 0)}
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
          className="backBtnOutline flex1"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          className="publishBtn flex2"
        >
          Publish Assignment
        </button>
      </div>
    </div>
  );
};

export default TeacherClasses;