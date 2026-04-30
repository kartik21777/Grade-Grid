import { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import StudentHome from './pages/student/StudentHome';
import StudentAssignments from './pages/student/StudentAssignments';
import StudentResults from './pages/student/StudentResults';
import StudentNotes from './pages/student/StudentNotes';
import StudentDeadlines from './pages/student/StudentDeadlines';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherHome from './pages/teacher/TeacherHome';
import TeacherClasses from './pages/teacher/TeacherClasses';
import SearchStudent from './pages/teacher/SearchStudent';
import GradeAssignment from './pages/teacher/GradeAssignment';
import ClassResults from './pages/teacher/ClassResults';
import TeacherNotes from './pages/teacher/TeacherNotes';
import Dashboard from './components/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminHome from './pages/admin/AdminHome';
import AdminAllUsers from './pages/admin/AdminAllUsers';
import AdminStudents from './pages/admin/AdminStudents';
import AdminTeachers from './pages/admin/AdminTeachers';
import AdminClasses from './pages/admin/AdminClasses';
import AdminCreateClass from './pages/admin/AdminCreateClass';
import AdminClassAllocations from './pages/admin/AdminClassAllocations';
import { DataProvider } from './context/DataContext';
import { AlertProvider } from './context/AlertContext';

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: credentials.id, password: credentials.password })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const newUser = { id: credentials.id, role: data.role };
        setUser(newUser);
        setIsLoggedIn(true);

        // Persist to localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(newUser));

        if (data.role === 'admin') navigate('/admin');
        else if (data.role === 'teacher') navigate('/teacher');
        else navigate('/student');
      } else {
        setError(data.message || 'Invalid ID or Password');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('Unable to connect to server');
    }
  };

  return (
    <AlertProvider>
      <DataProvider user={user}>
        {isLoggedIn ? (
          <Dashboard user={user} setIsLoggedIn={setIsLoggedIn}>
            <Routes>
              <Route path="/student" element={<StudentDashboard />}>
                <Route index element={<StudentHome />} />
                <Route path="assignments" element={<StudentAssignments />} />
                <Route path="results" element={<StudentResults />} />
                <Route path="notes" element={<StudentNotes />} />
                <Route path="deadlines" element={<StudentDeadlines />} />
              </Route>

              <Route path="/teacher" element={<TeacherDashboard />}>
                <Route index element={<TeacherHome />} />
                <Route path="classes" element={<TeacherClasses />} />
                <Route path="grade-assignment" element={<GradeAssignment />} />
                <Route path="search-student" element={<SearchStudent />} />
                <Route path="class-results" element={<ClassResults />} />
                <Route path="notes" element={<TeacherNotes />} />
              </Route>

              <Route path="/admin" element={<AdminDashboard />}>
                <Route index element={<AdminHome />} />
                <Route path="users" element={<AdminAllUsers />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="teachers" element={<AdminTeachers />} />
                <Route path="classes" element={<AdminClasses />} />
                <Route path="classes/:id/allocations" element={<AdminClassAllocations />} />
                <Route path="create-class" element={<AdminCreateClass />} />
              </Route>

              <Route path="*" element={<Navigate to={user.role === 'admin' ? '/admin' : user.role === 'teacher' ? '/teacher' : '/student'} replace />} />
            </Routes>
          </Dashboard>
        ) : (
          <Routes>
            <Route path="/" element={<Login credentials={credentials} onChange={(e) => setCredentials({ ...credentials, [e.target.name]: e.target.value })} onLogin={handleLogin} error={error} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </DataProvider>
    </AlertProvider>
  );
};


export default App;