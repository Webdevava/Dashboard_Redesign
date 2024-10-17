"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import BarChart from "@/components/charts/BarChart";
import { ArrowLeft, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://apmapis.webdevava.live/api";

const DevicePage = () => {
  const { deviceId } = useParams();
  const [logoData, setLogoData] = useState([]);
  const [audioData, setAudioData] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = (data) => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  };

  const fetchData = async () => {
    try {
      const logoResponse = await fetch(
        `${API_URL}/events/logo?deviceId=${deviceId}`
      );
      const logoResult = await logoResponse.json();
      setLogoData(logoResult.data);

      const afpResponse = await fetch(
        `${API_URL}/events/afp?deviceId=${deviceId}`
      );
      const afpResult = await afpResponse.json();
      setAudioData(afpResult.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (deviceId) {
      fetchData(); // Initial fetch

      const intervalId = setInterval(() => {
        fetchData();
      }, 5000); // Fetch every 5 seconds

      // Cleanup function to clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [deviceId]);

  const renderTable = (data, type) => (
    <Card className="w-full rounded-xl p-0">
      <CardHeader className="p-2 ">
        <CardTitle className="text-lg ">
          {type === "logo" ? "Logo Detection Output" : "Audio Detection Output"}
        </CardTitle>
      </CardHeader>
      <CardContent className="rounded-2xl p-2 ">
        <div className="rounded-2xl p-0 ">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10  ">
              <TableRow className=" flex items-center justify-between border rounded-t-2xl bg-accent">
                <TableHead className="w-[180px] h-full flex items-center justify-center">
                  <Button variant="ghost" onClick={() => handleSort("TS")}>
                    Timestamp
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="h-full flex w-full items-center justify-center">
                  Detection
                </TableHead>
                {type === "logo" && (
                  <TableHead className="text-right h-full flex items-center justify-center">
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("confidence")}
                    >
                      Confidence
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
          </Table>
          <ScrollArea className="h-[40vh]">
            <Table>
              <TableBody className="border rounded-b-2xl">
                {sortedData(data).map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {new Date(item.TS * 1000).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="relative w-10 h-10 ">
                          <Image
                            src={`https://apm-logo-bucket.s3.ap-south-1.amazonaws.com/${item.channel_id}.png`}
                            alt={item.logoDetection}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-full"
                          />
                        </div>
                        {item.channel_id}
                      </div>
                    </TableCell>
                    {type === "logo" && (
                      <TableCell className="text-right ">
                        <Badge
                          className={`${
                            item.accuracy > 0.8
                              ? "bg-green-800/75 border-green-800 " // Success (confidence > 0.8)
                              : item.accuracy > 0.6
                              ? "bg-yellow-500/75 border-yellow-500" // Warning (confidence > 0.6)
                              : "bg-red-800/75 border-red-800" // Destructive (confidence <= 0.6)
                          } hover:bg-transparent text-foreground`}
                        >
                          {(item.accuracy * 100).toFixed(1)}%
                        </Badge>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col gap-6 ">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Device ID: <span className="text-primary underline">{deviceId}</span>{" "}
          Live Feed
        </h1>
        <Button
          variant="secondary"
          onClick={handleGoBack}
          className="gap-2 border bg-card text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderTable(logoData, "logo")}
        {renderTable(audioData, "audio")}
      </div>
      <BarChart logoData={logoData} audioData={audioData} />
    </div>
  );
};

export default DevicePage;
