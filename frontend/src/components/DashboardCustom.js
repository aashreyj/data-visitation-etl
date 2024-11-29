import querystring from 'querystring';
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import { Line, Pie } from "react-chartjs-2";
import { dataAPI } from "../utils/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement
);

const DashboardCustom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [lineData, setLineData] = useState({});
  const [pieData, setPieData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiCategory = location.state?.commodity || "agriculture";
  const apiIeType = location.state?.category || "import";
  const quantityOrValue = location.state?.quantityOrValue || "value";
  const commodityOrGeography = location.state?.commodityOrGeography || "commodity";
  const selectedFilters = location.state.filters;
  const pieBackgroundColours = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#9400D3', '#4BA3C7', '#FF6F61', '#FFC154'];

  let unit = "";
  if (quantityOrValue === "quantity")
    unit = " (in Tonnes) ";
  else
    unit = " (in Mil. USD) ";

  let displayWord = "";
  if (commodityOrGeography === "commodity")
    displayWord = selectedFilters.regions[0];
  else
    displayWord = selectedFilters.commodities[0];
  
  // FUNCTION TO CONVERT A WORD TO TITLE CASE
  function toTitleCase(word) {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  const fetchCustomData = async () => {
    setIsLoading(true);
    setError('');
    try {
      // MAKE API REQUEST
      const API_BASE_URL = `http://localhost:5000/data/${apiCategory}/${String(apiIeType).toLowerCase()}/`;
      const queryString = querystring.stringify(selectedFilters);
      const urlYear = API_BASE_URL + "year?" + queryString;
      const urlGeography = API_BASE_URL + "geography?" + queryString;

      const yearResponse = await fetch(urlYear);
      const geographyResponse = await fetch(urlGeography);

      const yearResponseJson = await yearResponse.json();
      const geographyResponseJson = await geographyResponse.json();

      if (!yearResponse.ok || !geographyResponse.ok) {
        throw new Error(yearResponseJson.message);
      }

      // CREATE LINE CHART DATASET
      const lineChartData = {};
      lineChartData.labels = [];
      for (let year of yearResponseJson.data.labels)
        lineChartData.labels.push(year.split("_")[0]);

      lineChartData.datasets = [];

      // dataset is either commodity or geography
      if (commodityOrGeography === "commodity") {
        for (let commodityIndex in yearResponseJson.data.commodity_data) {
          const dataObject = {
            label: yearResponseJson.data.commodity_data[commodityIndex].name,
            fill: false,
            tension: 0.1,
            borderColor: `hsl(${commodityIndex * 137.5}, 70%, 50%)`,
            data: yearResponseJson.data.commodity_data[commodityIndex][quantityOrValue]
          };
          lineChartData.datasets.push(dataObject);
        }
      }
      else {
      }
      setLineData(lineChartData);

      // CREATE PIE CHART DATASET
      const pieChartData = {};
      pieChartData.labels = [];
      pieChartData.datasets = [{
        data: [],
        backgroundColor: []
      }];

      if (commodityOrGeography === "commodity") {
        for (let commodityIndex in yearResponseJson.data.commodity_data) {
          pieChartData.labels.push(yearResponseJson.data.commodity_data[commodityIndex].name);
          pieChartData.datasets[0].backgroundColor.push(pieBackgroundColours[commodityIndex]);
          let sum = 0;
          for (let value of yearResponseJson.data.commodity_data[commodityIndex][quantityOrValue])
            sum += Number(value);
          pieChartData.datasets[0].data.push(Number(sum / yearResponseJson.data.labels.length))
        }
      }
      else {

      }
      setPieData(pieChartData);

    }
    catch (err) {
      setError(err.message || "Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  }


  useEffect(() => {
    fetchCustomData();
  }, []);

  const handleDownload = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/download`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filters: selectedFilters,
            commodities: selectedCommodities,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download data");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "custom-data.csv";
      a.click();
    } catch (err) {
      console.error("Error downloading data:", err);
      alert("Failed to download data. Please try again.");
    }
  };

  if (isLoading) {
    return <div>Loading custom charts...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <ErrorBoundary>
      <div className="dashboard-custom">
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Custom Dashboard
        </h2>

        <div
          className="chart-wrapper"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around",
          }}
        >
          {(
            <div
              className="chart-container"
              style={{
                flex: "1 1 45%",
                minWidth: "300px",
                marginBottom: "20px",
              }}
            >
              <h3 style={{marginBottom: "50px"}}>{`${toTitleCase(apiIeType)} ${toTitleCase(quantityOrValue)} ${unit} over selected years for ${displayWord}`}</h3>
              <Line data={lineData} />
            </div>
          )}
          {(
            <div
              className="chart-container"
              style={{
                flex: "1 1 45%",
                minWidth: "300px",
                marginBottom: "20px"
              }}
            >
              <h3 style={{marginBottom: "20px"}}>{`Distribution of Average ${toTitleCase(apiIeType)} ${toTitleCase(quantityOrValue)} ${unit} for ${displayWord}`}</h3>
              <Pie
                data={pieData}
                height={"300px"}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                      labels: {
                        padding: 25,
                      },
                    },
                  }
                }} />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          className="actions"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          <button
            onClick={() => navigate("/data-filter", { state: { category: apiIeType, commodity: apiCategory } })}
            style={{
              padding: "10px 20px",
              marginRight: "10px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Back to Data Filters
          </button>
          <button
            onClick={handleDownload}
            style={{
              padding: "10px 20px",
              marginRight: "10px",
              backgroundColor: "#FF5722",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Download JSON
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardCustom;
