"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { Thermometer, Zap, Droplet, Fan } from "lucide-react";
import TemperatureThermometer from "@/components/charts/TemperatureThermometer";
import OilLevelChart from "@/components/charts/OilLevelChart";

// Data generation function
const generateSyntheticData = (limit = 100) => {
  let temperature = 68;
  let powerSupply = 10;
  let oilLevel = 80;
  let oilTemperature = 65;
  let dataCounter = 0;
  const data = [];

  while (dataCounter < limit) {
    const timestamp = new Date(Date.now() + dataCounter * 5000); // 5 seconds interval

    // Apply fluctuations and manual injections as per the original logic
    if (10 <= dataCounter && dataCounter < 20) {
      const manualTemperatures = [
        74, 74.6, 74.8, 75, 75.2, 75.5, 75.3, 75, 74, 73,
      ];
      temperature = manualTemperatures[dataCounter - 10];
    } else if (16 <= dataCounter && dataCounter < 27) {
      const manualOilLevel = [
        85, 85.2, 85.4, 85.5, 85.6, 85.5, 85.3, 85, 84.9, 84.7, 84.5,
      ];
      oilLevel = manualOilLevel[dataCounter - 16];
    } else if (30 <= dataCounter && dataCounter < 44) {
      const manualTemperatures = [
        73, 73.7, 73.9, 74, 75, 76.6, 78, 79.4, 80.1, 80.5, 80.6, 80.7, 81,
      ];
      temperature = manualTemperatures[dataCounter - 30];
    } else if (46 <= dataCounter && dataCounter < 57) {
      const manualPower = [
        16, 16.1, 16.2, 16.4, 16.5, 16.6, 16.5, 16.4, 16.3, 16.1, 16,
      ];
      powerSupply = manualPower[dataCounter - 46];
    } else {
      temperature += Math.random() * 6 - 3;
      powerSupply += Math.random() - 0.5;
      oilTemperature += Math.random() * 4 - 2;
    }

    oilLevel -= 0.1;

    // Ensure smooth transitions
    if (dataCounter === 20)
      temperature = Math.max(69, temperature - Math.random() * 2 + 1);
    else if (dataCounter === 27)
      oilLevel = Math.max(80, oilLevel - Math.random() * 0.5 - 0.5);
    else if (dataCounter === 44)
      temperature = Math.max(60, temperature - Math.random() * 0.5 - 0.5);

    data.push({
      timestamp,
      temperature: Math.round(temperature * 100) / 100,
      powerSupply: Math.round(powerSupply * 100) / 100,
      oilLevel: Math.round(oilLevel * 100) / 100,
      oilTemperature: Math.round(oilTemperature * 100) / 100,
    });

    dataCounter++;
  }

  return data;
};

// Predictive analysis function
const predictFutureData = (data, pointsAhead = 4) => {
  if (!data || data.length === 0) {
    return [];
  }

  const lastDataPoint = data[data.length - 1];
  const futureData = [];

  for (let i = 1; i <= pointsAhead; i++) {
    const futureTimestamp = new Date(
      lastDataPoint.timestamp.getTime() + i * 5000
    );
    futureData.push({
      timestamp: futureTimestamp,
      temperature: lastDataPoint.temperature + Math.random() * 2 - 1,
      powerSupply: lastDataPoint.powerSupply + Math.random() * 0.5 - 0.25,
      oilLevel: lastDataPoint.oilLevel - 0.1,
      oilTemperature: lastDataPoint.oilTemperature + Math.random() * 1.5 - 0.75,
    });
  }

  return [...data, ...futureData];
};

const chartTypes = ["line", "bar", "area"];

