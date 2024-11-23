import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import ChartComponent from './ChartComponent';
import '../styles/components.css';

const DashboardDefault = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { tradeType, selectedCommodity } = state || {};
  const [categories, setCategories] = useState([]); // To hold all categories
  const [currentCommodity, setCurrentCommodity] = useState(selectedCommodity);
  const [chartsData, setChartsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data); // Assume API returns an array of categories
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchChartsData = async (commodity) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/data/${tradeType}/${commodity}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters: {} }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch charts data');
      }

      const data = await response.json();
      setChartsData(data);
    } catch (err) {
      setError(err.message || 'Unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!tradeType || !selectedCommodity) {
      navigate('/commodities-category');
    } else {
      fetchCategories();
      fetchChartsData(selectedCommodity);
    }
  }, [tradeType, selectedCommodity]);

  const handleCommodityChange = (commodity) => {
    setCurrentCommodity(commodity);
    fetchChartsData(commodity);
  };

  if (isLoading) {
    return <div>Loading Data...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error: {error}</h2>
        <button onClick={() => fetchChartsData(currentCommodity)}>Retry</button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="dashboard-default">
        <h1 className="chart-heading">
          {`${tradeType} - ${currentCommodity}`} Trends and Regional Distribution
        </h1>
        <div className="categories-container">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-item ${currentCommodity === category ? 'selected' : ''}`}
              onClick={() => handleCommodityChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="charts-container">
          <div className="chart-container">
            <ChartComponent
              chartData={chartsData.lineChart || {}}
              chartType="line"
              title="Monthly Trends"
            />
          </div>
          <div className="chart-container">
            <ChartComponent
              chartData={chartsData.pieChart || {}}
              chartType="pie"
              title="Regional Distribution"
            />
          </div>
        </div>
        <div className="dashboard-actions">
          <button
            onClick={() => navigate('/data-filter', { state: { tradeType, currentCommodity } })}
            className="custom-visualisation-button"
          >
            Custom Visualisation
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardDefault;