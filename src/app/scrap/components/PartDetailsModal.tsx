"use client";

import { Fragment, useState, useRef } from "react";
import { Dialog, Tab, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  DocumentChartBarIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  DocumentArrowDownIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Line, Bar } from "react-chartjs-2";
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
  Filler,
  ChartOptions,
  ChartData,
} from "chart.js";
import type { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import zoomPlugin from "chartjs-plugin-zoom";
import annotationPlugin from "chartjs-plugin-annotation";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin,
  annotationPlugin
);

export interface PartDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  partNumber: string;
  facility: string;
  data?: {
    material: string;
    materialDescription: string;
    quantity: number;
    cost: number;
    trend?: string;
    monthlyData: {
      month: string;
      quantity: number;
      cost: number;
      cpm: number;
      target: number;
    }[];
    topReasons: {
      reason: string;
      quantity: number;
      cost: number;
      percentage: number;
      trend: number;
    }[];
    yearlyStats: {
      totalQuantity: number;
      totalCost: number;
      averageCostPerUnit: number;
      yearOverYearChange: number;
      targetAchievement: number;
      savingsOpportunity: number;
    };
    seasonalityData: {
      quarter: string;
      quantity: number;
      cost: number;
      percentageOfYear: number;
    }[];
    relatedParts: {
      partNumber: string;
      description: string;
      quantity: number;
      cost: number;
      correlation: number;
    }[];
  };
}

