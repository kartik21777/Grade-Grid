import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <section>
      <div className="teacherDashboardHeader">
        <h2 className="teacherDashboardTitle">Student Portal</h2>

      </div>

      <Outlet />
    </section>
  );
};

export default StudentDashboard;