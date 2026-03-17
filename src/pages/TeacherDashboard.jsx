import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <h2 style={{ margin: 0 }}>Instructor Portal</h2>
        {/* Show Back button only if we are not on the main teacher home */}
        {location.pathname !== '/teacher' && (
          <button 
            onClick={() => navigate('/teacher')} 
            style={{ padding: '8px 15px', background: '#e0e0e0', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
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