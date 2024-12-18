import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Header from './components/Header';
import CommoditiesPage from './components/CommoditiesPage';
import DashboardDefault from './components/DashboardDefault';
import DataFilter from './components/DataFilter';
import DashboardCustom from './components/DashboardCustom';
import DataDisplay from './components/DataDisplay';
import AboutUs from './components/AboutUs';
import Login from './components/Login';
import Register from './components/Register';
import LandingPage from './components/LandingPage';
import './styles/global.css'; // Ensure this file exists and includes relevant styles

const App = () => {
  return (
    <Router>
      <div className="App">
        {/* Header Section */}
        <Header />

        {/* Navbar for Navigation */}
        <Navbar />

        <div className="main-layout" style={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar for Navigation */}
          <Sidebar />

          {/* Body Section for Route Content */}
          <div className="body" style={{ flex: 1, padding: '20px' }}>
            <Routes>
              {/* Home Route */}
              <Route path="/" element={<LandingPage />} />

              {/* Commodities Route */}
              <Route path="/commodities-category" element={<CommoditiesPage />} />

              {/* Data Visualization Routes */}
              <Route path="/data-visualization" element={<DashboardDefault />} />
              <Route path="/data-filter" element={<DataFilter />} />
              <Route path="/data-visualization/custom" element={<DashboardCustom />} />
              <Route path="/data-visualization/data" element={<DataDisplay />} />

              {/* Login/Register Route */}
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<Register/>} />

              {/* About Us Route */}
              <Route path="/about-us" element={<AboutUs />} />
            </Routes>
          </div>
        </div>

        {/* Footer Section */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;