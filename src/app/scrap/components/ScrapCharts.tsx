"use client";

import { Card } from "@nextui-org/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ScrapCharts = ({ data, dateRange }) => {
  // Process data for charts
  const categories = [...new Set(data.map((item) => item.category))];
  const costByCategory = categories.map((category) =>
    data
      .filter((item) => item.category === category)
      .reduce((sum, item) => sum + item.cost, 0)
  );

  const pieData = {
    labels: categories,
    datasets: [
      {
        data: costByCategory,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  return (
    <>
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Cost by Category</h3>
        <div className="h-[300px]">
          <Pie
            data={pieData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </Card>

      {/* Add more charts as needed */}
    </>
  );
};

export default ScrapCharts;
