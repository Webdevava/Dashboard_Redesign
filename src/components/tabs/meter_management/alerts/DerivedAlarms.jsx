"use client";

import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const initialData = [
  {
    id: 1,
    meterId: "100001",
    hhId: "HH001",
    eventId: "E001",
    audienceSessionStart: "2023-05-01 10:00:00",
    alarmName: "TAMPER ALARM",
    alarmPriority: "High",
    assignedTo: "John Doe",
  },
  {
    id: 2,
    meterId: "100002",
    hhId: "HH002",
    eventId: "E002",
    audienceSessionStart: "2023-05-02 11:00:00",
    alarmName: "SOS ALARM",
    alarmPriority: "Critical",
    assignedTo: "Jane Smith",
  },
  {
    id: 3,
    meterId: "100003",
    hhId: "HH003",
    eventId: "E003",
    audienceSessionStart: "2023-05-03 12:00:00",
    alarmName: "BATTERY ALARM",
    alarmPriority: "Medium",
    assignedTo: "Alice Johnson",
  },
  {
    id: 4,
    meterId: "100004",
    hhId: "HH004",
    eventId: "E004",
    audienceSessionStart: "2023-05-04 13:00:00",
    alarmName: "SIM ALERT",
    alarmPriority: "Low",
    assignedTo: "Bob Wilson",
  },
  {
    id: 5,
    meterId: "100005",
    hhId: "HH005",
    eventId: "E005",
    audienceSessionStart: "2023-05-05 14:00:00",
    alarmName: "SYSTEM ALARM",
    alarmPriority: "High",
    assignedTo: "Charlie Brown",
  },
  // Add more data as needed
];

const DerivedAlarms = () => {
  const [data, setData] = useState(initialData);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = [
    { accessorKey: "meterId", header: "Device ID" },
    { accessorKey: "hhId", header: "HH ID" },
    { accessorKey: "eventId", header: "Event ID" },
    { accessorKey: "audienceSessionStart", header: "Audience Session Start" },
    { accessorKey: "alarmName", header: "Alarm Name" },
    { accessorKey: "alarmPriority", header: "Alarm Priority" },
    { accessorKey: "assignedTo", header: "Assigned To" },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const handleSearch = () => {
    const filteredData = initialData.filter((item) =>
      item.meterId.toLowerCase().includes(globalFilter.toLowerCase())
    );
    setData(filteredData);
  };

  return (
    <div className="w-full p-2 bg-card">
      <div className="flex items-center mb-4">
        <Input
          placeholder="Search Device ID..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm mr-2"
        />
        <Button onClick={() => setGlobalFilter("")}>Clear</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default DerivedAlarms;
