"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Bell,
  AlertTriangle,
  Wifi,
  Battery,
  Cog,
  BellRing,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const alertTypeIcons = {
  5: Bell,
  6: AlertTriangle,
  7: Battery,
  16: Wifi,
  17: Cog,
};

const alertTypeColors = {
  generated: "bg-[#32ADE6]/25",
  pending: "bg-[#FFB800]/25",
  resolved: "bg-[#34C759]/25",
};

const alertTypeBadgeColors = {
  generated: "bg-[#32ADE6]",
  pending: "bg-[#FFB800]",
  resolved: "bg-[#34C759]",
};

const alertTypeTextColors = {
  generated: "text-[#32ADE6] dark:text-blue-500",
  pending: "text-[#FFB800] dark:text-yellow-500",
  resolved: "text-[#34C759] dark:text-green-500",
};

const CustomTooltip = ({ deviceId, position }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="absolute z-50 px-2 py-1 text-sm rounded shadow-md bg-card text-foreground"
    style={{
      left: `${position.x}px`,
      top: `${position.y}px`,
    }}
  >
    Go to alert for {deviceId}
  </motion.div>
);

const AlertCard = React.memo(({ alert, onClick }) => {
  const IconComponent = alertTypeIcons[alert.Type] || Cog;
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.95, rotate: 1.25 }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onMouseMove={handleMouseMove}
      className="overflow-hidden rounded-xl relative"
      transition={{
        x: { type: "spring", stiffness: 500, damping: 1 },
        opacity: { duration: 0.05 },
      }}
    >
      <Card
        className={`transition-all flex-shrink-0 w-full h-fit border-0 ${
          alertTypeColors[alert.AlertType.toLowerCase()]
        } group relative overflow-hidden cursor-pointer`}
        onClick={() => onClick(alert.DEVICE_ID)}
      >
        <CardHeader className="p-2">
          <div className="flex justify-between items-center">
            <IconComponent
              className={`${
                alertTypeTextColors[alert.AlertType.toLowerCase()]
              } size-6`}
            />
            <Badge
              className={`${
                alertTypeBadgeColors[alert.AlertType.toLowerCase()]
              } text-card size-10 rounded-full -rotate-12`}
            >
              <BellRing />
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-2">
          <div className="flex flex-col">
            <p className="text-lg font-bold line-clamp-2 text-foreground">
              {alert.Event_Name}
            </p>
            <p className="text-sm text-foreground/75">
              {new Date(alert.TS * 1000).toLocaleString()}
            </p>
          </div>
        </CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-foreground/35 bg-opacity-50 backdrop-blur-sm flex items-center justify-center rounded-xl"
        >
          <div className="text-card text-center p-4">
            <p className="mb-1 text-background">Device ID: {alert.DEVICE_ID}</p>
          </div>
        </motion.div>
      </Card>
      <AnimatePresence>
        {showTooltip && (
          <CustomTooltip
            deviceId={alert.DEVICE_ID}
            position={tooltipPosition}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
});

AlertCard.displayName = "AlertCard";

export default function AlertsSlider() {
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleCards, setVisibleCards] = useState(5);
  const [direction, setDirection] = useState(0);

  const handleResize = useCallback(() => {
    if (window.innerWidth < 640) {
      setVisibleCards(1);
    } else if (window.innerWidth < 1024) {
      setVisibleCards(3);
    } else {
      setVisibleCards(5);
    }
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const fetchAlerts = useCallback(
    async (page = 1, filterType = null) => {
      setIsLoading(true);
      setError(null);
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/events/alerts`;
        const params = {
          page,
          limit: visibleCards,
          ...(filterType && filterType !== "ALL" && { alertType: filterType }),
        };

        const { data } = await axios.get(url, { params });

        setAlerts(data.alerts);
        setTotalPages(data.totalPages);
        setTotalAlerts(data.total);
      } catch (error) {
        console.error("Error fetching alerts:", error);
        setError("Failed to load alerts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    },
    [visibleCards]
  );

  useEffect(() => {
    fetchAlerts(currentPage, activeFilter);
  }, [currentPage, activeFilter, visibleCards, fetchAlerts]);

  const handlePageChange = (newDirection) => {
    setDirection(newDirection);
    const newPage =
      newDirection === 1
        ? Math.min(currentPage + 1, totalPages)
        : Math.max(currentPage - 1, 1);
    setCurrentPage(newPage);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleCardClick = (deviceId) => {
    router.push(
      `/assets-management/stock-tracker?tab=meter&search=${deviceId}`
    );
  };

  const renderPlaceholder = () => (
    <Card className="border-2 transition-all flex-shrink-0 w-full min-h-[150px]">
      <CardContent className="flex flex-col justify-center items-center h-full p-4">
        <Skeleton className="w-12 h-12 rounded-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    if (isLoading) {
      return Array(visibleCards)
        .fill(null)
        .map((_, index) => (
          <React.Fragment key={index}>{renderPlaceholder()}</React.Fragment>
        ));
    } else if (alerts.length === 0) {
      return (
        <div className="col-span-full flex justify-center items-center h-32">
          <p className="text-lg text-foreground/75">
            No {activeFilter.toLowerCase()} alerts at the moment.
          </p>
        </div>
      );
    } else {
      return alerts.map((alert) => (
        <AlertCard key={alert._id} alert={alert} onClick={handleCardClick} />
      ));
    }
  };


  return (
    <div className="w-full mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-xl font-bold mb-4 sm:mb-0">All Meter Alarms</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {["ALL", "generated", "pending", "resolved"].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "secondary" : "outline"}
              onClick={() => handleFilterChange(filter)}
              className={`min-w-[100px] rounded-full ${
                activeFilter === filter
                  ? `border-2 ${alertTypeColors[filter] || ""}`
                  : ""
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  alertTypeBadgeColors[filter] || "bg-gray-400"
                }`}
              ></span>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-[-20px] z-10 bg-card rounded-full shadow-lg size-6"
          onClick={() => handlePageChange(-1)}
          disabled={currentPage === 1 || isLoading || alerts.length === 0}
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        <div className="w-full bg-card p-2 overflow-hidden rounded-xl">
          <div className="relative" style={{ height: "136px" }}>
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentPage}
                custom={direction}
                variants={{
                  enter: (direction) => ({
                    x: direction > 0 ? "100%" : "-100%",
                    opacity: 0,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                  }),
                  center: {
                    x: 0,
                    opacity: 1,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                  },
                  exit: (direction) => ({
                    x: direction < 0 ? "100%" : "-100%",
                    opacity: 0,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 250, damping: 20 },
                  opacity: { duration: 0.5 },
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {renderContent()}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          {error && (
            <div className="text-center text-red-500 mt-4">{error}</div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-[-20px] z-10 bg-card rounded-full shadow-lg size-6"
          onClick={() => handlePageChange(1)}
          disabled={currentPage === totalPages || isLoading || alerts.length === 0}
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      <div className="flex justify-center gap-4 items-center mt-6">
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        {activeFilter !== "ALL" ? (
          <p>
            Total {activeFilter} Alerts: {totalAlerts}
          </p>
        ) : (
          <p>All Alerts: {totalAlerts}</p>
        )}
      </div>
    </div>
  );
}
