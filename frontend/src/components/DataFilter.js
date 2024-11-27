import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DataFilter = () => {
  const navigate = useNavigate();

  // State for filters and error handling
  const [selectedFilters, setSelectedFilters] = useState({
    years: [],
    regions: [],
    quantity: false,
    value: false,
  });
  const [selectedCommodities, setSelectedCommodities] = useState([]);
  const [error, setError] = useState('');
  const yearMapping = {
    "2014": "2014_15",
    "2015": "2015_16",
    "2016": "2016_17",
    "2017": "2017_18",
    "2018": "2018_19",
    "2019": "2019_20",
    "2021": "2021_22",
    "2022": "2022_23",
  };

  const handleFilterChange = (key, value, isCheckbox = false) => {
    setSelectedFilters((prev) => {
      if (key === 'years' || key === 'regions') {
        if (value === `All ${key.charAt(0).toUpperCase() + key.slice(1)}`) {
          return { ...prev, [key]: isCheckbox && !prev[key].includes(value) ? [value] : [] };
        }
        return {
          ...prev,
          [key]: prev[key].includes(value)
            ? prev[key].filter((item) => item !== value)
            : [...prev[key].filter((item) => item !== `All ${key.charAt(0).toUpperCase() + key.slice(1)}`), value],
        };
      }
      return { ...prev, [key]: !prev[key] };
    });
  };

  const handleCommodityChange = (value) => {
    setSelectedCommodities((prev) =>
      prev.includes(value) ? prev.filter((commodity) => commodity !== value) : [...prev, value]
    );
  };

  const validateSelections = () => {
    const { years, regions } = selectedFilters;
    if (years.length < 2) return 'Please select at least two years.';
    if (regions.length === 0) return 'Please select at least one region.';
    if (selectedCommodities.length === 0) return 'Please select at least one commodity.';
    return '';
  };

  const handleSubmit = () => {
    if (!selectedFilters.years.length || !selectedCommodities.length) {
      alert("Please select filters");
      return;
    }

    const validationError = validateSelections();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    navigate('/data-visualization/custom', { state: { filters: selectedFilters, commodities: selectedCommodities } });
  };

  return (
    <div className="filter-section">
      <h2>Data Filters</h2>

      <div className="filter-body">
        <div className="filter-options">
          <h3>Filter Options</h3>

          {/* Years Filter */}
          <div className="filter-group">
            <h4>Select Time Periods</h4>
            <div className="checkbox-container">
              {['2014', '2015', '2016', '2017', '2018', '2019', '2021', '2022', 'All Years'].map((year) => (
                <label key={year}>
                  <input
                    type="checkbox"
                    value={yearMapping[year]}
                    onChange={(e) => handleFilterChange('years', e.target.value, true)}
                    checked={selectedFilters.years.includes(yearMapping[year])}
                    style={{ marginLeft: "20px", marginRight: "5px" }}
                  />
                  {year}
                </label>
              ))}
            </div>
          </div>

          {/* Quantity and Value Filters */}
          <div className="filter-group">
            <h4>Additional Filters</h4>
            <label>
              <input
                name="value-quantity-radio"
                type="radio"
                checked={selectedFilters.quantity}
                onChange={() => handleFilterChange('quantity')}
                style={{ marginLeft: "20px", marginRight: "5px" }}
              />
              Quantity
            </label>
            <label>
              <input
                name="value-quantity-radio"
                type="radio"
                checked={selectedFilters.value}
                onChange={() => handleFilterChange('value')}
                style={{ marginLeft: "20px", marginRight: "5px" }}
              />
              Value
            </label>
          </div>

          {/* Regions Filter */}
          <div className="filter-group">
            <h4>Select Regions</h4>
            <div className="checkbox-container">
              {['Africa', 'Asia', 'Europe', 'Oceania', 'North America', 'South America', 'All Regions'].map(
                (region) => (
                  <label key={region}>
                    <input
                      type="checkbox"
                      value={region}
                      onChange={(e) => handleFilterChange('regions', e.target.value, true)}
                      checked={selectedFilters.regions.includes(region)}
                      style={{ marginLeft: "20px", marginRight: "5px" }}
                    />
                    {region}
                  </label>
                )
              )}
            </div>
          </div>
        </div>

        {/* Commodities Selection */}
        <div className="commodity-selection">
          <h3>Select Commodities</h3>
          <div className="checkbox-container">
            {['Cashew', 'Coffee', 'Groundnut', 'Pulses', 'Sugar', 'Spices', 'Tea', 'Wheat'].map((commodity) => (
              <label key={commodity}>
                <input
                  type="checkbox"
                  value={commodity}
                  onChange={(e) => handleCommodityChange(e.target.value)}
                  checked={selectedCommodities.includes(commodity)}
                  style={{ marginLeft: "20px", marginRight: "5px" }}
                />
                {commodity}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="error-message" style={{ padding: "20px" }}>{error}</div>}

      {/* Submit Button */}
      <button className="submit-button" onClick={handleSubmit}>
        Apply Filters
      </button>
    </div>
  );
};

export default DataFilter;
