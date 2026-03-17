import React, { useState } from 'react';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ id: '', role: '' });
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (credentials.id && credentials.password) {
      const mockRole = credentials.id === '101' ? 'teacher' : 'student';
      setUser({ id: credentials.id, role: mockRole });
      setIsLoggedIn(true);
    } else {
      setError('Invalid ID or Password');
    }
  };

  if (!isLoggedIn) {
    return <Login 
      credentials={credentials} 
      onChange={handleInputChange} 
      onLogin={handleLogin} 
      error={error} 
      styles={styles} 
    />;
  }

  return (
    <div style={styles.dashboard}>
      <nav style={styles.nav}>
        <h3>Grade Grid</h3>
        <div style={styles.navRight}>
          <span style={{marginRight: '15px'}}>ID: {user.id} ({user.role})</span>
          <button onClick={() => setIsLoggedIn(false)} style={styles.logoutBtn}>Logout</button>
        </div>
      </nav>
      <div style={styles.content}>
        {user.role === 'student' 
          ? <StudentDashboard styles={styles} /> 
          : <TeacherDashboard styles={styles} />
        }
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f7fa' },
  card: { 
    background: 'white', 
    padding: '2.5rem',       
    borderRadius: '12px', 
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)', 
    width: '450px',          
    textAlign: 'left' 
  },
  title: { textAlign: 'center', margin: '0 0 5px 0', color : '#89a5d0' },
  subtitle: { textAlign: 'center', fontSize: '0.85rem', color: '#666', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '5px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box' },
  submitBtn: { padding: '12px', background: '#1a73e8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  dashboard: { minHeight: '100vh', backgroundColor: '#fff' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', backgroundColor: '#202124', color: 'white' },
  navRight: { display: 'flex', alignItems: 'center' },
  logoutBtn: { background: '#ea4335', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' },
  content: { 
    padding: '40px', 
    maxWidth: '1000px',      
    margin: '0 auto' 
  },
};

export default App;