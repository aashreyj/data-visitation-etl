import React from 'react';
import imagePath from '../Assets/a.jpeg'; // Correctly import the image at the top
import '../styles/components.css'; // Import your centralized components CSS file

const LandingPage = () => {
  return (
    <div
      className="landing-page"
      style={{
        backgroundImage: `url(${imagePath})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        
      }}
    >
      <div className="content-box">
        <h1>Simplifying Global Trade</h1>
        <br></br>
        <h1>One Insight at a Time</h1>
        <br></br>
        {/* <h2>From pricing to trade volumes, from trends to geographic distribution</h2> */}
        <br></br>
        <h3>Empowering Indian Traders for Global Markets.</h3>
      </div>
    </div>
  );
};

export default LandingPage;