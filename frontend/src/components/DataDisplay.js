import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

const DataDisplay = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  // Simulate data fetching
  useEffect(() => {
    setTimeout(() => {
      // Simulated fetched data
      setData([
        { year: '2022', commodity: 'Wheat', quantity: 1000, value: 5000, region: 'Asia' },
        { year: '2022', commodity: 'Cashew', quantity: 2000, value: 8000, region: 'Africa' },
        { year: '2023', commodity: 'Spices', quantity: 1500, value: 6000, region: 'Europe' },
        // Add more rows if needed
      ]);
      setIsLoading(false); // Set loading to false after data is fetched
    }, 1500); // Simulated delay of 1.5 seconds
  }, []);

  const handleDownload = () => {
    // Simulate data download
    const csvData = [
      ['Year', 'Commodity', 'Quantity', 'Value', 'Region'],
      ...data.map((row) => [row.year, row.commodity, row.quantity, row.value, row.region]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-display.csv';
    a.click();
  };

  if (isLoading) {
    return <div>Loading data...</div>; // Show loading message while fetching data
  }

  return (
    <ErrorBoundary>
      <div className="data-display">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Data Display</h2>
        
        {/* Table for displaying fetched data */}
        <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Year</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Commodity</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Quantity</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Value</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Region</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.year}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.commodity}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.quantity}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.value}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{row.region}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Placeholder for visualizations */}
        <div className="visualization-section" style={{ marginBottom: '20px' }}>
          <p style={{ textAlign: 'center' }}>Placeholder for graphs, charts, or additional visualizations</p>
        </div>

        {/* Action buttons */}
        <div className="actions" style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/data-visualization/custom')}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/data-filter')}
            style={{
              padding: '10px 20px',
              marginRight: '10px',
              backgroundColor: '#008CBA',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Back to Data Filters
          </button>
          <button
            onClick={handleDownload}
            style={{
              padding: '10px 20px',
              backgroundColor: '#FF5722',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Download Data
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DataDisplay;