import React from 'react';

const StudentResults = () => {
  // Mock data for results
  const results = [
    {
      id: 1,
      title: 'Data Structures Lab 1',
      course: 'Year 2 - CSE A',
      checkedDate: '2026-02-15',
      totalMarks: 100,
      obtainedMarks: 92,
      feedback: 'Excellent work on the linked list implementation.',
      criteria: [
        { name: 'Code Quality', marks: 25, max: 25 },
        { name: 'Functionality', marks: 45, max: 50 },
        { name: 'Documentation', marks: 22, max: 25 },
      ]
    },
    {
      id: 2,
      title: 'Algorithms Homework 1',
      course: 'Year 2 - CSE A',
      checkedDate: '2026-03-05',
      totalMarks: 50,
      obtainedMarks: 38,
      feedback: 'Good try, but the sorting algorithm could be optimized further.',
      criteria: [
        { name: 'Correctness', marks: 25, max: 30 },
        { name: 'Time Complexity', marks: 13, max: 20 },
      ]
    }
  ];

  return (
    <div className="contentWrapper">
      <h2>My Results</h2>
      
      <div className="card-container">
        {results.map(result => (
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
        {results.length === 0 && (
          <p>No results available yet.</p>
        )}
      </div>
    </div>
  );
};

export default StudentResults;
