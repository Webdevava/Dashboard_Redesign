import * as React from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const generateRandomTemperature = (base, range = 10) => {
  return base + Math.random() * range - range / 2;
};

const generateHourlyData = (baseTemp, startHour, endHour) => {
  return Array.from({ length: endHour - startHour + 1 }, (_, index) => {
    const hour = startHour + index;
    const temp = generateRandomTemperature(baseTemp);
    return { hour, temperature: temp };
  });
};

// Generate data for all periods
const morningData = generateHourlyData(60, 6, 13);
const afternoonData = generateHourlyData(70, 14, 21);
const nightData = generateHourlyData(55, 22, 29);
const earlyMorningData = [
  { hour: 30, temperature: generateRandomTemperature(55) },
]; // Add 6 AM next day

// Combine all data for the full 24-hour cycle
const fullDayData = [
  ...morningData,
  ...afternoonData,
  ...nightData,
  ...earlyMorningData,
];

// Generate prediction data with slight variations
const generatePredictionData = () => {
  return fullDayData.map((entry) => ({
    hour: entry.hour,
    temperature: entry.temperature,
    prediction: entry.temperature + generateRandomTemperature(0, 5), // Small variation for prediction
  }));
};

const predictionData = generatePredictionData();

const chartConfig = {
  morning: {
    color: "hsl(var(--chart-1))",
    data: morningData,
  },
  afternoon: {
    color: "hsl(var(--chart-2))",
    data: afternoonData,
  },
  night: {
    color: "hsl(var(--chart-3))",
    data: nightData,
  },
};

const CustomizedDot = (props) => {
  const { cx, cy, payload } = props;
  const isOutOfControl = payload.temperature > 70;

  let period = "morning";
  const hour = payload.hour;

  if (hour >= 14 && hour < 22) {
    period = "afternoon";
  } else if (hour >= 22 || hour < 6) {
    period = "night";
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill={isOutOfControl ? "red" : chartConfig[period].color}
    />
  );
};

export default function TransformerPredictionChart() {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Get current hour in the 6 AM to 6 AM format
  const getCurrentHour = () => {
    let hour = currentTime.getHours();
    // Convert to our 6 AM - 6 AM (next day) format
    if (hour < 6) {
      hour += 24;
    }
    return hour;
  };

  // Get real-time data up to current hour
  const getRealTimeData = React.useMemo(() => {
    const currentHour = getCurrentHour();
    return fullDayData.filter((entry) => entry.hour <= currentHour);
  }, [currentTime]);

  // Format hour for display
  const formatHour = (hour) => {
    // Adjust hours to show 6 AM to 6 AM cycle
    const adjustedHour = hour >= 30 ? hour - 24 : hour;
    return `${adjustedHour}:00`;
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="border-b p-6">
          <CardTitle>Transformer Temperature - Prediction</CardTitle>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                domain={[6, 30]} // Show from 6 AM to 6 AM next day
                type="number"
                tickFormatter={formatHour}
                ticks={[6, 10, 14, 18, 22, 26, 30]} // Custom ticks for better readability
              />
              <YAxis
                label={{
                  value: "Temperature (°C)",
                  angle: -90,
                  position: "insideLeft",
                }}
                domain={[40, 100]}
              />
              <Tooltip
                labelFormatter={formatHour}
                formatter={(value, name) => [
                  `${value.toFixed(1)}°C`,
                  name === "prediction"
                    ? "Predicted Temperature"
                    : "Current Temperature",
                ]}
              />
              <ReferenceLine
                y={70}
                label="UCL"
                stroke="red"
                strokeDasharray="3 3"
              />
              <ReferenceLine
                y={80}
                label="UL"
                stroke="orange"
                strokeDasharray="3 3"
              />
              <ReferenceLine
                x={14}
                stroke="gray"
                strokeDasharray="3 3"
                label={{ value: "Afternoon", position: "top" }}
              />
              <ReferenceLine
                x={22}
                stroke="gray"
                strokeDasharray="3 3"
                label={{ value: "Night", position: "top" }}
              />
              {/* Real-time temperature line */}
              <Line
                type="monotone"
                data={getRealTimeData}
                dataKey="temperature"
                stroke={
                  chartConfig[
                    currentTime.getHours() >= 6 && currentTime.getHours() < 14
                      ? "morning"
                      : currentTime.getHours() >= 14 &&
                        currentTime.getHours() < 22
                      ? "afternoon"
                      : "night"
                  ].color
                }
                dot={<CustomizedDot />}
                strokeWidth={3}
              />
              {/* Prediction line */}
              <Line
                type="monotone"
                data={predictionData}
                dataKey="prediction"
                stroke="green"
                strokeWidth={2}
                strokeDasharray="4 2"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