const PartDetailsModal = ({
  isOpen,
  onClose,
  partNumber,
  facility,
  data,
}: PartDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const [timeframe, setTimeframe] = useState<"6m" | "1y" | "2y">("1y");

  const chartData = {
    labels: data?.monthlyData.map((item) => item.month) || [],
    datasets: [
      {
        label: "Quantity",
        data: data?.monthlyData.map((item) => item.quantity) || [],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.1)",
        fill: true,
        tension: 0.4,
        yAxisID: "y",
      },
      {
        label: "Cost",
        data: data?.monthlyData.map((item) => item.cost) || [],
        borderColor: "rgb(252,176,38)",
        backgroundColor: "rgba(252,176,38, 0.1)",
        fill: true,
        tension: 0.4,
        yAxisID: "y1",
      },
      {
        label: "Target",
        data: data?.monthlyData.map((item) => item.target) || [],
        borderColor: "rgb(239, 68, 68)",
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "rgb(156, 163, 175)",
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        titleColor: "rgb(252,176,38)",
        bodyColor: "rgb(156, 163, 175)",
        borderColor: "rgba(75, 85, 99, 0.3)",
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            if (label === "Cost") {
              return `${label}: £${value.toLocaleString()}`;
            }
            return `${label}: ${value.toLocaleString()}`;
          },
        },
      },
      zoom: {
        limits: {
          y: { min: 0, max: "original" },
        },
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
      } as any,
      annotation: {
        annotations: {
          targetLine: {
            type: "line",
            yMin: 0,
            yMax: 0,
            borderColor: "rgb(239, 68, 68)",
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
              content: "Target",
              enabled: true,
              position: "end",
            },
          },
        },
      } as any,
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgb(156, 163, 175)",
          callback: function (value) {
            return value.toLocaleString();
          },
        },
        title: {
          display: true,
          text: "Quantity",
          color: "rgb(156, 163, 175)",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: "rgb(156, 163, 175)",
          callback: function (value) {
            return `£${value.toLocaleString()}`;
          },
        },
        title: {
          display: true,
          text: "Cost",
          color: "rgb(156, 163, 175)",
        },
      },
      x: {
        type: "category",
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgb(156, 163, 175)",
        },
      },
    },
  };

  const seasonalityData = {
    labels: data?.seasonalityData.map((item) => item.quarter) || [],
    datasets: [
      {
        label: "% of Annual Scrap",
        data: data?.seasonalityData.map((item) => item.percentageOfYear) || [],
        backgroundColor: "rgba(252,176,38, 0.8)",
        borderRadius: 4,
      },
    ],
  };

  const seasonalityOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        titleColor: "rgb(252,176,38)",
        bodyColor: "rgb(156, 163, 175)",
        callbacks: {
          label: function (context) {
            return `${context.parsed.y.toFixed(1)}% of annual scrap`;
          },
        },
      },
    },
    scales: {
      y: {
        type: "linear",
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgb(156, 163, 175)",
          callback: function (value) {
            return `${value}%`;
          },
        },
      },
      x: {
        type: "category",
        grid: {
          display: false,
        },
        ticks: {
          color: "rgb(156, 163, 175)",
        },
      },
    },
  };

  const exportToCSV = (data: PartDetailsModalProps["data"]) => {
    if (!data) return;

    const headers = ["Month", "Quantity", "Cost", "CPM", "Target"];
    const rows = data.monthlyData.map((item) => [
      item.month,
      item.quantity,
      item.cost,
      item.cpm,
      item.target,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${data.material}_scrap_data.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const chartComponentRef = useRef<ChartJSOrUndefined<"line">>(null);

  const resetZoom = () => {
    if (chartComponentRef.current?.chart) {
      (chartComponentRef.current.chart as any).resetZoom();
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform rounded-lg bg-[#1a2436] text-left shadow-xl transition-all w-full max-w-5xl">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-200"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <Dialog.Title
                      as="div"
                      className="flex items-center justify-between"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-[rgb(252,176,38)]">
                          {partNumber}
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">
                          {data?.materialDescription}
                        </p>
                        <div className="text-sm text-gray-500">{facility}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-[#111827] rounded-lg px-3 py-2">
                          <CalendarIcon className="h-5 w-5 text-gray-400" />
                          <select
                            className="bg-transparent text-gray-200 outline-none text-sm"
                            value={timeframe}
                            onChange={(e) =>
                              setTimeframe(e.target.value as "6m" | "1y" | "2y")
                            }
                          >
                            <option value="6m">Last 6 Months</option>
                            <option value="1y">Last 12 Months</option>
                            <option value="2y">Last 24 Months</option>
                          </select>
                        </div>
                        <button
                          onClick={() => data && exportToCSV(data)}
                          className="flex items-center gap-2 bg-[#111827] text-gray-200 rounded-lg px-3 py-2 text-sm hover:bg-[#1a2436] transition-colors"
                        >
                          <DocumentArrowDownIcon className="h-5 w-5" />
                          Export Data
                        </button>
                      </div>
                    </Dialog.Title>
                  </div>

                  <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
                    <Tab.List className="flex space-x-4 border-b border-gray-800">
                      <Tab
                        className={({ selected }) =>
                          `px-4 py-2 text-sm font-medium outline-none ${
                            selected
                              ? "text-[rgb(252,176,38)] border-b-2 border-[rgb(252,176,38)]"
                              : "text-gray-400 hover:text-gray-300"
                          }`
                        }
                      >
                        <div className="flex items-center gap-2">
                          <DocumentChartBarIcon className="h-5 w-5" />
                          Overview
                        </div>
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          `px-4 py-2 text-sm font-medium outline-none ${
                            selected
                              ? "text-[rgb(252,176,38)] border-b-2 border-[rgb(252,176,38)]"
                              : "text-gray-400 hover:text-gray-300"
                          }`
                        }
                      >
                        <div className="flex items-center gap-2">
                          <ClockIcon className="h-5 w-5" />
                          History
                        </div>
                      </Tab>
                      <Tab
                        className={({ selected }) =>
                          `px-4 py-2 text-sm font-medium outline-none ${
                            selected
                              ? "text-[rgb(252,176,38)] border-b-2 border-[rgb(252,176,38)]"
                              : "text-gray-400 hover:text-gray-300"
                          }`
                        }
                      >
                        <div className="flex items-center gap-2">
                          <ChartBarIcon className="h-5 w-5" />
                          Analysis
                        </div>
                      </Tab>
                    </Tab.List>

                    <Tab.Panels className="mt-6">
                      {/* Overview Panel */}
                      <Tab.Panel>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* YTD Stats */}
                          <div className="bg-[#111827] rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-400 mb-4">
                              Year to Date Statistics
                            </h4>
                            <div className="space-y-4">
                              <div>
                                <div className="text-sm text-gray-500">
                                  Total Quantity
                                </div>
                                <div className="text-2xl font-semibold text-gray-200">
                                  {data?.yearlyStats.totalQuantity.toLocaleString()}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">
                                  Total Cost
                                </div>
                                <div className="text-2xl font-semibold text-gray-200">
                                  £
                                  {data?.yearlyStats.totalCost.toLocaleString(
                                    undefined,
                                    { minimumFractionDigits: 2 }
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">
                                  Average Cost Per Unit
                                </div>
                                <div className="text-2xl font-semibold text-gray-200">
                                  £
                                  {data?.yearlyStats.averageCostPerUnit.toLocaleString(
                                    undefined,
                                    { minimumFractionDigits: 2 }
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">
                                  Year over Year Change
                                </div>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`text-2xl font-semibold ${
                                      (data?.yearlyStats.yearOverYearChange ||
                                        0) >= 0
                                        ? "text-red-500"
                                        : "text-green-500"
                                    }`}
                                  >
                                    {(
                                      data?.yearlyStats.yearOverYearChange || 0
                                    ).toFixed(1)}
                                    %
                                  </div>
                                  {(data?.yearlyStats.yearOverYearChange ||
                                    0) >= 0 ? (
                                    <ArrowTrendingUpIcon className="h-5 w-5 text-red-500" />
                                  ) : (
                                    <ArrowTrendingDownIcon className="h-5 w-5 text-green-500" />
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">
                                  Target Achievement
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="text-2xl font-semibold text-gray-200">
                                    {data?.yearlyStats.targetAchievement.toFixed(
                                      1
                                    )}
                                    %
                                  </div>
                                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${
                                        (data?.yearlyStats.targetAchievement ||
                                          0) > 100
                                          ? "bg-red-500"
                                          : "bg-green-500"
                                      }`}
                                      style={{
                                        width: `${Math.min(
                                          data?.yearlyStats.targetAchievement ||
                                            0,
                                          100
                                        )}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">
                                  Potential Savings Opportunity
                                </div>
                                <div className="text-2xl font-semibold text-green-500">
                                  £
                                  {data?.yearlyStats.savingsOpportunity.toLocaleString(
                                    undefined,
                                    { minimumFractionDigits: 2 }
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Top Reasons */}
                          <div className="bg-[#111827] rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-400 mb-4">
                              Top Scrap Reasons
                            </h4>
                            <div className="space-y-4">
                              {data?.topReasons.map((reason, index) => (
                                <div key={index}>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-400">
                                      {reason.reason}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-gray-500">
                                        {reason.percentage.toFixed(1)}%
                                      </span>
                                      <span
                                        className={
                                          reason.trend >= 0
                                            ? "text-red-500"
                                            : "text-green-500"
                                        }
                                      >
                                        {reason.trend >= 0 ? "+" : ""}
                                        {reason.trend.toFixed(1)}%
                                      </span>
                                    </div>
                                  </div>
                                  <div className="w-full bg-gray-800 rounded-full h-2">
                                    <div
                                      className="bg-[rgb(252,176,38)] h-2 rounded-full"
                                      style={{
                                        width: `${reason.percentage}%`,
                                      }}
                                    />
                                  </div>
                                  <div className="mt-1 flex justify-between text-xs">
                                    <span className="text-gray-500">
                                      Qty: {reason.quantity}
                                    </span>
                                    <span className="text-gray-500">
                                      £{reason.cost.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Tab.Panel>

                      {/* History Panel */}
                      <Tab.Panel>
                        <div className="space-y-6">
                          <div className="bg-[#111827] rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="text-sm font-medium text-gray-400">
                                Monthly Trends
                              </h4>
                              <button
                                onClick={resetZoom}
                                className="flex items-center gap-2 text-gray-400 hover:text-gray-300"
                                title="Reset zoom"
                              >
                                <ArrowPathIcon className="h-5 w-5" />
                              </button>
                            </div>
                            <div className="h-[300px]">
                              <Line
                                ref={chartComponentRef}
                                data={chartData}
                                options={chartOptions}
                              />
                            </div>
                          </div>

                          <div className="bg-[#111827] rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-400 mb-4">
                              Seasonality Analysis
                            </h4>
                            <div className="h-[200px]">
                              <Bar
                                data={seasonalityData}
                                options={seasonalityOptions}
                              />
                            </div>
                          </div>
                        </div>
                      </Tab.Panel>

                      {/* Analysis Panel */}
                      <Tab.Panel>
                        <div className="space-y-6">
                          <div className="bg-[#111827] rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-400 mb-4">
                              Related Parts Analysis
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b border-gray-800">
                                    <th className="text-left py-2 text-sm font-medium text-gray-400">
                                      Part Number
                                    </th>
                                    <th className="text-left py-2 text-sm font-medium text-gray-400">
                                      Description
                                    </th>
                                    <th className="text-right py-2 text-sm font-medium text-gray-400">
                                      Quantity
                                    </th>
                                    <th className="text-right py-2 text-sm font-medium text-gray-400">
                                      Cost
                                    </th>
                                    <th className="text-right py-2 text-sm font-medium text-gray-400">
                                      Correlation
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {data?.relatedParts.map((part, index) => (
                                    <tr
                                      key={index}
                                      className="border-b border-gray-800/30 last:border-0"
                                    >
                                      <td className="py-2 text-sm text-gray-300">
                                        {part.partNumber}
                                      </td>
                                      <td className="py-2 text-sm text-gray-400">
                                        {part.description}
                                      </td>
                                      <td className="py-2 text-sm text-right text-gray-300">
                                        {part.quantity.toLocaleString()}
                                      </td>
                                      <td className="py-2 text-sm text-right text-gray-300">
                                        £{part.cost.toLocaleString()}
                                      </td>
                                      <td className="py-2 text-sm text-right">
                                        <span
                                          className={
                                            part.correlation >= 0.7
                                              ? "text-red-500"
                                              : part.correlation >= 0.4
                                              ? "text-yellow-500"
                                              : "text-green-500"
                                          }
                                        >
                                          {(part.correlation * 100).toFixed(1)}%
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#111827] rounded-lg p-4">
                              <h4 className="text-sm font-medium text-gray-400 mb-4">
                                Cost Reduction Opportunities
                              </h4>
                              <div className="space-y-4">
                                <div>
                                  <div className="text-sm text-gray-500">
                                    Target Reduction
                                  </div>
                                  <div className="text-2xl font-semibold text-green-500">
                                    £
                                    {(
                                      (data?.yearlyStats.savingsOpportunity ||
                                        0) * 0.75
                                    ).toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                    })}
                                  </div>
                                  <div className="text-sm text-gray-400 mt-1">
                                    Based on industry benchmarks
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">
                                    Implementation Timeline
                                  </div>
                                  <div className="text-2xl font-semibold text-gray-200">
                                    3-6 Months
                                  </div>
                                  <div className="text-sm text-gray-400 mt-1">
                                    Estimated time to achieve target
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-[#111827] rounded-lg p-4">
                              <h4 className="text-sm font-medium text-gray-400 mb-4">
                                Action Items
                              </h4>
                              <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-200">
                                      Review Quality Control Process
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      High rejection rate indicates potential QC
                                      issues
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-200">
                                      Supplier Engagement
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      Schedule review with supplier to discuss
                                      quality
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-200">
                                      Process Optimization
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      Implement improved handling procedures
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default PartDetailsModal;
