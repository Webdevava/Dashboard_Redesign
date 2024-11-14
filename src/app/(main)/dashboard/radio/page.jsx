'use client'
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CHANNELS = [
  "Radio City",
  "Radio Mirchi",
  "Big FM",
  "Red FM",
  "Fever FM",

  //   "Ishq FM",
  //   "Radio One",
  //   "AIR FM Gold",
  //   "Radio Indigo",
  //   "All India Radio",
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const MINUTES_PER_DAY = 30; // 30 minutes per day shown

const ADS = [
  {
    name: "Adidas",
    industry: "Sportswear",
    color: "bg-green-500/20",
    borderColor: "border-green-500",
    hoverColor: "hover:bg-green-500/30",
    textColor: "text-green-700",
    image: "/images/ads/adidas.jpg",
  },
  {
    name: "Jeep",
    industry: "Automotive",
    color: "bg-yellow-500/20",
    borderColor: "border-yellow-500",
    hoverColor: "hover:bg-yellow-500/30",
    textColor: "text-yellow-700",
    image: "/images/ads/jeep.jpg",
  },
  {
    name: "Qatar Airways",
    industry: "Airlines",
    color: "bg-orange-500/20",
    borderColor: "border-orange-500",
    hoverColor: "hover:bg-orange-500/30",
    textColor: "text-orange-700",
    image: "/images/ads/qatar-airways.png",
  },
  {
    name: "Coca Cola",
    industry: "Beverages",
    color: "bg-red-500/20",
    borderColor: "border-red-500",
    hoverColor: "hover:bg-red-500/30",
    textColor: "text-red-700",
    image: "/images/ads/coca-cola.jpg",
  },
  {
    name: "Amazon",
    industry: "E-commerce",
    color: "bg-blue-500/20",
    borderColor: "border-blue-500",
    hoverColor: "hover:bg-blue-500/30",
    textColor: "text-blue-700",
    image: "/images/ads/amazon.jpg",
  },
];

function generateWeeklyContent() {
  const content = [];
  CHANNELS.forEach((channel) => {
    DAYS.forEach((day, dayIndex) => {
      let currentMinute = 0;
      while (currentMinute < MINUTES_PER_DAY) {
        if (Math.random() > 0.5) {
          // 50% chance of ad placement for more frequent ads
          const duration = [1, 2, 3][Math.floor(Math.random() * 3)]; // Shorter durations for more ads
          const ad = ADS[Math.floor(Math.random() * ADS.length)];
          content.push({
            id: `${channel}-${day}-ad-${currentMinute}`,
            type: "ad",
            name: ad.name,
            duration,
            startMinute: currentMinute,
            day: dayIndex,
            channel,
            image: ad.image,
            industry: ad.industry,
            color: ad.color,
            borderColor: ad.borderColor,
            hoverColor: ad.hoverColor,
            textColor: ad.textColor,
          });
          currentMinute += duration;
        } else {
          const duration = Math.floor(Math.random() * 5) + 3; // 3-8 minutes
          content.push({
            id: `${channel}-${day}-content-${currentMinute}`,
            type: "content",
            name: "Radio Show",
            duration,
            startMinute: currentMinute,
            day: dayIndex,
            channel,
            description: `${channel} Radio Show`,
          });
          currentMinute += duration;
        }
      }
    });
  });
  return content;
}

export default function RadioTimeline() {
  const [content, setContent] = useState([]);
  const pixelsPerMinute = 20; // Adjust this value to fit your screen

  useEffect(() => {
    setContent(generateWeeklyContent());
  }, []);

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Weekly Radio Advertisement Timeline
        </h1>

        {/* Days of the week header */}
        <div className="ml-[200px] grid grid-cols-7 gap-4 mb-2 text-sm font-medium">
          {DAYS.map((day) => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Channels and timeline */}
        <div className="relative">
          {CHANNELS.map((channel) => (
            <div key={channel} className="flex items-center mb-4">
              {/* Channel name */}
              <div className="w-[200px] pr-4 font-medium flex-shrink-0 flex items-center space-x-2">
                <img
                  src={`/images/logos/${channel
                    .toLowerCase()
                    .replace(" ", "-")}.png`}
                  alt={`${channel} logo`}
                  className="h-6 w-6"
                />
                <span>{channel}</span>
              </div>

              {/* Timeline grid */}
              <div className="flex-grow grid grid-cols-7 gap-4">
                {DAYS.map((day, dayIndex) => (
                  <div
                    key={`${channel}-${day}`}
                    className="relative h-16 bg-muted rounded-sm"
                  >
                    {content
                      .filter(
                        (item) =>
                          item.channel === channel && item.day === dayIndex
                      )
                      .map((item) => (
                        <TooltipProvider key={item.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className={`absolute top-0 bottom-0 rounded-sm overflow-hidden transition-colors
                                  ${
                                    item.type === "ad"
                                      ? `${item.color} border ${item.borderColor} ${item.hoverColor}`
                                      : "bg-primary/20 border border-primary hover:bg-primary/30"
                                  }`}
                                style={{
                                  left: `${
                                    (item.startMinute / MINUTES_PER_DAY) * 100
                                  }%`,
                                  width: `${
                                    (item.duration / MINUTES_PER_DAY) * 100
                                  }%`,
                                }}
                              >
                                {item.type === "ad" && (
                                  <div className="p-1 text-[10px] truncate">
                                    {item.name}
                                  </div>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              {item.type === "ad" ? (
                                <div className="flex space-x-4">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded"
                                  />
                                  <div>
                                    <h3 className="font-bold">{item.name}</h3>
                                    <p>Industry: {item.industry}</p>
                                    <p>Duration: {item.duration} mins</p>
                                    <p>Time: {formatTime(item.startMinute)}</p>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <h3 className="font-bold">{item.name}</h3>
                                  <p>{item.description}</p>
                                  <p>Duration: {item.duration} mins</p>
                                  <p>Time: {formatTime(item.startMinute)}</p>
                                </div>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
