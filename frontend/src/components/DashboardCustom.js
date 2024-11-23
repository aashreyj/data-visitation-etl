import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const DashboardCustom = ({ selectedFilters, selectedCommodities }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await dataAPI.fetchVisualizations(
          selectedFilters,
          selectedCommodities
        );
        if (response.data) {
          setData(response.data);
        } else {
          throw new Error("No data received from server");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomData();
  }, [selectedFilters, selectedCommodities]);

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

  const chartData = {
    labels: data?.data?.labels || [],
    datasets:
      data?.data?.commodity_data?.map((commodity, index) => ({
        label: commodity.name,
        data: commodity.value,
        borderColor: `hsl(${index * 137.5}, 70%, 50%)`,
        tension: 0.1,
        fill: false,
      })) || [],
  };

  const pieChartData = {
    labels: data?.data?.commodity_data?.map((c) => c.name) || [],
    datasets: [
      {
        data:
          data?.data?.commodity_data?.map((c) => c.value[c.value.length - 1]) ||
          [],
        backgroundColor:
          data?.data?.commodity_data?.map(
            (_, index) => `hsl(${index * 137.5}, 70%, 50%)`
          ) || [],
      },
    ],
  };

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
          {data?.data?.commodity_data && (
            <div
              className="chart-container"
              style={{
                flex: "1 1 45%",
                minWidth: "300px",
                marginBottom: "20px",
              }}
            >
              <h3>Line Chart</h3>
              <Line data={chartData} />
            </div>
          )}
          {data?.data?.commodity_data && (
            <div
              className="chart-container"
              style={{
                flex: "1 1 45%",
                minWidth: "300px",
                marginBottom: "20px",
              }}
            >
              <h3>Pie Chart</h3>
              <Pie data={pieChartData} />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          className="actions"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          <button
            onClick={() => navigate("/data-filter")}
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
            Download Data
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardCustom;
