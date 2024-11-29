import React, { useState } from "react";
import "../styles/components.css"; // Import the component.css file
import { Link } from "react-router-dom";

const Login = () => {
  // State to manage password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(e.png)` }}>
      <div className="login-box">
        <h2 className="login-heading">Login Now!</h2>
        <form>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email id" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-container">
              <input
                type={passwordVisible ? "text" : "password"} // Toggle between 'text' and 'password'
                id="password"
                placeholder="Enter your password"
              />
              <span
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                👁️
              </span>
            </div>
          </div>
          <div className="remember-me">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember Me</label>
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
        </form>
        <p className="register-link">
          Don’t have an account?
          <Link to="/register">Register Now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
