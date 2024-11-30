import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-justify-center">
        {/* Main navigation links */}
        <Link to="/" className="navbar-item">Home</Link>
        <Link to="/commodities-category" className="navbar-item">Commodities</Link>
        <Link to="/data-visualization" className="navbar-item">Data Visualization</Link>
        <Link to="/about-us" className="navbar-item">About Us</Link>
      </div>
      <div className="navbar-right">
        {/* Login/Register link */}
        <Link to="/login" className="navbar-item">Login/Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;