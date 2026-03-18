import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <section>
      <div className="teacherDashboardHeader">
        <h2 className="teacherDashboardTitle">Instructor Portal</h2>
        
        {location.pathname !== '/teacher' && (
          <button 
            onClick={() => navigate('/teacher')} 
            className="backBtn"
          >
            ← Back to Dashboard
          </button>
        )}
      </div>

      
      <Outlet />
    </section>
  );
};

export default TeacherDashboard;