import React from "react";
import "../styles/components.css"; // Import the component.css file which includes styles

import groupImage from "../Assets/d.png";
import chiefAdvisorImage from "../Assets/s.png";
import { Colors } from "chart.js";


const chiefAdvisor = {
  name: "Dr. Sai Anirudh Karre, PhD",
  role: "Chief Advisor & Mentor",
  bio: "Dr.Sai Anirudh Karre is an Industry Professional in Data Engineering and also an Academic Researcher in the field of Software Engineering, Virtual Reality and HCI. He earned his Ph.D. in 2024 under Prof. Y. Raghu Reddy at the Software Engineering Research Center, IIIT Hyderabad.He has strong Data Engineering background and is currently working as a Data Product Manager at Phenom. In past, he took care of Data Products at Accurate Background, Cornerstone Ondemand. ",
  image: chiefAdvisorImage,
};

const members = [
  {
    name: "Deepesh Vendoti",
    role: "Frontend Developer",
    bio: "Developed React-based UI screens,Integrated Chart.js to efficiently visualize the data",
  },
  {
    name: "Kanika Aapan",
    role: "Frontend Developer",
    bio: "Developed responsive interfaces, analyzed & visualize data using Chart.Js",
  },
  {
    name: "Ashima Mathur",
    role: "Database Architect",
    bio: "Designed and implemented the data tables, developed extraction logic to load the dataset into the reporting database",
  },
  {
    name: "Khooshi Popat",
    role: "Frontend Developer",
    bio: "Developed responsive interfaces, analyzed & visualize data using Chart.Js",
  },
  {
    name: "Aashrey Jain",
    role: "Backend Developer",
    bio: "Implemented the APIs for this project using Express.js, maintained the codebase using GitHub",
  },
];

const AboutUs = () => {
  const groupedMembers = [];
  for (let i = 0; i < members.length; i += 5) {
    groupedMembers.push(members.slice(i, i + 5));
  }

  return (
    <div className="about-us">
      <h1>About Us</h1>
      <br />
      <p>
        Import and export form the backbone of the global economy, enabling
        countries to trade goods and services that they either cannot produce
        themselves or can obtain at a lower cost from another country. Exporting
        helps nations generate revenue and create jobs, while importing allows
        access to essential products and resources. The balance between imports
        and exports shapes a country's economy, trade policies, and
        international relations. With EXIM Scope, you can explore comprehensive
        data on commodities, pricing, trade volumes, and regional trade trends
        to make informed decisions in the dynamic world of international trade.
      </p>

      {/* Chief Advisor Section */}
      <div className="chief-advisor">
        <img
          src={chiefAdvisor.image}
          alt="Chief Advisor"
          className="advisor-image"
        />
        <div className="advisor-info">
          <h2>{chiefAdvisor.name}</h2>
          <p>
            <strong>{chiefAdvisor.role}</strong>
          </p>
          <p>{chiefAdvisor.bio}</p>
        </div>
      </div>

      {/* Group Image Section */}
      <img src={groupImage} alt="Team Group" className="group-image" />

      {/* Team Members Section */}
      {groupedMembers.map((group, index) => (
        <div key={index} className="group-section">
          <div className="member-details">
            {group.map((member, idx) => (
              <div key={idx} className="member">
                <h3>{member.name}</h3>
                <p>
                  <strong>{member.role}</strong>
                </p>
                <p>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AboutUs;