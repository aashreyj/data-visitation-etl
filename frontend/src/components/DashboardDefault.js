import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import ChartComponent from './ChartComponent'; // Reusable chart component
import '../styles/components.css'; // Ensure the path is correct for additional styling

const DashboardDefault = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [lineChartData, setLineChartData] = useState({});
  const [pieChartData, setPieChartData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const ieType = location.state?.selectedCategory;
  const category = location.state?.selectedCommodity;
  const apiCategory = "agriculture";
  let apiIeType;
  if (ieType == "Imports")
    apiIeType = "import";
  else
    apiIeType = "export";

  const fetchChartsData = async () => {
    try {
      setIsLoading(true);
      setError("");

      // MAKE API REQUEST
      const API_BASE_URL = `http://localhost:5000/data/${apiCategory}/${String(apiIeType).toLowerCase()}/`;
      const urlYear = API_BASE_URL + "year";
      const urlGeography = API_BASE_URL + "geography";

      const yearResponse = await fetch(urlYear);
      const geographyResponse = await fetch(urlGeography);

      if (!yearResponse.ok)
        throw new Error(yearResponse.json().message);
      else if (!geographyResponse.ok)
        throw new Error(geographyResponse.json().message);

      const yearResponseJson = await yearResponse.json();

      // PROCESS DATA FOR LINE GRAPH
      const lineData = {};
      lineData.labels = [];
      for (let year of yearResponseJson.data.labels)
        lineData.labels.push(year.split("_")[0]);

      lineData.datasets = [{
        label: `${apiIeType.toUpperCase()} Value (in Billion USD)`,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: false,
      }];
      lineData.datasets[0].data = [];

      let sum = 0;
      for (let year = 0; year < lineData.labels.length; year++) {
        sum = 0;
        for (let commodity of yearResponseJson.data.commodity_data)
          sum += Number(commodity.value[year]);
        lineData.datasets[0].data.push(sum / 1000);
      }
      setLineChartData(lineData);

      // PROCESS DATA FOR PIE GRAPH
      const geoResponseJson = await geographyResponse.json();
      const geoData = {};
      geoData.labels = geoResponseJson.data.labels;

      geoData.datasets = [{
        label: `${apiIeType.toUpperCase()} Quantity in tonnes`,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#9400D3'],
      }];
      geoData.datasets[0].data = [];

      for (let geo = 0; geo < geoData.labels.length; geo++) {
        sum = 0;
        for (let commodity of geoResponseJson.data.commodity_data)
          sum += Number(commodity.quantity[geo]);
        geoData.datasets[0].data.push(sum);
      }
      setPieChartData(geoData);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!ieType || !category)
      navigate("/commodities-category");
    else
      fetchChartsData();
  }, []);

  if (isLoading) {
    return <div>Loading Data...</div>; // Show loading state
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error: {error}</h2>
        <button onClick={() => fetchChartsData()}>Retry</button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="dashboard-default">
        <h1 className="chart-heading" style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '20px' }}>
          {ieType || "Imports"} Trend and Regional Distribution for {category || "Agriculture and Food Products"}
        </h1>
        <div className="charts-container">
          <div className="chart-container">
            <ChartComponent chartData={lineChartData} chartType="line" title={`Year-wise ${ieType || "Imports"} Trends by Value`} />
          </div>
          <div className="chart-container">
            <ChartComponent chartData={pieChartData} chartType="pie" title="Regional Distribution by Quantity (in tonnes)" />
          </div>
        </div>
        <div className="dashboard-actions" style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/data-filter', { state: { category: apiIeType, commodity: apiCategory } })}
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
