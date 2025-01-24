"use client";

import { TopPart } from "@/types/scrap";

interface TopScrapTableProps {
  title: string;
  data: TopPart[];
  onSelectPart: (partNumber: string) => void;
  isYearToDate?: boolean;
  validDateRange?: { earliest: string; latest: string } | null;
}

const TopScrapTable = ({
  title,
  data,
  onSelectPart,
  isYearToDate,
  validDateRange,
}: TopScrapTableProps) => {
  // If it's year to date, filter data to only include items from start of earliest year
  const filteredData = isYearToDate
    ? data.filter((part) => {
        try {
          // Parse ISO date format (YYYY-MM-DD)
          const partDate = new Date(part.documentDate);

          // Use the year from the earliest date in valid range, or current year as fallback
          const earliestYear = validDateRange?.earliest
            ? new Date(validDateRange.earliest).getFullYear()
            : new Date().getFullYear();

          const startOfYear = new Date(earliestYear, 0, 1); // January 1st of earliest year

          console.log("YTD Filter:", {
            partDate: partDate.toISOString(),
            startOfYear: startOfYear.toISOString(),
            isValid: partDate >= startOfYear,
            documentDate: part.documentDate,
            earliestYear,
          });

          return partDate >= startOfYear;
        } catch (error) {
          console.error("Error parsing date:", part.documentDate, error);
          return false;
        }
      })
    : data;

  // Sort data by cost in descending order
  const sortedData = [...filteredData].sort((a, b) => b.cost - a.cost);

  // Take only top 10 if year to date, or top 5 if weekly
  const limitedData = isYearToDate
    ? sortedData.slice(0, 10)
    : sortedData.slice(0, 5);

  return (
    <div className="bg-[#1a2436] rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-bold text-[rgb(252,176,38)] mb-4">
          {title}
        </h2>
        {limitedData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400">
                  <th className="pb-4">Part Number</th>
                  <th className="pb-4">Description</th>
                  <th className="pb-4 text-right">Quantity</th>
                  <th className="pb-4 text-right">Cost</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {limitedData.map((part) => (
                  <tr
                    key={part.material}
                    className="border-t border-gray-800 cursor-pointer hover:bg-[#111827]"
                    onClick={() => onSelectPart(part.material)}
                  >
                    <td className="py-4 text-gray-300">{part.material}</td>
                    <td className="py-4 text-gray-300">
                      {part.materialDescription}
                    </td>
                    <td className="py-4 text-right text-gray-300">
                      {part.quantity.toLocaleString()}
                    </td>
                    <td className="py-4 text-right text-gray-300">
                      £{part.cost.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-400">No data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopScrapTable;
