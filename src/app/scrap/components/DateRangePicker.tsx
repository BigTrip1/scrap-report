"use client";

import { Select, SelectItem } from "@nextui-org/react";

const DateRangePicker = ({ value, onChange }) => {
  const dateRanges = [
    { value: "7days", label: "Last 7 Days" },
    { value: "30days", label: "Last 30 Days" },
    { value: "ytd", label: "Year to Date" },
    { value: "custom", label: "Custom Range" },
  ];

  return (
    <div className="w-48">
      <Select
        label="Date Range"
        selectedKeys={[value]}
        onChange={(e) => onChange(e.target.value)}
      >
        {dateRanges.map((range) => (
          <SelectItem key={range.value} value={range.value}>
            {range.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default DateRangePicker;
