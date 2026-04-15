import { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Reusable line chart for displaying load data.
 *
 * Props:
 * - datasets: Array of { label, data, color }
 * - labels: Array of x-axis labels
 * - title: Chart title string
 * - height: Optional height in px (default: 350)
 */
export default function LoadChart({ datasets = [], labels = [], title = '', height = 350, yAxisLabel = 'Watts (W)', xAxisLabel = 'Time (s)' }) {
  const chartRef = useRef(null);
  console.log('Rendering LoadChart with datasets:', datasets);
  console.log(datasets)
  const chartData = {
    labels,
    datasets: datasets.map((ds,i) => ({
      label: ds.label,
      data: ds.data,
      fill: true,
      borderColor: ds.color,
      backgroundColor: hexToRgba(ds.color, 0.1),
      borderWidth: 2.5,
      tension: 0.4,
      pointBackgroundColor: ds.color,
      pointRadius: 4,
      pointHoverRadius: 7,
      pointBorderWidth: 2,
      pointBorderColor: '#0f0f23',
      pointHoverBorderColor: '#ffffff',
      hidden: i == 0 ? false : true, // Show only first dataset by default
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'end',
        labels: {
          color: '#8892b0',
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: '500',
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          boxWidth: 8,
        },
      },
      title: {
        display: !!title,
        text: title,
        color: '#ffffff',
        font: {
          family: "'Orbitron', sans-serif",
          size: 14,
          weight: '500',
        },
        padding: { bottom: 16 },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 15, 35, 0.95)',
        borderColor: 'rgba(0, 203, 115, 0.3)',
        borderWidth: 1,
        titleColor: '#ffffff',
        bodyColor: '#8892b0',
        titleFont: {
          family: "'Inter', sans-serif",
          weight: '600',
        },
        bodyFont: {
          family: "'Inter', sans-serif",
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yAxisLabel,
          color: '#5a6380',
          font: {
            family: "'Inter', sans-serif",
            size: 11,
            weight: '500',
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.04)',
          drawBorder: false,
        },
        ticks: {
          color: '#5a6380',
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
          padding: 8,
        },
        border: {
          display: false,
        },
      },
      x: {
        title: {
          display: true,
          text: xAxisLabel,
          color: '#5a6380',
          font: {
            family: "'Inter', sans-serif",
            size: 11,
            weight: '500',
          },
        },
        grid: {
          display: false,
        },
        ticks: {
          color: '#5a6380',
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
          padding: 8,
        },
        border: {
          display: false,
        },
      },
    },
    animation: {
      duration: 800,
      easing: 'easeInOutQuart',
    },
  };

  return (
    <div className="load-chart-container" style={{ height: `${height}px` }}>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
