"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { MonthlyData } from "@/types/scrap";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

interface MonthlyScrapChartProps {
  facility: string;
  dateRange: string;
  data: MonthlyData[];
}

// Helper function to format dates to UK format (DD/MM/YYYY)
function formatToUKDate(isoDate: string): string {
  try {
    const [year, month] = isoDate.split("-");
    return `${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return isoDate;
  }
}

const MonthlyScrapChart = ({
  facility,
  dateRange,
  data,
}: MonthlyScrapChartProps) => {
  // If no data, show empty state
  if (data.length === 0) {
    return (
      <div className="bg-[#1a2436] rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-[rgb(252,176,38)]">
              Monthly Scrap Cost & CPM
            </h2>
            <div className="text-sm text-gray-400">{facility}</div>
          </div>
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-gray-400">
              No data available for the selected period
            </p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: data.map((item) => formatToUKDate(item.month)),
    datasets: [
      {
        type: "bar" as const,
        label: "Total Cost",
        data: data.map((item) => item.totalCost),
        backgroundColor: "rgba(252, 176, 38, 0.8)",
        borderColor: "rgb(252, 176, 38)",
        borderWidth: 1,
        borderRadius: 4,
        yAxisID: "y",
      },
      {
        type: "line" as const,
        label: "CPM",
        data: data.map((item) => item.cpm),
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderWidth: 2,
        pointStyle: "circle",
        pointRadius: 4,
        pointHoverRadius: 6,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        labels: {
          boxWidth: 8,
          usePointStyle: true,
          pointStyle: "circle",
          color: "#9CA3AF",
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          padding: 8,
        },
      },
      y: {
        position: "left" as const,
        grid: {
          color: "rgba(75, 85, 99, 0.1)",
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          padding: 10,
          callback: function (value: any) {
            return "£" + value.toLocaleString();
          },
        },
      },
      y1: {
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            family: "'Inter', sans-serif",
            size: 12,
          },
          padding: 10,
          callback: function (value: any) {
            return "£" + value.toFixed(2);
          },
        },
      },
    },
  };

  return (
    <div className="bg-[#1a2436] rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[rgb(252,176,38)]">
            Monthly Scrap Cost & CPM
          </h2>
          <div className="text-sm text-gray-400">{facility}</div>
        </div>
        <div className="h-[400px]">
          <Bar options={options} data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default MonthlyScrapChart;
