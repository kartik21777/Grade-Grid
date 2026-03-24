import { useDataContext } from '../../context/DataContext';

const StudentResults = () => {
  const { currentUser, getStudentResultsByRoll } = useDataContext();
  const results = getStudentResultsByRoll(currentUser.id);

  return (
    <div className="contentWrapper">
      <h2 style={{ color: 'white' }}>My Results</h2>

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
