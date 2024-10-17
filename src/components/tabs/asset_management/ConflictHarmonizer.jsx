"use client";

import React, { useState } from "react";
import { ChevronDown, Ellipsis } from "lucide-react";
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

const data = [
  {
    testMeterId: "100001",
    testMeterVersion: "v1.0.2",
    conflictMeterId: "1000010",
    conflictMeterVersion: "v2.3.1",
    conflictingComponent: "Power Module",
    createdOn: "2024-03-12",
    updatedOn: "2024-03-15",
    status: "Pending",
  },
  {
    testMeterId: "100002",
    testMeterVersion: "v1.1.0",
    conflictMeterId: "1000015",
    conflictMeterVersion: "v2.4.0",
    conflictingComponent: "Display Unit",
    createdOn: "2024-03-14",
    updatedOn: "2024-03-16",
    status: "Resolved",
  },
  {
    testMeterId: "100003",
    testMeterVersion: "v1.2.1",
    conflictMeterId: "1000021",
    conflictMeterVersion: "v2.5.2",
    conflictingComponent: "Communication Module",
    createdOn: "2024-03-15",
    updatedOn: "2024-03-17",
    status: "Pending",
  },
  {
    testMeterId: "100004",
    testMeterVersion: "v1.0.0",
    conflictMeterId: "100008",
    conflictMeterVersion: "v2.2.0",
    conflictingComponent: "Power Supply",
    createdOn: "2024-03-10",
    updatedOn: "2024-03-13",
    status: "Resolved",
  },
  {
    testMeterId: "100005",
    testMeterVersion: "v1.3.0",
    conflictMeterId: "1000012",
    conflictMeterVersion: "v2.6.1",
    conflictingComponent: "Sensor Array",
    createdOn: "2024-03-16",
    updatedOn: "2024-03-18",
    status: "Pending",
  },
];

const columns = [
  {
    accessorKey: "testMeterId",
    header: "Test Device ID",
    cell: ({ row }) => <div>{row.getValue("testMeterId")}</div>,
  },
  {
    accessorKey: "testMeterVersion",
    header: "Test Device Version",
    cell: ({ row }) => <div>{row.getValue("testMeterVersion")}</div>,
  },
  {
    accessorKey: "conflictMeterId",
    header: "Conflict Device ID",
    cell: ({ row }) => <div>{row.getValue("conflictMeterId")}</div>,
  },
  {
    accessorKey: "conflictMeterVersion",
    header: "Conflict Device Version",
    cell: ({ row }) => <div>{row.getValue("conflictMeterVersion")}</div>,
  },
  {
    accessorKey: "conflictingComponent",
    header: "Conflicting Component",
    cell: ({ row }) => <div>{row.getValue("conflictingComponent")}</div>,
  },
  {
    accessorKey: "createdOn",
    header: "Created On",
    cell: ({ row }) => <div>{row.getValue("createdOn")}</div>,
  },
  {
    accessorKey: "updatedOn",
    header: "Updated On",
    cell: ({ row }) => <div>{row.getValue("updatedOn")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const conflict = row.original;

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
              onClick={() =>
                navigator.clipboard.writeText(conflict.testMeterId)
              }
            >
              Copy Test Device ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function ConflictHarmonizer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const handleSearch = () => {
    const filtered = data.filter((item) =>
      item.testMeterId.toLowerCase().includes(searchTerm.toLowerCase())
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
