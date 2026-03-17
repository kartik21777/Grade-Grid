import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import TeacherHome from './components/teacher/TeacherHome';
import TeacherSchedule from './components/teacher/TeacherSchedule';
import TeacherClasses from './components/teacher/TeacherClasses';
import CreateAssignment from './components/teacher/CreateAssignment';
import TeacherAssignments from './components/teacher/TeacherAssignments';

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
    <div style={isLoggedIn ? styles.dashboard : {}}>
      {isLoggedIn && (
        <nav style={styles.nav}>
          <h3>Grade Grid</h3>
          <div style={styles.navRight}>
            <span style={{ marginRight: '15px' }}>ID: {user.id} ({user.role})</span>
            <button onClick={() => { setIsLoggedIn(false); navigate('/'); }} style={styles.logoutBtn}>Logout</button>
          </div>
        </nav>
      )}

      <div style={isLoggedIn ? styles.content : {}}>
        <Routes>
          <Route path="/" element={<Login credentials={credentials} onChange={(e) => setCredentials({ ...credentials, [e.target.name]: e.target.value })} onLogin={handleLogin} error={error} styles={styles} />} />
          
          <Route path="/student" element={<StudentDashboard styles={styles} />} />
          
          {/* Nested Teacher Routes */}
          <Route path="/teacher" element={<TeacherDashboard styles={styles} />}>
            <Route index element={<TeacherHome styles={styles} />} />
            <Route path="schedule" element={<TeacherSchedule styles={styles} />} />
            <Route path="classes" element={<TeacherClasses styles={styles} />} />
            <Route path="create-assignment" element={<CreateAssignment styles={styles} />} />
            <Route path="assignments" element={<TeacherAssignments styles={styles} />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f7fa',
  },
  card: {
    background: 'white',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    width: '450px',
    textAlign: 'left',
  },
  title: {
    textAlign: 'center',
    margin: '0 0 5px 0',
    color: '#89a5d0',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    width: '100%',
    boxSizing: 'border-box',
  },
  submitBtn: {
    padding: '12px',
    background: '#1a73e8',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  dashboard: {
    minHeight: '100vh',
    backgroundColor: '#fff',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    backgroundColor: '#202124',
    color: 'white',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
  },
  logoutBtn: {
    background: '#ea4335',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  content: {
    padding: '40px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
};

export default App;