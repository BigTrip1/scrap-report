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
import { ScrapItem } from "@/types/scrap";

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

interface MonthlyMetricsChartsProps {
  data: ScrapItem[];
}

const MonthlyMetricsCharts = ({ data }: MonthlyMetricsChartsProps) => {
  // Process the data to get monthly savings
  const monthlySavings = data.reduce((acc: Record<string, number>, item) => {
    const month = item.month;
    acc[month] = (acc[month] || 0) + item.totalCost * 0.15; // 15% savings
    return acc;
  }, {});

  const sortedMonths = Object.keys(monthlySavings).sort();
  const savingsData = sortedMonths.map((month) => monthlySavings[month]);

  const chartData = {
    labels: sortedMonths,
    datasets: [
      {
        label: "Monthly Savings",
        data: savingsData,
        backgroundColor: "#10B981",
        borderColor: "#10B981",
        borderWidth: 0,
        borderRadius: 4,
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
        display: false,
      },
      tooltip: {
        backgroundColor: "#1F2937",
        titleColor: "#F3F4F6",
        bodyColor: "#D1D5DB",
        borderColor: "#374151",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            label += "£" + context.parsed.y.toLocaleString();
            return label;
          },
        },
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
    },
  };

  return (
    <div className="bg-[#1a2436] rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-bold text-[rgb(252,176,38)] mb-4">
          Monthly Savings
        </h2>
        <div className="h-[400px]">
          <Bar options={options} data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default MonthlyMetricsCharts;
