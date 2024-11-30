import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../Assets/logo.png'; // Import the logo

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/">
          <img src={logo} alt="EXIM Logo" />
        </Link>
      </div>
      <h1>EximScope Data Visualization Portal</h1>
    </header>
  );
};

export default Header;