import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components globally
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const ChartComponent = ({ chartData, chartType, title }) => {
  return (
    <div className="chart-component">
      <h3 style={{ textAlign: 'center'}}>{title}</h3>
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
