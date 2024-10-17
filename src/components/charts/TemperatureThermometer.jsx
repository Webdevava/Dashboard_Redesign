"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function TemperatureThermometer({
  temperature: initialTemperature,
}) {
  const [temperature, setTemperature] = useState(initialTemperature);
  const [isIncreasing, setIsIncreasing] = useState(true);

  useEffect(() => {
    setIsIncreasing(initialTemperature > temperature);
    setTemperature(initialTemperature);
  }, [initialTemperature]);

  return (
    <Card className="flex flex-col items-center justify-center w-fit p-4">
      <div className="relative w-64 h-96">
        {/* Main thermometer body */}
        <div className="absolute inset-x-0 top-8 bottom-0 mx-auto w-6 bg-gradient-to-br from-primary/25 to-white rounded-t-full overflow-hidden">
          {/* Glass shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"></div>

          {/* Temperature tube */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-[calc(100%-32px)] bg-white/10 rounded-t-full overflow-hidden">
            {/* Mercury column */}
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-600 to-red-400 transition-all duration-1000 ease-in-out"
              style={{ height: `${temperature}%` }}
            >
              {/* Mercury shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-300 to-transparent opacity-30"></div>
            </div>
          </div>

          {/* Temperature markings */}
          {[...Array(11)].map((_, i) => (
            <div
              key={i}
              className="absolute left-full flex items-center"
              style={{ bottom: `${i * 10}%`, transform: "translateY(50%)" }}
            >
              <div className="w-3 h-[2px] bg-gray-400 ml-1" />
              <span className="ml-2 text-xs text-foreground font-medium">
                {(10 - i) * 10}°
              </span>
            </div>
          ))}
        </div>

        {/* Thermometer bulb */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-24">
          {/* Outer glass */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-white rounded-full">
            {/* Glass shine */}
            <div className="absolute inset-0  bg-transparent opacity-30"></div>
          </div>

          {/* Mercury bulb */}
          <div className="absolute inset-[4px] rounded-full overflow-hidden">
            <div
              className={`absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 transition-all duration-1000 ${
                temperature > 70 ? "animate-pulse" : ""
              }`}
            >
              {/* Mercury shine effects */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-300 to-transparent opacity-40"></div>
                <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-red-200 rounded-full blur-sm opacity-30 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Temperature indicator bubble */}
        <div
          className={`absolute -right-0 px-4 py-2 bg-gray-800/90 rounded-xl backdrop-blur-sm transition-all duration-1000 border border-gray-700`}
          style={{
            bottom: `${temperature}%`,
            transform: "translateY(50%)",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isIncreasing ? "bg-red-400" : "bg-blue-400"
              } animate-pulse`}
            />
            <span
              className={`text-sm font-bold ${
                isIncreasing ? "text-red-400" : "text-blue-400"
              }`}
            >
              {temperature}°
            </span>
          </div>
        </div>
      </div>

      {/* Status display */}
      <div className="mt-6 flex flex-col items-center gap-1">
        <div
          className={`text-lg font-bold ${
            temperature > 70
              ? "text-red-400"
              : temperature > 30
              ? "text-yellow-400"
              : "text-blue-400"
          }`}
        >
          {temperature > 70 ? "High" : temperature > 30 ? "Normal" : "Low"}{" "}
          Temperature
        </div>
        <div
          className={`text-sm ${
            isIncreasing ? "text-red-400" : "text-blue-400"
          }`}
        >
          {isIncreasing ? "↑ Rising" : "↓ Falling"}
        </div>
      </div>
    </Card>
  );
}
