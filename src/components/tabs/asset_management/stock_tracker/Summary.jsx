"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data generation function
const generateData = (type, dates) => {
  return dates.map((date) => ({
    date,
    installed: Math.floor(Math.random() * 100),
    remaining: Math.floor(Math.random() * 50),
  }));
};

const dates = [
  "2023-01-01",
  "2023-02-01",
  "2023-03-01",
  "2023-04-01",
  "2023-05-01",
];

const dummyData = {
  Devices: generateData("Devices", dates),
  Remotes: generateData("Remotes", dates),
};

// Calculate totals for pie charts
const calculateTotals = (data) => {
  const totals = data.reduce(
    (acc, curr) => {
      acc.installed += curr.installed;
      acc.remaining += curr.remaining;
      return acc;
    },
    { installed: 0, remaining: 0 }
  );
  return [
    { name: "Installed", value: totals.installed },
    { name: "Remaining", value: totals.remaining },
  ];
};

const meterTotals = calculateTotals(dummyData.Devices);
const remoteTotals = calculateTotals(dummyData.Remotes);

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
  label,
  selectedType,
  selectedMetric,
  pie,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border bg-card p-2 shadow-sm">
        <p className="text-[0.70rem] uppercase text-muted-foreground">
          {label}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {pie ? (
            payload.map((entry, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-[0.70rem] uppercase text-muted-foreground">
                  {entry.name}
                </span>
                <span className="font-bold text-muted-foreground">
                  {entry.value}
                </span>
              </div>
            ))
          ) : selectedType === "ALL" ? (
            payload.map((entry, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-[0.70rem] uppercase text-muted-foreground">
                  {entry.dataKey}
                </span>
                <span className="font-bold text-muted-foreground">
                  {entry.value}
                </span>
              </div>
            ))
          ) : (
            <div className="flex flex-col">
              <span className="text-[0.70rem] uppercase text-muted-foreground">
                {selectedMetric}
              </span>
              <span className="font-bold text-muted-foreground">
                {payload[0].value}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

// Custom label for pie charts
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="card"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function Summary() {
  const [loading, setLoading] = React.useState(false);

  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedMetric, setSelectedMetric] = useState("installed");

  const chartData =
    selectedType === "ALL"
      ? dates.map((date) => ({
          date,
          Devices: dummyData.Devices.find((d) => d.date === date)[
            selectedMetric
          ],
          Remotes: dummyData.Remotes.find((d) => d.date === date)[
            selectedMetric
          ],
        }))
      : dummyData[selectedType];

  // Set colors based on the selected Type
  const barColors = {
    Devices: "hsl(var(--primary))",
    Remotes: "hsl(var(--border))",
  };

  const pieColors = ["hsl(var(--primary))", "hsl(var(--border))"];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div
          className={cn(
            "w-16 h-16 border-4 border-dashed rounded-full animate-spin",
            "border-gray-400 border-t-transparent"
          )}
        ></div>
      </div>
    );
  }

  return (
    <div className="w-full p-2 bg-card rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Installation Summary</h1>

      {/* Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader className="p-2 border-b flex flex-row justify-between items-center px-4">
            <CardTitle className="text-lg w-fit">
              Devices Installation Status
            </CardTitle>
            <div className="flex gap-3 justify-center w-fit border p-2 rounded-xl h-fit">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-[hsl(var(--primary))]"></div>
                <span className="text-sm">Devices</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-[hsl(var(--border))]"></div>
                <span className="text-sm">Remotes</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={meterTotals}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {meterTotals.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip pie />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-2 border-b flex flex-row justify-between items-center px-4">
            <CardTitle className="text-lg">
              Remotes Installation Status
            </CardTitle>
            <div className="flex gap-3 justify-center w-fit border p-2 rounded-xl h-fit">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-[hsl(var(--primary))]"></div>
                <span className="text-sm">Devices</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-[hsl(var(--border))]"></div>
                <span className="text-sm">Remotes</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={remoteTotals}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {remoteTotals.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip pie />} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="w-full bg-transparent bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-10 shadow-inner shadow-accent/50 border rounded-xl">
        <CardHeader className="p-2 border-b flex flex-row justify-between items-center px-4">
          <CardTitle className="text-lg w-fit">
            Device Installation Progress
          </CardTitle>
          <div className="flex gap-3 justify-center w-fit border p-2 rounded-xl h-fit">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2 bg-[hsl(var(--primary))]"></div>
              <span className="text-sm">Devices</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2 bg-[hsl(var(--border))]"></div>
              <span className="text-sm">Remotes</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <div className="flex gap-2 mb-2">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">ALL</SelectItem>
                <SelectItem value="Devices">Devices</SelectItem>
                <SelectItem value="Remotes">Remotes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="installed">Installed</SelectItem>
                <SelectItem value="remaining">Remaining</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              className="z-0 bg-card border rounded-xl"
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                content={
                  <CustomTooltip
                    selectedType={selectedType}
                    selectedMetric={selectedMetric}
                  />
                }
              />
              {selectedType === "ALL" ? (
                <>
                  <Bar
                    dataKey="Devices"
                    fill={barColors.Devices}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="Remotes"
                    fill={barColors.Remotes}
                    radius={[4, 4, 0, 0]}
                  />
                </>
              ) : (
                <Bar
                  dataKey={selectedMetric}
                  fill={barColors[selectedType]}
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export default Summary;
