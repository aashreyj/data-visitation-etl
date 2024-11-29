import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DataFilter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State for filters and error handling
  const [selectedFilters, setSelectedFilters] = useState({
    years: [],
    regions: [],
    commodities: [],
  });

  const [quantityOrValue, setQuantityOrValue] = useState("quantity");
  const [commodityOrGeography, setCommodityOrGeography] = useState("commodity");

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
      if (value === `All ${key.charAt(0).toUpperCase() + key.slice(1)}`) {
        return { ...prev, [key]: isCheckbox && !prev[key].includes(value) ? [value] : [] };
      }
      return {
        ...prev,
        [key]: prev[key].includes(value)
          ? prev[key].filter((item) => item !== value)
          : [...prev[key].filter((item) => item !== `All ${key.charAt(0).toUpperCase() + key.slice(1)}`), value],
      };
    });
  };

  const handleRadioChange = (event) => {
    switch (event.target.id) {
      case "value-radio": {
        setQuantityOrValue("value");
        break;
      }
      case "quantity-radio": {
        setQuantityOrValue("quantity");
        break;
      }
      case "commodity-radio": {
        setCommodityOrGeography("commodity");
        break;
      }
      case "geography-radio": {
        setCommodityOrGeography("geography");
        break;
      }
    }
  }

  const validateSelections = () => {
    if (selectedFilters.years.length < 2) return 'Please select at least two years.';

    if (commodityOrGeography === "commodity") {
      if (selectedFilters.commodities.length < 1) return 'Please select at least one commodity';
      if (selectedFilters.regions.length != 1) return 'Please select exactly one region';
    }
    else {
      if (selectedFilters.regions.length < 1) return 'Please select at least one region';
      if (selectedFilters.commodities.length != 1) return 'Please select exactly one commodity';
    }
    return '';
  };

  const handleSubmit = () => {
    if (!selectedFilters.years.length || !selectedFilters.commodities.length || !selectedFilters.years.length) {
      alert("Please select year, commodity, and/or region filters");
      return;
    }

    const validationError = validateSelections();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    navigate('/data-visualization/custom', {
      state: {
        filters: selectedFilters,
        quantityOrValue: quantityOrValue,
        commodityOrGeography: commodityOrGeography,
        category: location.state?.category || "import",
        commodity: location.state?.commodity || "agriculture"
      }
    });
  };

  return (
    <div className="filter-section">
      <h2>Data Filters</h2>

      <div className="filter-body">
        <div className="filter-options">
          <h3>Options</h3>

          {/* Years Filter */}
          <div className="filter-group">
            <h4>Time Periods</h4>
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
                id="quantity-radio"
                name="value-quantity-radio"
                type="radio"
                onChange={handleRadioChange}
                style={{ marginLeft: "20px", marginRight: "5px" }}
                checked={quantityOrValue === "quantity"}
              />
              Quantity
            </label>
            <label>
              <input
                id="value-radio"
                name="value-quantity-radio"
                type="radio"
                onChange={handleRadioChange}
                style={{ marginLeft: "20px", marginRight: "5px" }}
                checked={quantityOrValue === "value"}
              />
              Value
            </label>
          </div>

          <div className='filter-group'>
            <h4>Data View</h4>
            <label>
              <input
                id="commodity-radio"
                name="commodity-geography-radio"
                type="radio"
                onChange={handleRadioChange}
                style={{ marginLeft: "20px", marginRight: "5px" }}
                checked={commodityOrGeography === "commodity"}
              />
              Commodities for a Region
            </label>
            <label>
              <input
                id="geography-radio"
                name="commodity-geography-radio"
                type="radio"
                onChange={handleRadioChange}
                style={{ marginLeft: "20px", marginRight: "5px" }}
                checked={commodityOrGeography === "geography"}
              />
              Regions for a Commodity
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
                      onChange={(e) => handleFilterChange('regions', e.target.value)}
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
            {['Cashew', 'Coffee', 'Groundnut', 'Pulses', 'Sugar', 'Spices', 'Tea', 'Wheat', 'All Commodities'].map((commodity) => (
              <label key={commodity}>
                <input
                  type="checkbox"
                  value={commodity}
                  onChange={(e) => handleFilterChange('commodities', e.target.value)}
                  checked={selectedFilters.commodities.includes(commodity)}
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
