"use client";

import { useScrapAnalytics } from "@/contexts/ScrapAnalyticsContext";
import {
  CalendarIcon,
  ChartBarIcon,
  ArrowPathIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

export default function AnalyticsControls() {
  const {
    dateRange,
    setDateRange,
    comparisonMode,
    setComparisonMode,
    viewMode,
    setViewMode,
    refreshData,
    lastUpdated,
    isLoading,
    alerts,
  } = useScrapAnalytics();

  const unreadAlerts = alerts.filter((alert) => !alert.isRead).length;

  return (
    <div className="bg-[#1a2436] rounded-lg shadow-lg overflow-hidden mb-6">
      <div className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Date Range Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-gray-400" />
              <select
                className="bg-[#0f1824] text-gray-200 px-3 py-1.5 rounded border border-gray-800/50 outline-none text-sm"
                onChange={(e) => {
                  const today = new Date();
                  let start = new Date();
                  switch (e.target.value) {
                    case "7d":
                      start.setDate(start.getDate() - 7);
                      break;
                    case "30d":
                      start.setDate(start.getDate() - 30);
                      break;
                    case "ytd":
                      start = new Date(today.getFullYear(), 0, 1);
                      break;
                    case "1y":
                      start.setFullYear(start.getFullYear() - 1);
                      break;
                  }
                  setDateRange({ start, end: today });
                }}
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="ytd">Year to Date</option>
                <option value="1y">Last 12 Months</option>
              </select>
            </div>

            {/* Comparison Mode */}
            <select
              className="bg-[#0f1824] text-gray-200 px-3 py-1.5 rounded border border-gray-800/50 outline-none text-sm"
              value={comparisonMode}
              onChange={(e) => setComparisonMode(e.target.value as any)}
            >
              <option value="none">No Comparison</option>
              <option value="yoy">Year over Year</option>
              <option value="facility">Facility Comparison</option>
            </select>
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#0f1824] rounded-lg border border-gray-800/50 p-1">
              <button
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === "summary"
                    ? "bg-[#1a2436] text-[rgb(252,176,38)]"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setViewMode("summary")}
              >
                Summary
              </button>
              <button
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === "detailed"
                    ? "bg-[#1a2436] text-[rgb(252,176,38)]"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setViewMode("detailed")}
              >
                Detailed
              </button>
            </div>

            {/* Refresh and Alerts */}
            <div className="flex items-center gap-2">
              <button
                className="p-2 text-gray-400 hover:text-gray-200 rounded-lg border border-gray-800/50 bg-[#0f1824] relative"
                onClick={() => refreshData()}
                disabled={isLoading}
              >
                <ArrowPathIcon
                  className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-200 rounded-lg border border-gray-800/50 bg-[#0f1824] relative">
                <BellIcon className="h-5 w-5" />
                {unreadAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadAlerts}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <div className="mt-2 text-xs text-gray-500">
            Last updated: {format(lastUpdated, "dd MMM yyyy HH:mm:ss")}
          </div>
        )}
      </div>
    </div>
  );
}
