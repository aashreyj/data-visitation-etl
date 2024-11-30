import React from 'react';

const CommoditySection = ({ section }) => {
  return (
    <div className="commodity-section">
      <h2>{section}</h2>
      <p>Here is the content for {section}. You can add the specific data or components related to this commodity category.</p>
    </div>
  );
};

export default CommoditySection;