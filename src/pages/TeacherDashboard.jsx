import React from 'react';
import { Outlet } from 'react-router-dom';

const TeacherDashboard = () => {
  return (
    <section>
      <div className="teacherDashboardHeader">
        <h2 className="teacherDashboardTitle">Instructor Portal</h2>
      </div>
      <Outlet />
    </section>)
};

export default TeacherDashboard;