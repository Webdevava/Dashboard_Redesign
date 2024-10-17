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
    HHID: "HH001",
    FieldStatus: "Active",
    validFrom: "2024-01-01",
    validTo: "2028-07-01",
    updatedAt: "2024-03-15 10:30:00",
    updatedBy: "John Doe",
  },
  {
    HHID: "HH002",
    FieldStatus: "Inactive",
    validFrom: "2024-03-15",
    validTo: "2028-09-15",
    updatedAt: "2024-03-16 14:45:00",
    updatedBy: "Jane Smith",
  },
  {
    HHID: "HH003",
    FieldStatus: "Pending",
    validFrom: "2024-06-01",
    validTo: "2028-12-01",
    updatedAt: "2024-03-17 09:15:00",
    updatedBy: "Alice Johnson",
  },
  {
    HHID: "HH004",
    FieldStatus: "Active",
    validFrom: "2024-09-01",
    validTo: "2029-03-01",
    updatedAt: "2024-03-18 16:20:00",
    updatedBy: "Bob Wilson",
  },
  {
    HHID: "HH005",
    FieldStatus: "Inactive",
    validFrom: "2024-12-15",
    validTo: "2029-06-15",
    updatedAt: "2024-03-19 11:55:00",
    updatedBy: "Carol Brown",
  },
];

const columns = [
  {
    accessorKey: "HHID",
    header: "HHID",
  },
  {
    accessorKey: "FieldStatus",
    header: "Field Status",
  },
  {
    accessorKey: "validFrom",
    header: "Valid From",
  },
  {
    accessorKey: "validTo",
    header: "Valid To",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
  },
  {
    accessorKey: "updatedBy",
    header: "Updated By",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const hhFieldStatus = row.original;

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
              onClick={() => navigator.clipboard.writeText(hhFieldStatus.HHID)}
            >
              Copy HHID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function HHFieldStatus() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const handleSearch = () => {
    const filtered = data.filter((item) =>
      item.HHID.toLowerCase().includes(searchTerm.toLowerCase())
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
