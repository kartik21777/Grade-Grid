import React, { useState } from 'react';
import { useDataContext } from '../../context/DataContext';

const StudentNotes = () => {
  const { currentUser, getStudentNotesByRoll } = useDataContext();
  const [selectedSubject, setSelectedSubject] = useState(null);

  const notes = getStudentNotesByRoll(currentUser.id);
  const subjects = [...new Set(notes.map(n => n.subject))];

  const filteredNotes = selectedSubject 
    ? notes.filter(n => n.subject === selectedSubject)
    : notes;

  return (
    <div className="contentWrapper">
      <div className="headerSection">
        <h2 className="portalTitle">Study Materials</h2>
        <p className="portalDesc">Access notes and resources shared by your instructors.</p>
      </div>

      <div className="filterSection">
        <button 
          className={!selectedSubject ? "filterBtn active" : "filterBtn"}
          onClick={() => setSelectedSubject(null)}
        >
          All Subjects
        </button>
        {subjects.map(subj => (
          <button 
            key={subj}
            className={selectedSubject === subj ? "filterBtn active" : "filterBtn"}
            onClick={() => setSelectedSubject(subj)}
          >
            {subj}
          </button>
        ))}
      </div>

      <div className="assignmentsGrid">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <div key={note.id} className="card assignmentCard">
              <div className="assignmentCardHeader">
                <span className="subjectTag">{note.subject}</span>
                <span className="courseTag">{note.course}</span>
              </div>
              
              <h3 className="assignmentTitle">{note.title}</h3>
              <p className="assignmentFile">
                <span className="fileIcon">📄</span> {note.file}
              </p>
              
              <div className="cardFooter">
                <button 
                  className="submitBtn" 
                  style={{ width: '100%' }}
                  onClick={() => alert(`Downloading "${note.file}"...`)}
                >
                  View / Download Notes
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="noDataBox">
            <p>No study materials found for this subject.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentNotes;
