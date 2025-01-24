"use client";

import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { ScrapSummary } from "@/types/scrap";

interface WeeklyScrapSummaryProps {
  facility: string;
  dateRange: string;
  data: ScrapSummary | null;
}

const WeeklyScrapSummary = ({
  facility,
  dateRange,
  data,
}: WeeklyScrapSummaryProps) => {
  const stats = [
    {
      label: "Total Scrap Cost",
      value: data ? `£${data.totalCost.toLocaleString()}` : "£0",
      change: data?.trends?.costChange || "0%",
      trend: data?.trends?.costChange?.startsWith("+") ? "up" : "down",
      previousValue: data?.previousPeriod
        ? `£${data.previousPeriod.totalCost.toLocaleString()}`
        : "£0",
    },
    {
      label: "Parts Scrapped",
      value: data ? data.partsCount.toString() : "0",
      change: data?.trends?.partsChange || "0%",
      trend: data?.trends?.partsChange?.startsWith("+") ? "up" : "down",
      previousValue: data?.previousPeriod
        ? data.previousPeriod.partsCount.toString()
        : "0",
    },
    {
      label: "Average CPM",
      value: data ? `£${data.averageCPM.toLocaleString()}` : "£0",
      change: data?.previousPeriod
        ? `${(
            (((data?.averageCPM || 0) - (data.previousPeriod.averageCPM || 0)) /
              (data.previousPeriod.averageCPM || 1)) *
            100
          ).toFixed(1)}%`
        : "0%",
      trend:
        data?.averageCPM > (data?.previousPeriod?.averageCPM || 0)
          ? "up"
          : "down",
      previousValue: data?.previousPeriod
        ? `£${data.previousPeriod.averageCPM.toLocaleString()}`
        : "£0",
    },
  ];

  return (
    <div className="bg-[#1a2436] rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[rgb(252,176,38)]">Summary</h2>
          <div className="text-sm text-gray-400">{facility}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-2">
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-200 mt-1">
                  {stat.value}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trend === "up" ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-red-500" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-green-500" />
                  )}
                  <p
                    className={`text-sm ${
                      stat.trend === "up" ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t border-gray-800">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Previous Period</span>
                  <span className="text-gray-300">{stat.previousValue}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyScrapSummary;
