import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components globally
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const ChartComponent = ({ chartData, chartType, title }) => {
  return (
    <div className="chart-component">
      <h3 style={{ textAlign: 'center' }}>{title}</h3>
      <div>
        {chartType === 'line' && (
          <Line
            data={chartData}
            options={{
              responsive: true,
              scales: {
                y: {
                  suggestedMin: 0,
                  suggestedMax: 20,
                }
              }
            }}
          />)}
        {chartType === 'pie' && (
          <Pie
            data={chartData}
            height={"300px"}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      const dataset = tooltipItem.dataset;
                      const total = dataset.data.reduce((acc, value) => acc + value, 0);
                      const value = dataset.data[tooltipItem.dataIndex];
                      const percentage = ((value / total) * 100).toFixed(2);
                      return `${tooltipItem.label}: ${percentage}%`;
                    },
                  },
                },
                datalabels: {
                  formatter: (value, context) => {
                    const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                    const percentage = ((value / total) * 100).toFixed(2);
                    return `${percentage}%`;
                  },
                  color: '#fff',
                  font: {
                    weight: 'bold',
                  },
                },
                legend: {
                  position: "right",
                  labels: {
                    padding: 25,
                  },
                },
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

ChartComponent.propTypes = {
  chartData: PropTypes.object.isRequired,
  chartType: PropTypes.oneOf(['line', 'pie']).isRequired,
  title: PropTypes.string.isRequired,
};

export default ChartComponent;
