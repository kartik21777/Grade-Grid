import React from 'react';

// Reusable style for standard cells
const tdStyle = {
  border: '1px solid #000',
  padding: '8px',
  textAlign: 'center',
};

// A helper component to format the Class and Location neatly
const ClassCell = ({ className, location, colSpan }) => (
  <td colSpan={colSpan || 1} style={tdStyle}>
    <div style={{ fontWeight: 'bold', color: '#111' }}>{className}</div>
    <div style={{ fontSize: '12px', color: '#444', marginTop: '4px' }}>📍 {location}</div>
  </td>
);

const TeacherSchedule = () => {
  return (
    <div style={localStyles.wrapper}>
      <h3 style={localStyles.header}>
        GRAPHIC ERA DEEMED TO BE UNIVERSITY<br />
        INSTRUCTOR TIME TABLE<br />
        ACADEMIC YEAR 2025-26
      </h3>
      <div style={localStyles.tableContainer}>
        <table style={localStyles.table}>
          <thead>
            <tr>
              <th style={{ ...localStyles.th, backgroundColor: '#ffffff' }}>Days</th>
              <th style={localStyles.th}>8:00-8:55</th>
              <th style={localStyles.th}>9:00-9:55</th>
              <th style={localStyles.th}>9:55-10:50</th>
              <th style={localStyles.th}>11:10-12:05</th>
              <th style={localStyles.th}>12:05-1:00</th>
              <th style={localStyles.th}>1:00-1:55</th>
              <th style={localStyles.th}>1:55-2:50</th>
              <th style={localStyles.th}>3:10-4:05</th>
              <th style={localStyles.th}>4:05-5:00</th>
              <th style={localStyles.th}>5:00-5:55</th>
            </tr>
          </thead>
          <tbody>
            {/* MONDAY */}
            <tr style={localStyles.rowOdd}>
              <th style={localStyles.th}>Mon</th>
              <ClassCell className="Year 2 CSE A" location="Room 301" />
              <ClassCell className="Year 3 IT B" location="Room 405" />
              <ClassCell className="Year 2 CSE B" location="Room 302" />
              <ClassCell className="Year 1 CSE A" location="Room 101" />
              
              {/* Spanning blocks for the teacher's schedule */}
              <td rowSpan="5" style={localStyles.lunchCell}>
                <strong>Lunch Break</strong><br/><span style={{fontSize:'12px'}}>Staff Canteen</span>
              </td>
              
              <ClassCell className="Year 3 IT A (Lab)" location="Lab 2" colSpan="2" />
              
              <td rowSpan="4" style={localStyles.electiveCell}>
                <strong>Free Period / Prep</strong><br/><span style={{fontSize:'12px'}}>Staff Room</span>
              </td>
              <td colSpan="2" rowSpan="5" style={localStyles.placementCell}>
                <strong>Office Hours</strong><br/><span style={{fontSize:'12px'}}>Cabin 4</span>
              </td>
            </tr>
            
            {/* TUESDAY */}
            <tr style={localStyles.rowEven}>
              <th style={localStyles.th}>Tue</th>
              <ClassCell className="Year 2 CSE A" location="Room 301" />
              <ClassCell className="Year 3 IT B" location="Room 405" />
              <ClassCell className="Year 2 CSE B" location="Room 302" />
              <ClassCell className="Year 3 IT A" location="Room 401" />
              <ClassCell className="Year 3 IT B (Lab)" location="Lab 3" colSpan="2" />
            </tr>
            
            {/* WEDNESDAY */}
            <tr style={localStyles.rowOdd}>
              <th style={localStyles.th}>Wed</th>
              <ClassCell className="Year 2 CSE A (Lab)" location="Lab 1" colSpan="2" />
              <ClassCell className="Year 3 IT A" location="Room 401" />
              <ClassCell className="Year 2 CSE B" location="Room 302" />
              <ClassCell className="Year 3 IT B" location="Room 405" />
              <ClassCell className="Year 2 CSE C" location="Room 204" />
            </tr>
            
            {/* THURSDAY */}
            <tr style={localStyles.rowEven}>
              <th style={localStyles.th}>Thur</th>
              <ClassCell className="Year 1 CSE A" location="Room 101" />
              <ClassCell className="Year 3 IT A" location="Room 401" />
              <ClassCell className="Year 2 CSE B (Lab)" location="Lab 1" colSpan="2" />
              <ClassCell className="Year 3 IT A (Lab)" location="Lab 4" colSpan="2" />
            </tr>
            
            {/* FRIDAY */}
            <tr style={localStyles.rowOdd}>
              <th style={localStyles.th}>Fri</th>
              <ClassCell className="Year 3 IT B (Lab)" location="Lab 4" colSpan="2" />
              <ClassCell className="Year 1 CSE A" location="Room 101" />
              <ClassCell className="Year 3 IT A" location="Room 401" />
              <ClassCell className="Year 2 CSE B" location="Room 302" />
              <ClassCell className="Year 3 IT B" location="Room 405" />
              <ClassCell className="Year 4 CSE A" location="Room 501" />
            </tr>
          </tbody>
        </table>
      </div>
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
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    lineHeight: '1.5',
    fontSize: '18px',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    border: '2px solid #000',
    fontSize: '14px',
    textAlign: 'center',
    minHeight: '500px',
  },
  th: {
    backgroundColor: '#07beb8',
    border: '1px solid #000',
    padding: '10px',
    fontWeight: 'bold',
  },
  rowOdd: {
    backgroundColor: '#c4fff9',
  },
  rowEven: {
    backgroundColor: '#9ceaef',
  },
  lunchCell: {
    backgroundColor: '#8eece6',
    border: '1px solid #000',
    padding: '8px',
  },
  electiveCell: {
    backgroundColor: 'rgb(109, 255, 255)',
    border: '1px solid #000',
    padding: '8px',
  },
  placementCell: {
    backgroundColor: 'rgb(147, 255, 219)',
    border: '1px solid #000',
    padding: '8px',
  },
};

export default TeacherSchedule;