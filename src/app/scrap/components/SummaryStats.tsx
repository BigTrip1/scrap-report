"use client";

import { Card } from "@nextui-org/react";

const SummaryStats = ({ data, dateRange }) => {
  // Calculate summary statistics
  const totalCost = data.reduce((sum, item) => sum + item.cost, 0);
  const totalParts = data.reduce((sum, item) => sum + item.quantity, 0);
  const topContributor = data.reduce(
    (max, item) => (item.cost > max.cost ? item : max),
    data[0]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-500">
          Total Scrap Cost
        </h3>
        <p className="text-2xl font-bold">£{totalCost.toFixed(2)}</p>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-500">Total Parts</h3>
        <p className="text-2xl font-bold">{totalParts}</p>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-semibold text-gray-500">Top Contributor</h3>
        <p className="text-2xl font-bold">{topContributor?.partNumber}</p>
        <p className="text-sm text-gray-500">
          £{topContributor?.cost.toFixed(2)}
        </p>
      </Card>
    </div>
  );
};

export default SummaryStats;