export default function TransformerDashboard() {
  const [chartType, setChartType] = useState("line");
  const [data, setData] = useState([]);
  const [fanSpeed, setFanSpeed] = useState(0);

  useEffect(() => {
    const initialData = generateSyntheticData(20);
    setData(initialData);

    const interval = setInterval(() => {
      setData((prevData) => {
        const newDataPoint = generateSyntheticData(1)[0];
        const updatedData = [...prevData.slice(-19), newDataPoint];
        return updatedData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const currentTemp = data[data.length - 1].temperature;
      if (currentTemp >= 70) {
        const newFanSpeed = Math.min(
          2000,
          Math.round((currentTemp - 70) * 200)
        );
        setFanSpeed(newFanSpeed);
      } else {
        setFanSpeed(0);
      }
    }
  }, [data]);

  const renderChart = (
    data,
    dataKeys,
    colors,
    predictive = false,
    showUCLUL = false
  ) => {
    const ChartComponent =
      chartType === "line"
        ? LineChart
        : chartType === "bar"
        ? BarChart
        : AreaChart;
    const DataComponent =
      chartType === "line" ? Line : chartType === "bar" ? Bar : Area;

    const chartData =
      predictive && data.length > 0 ? predictFutureData(data) : data;

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={chartData}>
          <CartesianGrid strokeDasharray="3 5" horizontal={false} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={(timestamp) => {
              const date = new Date(timestamp);
              return `${date.getHours()}:${date
                .getMinutes()
                .toString()
                .padStart(2, "0")}`;
            }}
          />
          <YAxis yAxisId="left" />
          {dataKeys.length > 1 && <YAxis yAxisId="right" orientation="right" />}
          <Tooltip
            labelFormatter={(label) => {
              const date = new Date(label);
              return `${date.toLocaleTimeString()}`;
            }}
          />
          {dataKeys.map((key, index) => (
            <DataComponent
              key={key}
              yAxisId={dataKeys.length > 1 && index === 1 ? "right" : "left"}
              type="monotone"
              dataKey={key}
              stroke={colors[index]}
              fill={colors[index]}
              strokeWidth={2}
              fillOpacity={0.3}
            />
          ))}
          {showUCLUL && (
            <>
              <ReferenceLine
                yAxisId="left"
                y={70}
                stroke="orange"
                strokeDasharray="3 3"
                label="UCL (70°C)"
              />
              <ReferenceLine
                yAxisId="left"
                y={80}
                stroke="red"
                strokeDasharray="3 3"
                label="UL (80°C)"
              />
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Night";
  };

  const currentTemperature =
    data.length > 0 ? data[data.length - 1].temperature : 50;
  const currentOilLevel = data.length > 0 ? data[data.length - 1].oilLevel : 50;

  return (
    <div className="mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <header className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <InfoCard
          title="Temperature"
          value={`${currentTemperature.toFixed(1)}°C`}
          icon={<Thermometer className="h-4 w-4" />}
          data={data}
          dataKey="temperature"
          color="#ff4d4f"
        />
        <InfoCard
          title="Power Consumption"
          value={
            data.length > 0
              ? `${data[data.length - 1].powerSupply.toFixed(2)} kW`
              : "N/A"
          }
          icon={<Zap className="h-4 w-4" />}
          data={data}
          dataKey="powerSupply"
          color="#1890ff"
        />
        <InfoCard
          title="Oil Level"
          value={`${currentOilLevel.toFixed(1)}%`}
          icon={<Droplet className="h-4 w-4" />}
          data={data}
          dataKey="oilLevel"
          color="#52c41a"
        />
        <InfoCard
          title="Oil Temperature"
          value={
            data.length > 0
              ? `${data[data.length - 1].oilTemperature.toFixed(1)}°C`
              : "N/A"
          }
          icon={<Thermometer className="h-4 w-4" />}
          data={data}
          dataKey="oilTemperature"
          color="#faad14"
        />
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Proactive Cooling System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between w-full items-center">
            <h1 className="text-2xl font-bold mb-4">
              Fan Speed: {fanSpeed} RPM
            </h1>
            <Fan
              className={`h-12 w-12 text-blue-500 ${
                fanSpeed > 0 ? "animate-spin" : ""
              }`}
              style={{ animationDuration: `${2000 / fanSpeed}s` }}
            />
          </div>
          <p className="text-muted-foreground mb-2">
            {fanSpeed > 0
              ? "The cooling system is actively maintaining optimal temperature levels."
              : "The cooling system is currently inactive as the temperature is below 70°C."}
          </p>
          <div className="bg-secondary p-4 rounded-md">
            <h4 className="font-semibold mb-2">System Status:</h4>
            <ul className="list-disc list-inside">
              <li>
                Temperature:{" "}
                {data.length > 0
                  ? data[data.length - 1].temperature < 70
                    ? "Normal"
                    : "Elevated"
                  : "N/A"}
              </li>
              <li>Oil Flow: Optimal</li>
              <li>Efficiency: 95%</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card >
        <CardHeader>
          <CardTitle>Live Readings</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-around  gap-4 p-4">
          <TemperatureThermometer temperature={currentTemperature} />
          <OilLevelChart oilLevel={currentOilLevel} />
        </CardContent>
      </Card>

      <hr className="my-6" />
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Analytics Charts</h1>
          <Select
            value={chartType}
            onValueChange={setChartType}
            className="bg-card"
          >
            <SelectTrigger className="w-[180px] mb-4 bg-card rounded-md border">
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent className="rounded-md">
              {chartTypes.map((type) => (
                <SelectItem key={type} value={type} className="rounded-md">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 grid-cols mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Analysis ({getTimeOfDay()})</CardTitle>
            </CardHeader>
            <CardContent>
              {renderChart(data, ["temperature"], ["#8884d8"], true, true)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Power Consumption & Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              {renderChart(
                data,
                ["powerSupply", "temperature"],
                ["#1890ff", "#ff4d4f"],
                false,
                true
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Oil Level</CardTitle>
            </CardHeader>
            <CardContent>
              {renderChart(data, ["oilLevel"], ["#52c41a"])}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Oil Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              {renderChart(data, ["oilTemperature"], ["#faad14"])}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, value, icon, data, dataKey, color }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="p-2 ">
        <div className="text-2xl font-bold">{value}</div>
        <ResponsiveContainer width="100%" height={80}>
          <AreaChart data={data}>
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fill={color}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
