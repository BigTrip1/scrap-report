"use client";

import { useState, useEffect } from "react";
import TopScrapTable from "./components/TopScrapTable";
import MonthlyScrapChart from "./components/MonthlyScrapChart";
import MonthlyScrapTable from "./components/MonthlyScrapTable";
import PartDetailsModal from "./components/PartDetailsModal";
import { useScrapData } from "@/hooks/useScrapData";
import { CurrencySelector } from "@/components/CurrencySelector";
import { MonthlyData, TopPart } from "@/types/scrap";
import { useCurrency } from "@/contexts/CurrencyContext";

interface SampleDocument {
  material: string;
  materialDescription: string;
  documentDate: string;
  quantity: number;
  cost: number;
  reasonArea: string;
  storageLocation: string;
}

interface TestResults {
  totalDocuments: number;
  dateRangeCount: number;
  dateRange: {
    startDate: string;
    endDate: string;
    ukStartDate: string;
    ukEndDate: string;
  } | null;
  sampleDocuments: SampleDocument[];
  uniqueDates: string[];
  dateStats: {
    earliest: string;
    latest: string;
    totalDates: number;
  };
}

// Helper function to format dates to UK format (DD/MM/YYYY)
function formatToUKDate(isoDate: string | null): string {
  if (!isoDate) return "-";
  try {
    const [year, month, day] = isoDate.split("-");
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return isoDate || "-";
  }
}

// Helper function to check if an item is obsolete
function isObsolete(item: {
  reasonArea?: string;
  materialDescription?: string;
}): boolean {
  const reasonArea = item.reasonArea?.toLowerCase() || "";
  const description = item.materialDescription?.toLowerCase() || "";
  return reasonArea.includes("obsolete") || description.includes("obsolete");
}

// Helper function to filter out obsolete items from monthly data
function filterMonthlyData(data: MonthlyData[]): MonthlyData[] {
  return data.map((month) => ({
    ...month,
    totalCost: month.totalCost,
    quantity: month.quantity,
  }));
}

// Helper function to filter out obsolete items from top parts
function filterTopParts(parts: TopPart[]): TopPart[] {
  return parts.filter((part) => !isObsolete(part));
}

// Helper function to calculate summary data excluding obsolete items
function calculateFilteredSummary(
  data: {
    topParts: TopPart[];
    monthlyData: MonthlyData[];
  } | null
) {
  if (!data) return null;

  const nonObsoleteParts = data.topParts.filter(
    (part: TopPart) => !isObsolete(part)
  );

  const totalCost = nonObsoleteParts.reduce(
    (sum: number, part: TopPart) => sum + part.cost,
    0
  );
  const partsCount = nonObsoleteParts.reduce(
    (sum: number, part: TopPart) => sum + part.quantity,
    0
  );
  const averageCPM = partsCount > 0 ? totalCost / partsCount : 0;

  return {
    totalCost,
    partsCount,
    averageCPM,
  };
}

// Helper function to get date range based on selection
function getDateRange(
  selection: string,
  validDateRange: { earliest: string; latest: string } | null
) {
  const now = new Date();
  const start = new Date();

  switch (selection) {
    case "7d":
      start.setDate(now.getDate() - 7);
      break;
    case "30d":
      start.setDate(now.getDate() - 30);
      break;
    case "ytd":
      // Use earliest date from DB if available, otherwise default to Jan 1st
      if (validDateRange?.earliest) {
        return {
          start: validDateRange.earliest,
          end: validDateRange.latest || now.toISOString().split("T")[0],
        };
      }
      start.setMonth(0, 1); // January 1st
      break;
    case "1y":
      start.setFullYear(now.getFullYear() - 1);
      break;
    default:
      return { start: undefined, end: undefined };
  }

  return {
    start: start.toISOString().split("T")[0],
    end: now.toISOString().split("T")[0],
  };
}

