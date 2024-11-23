import React from 'react';
import { Line, Pie } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components globally
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend);

const ChartComponent = ({ chartData, chartType, title }) => {
  return (
    <div className="chart-component">
      <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>{title}</h3>
      {chartType === 'line' && <Line data={chartData} />}
      {chartType === 'pie' && <Pie data={chartData} />}
    </div>
  );
};

ChartComponent.propTypes = {
  chartData: PropTypes.object.isRequired,
  chartType: PropTypes.oneOf(['line', 'pie']).isRequired,
  title: PropTypes.string.isRequired,
};

export default ChartComponent;