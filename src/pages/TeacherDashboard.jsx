import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <section>
      <div className="teacherDashboardHeader">
        <h2 className="teacherDashboardTitle">Instructor Portal</h2>
        

      </div>

      
      <Outlet />
    </section>
  );
};

export default TeacherDashboard;