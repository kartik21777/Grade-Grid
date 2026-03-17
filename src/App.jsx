import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherHome from './pages/teacher/TeacherHome';
import TeacherSchedule from './pages/teacher/TeacherSchedule';
import TeacherClasses from './pages/teacher/TeacherClasses';
import CreateAssignment from './pages/teacher/CreateAssignment';
import TeacherAssignments from './pages/teacher/TeacherAssignments';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ id: '', role: '' });
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.id && credentials.password) {
      const mockRole = credentials.id === '101' ? 'teacher' : 'student';
      setUser({ id: credentials.id, role: mockRole });
      setIsLoggedIn(true);
      navigate(mockRole === 'teacher' ? '/teacher' : '/student');
    } else {
      setError('Invalid ID or Password');
    }
  };

  return (
    <div className={isLoggedIn ? 'dashboard' : ''}>
      {isLoggedIn && (
        <nav className="nav">
          <h3>Grade Grid</h3>
          <div className="navRight">
            <span style={{ marginRight: '15px' }}>ID: {user.id} ({user.role})</span>
            <button onClick={() => { setIsLoggedIn(false); navigate('/'); }} className="logoutBtn">Logout</button>
          </div>
        </nav>
      )}

      <div className={isLoggedIn ? 'content' : ''}>
        <Routes>
          <Route path="/" element={<Login credentials={credentials} onChange={(e) => setCredentials({ ...credentials, [e.target.name]: e.target.value })} onLogin={handleLogin} error={error} />} />
          
          <Route path="/student" element={<StudentDashboard />} />
          
          <Route path="/teacher" element={<TeacherDashboard />}>
            <Route index element={<TeacherHome />} />
            <Route path="schedule" element={<TeacherSchedule />} />
            <Route path="classes" element={<TeacherClasses />} />
            <Route path="create-assignment" element={<CreateAssignment />} />
            <Route path="assignments" element={<TeacherAssignments />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};


export default App;