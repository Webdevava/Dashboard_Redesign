"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ThermometerIcon,
  DropletIcon,
  ZapIcon,
  Fan,
  AlertTriangle,
} from "lucide-react";
import { keyframes } from "@emotion/react";
import { toast } from "sonner";
import { motion } from "framer-motion";

// Consolidated data generator
const generateData = () => {
  let temperature = 68;
  let powerSupply = 11;
  let oilLevel = 80;
  let oilTemperature = 69;
  let moisture = 1.5;
  let pressure = 100;

  const limits = {
    temperature: { upper: 75, lower: 65 },
    powerSupply: { upper: 17.6, lower: 4.4 },
    oilLevel: { upper: 90, lower: 30 },
    oilTemperature: { upper: 90, lower: 60 },
    moisture: { upper: 3, lower: 0 },
    pressure: { upper: 120, lower: 80 },
  };

  let trends = {
    temperature: false,
    powerSupply: false,
    oilLevel: false,
    oilTemperature: false,
  };

  return (dataCounter) => {
    const newTimestamp = new Date().toISOString();

    Object.keys(trends).forEach((key) => {
      if (trends[key]) {
        eval(`${key} += 0.4`);
        if (eval(key) >= limits[key].upper) {
          trends[key] = false;
        }
      } else if (
        (key === "temperature" && dataCounter >= 20 && dataCounter < 28) ||
        (key === "powerSupply" && dataCounter >= 50 && dataCounter < 56) ||
        (key === "oilLevel" && dataCounter >= 90 && dataCounter < 96) ||
        (key === "oilTemperature" && dataCounter >= 130 && dataCounter < 136)
      ) {
        eval(`${key} += 0.5`);
        if (
          (key === "temperature" && dataCounter === 27) ||
          (key === "powerSupply" && dataCounter === 55) ||
          (key === "oilLevel" && dataCounter === 95) ||
          (key === "oilTemperature" && dataCounter === 135)
        ) {
          trends[key] = true;
        }
      } else {
        eval(`${key} += (Math.random() - 0.5) * 0.2`);
      }
    });

    oilLevel -= 0.25; // Gradually decrease oil level
    moisture += (Math.random() - 0.5) * 0.1;
    pressure += (Math.random() - 0.5) * 2;

    // Ensure values are within bounds
    Object.keys(limits).forEach((key) => {
      eval(
        `${key} = Math.max(limits[key].lower, Math.min(${key}, limits[key].upper))`
      );
    });

    return {
      time: newTimestamp,
      temperature,
      powerSupply,
      oilLevel,
      oilTemperature,
      moisture,
      pressure,
    };
  };
};

const spinAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const TransformerDashboard = () => {
  const [liveData, setLiveData] = useState({
    temperature: [],
    oilLevel: [],
    moisture: [],
    oilTemperature: [],
    powerConsumption: [],
    pressure: [],
  });

  const [realtimeData, setRealtimeData] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [isCoolingActive, setIsCoolingActive] = useState(false);

  const dataGenerator = React.useRef(generateData());
  const dataCounter = React.useRef(0);

  const showErrorToast = (message, description) => {
    toast.error(message, {
      description: description,
      style: { background: "rgb(220, 38, 38)", color: "white", border: "none" },
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = dataGenerator.current(dataCounter.current);
      dataCounter.current += 1;

      setLiveData((prev) => ({
        temperature: [
          ...prev.temperature.slice(-99),
          { time: newData.time, value: newData.temperature },
        ],
        oilLevel: [
          ...prev.oilLevel.slice(-24),
          { time: newData.time, value: newData.oilLevel },
        ],
        moisture: [
          ...prev.moisture.slice(-99),
          { time: newData.time, value: newData.moisture },
        ],
        oilTemperature: [
          ...prev.oilTemperature.slice(-24),
          { time: newData.time, value: newData.oilTemperature },
        ],
        powerConsumption: [
          ...prev.powerConsumption.slice(-99),
          { time: newData.time, value: newData.powerSupply * 20 },
        ],
        pressure: [
          ...prev.pressure.slice(-99),
          { time: newData.time, value: newData.pressure },
        ],
      }));

      setRealtimeData((prev) => [
        ...prev.slice(-59),
        {
          time: new Date(newData.time).getTime(),
          powerConsumption: newData.powerSupply * 20,
          temperature: newData.temperature,
        },
      ]);

      setPredictions((prev) => [
        ...prev.slice(1),
        {
          time: new Date(
            new Date(newData.time).getTime() + 3600000
          ).toISOString(),
          actual: newData.powerSupply * 50,
          predicted: newData.powerSupply * 50 + (Math.random() - 0.5) * 20,
          oilTemp: newData.oilTemperature,
          predictedOilTemp: newData.oilTemperature + (Math.random() - 0.5) * 5,
        },
      ]);

      if (newData.temperature > 70 && !isCoolingActive) {
        showErrorToast(
          "High Temperature Alert",
          `Temperature has reached ${newData.temperature.toFixed(2)}°C`
        );
        setIsCoolingActive(true);
      } else if (newData.temperature < 68 && isCoolingActive) {
        setIsCoolingActive(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isCoolingActive]);

  const fanSpeed = Math.min(
    100,
    Math.max(
      0,
      (liveData.temperature[liveData.temperature.length - 1]?.value - 70) *
        10 || 0
    )
  );

  return (
    <div className="flex flex-col gap-6 text-foreground min-h-screen p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LiveChart
            data={liveData.temperature}
            title="Transformer Temperature"
            color="hsl(var(--primary))"
            icon={<ThermometerIcon className="h-4 w-4" />}
            unit="°C"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <LiveChart
            data={liveData.oilLevel}
            title="Oil Level"
            color="hsl(var(--secondary))"
            icon={<DropletIcon className="h-4 w-4" />}
            unit="%"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <LiveChart
            data={liveData.powerConsumption}
            title="Power Consumption"
            color="hsl(var(--accent))"
            icon={<ZapIcon className="h-4 w-4" />}
            unit="kW"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="col-span-1 md:col-span-2 lg:col-span-3"
        >
          <Card className="bg-card shadow-lg">
            <CardHeader>
              <CardTitle>Proactive Action: Cooling System</CardTitle>
            </CardHeader>
            <CardContent>
              <CoolingSystem
                fanSpeed={fanSpeed}
                isCoolingActive={isCoolingActive}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="col-span-1 md:col-span-2 lg:col-span-3"
        >
          <RealtimeChart data={realtimeData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="col-span-1 md:col-span-2 lg:col-span-3"
        >
          <Card className="bg-card shadow-lg">
            <CardHeader>
              <CardTitle>Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <TransformerPredictionChart data={predictions} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="col-span-1 md:col-span-2 lg:col-span-3"
        >
          <Card className="bg-card shadow-lg">
            <CardHeader>
              <CardTitle>Oil Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              <OilTemperatureChart
                data={liveData.oilTemperature}
                showErrorToast={showErrorToast}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="bg-card shadow-lg">
            <CardHeader>
              <CardTitle>Moisture Content</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={liveData.moisture}>
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--secondary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="col-span-1 md:col-span-2"
        >
          <Card className="bg-card shadow-lg">
            <CardHeader>
              <CardTitle>Oil Level</CardTitle>
            </CardHeader>
            <CardContent>
              <OilLevelChart
                data={liveData.oilLevel}
                showErrorToast={showErrorToast}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TransformerDashboard;

function LiveChart({ data, title, color, icon, unit }) {
  const currentValue = data[data.length - 1]?.value || 0;
  const previousValue = data[data.length - 2]?.value || 0;
  const change = currentValue - previousValue;
  const changePercent =
    previousValue !== 0 ? (change / previousValue) * 100 : 0;

  return (
    <Card className="bg-card shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {currentValue.toFixed(2)}
          {unit}
        </div>
        <p className="text-xs text-muted-foreground">
          {change >= 0 ? (
            <ArrowUpIcon className="h-4 w-4 text-green-500 inline" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-red-500 inline" />
          )}
          <span>{Math.abs(changePercent).toFixed(2)}%</span>
        </p>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function CoolingSystem({ fanSpeed, isCoolingActive }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold">{fanSpeed.toFixed(1)}%</p>
        <p className="text-sm text-muted-foreground">Current Fan Speed</p>
      </div>
      <div className="w-64 h-4 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${fanSpeed}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <div>
        <p className="text-sm font-medium">Status:</p>
        <p
          className={`text-sm ${
            fanSpeed > 80 ? "text-destructive" : "text-primary"
          }`}
        >
          {fanSpeed > 80 ? "Critical" : fanSpeed > 50 ? "Active" : "Normal"}
        </p>
      </div>
      <Fan
        className={`h-8 w-8 ${
          isCoolingActive ? "text-primary" : "text-muted-foreground"
        }`}
        style={{
          animation: isCoolingActive
            ? `${spinAnimation} 2s linear infinite`
            : "none",
        }}
      />
    </div>
  );
}

const RealtimeChart = ({ data }) => (
  <Card className="bg-card mb-4">
    <CardHeader>
      <CardTitle>Real-Time Power Consumption and Temperature</CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <XAxis
            dataKey="time"
            tickFormatter={(unixTime) =>
              new Date(unixTime).toLocaleTimeString()
            }
          />
          <YAxis
            yAxisId="power"
            domain={[200, 600]}
            label={{
              value: "Power Consumption (kW)",
              angle: -90,
              position: "insideLeft",
            }}
          />
          <YAxis
            yAxisId="temp"
            orientation="right"
            domain={[40, 100]}
            label={{
              value: "Temperature (°C)",
              angle: 90,
              position: "insideRight",
            }}
          />
          <Tooltip
            labelFormatter={(value) => new Date(value).toLocaleString()}
            formatter={(value, name) => [value.toFixed(2), name]}
          />
          <Legend />
          <ReferenceLine
            yAxisId="power"
            y={480}
            stroke="orange"
            strokeDasharray="3 3"
            label="Power UCL (480kW)"
          />
          <ReferenceLine
            yAxisId="power"
            y={300}
            stroke="orange"
            strokeDasharray="3 3"
            label="Power LCL (300kW)"
          />
          <ReferenceLine
            yAxisId="temp"
            y={80}
            stroke="red"
            strokeDasharray="3 3"
            label="Temp UCL (80°C)"
          />
          <ReferenceLine
            yAxisId="temp"
            y={60}
            stroke="red"
            strokeDasharray="3 3"
            label="Temp LCL (60°C)"
          />
          <Line
            yAxisId="power"
            type="monotone"
            dataKey="powerConsumption"
            name="Power Consumption"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="temperature"
            name="Temperature"
            stroke="#347928"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

const TransformerPredictionChart = ({ data }) => {
  const [activeTab, setActiveTab] = useState("morning");
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (data.length === 0) {
      setChartData({});
      return;
    }

    const currentTime = new Date();
    const dayStart = new Date(currentTime);
    dayStart.setHours(0, 0, 0, 0);

    const processPredictionData = (startTime, endTime) => {
      // Ensure we always start processing from the defined start time
      let processStart = new Date(startTime);
      let processEnd = new Date(endTime);

      const filteredData = data.filter(
        (item) =>
          new Date(item.time) >= processStart &&
          new Date(item.time) < processEnd
      );

      const processedData = filteredData.map((item) => {
        const itemTime = new Date(item.time);
        return {
          time: itemTime.getTime(),
          temperature: item.oilTemp,
          prediction: item.predictedOilTemp,
        };
      });

      // If no data points exist, start from the period start time
      const lastDataPoint = processedData[processedData.length - 1] || {
        time: processStart.getTime(),
        temperature: 70,
        prediction: 70,
      };

      // Generate prediction points until the period end time
      const extendedData = [
        ...processedData,
        ...Array(Math.ceil((processEnd - lastDataPoint.time) / 1800000))
          .fill()
          .map((_, i) => ({
            time: lastDataPoint.time + (i + 1) * 1800000,
            temperature: null,
            prediction: lastDataPoint.prediction + (Math.random() - 0.5) * 5,
          })),
      ];

      // Fill in any gaps at the start of the period
      const initialData = [];
      if (
        processedData.length === 0 ||
        processedData[0]?.time > processStart.getTime()
      ) {
        const startPoints = Math.ceil(
          (processedData[0]?.time ||
            processEnd.getTime() - processStart.getTime()) / 1800000
        );
        for (let i = 0; i < startPoints; i++) {
          initialData.push({
            time: processStart.getTime() + i * 1800000,
            temperature: null,
            prediction: 70 + (Math.random() - 0.5) * 5,
          });
        }
      }

      return [...initialData, ...extendedData];
    };

    const morningStart = new Date(dayStart);
    morningStart.setHours(6, 0, 0, 0);
    const afternoonStart = new Date(dayStart);
    afternoonStart.setHours(14, 0, 0, 0);
    const nightStart = new Date(dayStart);
    nightStart.setHours(22, 0, 0, 0);
    const nextDayMorningStart = new Date(dayStart.getTime() + 86400000);
    nextDayMorningStart.setHours(6, 0, 0, 0);

    const morningData = processPredictionData(morningStart, afternoonStart);
    const afternoonData = processPredictionData(afternoonStart, nightStart);
    const nightData = processPredictionData(nightStart, nextDayMorningStart);

    // Adjust afternoon data to reflect increased heat
    const adjustedAfternoonData = afternoonData.map((item) => ({
      ...item,
      prediction: item.prediction + (Math.random() * 10 + 2),
    }));

    setChartData({
      morning: morningData,
      afternoon: adjustedAfternoonData,
      night: nightData,
    });
  }, [data]);

  const formatHour = (time) => {
    const date = new Date(time);
    return `${date.getHours()}:00`;
  };

  const CustomizedDot = (props) => {
    const { cx, cy, payload } = props;
    const isOutOfControl = payload.temperature > 70;

    let period = activeTab;

    const getColor = () => {
      switch (period) {
        case "morning":
          return "hsl(var(--chart-1))";
        case "afternoon":
          return "hsl(var(--chart-2))";
        case "night":
          return "hsl(var(--chart-3))";
        default:
          return "hsl(var(--chart-1))";
      }
    };

    return payload.temperature ? (
      <circle
        cx={cx}
        cy={cy}
        r={5}
        fill={isOutOfControl ? "red" : getColor()}
      />
    ) : null;
  };

  return (
    <Card className="bg-card mb-4">
      <CardHeader>
        <CardTitle>
          {activeTab === "morning" && "Morning Temperature (06:00 - 14:00)"}
          {activeTab === "afternoon" && "Afternoon Temperature (14:00 - 22:00)"}
          {activeTab === "night" && "Night Temperature (22:00 - 06:00)"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 border p-1 flex justify-between gap-2 rounded w-fit">
          <button
            onClick={() => setActiveTab("morning")}
            className={`mr-2 ${
              activeTab === "morning"
                ? "font-bold bg-primary px-2 py-1 text-white rounded"
                : ""
            }`}
          >
            Morning
          </button>
          <button
            onClick={() => setActiveTab("afternoon")}
            className={`mr-2 ${
              activeTab === "afternoon"
                ? "font-bold bg-primary px-2 py-1 text-white rounded"
                : ""
            }`}
          >
            Afternoon
          </button>
          <button
            onClick={() => setActiveTab("night")}
            className={`mr-2 ${
              activeTab === "night"
                ? "font-bold bg-primary px-2 py-1 text-white rounded"
                : ""
            }`}
          >
            Night
          </button>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart
            data={chartData[activeTab]}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={formatHour}
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
              labelFormatter={(value) => formatHour(value)}
              formatter={(value, name) => [
                `${value?.toFixed(1)}°C`,
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
            <Line
              type="monotone"
              dataKey="temperature"
              stroke={
                activeTab === "morning"
                  ? "hsl(var(--chart-1))"
                  : activeTab === "afternoon"
                  ? "hsl(var(--chart-2))"
                  : "hsl(var(--chart-3))"
              }
              dot={<CustomizedDot />}
              strokeWidth={3}
            />
            <Line
              type="monotone"
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
  );
};

const OilTemperatureChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data.length === 0) {
      setChartData([]);
      return;
    }

    const processedData = data.map((item) => ({
      time: new Date(item.time),
      realTemp: item.value,
      predictedTemp: item.value + (Math.random() - 0.5) * 5,
    }));

    const lastDataPoint = processedData[processedData.length - 1];
    const lastTime = lastDataPoint.time;

    const extendedData = [
      ...processedData,
      ...Array(5)
        .fill()
        .map((_, i) => {
          const newTime = new Date(lastTime.getTime() + (i + 1) * 15000);
          return {
            time: newTime,
            realTemp: null,
            predictedTemp:
              lastDataPoint.predictedTemp + (Math.random() - 0.5) * 5,
          };
        }),
    ];

    setChartData(extendedData);
  }, [data]);

  if (chartData.length === 0) {
    return <div>No data available</div>;
  }

  const formatTime = (time) => {
    if (!(time instanceof Date)) return "";
    return time.toLocaleTimeString();
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorRealTemp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4285F4" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#4285F4" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPredictedTemp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FCCD2A" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#FCCD2A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="time"
          tickFormatter={formatTime}
          type="category"
          scale="time"
          domain={["dataMin", "dataMax"]}
        />
        <YAxis domain={[0, 100]} />
        <Tooltip
          labelFormatter={formatTime}
          formatter={(value, name) => [value.toFixed(2), name]}
        />
        <Legend />
        <ReferenceLine
          y={70}
          label="UCL (70°C)"
          stroke="orange"
          strokeDasharray="3 3"
        />
        <ReferenceLine
          y={80}
          label="UL (80°C)"
          stroke="red"
          strokeDasharray="3 3"
        />
        <Area
          type="monotone"
          dataKey="predictedTemp"
          stroke="#FCCD2A"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorPredictedTemp)"
          name="Predicted Temp"
          strokeDasharray="5 5"
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="realTemp"
          stroke="#4285F4"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorRealTemp)"
          name="Real Temp"
          dot={(props) => {
            const { cx, cy, payload } = props;
            if (payload.realTemp > 70) {
              return (
                <g>
                  <circle cx={cx} cy={cy} r={4} fill="red" />
                  <AlertTriangle x={cx - 8} y={cy - 8} size={16} color="red" />
                </g>
              );
            }
            return null;
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const OilLevelChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data.length === 0) {
      setChartData([]);
      return;
    }

    const processedData = data.map((item) => ({
      time: new Date(item.time).toLocaleString(),
      realLevel: item.value,
      predictedLevel: item.value + (Math.random() - 0.5) * 5,
    }));

    const lastDataPoint = processedData[processedData.length - 1];

    const extendedData = [
      ...processedData,
      ...Array(5)
        .fill()
        .map((_, i) => ({
          time: new Date(
            new Date(lastDataPoint.time).getTime() + (i + 1) * 60000
          ).toLocaleString(),
          realLevel: null,
          predictedLevel:
            lastDataPoint.predictedLevel + (Math.random() - 0.5) * 5,
        })),
    ];

    setChartData(extendedData);
  }, [data]);

  if (chartData.length === 0) {
    return <div>No data available</div>;
  }

  const LCL = 30;
  const LL = 15;

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorRealLevel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPredictedLevel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FCCD2A" stopOpacity={0.5} />
            <stop offset="95%" stopColor="#FCCD2A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="time" />
        <YAxis domain={[0, 100]} />
        <Tooltip
          labelFormatter={(label) => new Date(label).toLocaleString()}
          formatter={(value, name) => [value.toFixed(2), name]}
        />
        <Legend />
        <ReferenceLine
          y={LCL}
          label="LCL (30%)"
          stroke="orange"
          strokeDasharray="3 3"
        />
        <ReferenceLine
          y={LL}
          label="LL (15%)"
          stroke="red"
          strokeDasharray="3 3"
        />
        <Area
          type="monotone"
          dataKey="realLevel"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorRealLevel)"
          name="Real Oil Level"
        />
        <Area
          type="monotone"
          dataKey="predictedLevel"
          stroke="#FCCD2A"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorPredictedLevel)"
          name="Predicted Oil Level"
          strokeDasharray="5 5"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="realLevel"
          stroke="#82ca9d"
          dot={(props) => {
            const { cx, cy, payload } = props;
            if (payload.realLevel < LCL) {
              return <circle cx={cx} cy={cy} r={4} fill="red" stroke="none" />;
            }
            return null;
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
