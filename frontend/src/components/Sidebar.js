import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="section">
        <h3 className="section-title export">EXPORTS</h3>
        <ul>
          <li><Link to="/commodities" className="sidebar-item">Commodities</Link></li>
          <li><Link to="/years" className="sidebar-item">Years</Link></li>
          <li><Link to="/price" className="sidebar-item">Price</Link></li>
          <li><Link to="/quantity" className="sidebar-item">Quantity</Link></li>
          <li><Link to="/region" className="sidebar-item">Region</Link></li>
        </ul>
      </div>
      <div className="section">
        <h3 className="section-title import">IMPORTS</h3>
        <ul>
          <li><Link to="/commodities" className="sidebar-item">Commodities</Link></li>
          <li><Link to="/years" className="sidebar-item">Years</Link></li>
          <li><Link to="/price" className="sidebar-item">Price</Link></li>
          <li><Link to="/quantity" className="sidebar-item">Quantity</Link></li>
          <li><Link to="/region" className="sidebar-item">Region</Link></li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;