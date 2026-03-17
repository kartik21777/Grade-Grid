import React from 'react';

const Login = ({ credentials, onChange, onLogin, error, styles }) => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Grade Grid</h2>
        <p style={styles.subtitle}>Lab Evaluation Platform</p>
        
        <form onSubmit={onLogin} style={styles.form}>
          <input 
            type="number"
            name="id"
            placeholder="User ID" 
            value={credentials.id}
            onChange={onChange}
            style={styles.input} 
            required 
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={credentials.password}
            onChange={onChange}
            style={styles.input} 
            required 
          />
          {error && <p style={{color: 'red', fontSize: '12px'}}>{error}</p>}
          <button type="submit" style={styles.submitBtn}>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;