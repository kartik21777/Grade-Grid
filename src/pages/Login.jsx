const Login = ({ credentials, onChange, onLogin, error }) => {
  return (
    <div className="login-container">
      <div className="login-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Grade Grid</h2>
          <p className="login-subtitle">Lab Evaluation Platform</p>
        </div>

        <form onSubmit={onLogin} className="login-form">
          <div className="input-group">
            <input
              type="text"
              name="id"
              placeholder="User ID"
              value={credentials.id}
              onChange={onChange}
              className="login-input"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={onChange}
              className="login-input"
              required
            />
          </div>

          {error && <p className="login-errorMsg">{error}</p>}

          <button type="submit" className="login-submitBtn">
            <span>Sign In</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;