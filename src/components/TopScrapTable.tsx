"use client";

import { TopScrapItem } from "@/types/scrap";

export interface TopScrapTableProps {
  title: string;
  period: "weekly" | "ytd";
  facility: string;
  onSelectPart: (partNumber: string) => void;
  data: TopScrapItem[];
}

const TopScrapTable = ({
  title,
  period,
  facility,
  onSelectPart,
  data,
}: TopScrapTableProps) => {
  return (
    <div className="bg-[#1a2436] rounded-lg shadow-lg overflow-hidden h-full">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[rgb(252,176,38)]">{title}</h2>
          <div className="text-sm text-gray-400">{facility}</div>
        </div>
        <div className="overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800/50">
                <th className="text-left py-2 text-sm font-medium text-gray-400">
                  Part Details
                </th>
                <th className="text-right py-2 text-sm font-medium text-gray-400">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.material}
                  className="border-b border-gray-800/30 last:border-0 group hover:bg-gray-800/30 transition-colors cursor-pointer"
                  onClick={() => onSelectPart(item.material)}
                >
                  <td className="py-3">
                    <div className="text-gray-200 text-sm font-medium">
                      {item.material}
                    </div>
                    <div className="text-gray-400 text-xs">
                      {item.materialDescription}
                    </div>
                    <div className="text-gray-500 text-xs flex items-center gap-2">
                      <span>Qty: {item.quantity}</span>
                      <span>•</span>
                      <span>{item.reasonArea}</span>
                    </div>
                  </td>
                  <td className="text-right py-3">
                    <div className="text-gray-200 text-sm font-medium">
                      £{item.cost.toLocaleString()}
                    </div>
                    {item.trend && (
                      <div
                        className={`text-xs ${
                          item.trend.startsWith("+")
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {item.trend}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TopScrapTable;
