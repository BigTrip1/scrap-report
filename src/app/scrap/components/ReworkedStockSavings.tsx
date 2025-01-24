"use client";

import { ScrapSummary } from "@/types/scrap";

interface ReworkedStockSavingsProps {
  facility: string;
  dateRange: string;
  data: ScrapSummary | null;
}

const ReworkedStockSavings = ({
  facility,
  dateRange,
  data,
}: ReworkedStockSavingsProps) => {
  const monthlySavings = data?.reworkSavings || 0;
  const ytdSavings = data?.reworkSavings || 0;

  const savingsBreakdown = [
    {
      label: "Parts Recovery",
      value: ytdSavings * 0.6, // 60% of savings
      color: "bg-[#FCB026]",
    },
    {
      label: "Labor Savings",
      value: ytdSavings * 0.3, // 30% of savings
      color: "bg-[#FCB026] opacity-75",
    },
    {
      label: "Material Reuse",
      value: ytdSavings * 0.1, // 10% of savings
      color: "bg-[#FCB026] opacity-50",
    },
  ];

  return (
    <div className="bg-[#1a2436] rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[rgb(252,176,38)]">
            Reworked Stock Savings
          </h2>
          <div className="text-sm text-gray-400">{facility}</div>
        </div>

        {/* Monthly Savings */}
        <div className="mb-6">
          <div className="flex justify-between items-baseline">
            <p className="text-sm text-gray-400">Monthly Savings</p>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-bold text-gray-200">
                £{monthlySavings.toLocaleString()}
              </p>
              <span className="text-sm text-green-500">+10.7%</span>
            </div>
          </div>
          <div className="mt-2 flex gap-2">
            <div className="flex-1 h-2 bg-[#FCB026] rounded" />
            <div className="flex-1 h-2 bg-[#FCB026] opacity-75 rounded" />
            <div className="flex-1 h-2 bg-[#FCB026] opacity-50 rounded" />
          </div>
        </div>

        {/* YTD Savings */}
        <div>
          <div className="flex justify-between items-baseline mb-4">
            <p className="text-sm text-gray-400">YTD Savings</p>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-bold text-gray-200">
                £{ytdSavings.toLocaleString()}
              </p>
              <span className="text-sm text-green-500">+8.3%</span>
            </div>
          </div>

          {/* Savings Breakdown */}
          <div className="space-y-3">
            {savingsBreakdown.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-gray-200">
                    £{item.value.toLocaleString()}
                  </span>
                </div>
                <div className="h-2 rounded overflow-hidden bg-gray-800">
                  <div
                    className={`h-full ${item.color}`}
                    style={{ width: `${(item.value / ytdSavings) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReworkedStockSavings;
