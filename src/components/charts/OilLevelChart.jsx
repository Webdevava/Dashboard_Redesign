"use client";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";

export default function OilLevelChart({ oilLevel: initialOilLevel }) {
  const [oilLevel, setOilLevel] = useState(initialOilLevel);
  const [isIncreasing, setIsIncreasing] = useState(true);

  useEffect(() => {
    setIsIncreasing(initialOilLevel > oilLevel);
    setOilLevel(initialOilLevel);
  }, [initialOilLevel]);

  return (
    <Card className="flex flex-col items-center justify-center w-fit p-4">
      <div className="relative w-64 h-96">
        {/* Metallic cylinder background */}
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-accent to-muted rounded-3xl opacity-90 backdrop-blur-sm shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent to-transparent opacity-20 rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-card to-transparent opacity-10 rounded-3xl"></div>
        </div>

        {/* Oil container */}
        <div className="absolute inset-x-4 inset-y-4 bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden borde">
          {/* Oil content */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-orange-400 to-yellow-600 transition-all duration-1000 ease-in-out"
            style={{ height: `${oilLevel}%` }}
          >
            {/* Enhanced wave effects */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 animate-[wave_3s_ease-in-out_infinite]">
                <div className="absolute inset-0 opacity-30 bg-orange-200 rounded-full scale-[1.7] blur-sm transform -translate-x-1/2 translate-y-1/2"></div>
                <div className="absolute inset-0 opacity-30 bg-yellow-100 rounded-full scale-[1.35] blur-sm transform translate-x-1/3 translate-y-1/3"></div>
              </div>
              <div className="absolute inset-0 animate-[wave_4s_ease-in-out_infinite_reverse]">
                <div className="absolute inset-0 opacity-20 bg-yellow-200 rounded-full scale-150 blur-sm"></div>
              </div>
            </div>

            {/* Bubble effects */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-100 rounded-full opacity-40 animate-bubble"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Level markers with labels */}
          {[...Array(11)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 flex items-center"
              style={{ bottom: `${i * 10}%` }}
            >
              <div className="w-4 h-px bg-gray-500" />
              {/* <span className="ml-2 text-xs text-gray-600">
                {10 + i * 10}%
              </span> */}
            </div>
          ))}

          {/* Animated level indicator inside container */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 px-4 py-1 bg-gray-900/80 rounded-full backdrop-blur-sm transition-all duration-1000 ${
              isIncreasing ? "text-green-400" : "text-red-400"
            }`}
            style={{
              bottom: `${oilLevel}%`,
              transform: `translateX(-50%) translateY(50%)`,
            }}
          >
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  isIncreasing ? "bg-green-400" : "bg-red-400"
                } animate-pulse`}
              />
              <span className="text-sm font-medium">{oilLevel}%</span>
            </div>
          </div>
        </div>

        {/* Metallic rim effects */}
        <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-secondary to-transparent rounded-t-3xl"></div>
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-accent to-transparent rounded-b-3xl"></div>
      </div>

      {/* Status indicator */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <div
          className={`text-lg font-bold ${
            oilLevel > 70
              ? "text-green-400"
              : oilLevel > 30
              ? "text-yellow-400"
              : "text-red-400"
          }`}
        >
          {oilLevel > 70
            ? "Optimal Level"
            : oilLevel > 30
            ? "Monitor Level"
            : "Low Level Warning"}
        </div>
        <div
          className={`text-sm ${
            isIncreasing ? "text-green-400" : "text-red-400"
          }`}
        >
          {isIncreasing ? "↑ Rising" : "↓ Falling"}
        </div>
      </div>
    </Card>
  );
}
