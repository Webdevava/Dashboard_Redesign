"use client";

import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const initialData = [
  {
    id: 1,
    meterId: "100001",
    meterStatusEvents: "Active",
    householdId: "HH001",
    config: "v1.0.1",
    hardware: "HW001",
    submittedAt: "2023-05-01 10:00:00",
  },
  {
    id: 2,
    meterId: "100002",
    meterStatusEvents: "Active",
    householdId: "HH002",
    config: "v1.0.1",
    hardware: "HW002",
    submittedAt: "2023-05-02 11:00:00",
  },
  {
    id: 3,
    meterId: "100003",
    meterStatusEvents: "Inactive",
    householdId: "HH003",
    config: "v1.0.0",
    hardware: "HW001",
    submittedAt: "2023-05-03 12:00:00",
  },
  {
    id: 4,
    meterId: "100004",
    meterStatusEvents: "Active",
    householdId: "HH004",
    config: "v1.0.1",
    hardware: "HW003",
    submittedAt: "2023-05-04 13:00:00",
  },
  {
    id: 5,
    meterId: "100005",
    meterStatusEvents: "Active",
    householdId: "HH005",
    config: "v1.0.2",
    hardware: "HW002",
    submittedAt: "2023-05-05 14:00:00",
  },
];

const ViewAndUpdate = () => {
  const [data, setData] = useState(initialData);
  const [selectedRows, setSelectedRows] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [newConfig, setNewConfig] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewDetails, setViewDetails] = useState(null);

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    { accessorKey: "meterId", header: "Device ID" },
    { accessorKey: "meterStatusEvents", header: "Meter Status Events" },
    { accessorKey: "householdId", header: "Household ID" },
    { accessorKey: "config", header: "Config" },
    { accessorKey: "hardware", header: "Hardware" },
    { accessorKey: "submittedAt", header: "Submitted At" },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button onClick={() => handleView(row.original)}>View</Button>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setSelectedRows,
    state: {
      rowSelection: selectedRows,
    },
  });

  const handleSearch = () => {
    const filteredData = initialData.filter((item) =>
      item.meterId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filteredData);
  };

  const handleSendConfig = () => {
    setIsDialogOpen(true);
  };

  const handleConfigSubmit = () => {
    const updatedData = data.map((row) => {
      if (selectedRows[row.id]) {
        return { ...row, config: newConfig };
      }
      return row;
    });
    setData(updatedData);
    setSelectedRows({});
    setNewConfig("");
    setIsDialogOpen(false);
  };

  const handleView = (rowData) => {
    setViewDetails(rowData);
  };

  return (
    <div className="w-full p-2 bg-card">
      <div className="flex items-center mb-4">
        <Input
          placeholder="Search Device ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm mr-2"
        />
        <Button onClick={handleSearch}>Search</Button>
        <Button
          onClick={handleSendConfig}
          className="ml-auto"
          disabled={Object.keys(selectedRows).length === 0}
        >
          Send Config
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send New Configuration</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="v1.0.2"
            value={newConfig}
            onChange={(e) => setNewConfig(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfigSubmit}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {viewDetails && (
        <Dialog open={!!viewDetails} onOpenChange={() => setViewDetails(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Config Update Details</DialogTitle>
            </DialogHeader>
            <div>
              <p>
                <strong>Device ID:</strong> {viewDetails.meterId}
              </p>
              <p>
                <strong>Current Config:</strong> {viewDetails.config}
              </p>
              <p>
                <strong>Hardware:</strong> {viewDetails.hardware}
              </p>
              <p>
                <strong>Last Updated:</strong> {viewDetails.submittedAt}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ViewAndUpdate;
