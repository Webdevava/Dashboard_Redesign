// components/AlertCards.js
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BatteryWarning,
  MonitorCog,
  PocketKnife,
  RadioTower,
  Siren,
  RefreshCw,
} from "lucide-react";

const iconMap = {
  TAMPER_ALARM: <PocketKnife className="h-4 w-4 text-primary" />,
  SYSTEM_ALARM: <MonitorCog className="h-4 w-4 text-primary" />,
  BATTERY_ALARM: <BatteryWarning className="h-4 w-4 text-primary" />,
  SIM_ALERT: <RadioTower className="h-4 w-4 text-primary" />,
  SOS_ALARM: <Siren className="h-4 w-4 text-primary" />,
};

const alertTypes = [
  "TAMPER_ALARM",
  "SOS_ALARM",
  "BATTERY_ALARM",
  "SIM_ALERT",
  "SYSTEM_ALARM",
];

export default function AlertCards({ onCardClick }) {
  const [alarmData, setAlarmData] = useState([]);

  useEffect(() => {
    fetchAlarmData();
  }, []);

  const fetchAlarmData = async () => {
    try {
      const response = await fetch(
        "https://apmapis.webdevava.live/api/events/alertsCount"
      );
      const data = await response.json();

      const alarmDataWithDefaults = alertTypes.map((type) => {
        const existingData = data.find((alarm) => alarm.alert === type);
        return (
          existingData || {
            alert: type,
            total: 0,
            generated: 0,
            pending: 0,
            resolved: 0,
          }
        );
      });

      setAlarmData(alarmDataWithDefaults);
    } catch (error) {
      console.error("Error fetching alarm data:", error);
      const defaultAlarmData = alertTypes.map((type) => ({
        alert: type,
        total: 0,
        generated: 0,
        pending: 0,
        resolved: 0,
      }));
      setAlarmData(defaultAlarmData);
    }
  };

  const handleRefresh = () => {
    fetchAlarmData();
  };

  return (
    <div className="bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-10 shadow-inner shadow-accent/50 border rounded-xl">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <p className="text-xl font-bold">Alerts</p>
        <RefreshCw
          className="h-6 w-6 cursor-pointer hover:bg-secondary border p-1 rounded"
          onClick={handleRefresh}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 p-2">
        {alarmData.map((alarm, index) => (
          <Card
            key={index}
            onClick={() => onCardClick(alarm)}
            className="cursor-pointer bg-card hover:bg-primary/20 hover:border-ring transition-colors"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {alarm.alert.replace("_", " ")}
              </CardTitle>
              {iconMap[alarm.alert]}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{alarm.total || 0}</div>
              <div className="flex w-full flex-wrap gap-2">
                <p className="text-xs text-muted-foreground">
                  Generated: {alarm.generated || 0}
                </p>
                <p className="text-xs text-muted-foreground">
                  Pending: {alarm.pending || 0}
                </p>
                <p className="text-xs text-muted-foreground">
                  Resolved: {alarm.resolved || 0}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
