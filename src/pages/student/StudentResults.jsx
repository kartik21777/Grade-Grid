import React, { useState } from 'react';
import { useDataContext } from '../../context/DataContext';

const StudentResults = () => {
  const { currentUser, getStudentResultsByRoll } = useDataContext();
  const results = getStudentResultsByRoll(currentUser.id);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const subjects = [...new Set(results.map(r => r.subject))];

  if (!selectedSubject) {
    return (
      <div className="contentWrapper">
        <h2 style={{ color: 'white', marginBottom: '5px' }}>Academic Performance</h2>
        <p style={{ color: '#42cab3ff', marginBottom: '25px', fontSize: '15px' }}>View your graded work and feedback by subject.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {subjects.map(subject => {
            const subjectResults = results.filter(r => r.subject === subject);
            const totalScore = subjectResults.reduce((acc, curr) => acc + curr.obtainedMarks, 0);
            const maxScore = subjectResults.reduce((acc, curr) => acc + curr.totalMarks, 0);
            const average = maxScore > 0 ? ((totalScore / maxScore) * 100).toFixed(1) : 0;

            return (
              <div
                key={subject}
                className="card studentCard"
                style={{
                  cursor: 'pointer',
                  borderLeft: '4px solid #42cab3ff',
                  padding: '25px',
                  transition: 'background 0.2s',
                  margin: 0,
                  width: '100%',
                }}
                onClick={() => setSelectedSubject(subject)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 className="studentCardTitle" style={{ fontSize: '20px', marginBottom: '8px' }}>{subject}</h3>
                    <p style={{ color: '#8892b0', fontSize: '14px' }}>
                      <strong>{subjectResults.length}</strong> Graded Assignments
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#42cab3ff', fontSize: '24px', fontWeight: 'bold' }}>{average}%</div>
                    <div style={{ color: '#8892b0', fontSize: '12px' }}>Average Performance</div>
                  </div>
                </div>
              </div>
            );
          })}
          {subjects.length === 0 && (
            <div className="noDataBox">
              <p>No graded results available yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Filtered Detailed Results View
  const filteredResults = results.filter(r => r.subject === selectedSubject);

  return (
    <div className="contentWrapper">
      <div className="headerContainer" style={{ marginBottom: '25px' }}>
        <button 
          onClick={() => setSelectedSubject(null)}
          className="backButton"
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#42cab3ff', 
            cursor: 'pointer',
            padding: 0,
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          ← Back to All Subjects
        </button>
        <h2 style={{ color: 'white' }}>Results: {selectedSubject}</h2>
      </div>

      <div className="card-container">
        {filteredResults.map(result => (
          <div key={result.id} className="card studentCard">
            <div className="studentCardHeader resultHeaderBorder">
              <div>
                <h3 className="studentCardTitle">{result.title}</h3>
                <p className="studentCardCourse"><strong>Course:</strong> {result.course}</p>
                <p className="resultDate">Evaluated on: {result.checkedDate}</p>
              </div>

              <div className="studentCardMeta">
                <div className={`scoreBadge ${result.obtainedMarks / result.totalMarks >= 0.8 ? 'scoreExcellent' : 'scoreGood'}`}>
                  {result.obtainedMarks} <span className="scoreMaxText">/ {result.totalMarks}</span>
                </div>
              </div>
            </div>

            <div className="criteriaSection">
              <h4 className="criteriaTitle">Grading Criteria</h4>
              <table className="criteriaTable">
                <tbody>
                  {result.criteria.map((c, idx) => (
                    <tr key={idx} className="criteriaRow">
                      <td className="criteriaName">{c.name}</td>
                      <td className="criteriaScore">{c.marks} / {c.max}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="feedbackBox">
              <h4 className="feedbackTitle">Instructor Feedback</h4>
              <p className="feedbackText">"{result.feedback}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentResults;
