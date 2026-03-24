import { useState } from 'react';
import { useDataContext } from '../../context/DataContext';

const ClassResults = () => {
  const { facultyClasses, classData } = useDataContext();
  const [selectedClass, setSelectedClass] = useState(null);

  const currentData = selectedClass ? classData[selectedClass.id] : null;

  const calculateAggregate = (scores) => {
    let total = 0;
    let count = 0;
    scores.forEach(s => {
      if (s !== null) {
        total += s;
        count += 1;
      }
    });
    return count === 0 ? '-' : (total / count).toFixed(2);
  };

  const downloadCSV = () => {
    if (!currentData) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = ["Student Name", ...currentData.assignments, "Aggregate Score"];
    csvContent += headers.join(",") + "\r\n";

    currentData.students.forEach(student => {
      const row = [
        student.name,
        ...student.scores.map(s => s === null ? "Pending" : s),
        calculateAggregate(student.scores)
      ];
      csvContent += row.join(",") + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${selectedClass.name}_Results.csv`);
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link);
  };

  if (!selectedClass) {
    return (
      <div className="card teacherClassesCard">
        <h3>Class Results: Select Class</h3>
        <p className="teacherClassesDesc">
          Select a class to view aggregate results for all students and assignments.
        </p>
        <div className="form">
          {facultyClasses.map(cls => (
            <div
              key={cls.id}
              className="teacherClassOption"
              onClick={() => setSelectedClass(cls)}
            >
              <div>
                <span className="boldText">{cls.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card gradeAssignContainerLarge">
      <div className="gradeAssignHeader">
        <h3 className="gradeAssignTitle">Results: {selectedClass.name}</h3>
        <button onClick={() => setSelectedClass(null)} className="backBtnOutline">
          ← Back to Classes
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <p className="teacherClassesDesc" style={{ margin: 0 }}>
          View student assignment scores and download the aggregate report.
        </p>
        <button className="publishBtn gradeAssignDownloadBtn" onClick={downloadCSV}>
          ⬇ Download CSV
        </button>
      </div>
      <style>{`
        .resultsTable th, .resultsTable td {
          white-space: nowrap !important;
          padding: 12px 20px;
        }
      `}</style>
      <div className="gradeAssignTableContainer" style={{ overflowX: 'auto' }}>
        <table className="teacherAssignTable resultsTable" style={{ minWidth: '100%', tableLayout: 'auto' }}>
          <thead>
            <tr>
              <th className="teacherAssignTh">Student Name</th>
              {currentData.assignments.map((assignmentName, index) => (
                <th key={index} className="teacherAssignTh">{assignmentName}</th>
              ))}
              <th className="teacherAssignTh" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#93c5fd' }}>
                Aggregate
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.students.map((student, idx) => {
              const agg = calculateAggregate(student.scores);
              return (
                <tr key={idx}>
                  <td className="teacherAssignTd gradeAssignTdLeft" style={{ fontWeight: 'bold' }}>
                    {student.name}
                  </td>
                  {student.scores.map((score, sIdx) => (
                    <td key={sIdx} className="teacherAssignTd gradeAssignTdCenter">
                      {score === null ? <span style={{ color: '#94a3b8' }}>Pending</span> : score}
                    </td>
                  ))}
                  <td className="teacherAssignTd gradeAssignTdCenterBold" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', color: '#60a5fa' }}>
                    {agg}{agg !== '-' ? '%' : ''}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassResults;
