import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const PredictiveChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center">
        Loading data...
      </div>
    );
  }

  const getTimeOfDay = (hour) => {
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Night";
  };

  // Calculate reference line positions
  const morningIndex = Math.floor(data.length * 0.33);
  const afternoonIndex = Math.floor(data.length * 0.66);

  const morningTimestamp = data[morningIndex]?.timestamp;
  const afternoonTimestamp = data[afternoonIndex]?.timestamp;

  // Render reference lines only if we have valid timestamps
  const timeReferences = [];

  if (morningTimestamp) {
    timeReferences.push(
      <ReferenceLine
        key="morning"
        x={morningTimestamp}
        stroke="#666"
        strokeDasharray="3 3"
        label={{
          value: "Morning",
          position: "top",
          fill: "#666",
          className: "text-sm",
        }}
      />
    );
  }

  if (afternoonTimestamp) {
    timeReferences.push(
      <ReferenceLine
        key="afternoon"
        x={afternoonTimestamp}
        stroke="#666"
        strokeDasharray="3 3"
        label={{
          value: "Afternoon",
          position: "top",
          fill: "#666",
          className: "text-sm",
        }}
      />
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="timestamp"
          tickFormatter={(timestamp) => {
            if (!timestamp) return "";
            const date = new Date(timestamp);
            return `${date.getHours()}:${date
              .getMinutes()
              .toString()
              .padStart(2, "0")}`;
          }}
        />
        <YAxis
          domain={[40, 100]}
          ticks={[40, 55, 70, 85, 100]}
          label={{
            value: "Temperature (°C)",
            angle: -90,
            position: "insideLeft",
            className: "text-sm",
          }}
        />
        <Tooltip
          labelFormatter={(label) => {
            if (!label) return "";
            const date = new Date(label);
            return `${date.toLocaleTimeString()} - ${getTimeOfDay(
              date.getHours()
            )}`;
          }}
        />

        {/* Reference Lines for Temperature Limits */}
        <ReferenceLine
          y={80}
          stroke="#faad14"
          strokeDasharray="3 3"
          label={{
            value: "UL",
            position: "right",
            fill: "#faad14",
            className: "text-sm",
          }}
        />
        <ReferenceLine
          y={70}
          stroke="#ff4d4f"
          strokeDasharray="3 3"
          label={{
            value: "UCL",
            position: "right",
            fill: "#ff4d4f",
            className: "text-sm",
          }}
        />

        {/* Time Period Dividers */}
        {timeReferences}

        {/* Actual Temperature Line */}
        <Line
          type="monotone"
          dataKey="temperature"
          stroke="#8884d8"
          strokeWidth={2}
          dot={{ r: 1 }}
          name="Actual"
        />

        {/* Predicted Temperature Line */}
        <Line
          type="monotone"
          dataKey="predictedTemperature"
          stroke="#82ca9d"
          strokeDasharray="5 5"
          strokeWidth={2}
          dot={false}
          name="Predicted"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PredictiveChart;
