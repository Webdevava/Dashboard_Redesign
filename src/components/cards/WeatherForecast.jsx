"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sun, Cloud, CloudRain, Thermometer } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// This is a mock API call. Replace this with your actual API call.
const fetchWeatherData = async () => {
  // Simulating API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock data
  return {
    current: { temp: 22, condition: "Sunny" },
    forecast: [
      { day: "Mon", temp: 23, condition: "Cloudy" },
      { day: "Tue", temp: 25, condition: "Sunny" },
      { day: "Wed", temp: 21, condition: "Rainy" },
      { day: "Thu", temp: 20, condition: "Cloudy" },
      { day: "Fri", temp: 22, condition: "Sunny" },
      { day: "Sat", temp: 24, condition: "Sunny" },
      { day: "Sun", temp: 23, condition: "Cloudy" },
    ],
  };
};

const WeatherIcon = ({ condition }) => {
  switch (condition.toLowerCase()) {
    case "sunny":
      return <Sun className="h-6 w-6 text-yellow-400" />;
    case "cloudy":
      return <Cloud className="h-6 w-6 text-gray-400" />;
    case "rainy":
      return <CloudRain className="h-6 w-6 text-blue-400" />;
    default:
      return <Thermometer className="h-6 w-6 text-red-400" />;
  }
};

export default function WeatherForecast() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    fetchWeatherData().then(setWeatherData);
  }, []);

  if (!weatherData) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Weather Forecast</CardTitle>
          <CardDescription>Loading weather data...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full rounded-md" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Weather Forecast</span>
          <WeatherIcon condition={weatherData.current.condition} />
        </CardTitle>
        <CardDescription>Today and next 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-2xl font-bold">Today</h3>
          <p className="text-4xl font-bold">{weatherData.current.temp}°C</p>
          <p className="text-muted-foreground">
            {weatherData.current.condition}
          </p>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="text-center">
              <p className="font-medium">{day.day}</p>
              <WeatherIcon condition={day.condition} />
              <p className="text-sm">{day.temp}°C</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
