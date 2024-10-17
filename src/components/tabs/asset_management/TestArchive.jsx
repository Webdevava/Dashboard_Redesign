"use client";

import React, { useState } from "react";
import { ChevronDown, Ellipsis, Download } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const data = [
  {
    meterId: "100001",
    hardwareVersion: "v2.1.0",
    testStatus: "Passed",
    testedBy: "John Doe",
    testDate: "2024-03-15",
    testReport: "Report Link 1",
  },
  {
    meterId: "100002",
    hardwareVersion: "v2.1.1",
    testStatus: "Failed",
    testedBy: "Jane Smith",
    testDate: "2024-03-14",
    testReport: "Report Link 2",
  },
  // ... more entries
];

const columns = [
  {
    accessorKey: "meterId",
    header: "Device ID",
    cell: ({ row }) => <div>{row.getValue("meterId")}</div>,
  },
  {
    accessorKey: "hardwareVersion",
    header: "Hardware Version",
    cell: ({ row }) => <div>{row.getValue("hardwareVersion")}</div>,
  },
  {
    accessorKey: "testStatus",
    header: "Test Status",
    cell: ({ row }) => <div>{row.getValue("testStatus")}</div>,
  },
  {
    accessorKey: "testedBy",
    header: "Tested By",
    cell: ({ row }) => <div>{row.getValue("testedBy")}</div>,
  },
  {
    accessorKey: "testDate",
    header: "Test Date",
    cell: ({ row }) => <div>{row.getValue("testDate")}</div>,
  },
  {
    accessorKey: "testReport",
    header: "Test Report",
    cell: ({ row }) => (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link">View Report</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Test Report for Meter {row.getValue("meterId")}
            </DialogTitle>
            <DialogDescription>
              Detailed information about the test results.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Device ID:</span>
              <span className="col-span-3">{row.getValue("meterId")}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Hardware Version:</span>
              <span className="col-span-3">
                {row.getValue("hardwareVersion")}
              </span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Test Status:</span>
              <span className="col-span-3">{row.getValue("testStatus")}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Tested By:</span>
              <span className="col-span-3">{row.getValue("testedBy")}</span>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-bold">Test Date:</span>
              <span className="col-span-3">{row.getValue("testDate")}</span>
            </div>
          </div>
          <Button onClick={() => console.log("Downloading report...")}>
            <Download className="mr-2 h-4 w-4" /> Download Report
          </Button>
        </DialogContent>
      </Dialog>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const meter = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(meter.meterId)}
            >
              Copy Device ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function TestArchive() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data); // Start with all data

  const handleSearch = () => {
    const filtered = data.filter((item) =>
      item.meterId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full p-2 bg-card">
      <div className="flex-1 flex items-center max-w-96 rounded-full bg-background mb-2">
        <Input
          placeholder="Search Device ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm rounded-full border-none"
        />
        <Button onClick={handleSearch} className="rounded-full">
          Search
        </Button>
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
    </div>
  );
}
