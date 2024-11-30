import React, { useState } from "react";
import axios from 'axios'
import "../styles/components.css"; // Import the component.css file
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate;
  // State to manage password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLoginClick = async () => {
    // User input data (replace with actual form data or state variables)
    const apiEndpoint = "http://localhost:5000/user/login";
    const userData = {
      username: username,
      password: password
    };

    try {
      // Make the POST request
      // const response = await axios.post(apiEndpoint, userData);
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Login failed:, ${errorData}`);
        alert(`Login failed: ${errorData.message || "Unknown error"}`);
        return;
      }

      const data = await response.json();
      console.log("Logged in:", response.data);
      navigate("/");

    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(e.png)` }}>
      <div className="login-box">
        <h2 className="login-heading">Login Now!</h2>
        <form>
          <div className="input-group">
            <label htmlFor="email">Username</label>
            <input type="text" id="email" placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)}/>
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-container">
              <input
                type={passwordVisible ? "text" : "password"} // Toggle between 'text' and 'password'
                id="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
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
          <button type="submit" className="login-btn" onClick={handleLoginClick}>
            Login
          </button>
        </form>
        <p className="register-link">
          Don’t have an account?
          <Link to="/register"> Register Now</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