export default function ScrapPage() {
  const { currentCurrency } = useCurrency();
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [selectedFacility, setSelectedFacility] = useState("PROD");
  const [dateRange, setDateRange] = useState<string>("ytd");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [testError, setTestError] = useState<string | null>(null);
  const [validDateRange, setValidDateRange] = useState<{
    earliest: string;
    latest: string;
  } | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Run test on initial load to get valid date range
  useEffect(() => {
    const initialize = async () => {
      await testData();
      setIsInitialized(true);
    };
    initialize();
  }, []);

  // Update dates when valid range is set
  useEffect(() => {
    if (validDateRange) {
      const { start, end } = getDateRange(dateRange, validDateRange);
      setStartDate(start || validDateRange.earliest);
      setEndDate(end || validDateRange.latest);
    }
  }, [validDateRange, dateRange]);

  const { data, error } = useScrapData({
    facility: selectedFacility,
    dateRange,
    startDate:
      dateRange === "custom"
        ? startDate
        : getDateRange(dateRange, validDateRange)?.start,
    endDate:
      dateRange === "custom"
        ? endDate
        : getDateRange(dateRange, validDateRange)?.end,
    currency: currentCurrency,
    skip: !isInitialized || !validDateRange, // Skip data fetching until initialized
  });

  // Filter out obsolete items from the data
  const filteredData = data
    ? {
        ...data,
        summary: calculateFilteredSummary(data),
        monthlyData: filterMonthlyData(data.monthlyData || []),
        topParts: filterTopParts(data.topParts || []),
        obsoleteParts: (data.topParts || []).filter((part: TopPart) =>
          isObsolete(part)
        ),
      }
    : null;

  const testData = async () => {
    try {
      setTestError(null);
      setTestResults(null);

      const params = new URLSearchParams({
        facility: selectedFacility,
        dateRange,
      });

      if (dateRange === "custom" && startDate && endDate) {
        params.append("startDate", startDate);
        params.append("endDate", endDate);
      }

      console.log("Testing with params:", Object.fromEntries(params.entries()));

      const response = await fetch(`/api/test-scraps?${params.toString()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Database test results:", data);
      setTestResults(data);

      // Update valid date range from test results
      if (data.dateStats) {
        const { earliest, latest } = data.dateStats;
        if (earliest) {
          // Use the earliest date from DB, and if latest is null, use current date
          const latestDate = latest || new Date().toISOString().split("T")[0];
          console.log("Setting valid date range from DB:", {
            earliest,
            latestDate,
          });
          setValidDateRange({ earliest, latest: latestDate });

          // If current dates are outside valid range, update them
          if (dateRange === "custom") {
            if (!startDate || startDate < earliest) {
              console.log("Adjusting start date to earliest:", earliest);
              setStartDate(earliest);
            }
            if (!endDate || endDate > latestDate) {
              console.log("Adjusting end date to latest:", latestDate);
              setEndDate(latestDate);
            }
          }
        } else {
          console.warn("No valid dates found in database");
          // Set a default date range of last 30 days
          const end = new Date();
          const start = new Date();
          start.setDate(end.getDate() - 30);
          const defaultRange = {
            earliest: start.toISOString().split("T")[0],
            latest: end.toISOString().split("T")[0],
          };
          console.log("Setting default date range:", defaultRange);
          setValidDateRange(defaultRange);
        }
      }
    } catch (error) {
      console.error("Test error:", error);
      setTestError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    }
  };

  const handleDateRangeChange = (value: string) => {
    console.log("Date range changed to:", value);
    setDateRange(value);

    if (value === "custom") {
      if (validDateRange) {
        const { earliest, latest } = validDateRange;
        console.log("Setting custom date range from valid range:", {
          earliest,
          latest,
        });
        // Ensure dates are in ISO format
        setStartDate(earliest);
        setEndDate(latest);
      } else {
        // Default to last 30 days if no valid range
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        const newStartDate = start.toISOString().split("T")[0];
        const newEndDate = end.toISOString().split("T")[0];
        console.log("Setting default custom date range:", {
          newStartDate,
          newEndDate,
        });
        setStartDate(newStartDate);
        setEndDate(newEndDate);
      }
      setShowDatePicker(true);
    } else {
      console.log("Clearing custom date range");
      setStartDate("");
      setEndDate("");
      setShowDatePicker(false);
    }
  };

  // Handle facility change
  const handleFacilityChange = (value: string) => {
    setSelectedFacility(value);
  };

  // Handle date changes
  const handleStartDateChange = (value: string) => {
    console.log("Start date changed to:", value);
    setStartDate(value);
  };

  const handleEndDateChange = (value: string) => {
    console.log("End date changed to:", value);
    setEndDate(value);
  };

  // Early return for initialization
  if (!isInitialized || !validDateRange) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-400">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#111827] flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111827]">
      {/* Header */}
      {/* <header className="bg-[#fcb026] shadow">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/jcb-logo.png"
                alt="JCB Logo"
                width={100}
                height={50}
                className="mr-4"
              />
              <h1 className="text-2xl font-bold text-black">
                Scrap Data Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/build-lookup"
                className="text-sm text-black hover:text-gray-800"
              >
                Build Lookup
              </a>
              <a
                href="/sign-in"
                className="text-sm text-black hover:text-gray-800"
              >
                Sign in
              </a>
            </div>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Controls Row */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-[#111827] rounded-lg px-3 py-2 border border-gray-800">
              <select
                value={selectedFacility}
                onChange={(e) => handleFacilityChange(e.target.value)}
                className="bg-transparent text-gray-200 outline-none text-sm"
              >
                <option value="PROD">Production</option>
                <option value="CAB">Cab Systems</option>
                <option value="HP">Heavy Products</option>
              </select>
            </div>
            <div className="bg-[#111827] rounded-lg px-3 py-2 border border-gray-800">
              <select
                value={dateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                className="bg-transparent text-gray-200 outline-none text-sm"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="ytd">Year to Date</option>
                <option value="1y">Last 12 Months</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <CurrencySelector />
            {showDatePicker && (
              <div className="flex items-center gap-2">
                <div className="bg-[#111827] rounded-lg px-3 py-2 border border-gray-800">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    min={validDateRange?.earliest}
                    max={endDate}
                    className="bg-transparent text-gray-200 outline-none text-sm w-36 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
                  />
                </div>
                <div className="bg-[#111827] rounded-lg px-3 py-2 border border-gray-800">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    min={startDate}
                    max={validDateRange?.latest}
                    className="bg-transparent text-gray-200 outline-none text-sm w-36 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-50 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
                  />
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={testData}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Test Data
            </button>
            <div className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleString("en-GB")}
            </div>
          </div>
        </div>

        {/* Test Results */}
        {(testResults || testError) && (
          <div className="mb-8 bg-[#1a2436] rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-medium text-gray-200 mb-4">
              Test Results
            </h3>
            {testError ? (
              <div className="text-red-500">{testError}</div>
            ) : (
              testResults && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Total Documents</p>
                      <p className="text-xl font-bold text-gray-200">
                        {testResults.totalDocuments}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Date Range Count</p>
                      <p className="text-xl font-bold text-gray-200">
                        {testResults.dateRangeCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Unique Dates</p>
                      <p className="text-xl font-bold text-gray-200">
                        {testResults.uniqueDates?.length || 0}
                      </p>
                    </div>
                  </div>
                  {testResults.dateRange && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Date Range</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Start Date</p>
                          <p className="text-sm text-gray-300">
                            {testResults.dateRange.ukStartDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">End Date</p>
                          <p className="text-sm text-gray-300">
                            {testResults.dateRange.ukEndDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {testResults.dateStats && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">
                        Date Statistics
                      </p>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Earliest Date</p>
                          <p className="text-sm text-gray-300">
                            {formatToUKDate(testResults.dateStats.earliest)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Latest Date</p>
                          <p className="text-sm text-gray-300">
                            {formatToUKDate(testResults.dateStats.latest)}
                          </p>
                        </div>
    <div>
                          <p className="text-xs text-gray-500">Total Dates</p>
                          <p className="text-sm text-gray-300">
                            {testResults.dateStats.totalDates}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {testResults.sampleDocuments &&
                    testResults.sampleDocuments.length > 0 && (
      <div>
                        <p className="text-sm text-gray-400 mb-2">
                          Sample Document
                        </p>
                        <pre className="bg-[#111827] p-4 rounded text-xs text-gray-300 overflow-auto">
                          {JSON.stringify(
                            {
                              ...testResults.sampleDocuments[0],
                              documentDate: formatToUKDate(
                                testResults.sampleDocuments[0].documentDate
                              ),
                            },
                            null,
                            2
                          )}
                        </pre>
                      </div>
                    )}
                </div>
              )
            )}
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1a2436] rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-200 mb-4">
                Total Cost
              </h3>
              <p className="text-3xl font-bold text-[rgb(252,176,38)]">
                £{filteredData?.summary?.totalCost?.toLocaleString() || "0"}
              </p>
            </div>
            <div className="bg-[#1a2436] rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-200 mb-4">
                Parts Count
              </h3>
              <p className="text-3xl font-bold text-[rgb(252,176,38)]">
                {filteredData?.summary?.partsCount?.toLocaleString() || "0"}
              </p>
            </div>
            <div className="bg-[#1a2436] rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-200 mb-4">
                Average CPM
              </h3>
              <p className="text-3xl font-bold text-[rgb(252,176,38)]">
                £{filteredData?.summary?.averageCPM?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>

          <MonthlyScrapChart
            facility={selectedFacility}
            dateRange={dateRange}
            data={filteredData?.monthlyData || []}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopScrapTable
              title="Weekly Top 5 Scrapped Parts"
              onSelectPart={setSelectedPart}
              data={filteredData?.topParts?.slice(0, 5) || []}
              isYearToDate={false}
              validDateRange={validDateRange}
            />
            <TopScrapTable
              title="Year to Date Top 10 Scrapped Parts"
              onSelectPart={setSelectedPart}
              data={filteredData?.topParts || []}
              isYearToDate={true}
              validDateRange={validDateRange}
            />
          </div>
          <MonthlyScrapTable
            facility={selectedFacility}
            data={filteredData?.monthlyData || []}
          />

          {/* Obsolete Parts Section */}
          {filteredData?.obsoleteParts &&
            filteredData.obsoleteParts.length > 0 && (
              <div className="bg-[#1a2436] rounded-lg p-6 mt-6">
                <h3 className="text-lg font-medium text-gray-200 mb-4">
                  Obsolete Parts
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-400">
                        <th className="pb-4">Part Number</th>
                        <th className="pb-4">Description</th>
                        <th className="pb-4 text-right">Quantity</th>
                        <th className="pb-4 text-right">Cost</th>
                        <th className="pb-4">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {filteredData.obsoleteParts.map((part: TopPart) => (
                        <tr
                          key={part.material}
                          className="border-t border-gray-800"
                        >
                          <td className="py-4 text-gray-300">
                            {part.material}
                          </td>
                          <td className="py-4 text-gray-300">
                            {part.materialDescription}
                          </td>
                          <td className="py-4 text-right text-gray-300">
                            {part.quantity.toLocaleString()}
                          </td>
                          <td className="py-4 text-right text-gray-300">
                            £{part.cost.toLocaleString()}
                          </td>
                          <td className="py-4 text-gray-300">
                            {part.reasonArea}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
        </div>

        {/* Footer */}
        <div className="mt-8 py-4 border-t border-gray-800">
          <div className="text-right text-xs text-gray-500">
            J.C.Bamford Excavators © {new Date().getFullYear()}
          </div>
      </div>
      </main>

      {/* Part Details Modal */}
      {selectedPart &&
        !isObsolete({
          reasonArea: filteredData?.topParts?.find(
            (p: TopPart) => p.material === selectedPart
          )?.reasonArea,
          materialDescription: filteredData?.topParts?.find(
            (p: TopPart) => p.material === selectedPart
          )?.materialDescription,
        }) && (
          <PartDetailsModal
            isOpen={!!selectedPart}
            onClose={() => setSelectedPart(null)}
            partNumber={selectedPart}
            facility={selectedFacility}
          />
        )}
    </div>
  );
}
