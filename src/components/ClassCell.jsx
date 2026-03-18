import React from 'react';
const ClassCell = ({ className, location, colSpan }) => (
  <td colSpan={colSpan || 1} className="scheduleTd">
    <div className="classNameText">{className}</div>
    <div className="classLocationText"> {location}</div>
  </td>
);