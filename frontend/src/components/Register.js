import React, { useState } from "react";
import "../styles/components.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate;
  // State to manage password visibility
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleRegisterClick = async () => {
    // User input data (replace with actual form data or state variables)
    const userData = {
      username: username,
      first_name: firstName,
      last_name: "LNU",
      password: password
    };

    try {
      // API endpoint (replace with your actual endpoint)
      const apiEndpoint = "http://localhost:5000/user/register";

      // Make the POST request
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Registration failed: ${errorData}`);
        alert(`Registration failed: ${errorData.message || "Unknown error"}`);
        return;
      }

      const data = await response.json();
      console.log("Registration successful:", data);
      navigate("/");
    } catch (error) {

      console.error("Error making registration request:", error);
      alert("An error occurred while trying to register. Please try again later.");
    }
  };

  return (
    <div
      className="register-container"
      style={{ backgroundImage: `url(e.png)` }}
    >
      <div className="register-box">
        <h2 className="register-heading">Register Now!</h2>
        <form>
          <div className="input-group">
            <label htmlFor="first_name">First Name</label>
            <input type="text" id="first_name" placeholder="Enter your first name" onChange={(e) => setFirstName(e.target.value)}/>
          </div>
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
          <button type="submit" className="register-btn" onClick={() => handleRegisterClick({})}>
            Register
          </button>
        </form>
        <p className="login-link">
          Already have an account? <a href="/login">Login Now</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
