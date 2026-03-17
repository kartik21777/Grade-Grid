import React from 'react';

// A helper component to format the Class and Location neatly
const ClassCell = ({ className, location, colSpan }) => (
  <td colSpan={colSpan || 1} className="scheduleTd">
    <div className="classNameText">{className}</div>
    <div className="classLocationText">📍 {location}</div>
  </td>
);

const TeacherSchedule = () => {
  return (
    <div className="scheduleWrapper">
      <h3 className="scheduleHeader">
        GRAPHIC ERA DEEMED TO BE UNIVERSITY<br />
        INSTRUCTOR TIME TABLE<br />
        ACADEMIC YEAR 2025-26
      </h3>
      <div className="scheduleTableContainer">
        <table className="scheduleTable">
          <thead>
            <tr>
              <th className="scheduleTh whiteBg">Days</th>
              <th className="scheduleTh">8:00-8:55</th>
              <th className="scheduleTh">9:00-9:55</th>
              <th className="scheduleTh">9:55-10:50</th>
              <th className="scheduleTh">11:10-12:05</th>
              <th className="scheduleTh">12:05-1:00</th>
              <th className="scheduleTh">1:00-1:55</th>
              <th className="scheduleTh">1:55-2:50</th>
              <th className="scheduleTh">3:10-4:05</th>
              <th className="scheduleTh">4:05-5:00</th>
              <th className="scheduleTh">5:00-5:55</th>
            </tr>
          </thead>
          <tbody>
            {/* MONDAY */}
            <tr className="scheduleRowOdd">
              <th className="scheduleTh">Mon</th>
              <ClassCell className="Year 2 CSE A" location="Room 301" />
              <ClassCell className="Year 3 IT B" location="Room 405" />
              <ClassCell className="Year 2 CSE B" location="Room 302" />
              <ClassCell className="Year 1 CSE A" location="Room 101" />
              
              {/* Spanning blocks for the teacher's schedule */}
              <td rowSpan="5" className="scheduleLunchCell">
                <strong>Lunch Break</strong><br/><span className="smallText">Staff Canteen</span>
              </td>
              
              <ClassCell className="Year 3 IT A (Lab)" location="Lab 2" colSpan="2" />
              
              <td rowSpan="4" className="scheduleElectiveCell">
                <strong>Free Period / Prep</strong><br/><span className="smallText">Staff Room</span>
              </td>
              <td colSpan="2" rowSpan="5" className="schedulePlacementCell">
                <strong>Office Hours</strong><br/><span className="smallText">Cabin 4</span>
              </td>
            </tr>
            
            {/* TUESDAY */}
            <tr className="scheduleRowEven">
              <th className="scheduleTh">Tue</th>
              <ClassCell className="Year 2 CSE A" location="Room 301" />
              <ClassCell className="Year 3 IT B" location="Room 405" />
              <ClassCell className="Year 2 CSE B" location="Room 302" />
              <ClassCell className="Year 3 IT A" location="Room 401" />
              <ClassCell className="Year 3 IT B (Lab)" location="Lab 3" colSpan="2" />
            </tr>
            
            {/* WEDNESDAY */}
            <tr className="scheduleRowOdd">
              <th className="scheduleTh">Wed</th>
              <ClassCell className="Year 2 CSE A (Lab)" location="Lab 1" colSpan="2" />
              <ClassCell className="Year 3 IT A" location="Room 401" />
              <ClassCell className="Year 2 CSE B" location="Room 302" />
              <ClassCell className="Year 3 IT B" location="Room 405" />
              <ClassCell className="Year 2 CSE C" location="Room 204" />
            </tr>
            
            {/* THURSDAY */}
            <tr className="scheduleRowEven">
              <th className="scheduleTh">Thur</th>
              <ClassCell className="Year 1 CSE A" location="Room 101" />
              <ClassCell className="Year 3 IT A" location="Room 401" />
              <ClassCell className="Year 2 CSE B (Lab)" location="Lab 1" colSpan="2" />
              <ClassCell className="Year 3 IT A (Lab)" location="Lab 4" colSpan="2" />
            </tr>
            
            {/* FRIDAY */}
            <tr className="scheduleRowOdd">
              <th className="scheduleTh">Fri</th>
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



export default TeacherSchedule;