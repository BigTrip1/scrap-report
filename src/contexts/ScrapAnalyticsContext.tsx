"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface DateRange {
  start: Date;
  end: Date;
}

interface AnalyticsState {
  dateRange: DateRange;
  facility: string;
  refreshInterval: number;
  lastUpdated: Date | null;
  isLoading: boolean;
  selectedPart: string | null;
  comparisonMode: "yoy" | "facility" | "none";
  viewMode: "detailed" | "summary";
  alerts: Alert[];
}

interface Alert {
  id: string;
  type: "warning" | "error" | "info";
  message: string;
  timestamp: Date;
  isRead: boolean;
}

interface AnalyticsContextType extends AnalyticsState {
  setDateRange: (range: DateRange) => void;
  setFacility: (facility: string) => void;
  setRefreshInterval: (interval: number) => void;
  refreshData: () => Promise<void>;
  setSelectedPart: (partNumber: string | null) => void;
  setComparisonMode: (mode: "yoy" | "facility" | "none") => void;
  setViewMode: (mode: "detailed" | "summary") => void;
  markAlertAsRead: (alertId: string) => void;
  clearAlerts: () => void;
}

const defaultState: AnalyticsState = {
  dateRange: {
    start: new Date(new Date().getFullYear(), 0, 1), // Start of current year
    end: new Date(),
  },
  facility: "Loadall (Rocester)",
  refreshInterval: 300000, // 5 minutes
  lastUpdated: null,
  isLoading: false,
  selectedPart: null,
  comparisonMode: "none",
  viewMode: "summary",
  alerts: [],
};

const ScrapAnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
);

export function ScrapAnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AnalyticsState>(defaultState);

  // Auto-refresh data
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, state.refreshInterval);

    return () => clearInterval(interval);
  }, [state.refreshInterval]);

  // Mock refresh function - replace with actual API call
  const refreshData = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setState((prev) => ({
        ...prev,
        lastUpdated: new Date(),
        isLoading: false,
      }));
    } catch (error) {
      addAlert({
        type: "error",
        message: "Failed to refresh data",
      });
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const addAlert = ({
    type,
    message,
  }: {
    type: Alert["type"];
    message: string;
  }) => {
    const newAlert: Alert = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message,
      timestamp: new Date(),
      isRead: false,
    };
    setState((prev) => ({
      ...prev,
      alerts: [...prev.alerts, newAlert],
    }));
  };

  const markAlertAsRead = (alertId: string) => {
    setState((prev) => ({
      ...prev,
      alerts: prev.alerts.map((alert) =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      ),
    }));
  };

  const clearAlerts = () => {
    setState((prev) => ({ ...prev, alerts: [] }));
  };

  const setDateRange = (range: DateRange) => {
    setState((prev) => ({ ...prev, dateRange: range }));
  };

  const setFacility = (facility: string) => {
    setState((prev) => ({ ...prev, facility }));
  };

  const setRefreshInterval = (interval: number) => {
    setState((prev) => ({ ...prev, refreshInterval: interval }));
  };

  const setSelectedPart = (partNumber: string | null) => {
    setState((prev) => ({ ...prev, selectedPart: partNumber }));
  };

  const setComparisonMode = (mode: "yoy" | "facility" | "none") => {
    setState((prev) => ({ ...prev, comparisonMode: mode }));
  };

  const setViewMode = (mode: "detailed" | "summary") => {
    setState((prev) => ({ ...prev, viewMode: mode }));
  };

  return (
    <ScrapAnalyticsContext.Provider
      value={{
        ...state,
        setDateRange,
        setFacility,
        setRefreshInterval,
        refreshData,
        setSelectedPart,
        setComparisonMode,
        setViewMode,
        markAlertAsRead,
        clearAlerts,
      }}
    >
      {children}
    </ScrapAnalyticsContext.Provider>
  );
}

export function useScrapAnalytics() {
  const context = useContext(ScrapAnalyticsContext);
  if (context === undefined) {
    throw new Error(
      "useScrapAnalytics must be used within a ScrapAnalyticsProvider"
    );
  }
  return context;
}
