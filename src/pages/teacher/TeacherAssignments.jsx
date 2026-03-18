import React, { useState } from 'react';

const TeacherAssignments = () => {
  const [month, setMonth] = useState(2);
  const [year, setYear] = useState(2026);


  const mockAssignments = {
    "2026-2-5": ["Year 2 CSE A"],
    "2026-2-12": ["Year 3 IT B", "Year 1 CSE A"],
    "2026-2-20": ["Year 2 CSE B"],
    "2026-2-25": ["Year 4 CSE A"],
    "2026-3-10": ["Year 2 CSE A"]
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = [2026, 2027, 2028];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];


  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();


  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    calendarCells.push(i);
  }


  const weeks = [];
  for (let i = 0; i < calendarCells.length; i += 7) {
    const week = calendarCells.slice(i, i + 7);

    while (week.length < 7) {
      week.push(null);
    }
    weeks.push(week);
  }

  return (
    <div className="teacherAssignWrapper">
      <header className="teacherAssignHeader">
        <h2 className="teacherAssignTitle">Assignment Calendar</h2>


        <div className="teacherAssignControls">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="teacherAssignSelect"
          >
            {months.map((m, index) => (
              <option key={index} value={index}>{m}</option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="teacherAssignSelect"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </header>


      <table className="teacherAssignTable">
        <thead>
          <tr>
            {daysOfWeek.map((day) => (
              <th key={day} className="teacherAssignTh">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, rowIndex) => (
            <tr key={rowIndex}>
              {week.map((day, colIndex) => {
                const dateKey = `${year}-${month}-${day}`;
                const dayAssignments = mockAssignments[dateKey] || [];

                return (
                  <td key={colIndex} className="teacherAssignTd">
                    {day ? (
                      <div className="teacherAssignCellContent">
                        <span className="teacherAssignDateNumber">{day}</span>

                        <div className="teacherAssignContainer">
                          {dayAssignments.map((assignment, idx) => (
                            <div key={idx} className="teacherAssignTag">
                              {assignment}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



export default TeacherAssignments;