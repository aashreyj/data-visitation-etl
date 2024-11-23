import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import ChartComponent from './ChartComponent'; // Reusable chart component
import '../styles/components.css'; // Ensure the path is correct for additional styling

const DashboardDefault = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState(null);

  useEffect(() => {
    // Simulate data fetch with delay
    setTimeout(() => {
      setFilters(true);
      setIsLoading(false);
    }, 1500);
  }, []);

  // Dummy data for charts
  const lineChartData = {
    labels: ['2016', '2017', '2018', '2019', '2020', '2021', '2022'],
    datasets: [
      {
        label: 'Monthly Import Trends (in Billion USD)',
        data: [65, 59, 80, 81, 56, 55, 60],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      },
    ],
  };

  const pieChartData = {
    labels: ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Middle East'],
    datasets: [
      {
        label: 'Regional Distribution',
        data: [30, 15, 8, 17, 5, 9],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#9400D3'],
      },
    ],
  };

  if (isLoading) {
    return <div>Loading Data...</div>; // Show loading state
  }

  return (
    <ErrorBoundary>
      <div className="dashboard-default">
        <h1 className="chart-heading" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '20px' }}>
          Imports Trend and Regional Distribution
        </h1>
        <div className="charts-container">
          <div className="chart-container">
            <ChartComponent chartData={lineChartData} chartType="line" title="Monthly Import Trends" />
          </div>
          <div className="chart-container">
            <ChartComponent chartData={pieChartData} chartType="pie" title="Regional Distribution" />
          </div>
        </div>
        <div className="dashboard-actions" style={{ textAlign: 'center', marginTop: '40px' }}>
          <button 
            onClick={() => navigate('/data-filter')}
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