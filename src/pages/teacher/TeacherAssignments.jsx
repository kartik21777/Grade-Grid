import React, { useState } from 'react';

const TeacherAssignments = () => {
  // State for the selected month (0 = Jan, 1 = Feb, etc.) and year
  const [month, setMonth] = useState(2); // Default to March
  const [year, setYear] = useState(2026);

  // Mock data to show assignments on the calendar
  // Format is "YYYY-M-D" where M is 0-11
  const mockAssignments = {
    "2026-2-5": ["Year 2 CSE A"],
    "2026-2-12": ["Year 3 IT B", "Year 1 CSE A"],
    "2026-2-20": ["Year 2 CSE B"],
    "2026-2-25": ["Year 4 CSE A"],
    "2026-3-10": ["Year 2 CSE A"] // An assignment in April
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = [2026, 2027, 2028];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  // Calendar logic
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Build an array of all the cells needed (empty padding + actual days)
  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null); // Empty cells before the 1st of the month
  }
  for (let i = 1; i <= totalDays; i++) {
    calendarCells.push(i);
  }

  // Chunk the cells into weeks (arrays of 7) for rendering rows
  const weeks = [];
  for (let i = 0; i < calendarCells.length; i += 7) {
    const week = calendarCells.slice(i, i + 7);
    // Pad the last week with nulls if it doesn't end on a Saturday
    while (week.length < 7) {
      week.push(null);
    }
    weeks.push(week);
  }

  return (
    <div style={localStyles.wrapper}>
      <header style={{ marginBottom: '20px' }}>
        <h2 style={{ textAlign: 'center', margin: '0 0 15px 0' }}>Assignment Calendar</h2>
        
        {/* Dropdowns for Month and Year */}
        <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <select 
            value={month} 
            onChange={(e) => setMonth(Number(e.target.value))}
            style={localStyles.select}
          >
            {months.map((m, index) => (
              <option key={index} value={index}>{m}</option>
            ))}
          </select>
          
          <select 
            value={year} 
            onChange={(e) => setYear(Number(e.target.value))}
            style={localStyles.select}
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Calendar Grid */}
      <table style={localStyles.table}>
        <thead>
          <tr>
            {daysOfWeek.map((day) => (
              <th key={day} style={localStyles.th}>{day}</th>
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
                  <td key={colIndex} style={localStyles.td}>
                    {day ? (
                      <div style={localStyles.cellContent}>
                        <span style={localStyles.dateNumber}>{day}</span>
                        {/* Render assignments if they exist for this day */}
                        <div style={localStyles.assignmentContainer}>
                          {dayAssignments.map((assignment, idx) => (
                            <div key={idx} style={localStyles.assignmentTag}>
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

const localStyles = {
  wrapper: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  select: {
    padding: '8px 12px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    border: '2px solid #000',
    textAlign: 'center',
    tableLayout: 'fixed', // Ensures columns are equally sized
  },
  th: {
    backgroundColor: '#07beb8',
    color: '#000',
    border: '1px solid #000',
    padding: '10px',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  td: {
    border: '1px solid #000',
    height: '100px', // Gives the "Big Calendar" feel
    verticalAlign: 'top',
    padding: '5px',
    width: '14%', // 100% / 7 days
  },
  cellContent: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  dateNumber: {
    fontWeight: 'bold',
    textAlign: 'right',
    display: 'block',
    marginBottom: '5px',
  },
  assignmentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    overflowY: 'auto',
  },
  assignmentTag: {
    backgroundColor: '#e8f0fe',
    color: '#1a73e8',
    fontSize: '11px',
    padding: '4px',
    borderRadius: '4px',
    textAlign: 'left',
    fontWeight: '600',
    borderLeft: '3px solid #1a73e8',
  }
};

export default TeacherAssignments;