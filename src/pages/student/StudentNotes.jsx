import React, { useState } from 'react';
import { useDataContext } from '../../context/DataContext';

const NoteCard = ({ note }) => {
  return (
    <div className="card studentCard" style={{ width: '100%', boxSizing: 'border-box' }}>
      <div className="studentCardHeader">
        <div>
          <h3 className="studentCardTitle" style={{ color: '#a855f7' }}>{note.title}</h3>
          <p className="studentCardCourse"><strong>Course:</strong> {note.course}</p>
          <p style={{ margin: '5px 0', color: '#64748b', fontSize: '0.9rem' }}>
            Shared on {note.date || 'Today'}
          </p>
        </div>
      </div>

      <div className="submitWorkForm" style={{ padding: '15px' }}>
        <p style={{ color: '#0f172a', fontWeight: '500', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>📄</span> {note.file}
        </p>
        <button 
          className="submitBtn uploadBtn" 
          style={{ width: '100%', background: 'linear-gradient(135deg, #a855f7, #7e22ce)' }}
          onClick={() => window.open(`http://localhost:5000${note.file}`, '_blank')}
        >
          View / Download Notes
        </button>
      </div>
    </div>
  );
};

const StudentNotes = () => {
  const { currentUser, getStudentNotesByRoll } = useDataContext();
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Derive notes from context to ensure reactivity
  const notes = getStudentNotesByRoll(currentUser.id);
  const subjects = [...new Set(notes.map(n => n.subject))];

  if (!selectedSubject) {
    return (
      <div className="contentWrapper">
        <h2 style={{ color: 'white', marginBottom: '5px' }}>My Subject Notes</h2>
        <p style={{ color: '#42cab3ff', marginBottom: '25px', fontSize: '15px' }}>Select a subject to view its study materials.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {subjects.map(subject => {
            const subjectNotes = notes.filter(n => n.subject === subject);

            return (
              <div
                key={subject}
                className="card studentCard"
                style={{
                  cursor: 'pointer',
                  borderLeft: '4px solid #a855f7',
                  padding: '25px',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  margin: 0,
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                onClick={() => setSelectedSubject(subject)}
              >
                <h3 style={{ margin: '0 0 12px 0', color: '#c084fc', fontSize: '20px' }}>{subject}</h3>
                <p style={{ margin: 0, color: '#e879f9', fontSize: '14px' }}>
                  <strong>{subjectNotes.length}</strong> resources available
                </p>
              </div>
            );
          })}
          {subjects.length === 0 && (
            <p style={{ color: '#94a3b8' }}>No study materials shared yet.</p>
          )}
        </div>
      </div>
    );
  }

  const filteredNotes = notes.filter(n => n.subject === selectedSubject);

  return (
    <div className="contentWrapper">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ color: 'white', margin: '0 0 5px 0' }}>{selectedSubject} Notes</h2>
          <p style={{ margin: 0, color: '#d8b4fe', fontSize: '14px' }}>Study guides and lecture notes</p>
        </div>
        <button
          onClick={() => setSelectedSubject(null)}
          className="backBtnOutline"
        >
          ← Back to Subjects
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {filteredNotes.map(note => (
          <NoteCard key={note.id} note={note} />
        ))}
        {filteredNotes.length === 0 && (
          <p style={{ color: '#94a3b8' }}>No notes available for this subject.</p>
        )}
      </div>
    </div>
  );
};

export default StudentNotes;
