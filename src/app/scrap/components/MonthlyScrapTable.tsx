"use client";

import { MonthlyData } from "@/types/scrap";

interface MonthlyScrapTableProps {
  facility: string;
  data: MonthlyData[];
}

// Helper function to format dates to UK format (DD/MM/YYYY)
function formatToUKDate(isoDate: string): string {
  try {
    const [year, month] = isoDate.split("-");
    return `${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return isoDate;
  }
}

const MonthlyScrapTable = ({ facility, data }: MonthlyScrapTableProps) => {
  return (
    <div className="bg-[#1a2436] rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[rgb(252,176,38)]">
            Monthly Scrap Details
          </h2>
          <div className="text-sm text-gray-400">{facility}</div>
        </div>
        {data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400">
                  <th className="pb-4">Month</th>
                  <th className="pb-4 text-right">Total Cost</th>
                  <th className="pb-4 text-right">Parts Count</th>
                  <th className="pb-4 text-right">CPM</th>
                  <th className="pb-4 text-right">Savings</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {data.map((row) => {
                  const cpm =
                    row.quantity > 0 ? row.totalCost / row.quantity : 0;
                  const savings = row.totalCost * 0.15; // 15% savings
                  return (
                    <tr key={row.month} className="border-t border-gray-800">
                      <td className="py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatToUKDate(row.month)}
                      </td>
                      <td className="py-4 text-right">
                        £{row.totalCost.toLocaleString()}
                      </td>
                      <td className="py-4 text-right">
                        {row.quantity.toLocaleString()}
                      </td>
                      <td className="py-4 text-right">£{cpm.toFixed(2)}</td>
                      <td className="py-4 text-right text-green-500">
                        £{savings.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-400">
              No data available for the selected period
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyScrapTable;
