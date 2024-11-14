"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowLeft,
  Download,
  RefreshCw,
  Filter, // Import the Refresh icon
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function EventStreamRecords() {
  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit, setLimit] = useState(5);

  const [searchDeviceId, setSearchDeviceId] = useState("");
  const [filterDeviceId, setFilterDeviceId] = useState("");
  const [filterEventType, setFilterEventType] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState(null);
  const [filterDateTo, setFilterDateTo] = useState(null);

  const [searchParams, setSearchParams] = useState({});

  const [selectedRows, setSelectedRows] = useState({});
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleEventClick = (event) => {
      setSelectedEvent(event);
      setIsDialogOpen(true);
    };

  useEffect(() => {
    fetchEventData();

    const intervalId = setInterval(fetchEventData, 5000);

    return () => clearInterval(intervalId);
  }, [currentPage, limit, searchParams]);

  const fetchEventData = async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/events?page=${currentPage}&limit=${limit}`;

      Object.entries(searchParams).forEach(([key, value]) => {
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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

    const formatTimestamp = (timestamp) => {
      // Check if timestamp is in milliseconds or seconds
      const date = new Date(
        timestamp * (timestamp.toString().length <= 10 ? 1000 : 1)
      );
      return format(date, "PPpp");
    };

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchParams({
      deviceId: searchDeviceId || filterDeviceId,
      eventName: filterEventType,
      dateFrom: filterDateFrom,
      dateTo: filterDateTo,
    });
  };

  const handleReset = () => {
    setSearchDeviceId("");
    setFilterDeviceId("");
    setFilterEventType("");
    setFilterDateFrom(null);
    setFilterDateTo(null);
    setCurrentPage(1);
    setSearchParams({});
  };

  // Function to handle refresh button click
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
      // Convert timestamp to milliseconds (if already in milliseconds, no need to multiply)
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

 const renderValue = (value, depth = 0) => {
   if (value === null || value === undefined) {
     return "N/A";
   } else if (typeof value === "object" && !Array.isArray(value)) {
     return (
       <div style={{ marginLeft: `${depth * 20}px` }}>
         {Object.entries(value).map(([key, val]) => (
           <div key={key} className="grid grid-cols-4 items-center gap-4 mt-2">
             <Label className="text-right font-bold">{key}:</Label>
             <div className="col-span-3">{renderValue(val, depth + 1)}</div>
           </div>
         ))}
       </div>
     );
   } else if (Array.isArray(value)) {
     return (
       <div style={{ marginLeft: `${depth * 20}px` }}>
         {value.map((item, index) => (
           <div key={index} className="mt-2">
             {renderValue(item, depth + 1)}
           </div>
         ))}
       </div>
     );
   } else {
     return value.toString();
   }
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
    <main className="flex flex-1 flex-col gap-4  md:gap-8 bg-card ">
      <div className=" p-2 rounded-xl">
        <div className="flex items-center rounded-t-lg  justify-between mb-2 ">
          <div className="flex w-full justify-between gap-3 items-center">
            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-center max-w-96 rounded-full bg-background">
                <Input
                  placeholder="Search Devices..."
                  value={searchDeviceId}
                  onChange={(e) => setSearchDeviceId(e.target.value)}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" /> Search
                </Button>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="bg-background rounded-full"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Search By Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96">
                  <div className="space-y-4">
                    <h4 className="font-medium leading-none">Search Filters</h4>
                    <div className="grid gap-4">
                      <div className="flex items-center gap-4">
                        <Label htmlFor="deviceId" className="w-24">
                          Device ID
                        </Label>
                        <Input
                          id="deviceId"
                          value={filterDeviceId}
                          onChange={(e) => setFilterDeviceId(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <Label htmlFor="eventType" className="w-24">
                          Event Type
                        </Label>
                        <Input
                          id="eventType"
                          value={filterEventType}
                          onChange={(e) => setFilterEventType(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <Label className="w-24">Date From</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex-1 justify-start text-left font-normal"
                            >
                              {filterDateFrom ? (
                                format(filterDateFrom, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={filterDateFrom}
                              onSelect={setFilterDateFrom}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex items-center gap-4">
                        <Label className="w-24">Date To</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex-1 justify-start text-left font-normal"
                            >
                              {filterDateTo ? (
                                format(filterDateTo, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={filterDateTo}
                              onSelect={setFilterDateTo}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <Button onClick={handleSearch}>Search</Button>
                      <Button onClick={handleReset} variant="outline">
                        Reset
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Refresh button */}
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="rounded-full p-2 size-10"
              >
                <RefreshCw className="h-8 w-8" />
              </Button>
            </div>

            <div className="flex gap-1 items-center">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="secondary"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span>
                Page {currentPage} of {Math.ceil(totalRecords / limit)}
              </span>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage * limit >= totalRecords}
                variant="secondary"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className=" mx-3">
            <Select
              id="limit"
              value={limit.toString()}
              onValueChange={(value) => {
                setLimit(value === "all" ? totalRecords : Number(value)); // Update limit based on selection
              }}
            >
              <SelectTrigger className="w-[120px]">
                {/* <SelectValue placeholder="Select rows" /> */}
                {/* <span className="text-sm text-muted-foreground">({totalRecords})</span> */}
                <span>{limit}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
                <SelectItem value="all">All {totalRecords}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {Object.values(selectedRows).filter(Boolean).length > 0 && ( // Conditional rendering
            <Button
              className="ml-3"
              onClick={handleExport}
              disabled={
                Object.values(selectedRows).filter(Boolean).length === 0
              }
            >
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </Button>
          )}
        </div>
        <ScrollArea className="h-[48vh] rounded-xl border  w-full">
          <Table className="h-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={
                      eventData.length > 0 &&
                      eventData.every((event) => selectedRows[event._id])
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>DeviceID</TableHead>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>Event Type</TableHead>
                <TableHead>Event</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventData.map((event) => (
                <TableRow key={event._id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedRows[event._id] || false}
                      onCheckedChange={() => handleRowSelect(event._id)}
                    />
                  </TableCell>
                  <TableCell>{event.DEVICE_ID}</TableCell>
                  <TableCell>
                    {event.TS ? formatTimestamp(event.TS) : "N/A"}
                  </TableCell>
                  <TableCell>{event.Event_Name}</TableCell>
                  <TableCell
                    className="cursor-pointer hover:bg-accent   hover:rounded-lg transition-all duration-200"
                    onClick={() => handleEventClick(event)}
                  >
                    {getTableColumns(event).map((key, index) => (
                      <span key={key}>
                        <strong>{key}:</strong> {event[key]?.toString()}
                        {index < getTableColumns(event).length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Event Details</DialogTitle>
              <DialogDescription>
                Detailed information about the selected event.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {selectedEvent && (
                <>
                  {/* <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-bold">Device ID:</Label>
                    <div className="col-span-3">{selectedEvent.DEVICE_ID}</div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-bold">Timestamp:</Label>
                    <div className="col-span-3">
                      {formatTimestamp(selectedEvent.TS)}
                    </div>
                  </div> */}
                  {Object.entries(selectedEvent).map(([key, value]) => (
                    <div
                      key={key}
                      className="grid grid-cols-4 items-center gap-4"
                    >
                      <Label className="text-right font-bold">{key}:</Label>
                      <div className="col-span-3">{renderValue(value)}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
