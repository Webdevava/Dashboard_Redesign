import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function PowerConsumptionMeter() {
  const [power, setPower] = useState(50);
  const [isIncreasing, setIsIncreasing] = useState(true);

  useEffect(() => {
    const generateRandomPower = () => {
      const change = Math.floor(Math.random() * 6) - 3;
      const newPower = Math.max(0, Math.min(100, power + change));
      setIsIncreasing(newPower > power);
      return newPower;
    };

    const interval = setInterval(() => {
      setPower(generateRandomPower());
    }, 2000);
    return () => clearInterval(interval);
  }, [power]);

  return (
    <Card className="flex flex-col items-center justify-center w-fit p-4">
      <div className="relative w-64 h-96">
        <svg
          viewBox="0 0 100 200"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <clipPath id="powerClip">
              <path d="M60,0 L45,70 L80,85 L20,200 L35,120 L10,100 L60,0" />
            </clipPath>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
            </filter>
            <linearGradient
              id="powerGradient"
              x1="0%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#0D92F4" />
              <stop offset="100%" stopColor="#54C392" />
            </linearGradient>
          </defs>

          {/* Outer outline of the lightning bolt */}
          <path
            d="M60,0 L45,70 L80,85 L20,200 L35,120 L10,100 L60,0"
            className="fill-none stroke-gray-200 dark:stroke-gray-400"
            strokeWidth="3"
          />

          {/* Background lightning bolt */}
          <path
            d="M60,0 L45,70 L80,85 L20,200 L35,120 L10,100 L60,0"
            className="fill-gray-100 dark:fill-gray-800"
            filter="url(#shadow)"
          />

          {/* Power level fill */}
          <path
            d="M60,0 L45,70 L80,85 L20,200 L35,120 L10,100 L60,0"
            fill="url(#powerGradient)"
            clipPath="url(#powerClip)"
            style={{
              clipPath: `polygon(0 ${100 - power}%, 100% ${
                100 - power
              }%, 100% 100%, 0 100%)`,
              transition: "clip-path 1s ease-in-out",
            }}
            className={`${power > 70 ? "animate-pulse" : ""}`}
          />

          {/* Scale markers */}
          {[...Array(11)].map((_, i) => (
            <g
              key={i}
              transform={`translate(85, ${200 - i * 20})`}
              className="text-gray-600 dark:text-gray-300"
            >
              <line
                x1="0"
                y1="0"
                x2="5"
                y2="0"
                stroke="currentColor"
                strokeWidth="1"
              />
              <text
                x="10"
                y="4"
                fontSize="6"
                fill="currentColor"
                className="font-medium"
              >
                {i * 10}kW
              </text>
            </g>
          ))}

          {/* Shine effect */}
          <path
            d="M60,0 L45,70 L80,85 L20,200 L35,120 L10,100 L60,0"
            className="fill-white opacity-20"
          >
            <animate
              attributeName="opacity"
              values="0.2;0.3;0.2"
              dur="2s"
              repeatCount="indefinite"
            />
          </path>
        </svg>

        {/* Power reading bubble */}
        <div
          className={`absolute -right-4 px-4 py-2 bg-gray-800/90 rounded-xl backdrop-blur-sm transition-all duration-1000 border border-gray-700`}
          style={{
            bottom: `${power}%`,
            transform: "translateY(50%)",
          }}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isIncreasing ? "bg-yellow-400" : "bg-blue-400"
              } animate-pulse`}
            />
            <span
              className={`text-sm font-bold ${
                isIncreasing ? "text-yellow-400" : "text-blue-400"
              }`}
            >
              {power}kW
            </span>
          </div>
        </div>
      </div>

      {/* Status display */}
      <div className="mt-6 flex flex-col items-center gap-1">
        <div
          className={`text-lg font-bold ${
            power > 70
              ? "text-yellow-400"
              : power > 30
              ? "text-green-400"
              : "text-blue-400"
          }`}
        >
          {power > 70 ? "High" : power > 30 ? "Normal" : "Low"} Power Usage
        </div>
        <div
          className={`text-sm ${
            isIncreasing ? "text-yellow-400" : "text-blue-400"
          }`}
        >
          {isIncreasing ? "↑ Rising" : "↓ Falling"}
        </div>
      </div>
    </Card>
  );
}
