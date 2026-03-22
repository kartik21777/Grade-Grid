import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import StudentHome from './pages/student/StudentHome';
import StudentAssignments from './pages/student/StudentAssignments';
import StudentResults from './pages/student/StudentResults';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherHome from './pages/teacher/TeacherHome';
import TeacherClasses from './pages/teacher/TeacherClasses';
import SearchStudent from './pages/teacher/SearchStudent';
import GradeAssignment from './pages/teacher/GradeAssignment';
import ClassResults from './pages/teacher/ClassResults';
import Dashboard from './components/Dashboard';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { id: '', role: '' };
  });
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.id && credentials.password) {
      const mockRole = credentials.id === '101' ? 'teacher' : 'student';
      const newUser = { id: credentials.id, role: mockRole };
      setUser(newUser);
      setIsLoggedIn(true);
      
      // Persist to localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(newUser));
      
      navigate(mockRole === 'teacher' ? '/teacher' : '/student');
    } else {
      setError('Invalid ID or Password');
    }
  };

  return (
    <>
      {isLoggedIn ? (
        <Dashboard user={user} setIsLoggedIn={setIsLoggedIn}>
          <Routes>
            <Route path="/student" element={<StudentDashboard />}>
              <Route index element={<StudentHome />} />
              <Route path="assignments" element={<StudentAssignments />} />
              <Route path="results" element={<StudentResults />} />
            </Route>
            
            <Route path="/teacher" element={<TeacherDashboard />}>
              <Route index element={<TeacherHome />} />
              <Route path="classes" element={<TeacherClasses />} />
              <Route path="grade-assignment" element={<GradeAssignment />} />
              <Route path="search-student" element={<SearchStudent />} />
              <Route path="class-results" element={<ClassResults />} />
            </Route>
            
            <Route path="*" element={<Navigate to={user.role === 'teacher' ? '/teacher' : '/student'} replace />} />
          </Routes>
        </Dashboard>
      ) : (
        <Routes>
          <Route path="/" element={<Login credentials={credentials} onChange={(e) => setCredentials({ ...credentials, [e.target.name]: e.target.value })} onLogin={handleLogin} error={error} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </>
  );
};


export default App;