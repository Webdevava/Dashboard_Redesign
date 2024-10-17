"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

// Dummy data
const generateData = (apm, dates) => {
  return dates.map((date) => ({
    date,
    installed: Math.floor(Math.random() * 100),
    connected: Math.floor(Math.random() * 80),
    "EoD received": Math.floor(Math.random() * 60),
    "installed household": Math.floor(Math.random() * 40),
  }));
};

const dates = [
  "01-01-24",
  "01-02-24",
  "01-03-24",
  "01-04-24",
  "01-05-24",
  "01-06-24",
];

const dummyData = {
  APM1: generateData("APM1", dates),
  APM2: generateData("APM2", dates),
  APM3: generateData("APM3", dates),
};

export default function APMStatistics() {
  const [selectedAPM, setSelectedAPM] = useState("ALL");
  const [selectedMetric, setSelectedMetric] = useState("installed");
  const [isLoading, setIsLoading] = useState(true);
  const chartRef = useRef(null);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Define specific values for each APM
  const values = {
    APM1: 2300,
    APM2: 1500,
    APM3: 1800,
  };

  // Calculate the total for ALL
  const total = values.APM1 + values.APM2 + values.APM3;

  const chartData =
    selectedAPM === "ALL"
      ? dates.map((date) => ({
          date,
          APM1: dummyData.APM1.find((d) => d.date === date)[selectedMetric],
          APM2: dummyData.APM2.find((d) => d.date === date)[selectedMetric],
          APM3: dummyData.APM3.find((d) => d.date === date)[selectedMetric],
        }))
      : dummyData[selectedAPM];

  // Set color based on the selected APM
  const barColor =
    selectedAPM === "APM1"
      ? "#28B7C4"
      : selectedAPM === "APM2"
      ? "#9F5BC1"
      : selectedAPM === "APM3"
      ? "#FFA500"
      : "#28B7C4"; // Default color for ALL

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  const renderAPMButtons = () => {
    return ["ALL", "APM1", "APM2", "APM3"].map((apm) => {
      const bgColor =
        apm === "APM1"
          ? "bg-[#28B7C4]/25"
          : apm === "APM2"
          ? "bg-[#9F5BC1]/25"
          : apm === "APM3"
          ? "bg-[#FFA500]/25"
          : "bg-accent/25";

      const circleColor =
        apm === "APM1"
          ? "bg-[#28B7C4]"
          : apm === "APM2"
          ? "bg-[#9F5BC1]"
          : apm === "APM3"
          ? "bg-[#FFA500]"
          : "bg-gray-600";

      const displayValue = apm === "ALL" ? total : values[apm];

      return (
        <button
          key={apm}
          onClick={() => setSelectedAPM(apm)}
          className={`flex items-center justify-center rounded-full px-2 ${
            selectedAPM === apm ? "border-2 border-foreground " : ""
          } ${bgColor}`}
        >
          <div className={`w-3 h-3 rounded-full mr-2 ${circleColor}`}></div>
          <div className="text-start">
            <p className="text-sm font-extrabold">
              {formatNumber(displayValue)}+
            </p>
            <p className="text-xs">Total {apm}</p>
          </div>
        </button>
      );
    });
  };

  const renderMetricButtons = () => {
    const metrics = [
      "installed",
      "connected",
      "EoD received",
      "installed household",
    ];
    return metrics.map((metric) => (
      <button
        key={metric}
        onClick={() => setSelectedMetric(metric)}
        className={`px-4 py-2 rounded-full w-full ${
          selectedMetric === metric ? "bg-primary text-card" : ""
        }`}
      >
        {metric}
      </button>
    ));
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-4 bg-card border-none rounded-xl shadow-lg">
          <p className="text-sm font-semibold">{`Date: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`tooltip-${index}`} className="text-xs">
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </Card>
      );
    }

    return null;
  };

  return (
    <div className="w-full h-full -z-0 flex flex-col">
      <Card className="w-full h-full bg-card rounded-2xl border-0 flex flex-col">
        <CardContent className="flex flex-col h-full p-2">
          <div className="flex flex-col justify-between gap-2">
            {isLoading ? (
              <>
                <Skeleton className="h-12 w-full mb-2" />
                <Skeleton className="h-10 w-full" />
              </>
            ) : (
              <>
                <div className="flex gap-2 w-full">{renderAPMButtons()}</div>
                <div className="flex text-xs truncate gap-2 bg-secondary p-1 rounded-full">
                  {renderMetricButtons()}
                </div>
              </>
            )}
          </div>

          <div ref={chartRef} className="flex-grow w-full">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={8}>
                  <CartesianGrid strokeDasharray="5 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    label={{
                      value: "Dates",
                      position: "insideBottom",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "No. of Devices",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  {selectedAPM === "ALL" ? (
                    <>
                      <Bar
                        dataKey="APM1"
                        fill="#28B7C4"
                        radius={[1000, 1000, 0, 0]}
                      />
                      <Bar
                        dataKey="APM2"
                        fill="#9F5BC1"
                        radius={[1000, 1000, 0, 0]}
                      />
                      <Bar
                        dataKey="APM3"
                        fill="#FFA500"
                        radius={[1000, 1000, 0, 0]}
                      />
                    </>
                  ) : (
                    <Bar
                      dataKey={selectedMetric}
                      fill={barColor}
                      radius={[1000, 1000, 0, 0]}
                    />
                  )}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
