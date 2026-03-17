import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <section>
      <div className="teacherDashboardHeader">
        <h2 className="teacherDashboardTitle">Instructor Portal</h2>
        {/* Show Back button only if we are not on the main teacher home */}
        {location.pathname !== '/teacher' && (
          <button 
            onClick={() => navigate('/teacher')} 
            className="backBtn"
          >
            ← Back to Dashboard
          </button>
        )}
      </div>

      {/* This is where the sub-pages will be rendered */}
      <Outlet />
    </section>
  );
};

export default TeacherDashboard;