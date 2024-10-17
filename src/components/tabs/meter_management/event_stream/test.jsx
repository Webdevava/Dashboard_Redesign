"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowLeft,
  Download,
  RefreshCw,
  Filter,
} from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function EventStreamRecords() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(5);

  // Search and filter states
  const [searchDeviceId, setSearchDeviceId] = useState("");
  const [filterDeviceId, setFilterDeviceId] = useState("");
  const [filterEventType, setFilterEventType] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);
  const [searchParamsState, setSearchParamsState] = useState({});
  const [selectedRows, setSelectedRows] = useState({});

  useEffect(() => {
    const deviceId = searchParams.get("deviceId") || "";
    const eventType = searchParams.get("eventType") || "";
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const page = parseInt(searchParams.get("page")) || 1;
    const limitParam = parseInt(searchParams.get("limit")) || 5;

    setSearchDeviceId(deviceId);
    setFilterDeviceId(deviceId);
    setFilterEventType(eventType);
    setFilterDateFrom(dateFrom ? new Date(dateFrom) : null);
    setFilterDateTo(dateTo ? new Date(dateTo) : null);
    setCurrentPage(page);
    setLimit(limitParam);

    // Set search params if any exist in URL
    if (deviceId || eventType || dateFrom || dateTo) {
      setSearchParamsState({
        DEVICE_ID: deviceId,
        eventName: eventType,
        dateFrom: dateFrom ? new Date(dateFrom) : null,
        dateTo: dateTo ? new Date(dateTo) : null,
      });
    }
  }, [searchParams]);

  // Update URL with current search parameters
  const updateURL = (params) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    // Update or remove each parameter
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        if (value instanceof Date) {
          current.set(key, value.toISOString());
        } else {
          current.set(key, value);
        }
      } else {
        current.delete(key);
      }
    });

    // Add page and limit to URL
    current.set("page", params.page || currentPage.toString());
    current.set("limit", limit.toString());

    // Create the new URL
    const searchString = current.toString();
    const query = searchString ? `?${searchString}` : "";

    router.push(`${window.location.pathname}${query}`);
  };

  useEffect(() => {
    fetchEventData();

    const intervalId = setInterval(fetchEventData, 5000);

    return () => clearInterval(intervalId);
  }, [currentPage, limit, searchParamsState]);

  const fetchEventData = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/events?page=${currentPage}&limit=${limit}`;

      Object.entries(searchParamsState).forEach(([key, value]) => {
        if (value) {
          if (key === "dateFrom" || key === "dateTo") {
            url += `&${key}=${value.toISOString()}`;
          } else {
            url += `&${key}=${value}`;
          }
        }
      });

      const response = await fetch(url);
      const data = await response.json();
      setEventData(data.events);
      setTotalRecords(data.total);
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  const getTableColumns = (event) => {
    const excludedKeys = [
      "ID",
      "DEVICE_ID",
      "TS",
      "Type",
      "eventName",
      "_id",
      "__v",
    ];
    return Object.keys(event).filter((key) => !excludedKeys.includes(key));
  };

  const handleSearch = () => {
    const newParams = {
      deviceId: searchDeviceId || filterDeviceId,
      eventType: filterEventType,
      dateFrom: filterDateFrom,
      dateTo: filterDateTo,
      page: "1", // Reset to first page on new search
    };

    updateURL(newParams);
    setCurrentPage(1);
    setSearchParamsState({
      DEVICE_ID: newParams.deviceId,
      eventName: newParams.eventType,
      dateFrom: newParams.dateFrom,
      dateTo: newParams.dateTo,
    });
  };

  const handleReset = () => {
    setSearchDeviceId("");
    setFilterDeviceId("");
    setFilterEventType("");
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setCurrentPage(1);
    setSearchParamsState({});

    updateURL({
      deviceId: "",
      eventType: "",
      dateFrom: null,
      dateTo: null,
      page: "1",
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    updateURL({
      deviceId: searchDeviceId || filterDeviceId,
      eventType: filterEventType,
      dateFrom: filterDateFrom,
      dateTo: filterDateTo,
      page: newPage.toString(),
    });
  };

  const handleLimitChange = (value) => {
    const newLimit = value === "all" ? totalRecords : Number(value);
    setLimit(newLimit);
    updateURL({
      deviceId: searchDeviceId || filterDeviceId,
      eventType: filterEventType,
      dateFrom: filterDateFrom,
      dateTo: filterDateTo,
      page: "1",
      limit: newLimit.toString(),
    });
  };

  const handleRefresh = () => {
    fetchEventData();
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectAll = (checked) => {
    const newSelectedRows = {};
    eventData.forEach((event) => {
      newSelectedRows[event._id] = checked;
    });
    setSelectedRows(newSelectedRows);
  };

  const handleExport = () => {
    const selectedData = eventData.filter((event) => selectedRows[event._id]);
    if (selectedData.length === 0) {
      alert("Please select at least one row to export.");
      return;
    }

    const csvContent = convertToCSV(selectedData);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "event_data.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const convertToCSV = (data) => {
    const headers = ["Device ID", "Timestamp", "Event Type", "Event"];
    const rows = data.map((event) => {
      const timestamp = new Date(event.TS).toLocaleString();
      return [
        event.DEVICE_ID,
        timestamp,
        event.eventName,
        JSON.stringify(getEventDetails(event)),
      ];
    });
    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  };

  const getEventDetails = (event) => {
    const eventDetails = {};
    getTableColumns(event).forEach((key) => {
      eventDetails[key] = event[key];
    });
    return eventDetails;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div
          className={cn(
            "w-16 h-16 border-4 border-dashed rounded-full animate-spin",
            "border-gray-400 border-t-transparent"
          )}
        ></div>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 md:gap-8 bg-card">
      {/* Rest of the JSX remains the same */}
    </main>
  );
}
