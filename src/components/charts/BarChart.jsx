// "use client";

// import { useState } from "react";
// import {
//   Bar,
//   Line,
//   ComposedChart,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
// } from "recharts";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Calendar, EllipsisVertical } from "lucide-react";

// export default function Component({ logoData, audioData }) {
//   const [activeChart, setActiveChart] = useState("all");
//   const [timeRange, setTimeRange] = useState("Day");

//   const chartData = logoData.map((logo, index) => {
//     const audioConfidence = audioData[index]?.confidence || 0;
//     const averageConfidence = (logo.confidence + audioConfidence) / 2;
//     return {
//       timestamp: new Date(logo.ts).toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//       logoConfidence: logo.confidence * 100,
//       audioConfidence: audioConfidence * 100,
//       averageConfidence: averageConfidence * 100,
//     };
//   });

//   const toggleChart = (chart) => {
//     setActiveChart(chart);
//   };

//   return (
//     <Card className="w-full shadow-inner shadow-accent/50 border p-0 rounded-xl">
//       <CardHeader className="flex flex-row items-center justify-between space-y-0  p-0pb-2">
//         <div className="flex space-x-2">
//           <Button
//             variant={activeChart === "all" ? "default" : "outline"}
//             size="sm"
//             onClick={() => toggleChart("all")}
//             className="bg-accent/65 hover:bg-accent "
//           >
//             All
//           </Button>
//           <Button
//             variant={activeChart === "audio" ? "default" : "outline"}
//             size="sm"
//             onClick={() => toggleChart("audio")}
//             className="bg-blue-600/25 text-blue-600 hover:bg-blue-600 rounded-full"
//           >
//             Audio
//           </Button>
//           <Button
//             variant={activeChart === "logo" ? "default" : "outline"}
//             size="sm"
//             onClick={() => toggleChart("logo")}
//             className="bg-purple-600/25 text-purple-600 hover:bg-purple-600 rounded-full"
//           >
//             Logo
//           </Button>
//           <Button
//             variant={activeChart === "accuracy" ? "default" : "outline"}
//             size="sm"
//             onClick={() => toggleChart("accuracy")}
//             className="bg-green-600/25 text-green-600 hover:bg-green-600 rounded-full"
//           >
//             Accuracy
//           </Button>
//         </div>
//         <div className="flex justify-between items-center gap-4 mb-4">
//           <div className="text-base flex gap-4 items-center text-primary font-bold bg-background rounded-full px-3 py-2">
//             OCTOBER 2024
//             <Calendar size={16}/>
//           </div>
//           <div className="flex space-x-2  rounded-full bg-background p-1">
//             {["Day", "Week", "Month"].map((range) => (
//               <Button
//                 key={range}
//                 variant={timeRange === range ? "default" : "outline"}
//                 size="sm"
//                 className="rounded-full border-none px-3 py-0"
//                 onClick={() => setTimeRange(range)}
//               >
//                 {range}
//               </Button>
//             ))}
//           </div>
//           <div className="bg-background rounded-full size-10 flex items-center justify-center">
//             <EllipsisVertical/>
//           </div>
//         </div>
//       </CardHeader>
//       <CardContent className="p-0">
//         <div className="pt-3 h-96">
//           <ResponsiveContainer width="100%" height="100%">
//             <ComposedChart data={chartData} barSize={8}>
//               <XAxis
//                 dataKey="timestamp"
//                 stroke="#888888"
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//               />
//               <YAxis
//                 yAxisId="left"
//                 stroke="#888888"
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//                 tickFormatter={(value) => `${value}%`}
//               />
//               <YAxis
//                 yAxisId="right"
//                 orientation="right"
//                 stroke="#888888"
//                 fontSize={12}
//                 tickLine={false}
//                 axisLine={false}
//                 tickFormatter={(value) => `${value}%`}
//               />
//               <Tooltip
//                 content={({ active, payload }) => {
//                   if (active && payload && payload.length) {
//                     return (
//                       <div className="rounded-lg border bg-background p-2 shadow-sm">
//                         <div className="grid grid-cols-2 gap-2">
//                           {(activeChart === "all" ||
//                             activeChart === "audio") && (
//                             <div className="flex flex-col">
//                               <span className="text-[0.70rem] uppercase text-muted-foreground">
//                                 Audio
//                               </span>
//                               <span className="font-bold text-muted-foreground">
//                                 {payload[0]?.value.toFixed(2)}%
//                               </span>
//                             </div>
//                           )}
//                           {(activeChart === "all" ||
//                             activeChart === "logo") && (
//                             <div className="flex flex-col">
//                               <span className="text-[0.70rem] uppercase text-muted-foreground">
//                                 Logo
//                               </span>
//                               <span className="font-bold text-muted-foreground">
//                                 {payload[1]?.value.toFixed(2)}%
//                               </span>
//                             </div>
//                           )}
//                           {(activeChart === "all" ||
//                             activeChart === "accuracy") && (
//                             <div className="flex flex-col col-span-2">
//                               <span className="text-[0.70rem] uppercase text-muted-foreground">
//                                 Accuracy
//                               </span>
//                               <span className="font-bold text-muted-foreground">
//                                 {payload[2]?.value.toFixed(2)}%
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   }
//                   return null;
//                 }}
//               />
//               <Legend />
//               {(activeChart === "all" || activeChart === "audio") && (
//                 <Bar
//                   yAxisId="left"
//                   dataKey="audioConfidence"
//                   fill="#3b82f6"
//                   radius={[4, 4, 0, 0]}
//                 />
//               )}
//               {(activeChart === "all" || activeChart === "logo") && (
//                 <Bar
//                   yAxisId="left"
//                   dataKey="logoConfidence"
//                   fill="#a855f7"
//                   radius={[4, 4, 0, 0]}
//                 />
//               )}
//               {(activeChart === "all" || activeChart === "accuracy") && (
//                 <Line
//                   yAxisId="right"
//                   type="monotone"
//                   dataKey="averageConfidence"
//                   stroke="#22c55e"
//                   strokeWidth={4}
//                   dot={{ fill: "#22c55e", r: 4 }}
//                 />
//               )}
//             </ComposedChart>
//           </ResponsiveContainer>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

'use client'
import React, { useState, useEffect } from "react";
import {
  Bar,
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BarChart = ({ logoData, audioData }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const processedData = logoData.map((logo, index) => ({
      timestamp: new Date(logo.TS).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      logoAccuracy: logo.accuracy * 100,
      audioAccuracy: 100, // Setting audio accuracy to 100% as per requirement
    }));
    setChartData(processedData);
  }, [logoData, audioData]);

  return (
    <Card className="w-full shadow-inner shadow-accent/50 border p-0 rounded-xl">
      <CardHeader className="p-4">
        <CardTitle>Logo and Audio Accuracy Chart</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <XAxis dataKey="timestamp" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Logo Accuracy
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[0]?.value.toFixed(2)}%
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Audio Accuracy
                            </span>
                            <span className="font-bold text-muted-foreground">
                              {payload[1]?.value.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar
                dataKey="logoAccuracy"
                fill="#8884d8"
                name="Logo Accuracy"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="audioAccuracy"
                fill="#82ca9d"
                name="Audio Accuracy"
                radius={[4, 4, 0, 0]}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarChart;