import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

<br>
</br>
const CommoditiesPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('');


  <br>
  </br>
  // Handle selection of Imports/Exports category
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedCommodity(''); // Reset commodity selection when category changes
  };

  <br>
  </br>
  // Handle selection of a specific commodity
  const handleCommodityClick = (commodity) => {
    setSelectedCommodity(commodity);
    // Navigate to the visualization page with the selected category and commodity
    navigate('/data-visualization/', {
      state: {
        selectedCommodity: commodity,
        selectedCategory
      }
    });
  };

  return (
    <div className="commodities-page">
      <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '30px' }}>
        Select Your Interest
      </h2>

      {/* Category Selection */}
      <div className="category-selection">
        <button
          onClick={() => handleCategorySelect('Imports')}
          className={`category-button ${selectedCategory === 'Imports' ? 'selected' : ''}`}
        >
          Imports
        </button>
        <button
          onClick={() => handleCategorySelect('Exports')}
          className={`category-button ${selectedCategory === 'Exports' ? 'selected' : ''}`}
        >
          Exports
        </button>
      </div>

      {/* Commodity Selection */}
      {selectedCategory && (
        <div>
          <h3 style={{ textAlign: 'center', fontSize: '1.75rem', marginBottom: '30px' }}>
            Select a Commodity Category for {selectedCategory}
          </h3>
          <div className="category-grid">
            {[
              'Agriculture and Food Products',
              'Minerals, Metals, and Related Products',
              'Chemical and Industrial Products',
              'Textiles, Leather, and Fashion',
              'Wood, Paper, and Printing Products',
              'Machinery, Vehicles, and Transport Equipment',
              'Medical, Scientific, and Optical Instruments',
              'Defense and Security Products',
              'Manufactured Goods and Collectibles',
            ].map((commodity) => (
              <div
                key={commodity}
                className={`category-item ${selectedCommodity === commodity ? 'active' : ''}`}
                onClick={() => handleCommodityClick(commodity)}
              >
                {commodity}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommoditiesPage;