"use client";

import { useState } from "react";
import { Card } from "@nextui-org/react";
import DateRangePicker from "./DateRangePicker";
import TopScrapTable from "./TopScrapTable";
import ScrapCharts from "./ScrapCharts";
import SummaryStats from "./SummaryStats";
import ScrapBarChart from "./ScrapBarChart";

const ScrapDashboard = ({ initialData }) => {
  const [dateRange, setDateRange] = useState("7days"); // '7days', '30days', 'ytd', 'custom'
  const [filterCost, setFilterCost] = useState(0);

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <div className="flex items-center gap-2">
            <label>Cost Threshold (£)</label>
            <input
              type="number"
              value={filterCost}
              onChange={(e) => setFilterCost(Number(e.target.value))}
              className="border rounded px-2 py-1"
            />
          </div>
        </div>
      </Card>

      {/* Summary Statistics */}
      <SummaryStats data={initialData} dateRange={dateRange} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScrapBarChart data={initialData} />
        <ScrapCharts data={initialData} dateRange={dateRange} />
      </div>

      {/* Top 5 Weekly Table */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          Top 5 Weekly Scrapped Parts
        </h2>
        <TopScrapTable data={initialData} />
      </Card>
    </div>
  );
};

export default ScrapDashboard;
