import React from 'react';

const Login = ({ credentials, onChange, onLogin, error }) => {
  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Grade Grid</h2>
        <p className="subtitle">Lab Evaluation Platform</p>
        
        <form onSubmit={onLogin} className="form">
          <input 
            type="number"
            name="id"
            placeholder="User ID" 
            value={credentials.id}
            onChange={onChange}
            className="input" 
            required 
          />
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={credentials.password}
            onChange={onChange}
            className="input" 
            required 
          />
          {/* Kept the inline style for the error message, but you can change this to className="errorMsg" later if you want to put it in index.css */}
          {error && <p style={{color: 'red', fontSize: '12px'}}>{error}</p>}
          
          <button type="submit" className="submitBtn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;