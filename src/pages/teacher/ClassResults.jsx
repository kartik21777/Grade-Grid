import React, { useState } from 'react';

const ClassResults = () => {
  const [selectedClass, setSelectedClass] = useState(null);

  const facultyClasses = [
    { id: 1, name: 'Year 2 - CSE A' },
    { id: 2, name: 'Year 3 - IT A' },
    { id: 3, name: 'Year 1 - CSE B' }
  ];

  const classData = {
    1: {
      assignments: ['Data Structures Lab 3', 'Data Structures Midterm', 'Assignment 3', 'Assignment 4', 'Assignment 5', 'Assignment 6', 'Assignment 7', 'Assignment 8', 'Assignment 9', 'Assignment 10', 'Assignment 11', 'Assignment 12'],
      students: [
        { name: 'Alice Smith', scores: [85, 92, 90, 88, 95, 80, 85, 87, 89, 91, 95, 99] },
        { name: 'Bob Jones', scores: [85, 76, 80, 85, 82, 70, 75, 79, 81, 85, 87, 90] },
        { name: 'Charlie Brown', scores: [null, 81, 75, 80, 85, 80, null, 85, 90, 88, 85, 84] } 
      ]
    },
    2: {
      assignments: ['Web Dev Mini Project'],
      students: [
        { name: 'Diana Prince', scores: [95] },
        { name: 'Evan Wright', scores: [88] }
      ]
    },
    3: {
      assignments: ['Intro to Python Assignment 1', 'Intro to Python Assignment 2'],
      students: [
        { name: 'Fiona Gallagher', scores: [90, 85] },
        { name: 'George Miller', scores: [70, null] }
      ]
    }
  };

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
    // Header
    const headers = ["Student Name", ...currentData.assignments, "Aggregate Score"];
    csvContent += headers.join(",") + "\r\n";

    // Data rows
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
    <div className="card teacherClassesCard gradeAssignContainerLarge">
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
        <button className="submitBtn publishBtn gradeAssignDownloadBtn" onClick={downloadCSV}>
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
