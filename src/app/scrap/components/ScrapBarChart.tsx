"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { Card, CardBody, CardHeader, CardFooter } from "@nextui-org/react";
import { ScrapItem } from "@/types/scrap";

// Create types for our chart data and config
type ChartData = {
  month: string;
  scrapCost: number;
};

type ChartConfig = {
  [key: string]: {
    label: string;
    color: string;
  };
};

const chartConfig = {
  scrapCost: {
    label: "Scrap Cost",
    color: "var(--nextui-colors-primary)",
  },
} satisfies ChartConfig;

interface ScrapBarChartProps {
  data: ScrapItem[];
}

const ScrapBarChart = ({ data }: ScrapBarChartProps) => {
  // Process data for the chart
  const chartData: ChartData[] = data.reduce((acc: ChartData[], item) => {
    const date = new Date(item.dateScraped);
    const month = date.toLocaleString("default", { month: "long" });

    const existingMonth = acc.find((d) => d.month === month);
    if (existingMonth) {
      existingMonth.scrapCost += item.cost;
    } else {
      acc.push({ month, scrapCost: item.cost });
    }

    return acc;
  }, []);

  // Calculate trend
  const lastTwoMonths = chartData.slice(-2);
  const trend =
    lastTwoMonths.length === 2
      ? ((lastTwoMonths[1].scrapCost - lastTwoMonths[0].scrapCost) /
          lastTwoMonths[0].scrapCost) *
        100
      : 0;

  return (
    <Card>
      <CardHeader className="flex flex-col gap-1">
        <h4 className="text-lg font-semibold">Monthly Scrap Cost</h4>
        <p className="text-small text-default-500">Last 6 Months Trend</p>
      </CardHeader>
      <CardBody>
        <div className="h-[300px] w-full">
          <BarChart
            width={600}
            height={300}
            data={chartData.slice(-6)} // Last 6 months
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Bar
              dataKey="scrapCost"
              fill={chartConfig.scrapCost.color}
              radius={8}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => `£${value.toFixed(2)}`}
              />
            </Bar>
          </BarChart>
        </div>
      </CardBody>
      <CardFooter className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          {trend > 0 ? "Trending up" : "Trending down"} by{" "}
          {Math.abs(trend).toFixed(1)}% this month{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <p className="text-sm text-default-500">
          Showing total scrap cost for the last 6 months
        </p>
      </CardFooter>
    </Card>
  );
};

export default ScrapBarChart;
