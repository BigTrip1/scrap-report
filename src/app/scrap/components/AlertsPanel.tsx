"use client";

import { useScrapAnalytics } from "@/contexts/ScrapAnalyticsContext";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";

export default function AlertsPanel() {
  const { alerts, markAlertAsRead, clearAlerts } = useScrapAnalytics();

  const alertIcons = {
    warning: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />,
    error: <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />,
    info: <InformationCircleIcon className="h-5 w-5 text-blue-500" />,
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-16 right-4 z-50 w-96 space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`bg-[#1a2436] rounded-lg shadow-lg border border-gray-800/50 p-4 transform transition-all duration-300 ${
            alert.isRead ? "opacity-50" : "opacity-100"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">{alertIcons[alert.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-200">{alert.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {format(alert.timestamp, "HH:mm:ss")}
              </p>
            </div>
            <button
              className="flex-shrink-0 text-gray-400 hover:text-gray-300"
              onClick={() => markAlertAsRead(alert.id)}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}

      {alerts.length > 1 && (
        <button
          className="w-full bg-[#1a2436] text-gray-400 hover:text-gray-300 text-sm py-2 rounded-lg border border-gray-800/50"
          onClick={clearAlerts}
        >
          Clear All
        </button>
      )}
    </div>
  );
}
