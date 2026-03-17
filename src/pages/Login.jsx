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
          {/* Error message stylings have been moved to index.css */}
          {error && <p className="errorMsg">{error}</p>}
          
          <button type="submit" className="submitBtn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;