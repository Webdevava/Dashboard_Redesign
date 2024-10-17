"use client";

import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialData = [
  {
    id: 1,
    alertType: "TAMPER ALARM",
    priority: "High",
    qualificationType: "Qualified",
    assignee: "Technical",
  },
  {
    id: 2,
    alertType: "SOS ALARM",
    priority: "Critical",
    qualificationType: "Qualified",
    assignee: "Engineer",
  },
  {
    id: 3,
    alertType: "BATTERY ALARM",
    priority: "Medium",
    qualificationType: "Disqualified",
    assignee: "Technical",
  },
  {
    id: 4,
    alertType: "SIM ALERT",
    priority: "Low",
    qualificationType: "Qualified",
    assignee: "Technical",
  },
  {
    id: 5,
    alertType: "SYSTEM ALARM",
    priority: "High",
    qualificationType: "Qualified",
    assignee: "Engineer",
  },
];

const priorityOptions = ["Low", "Medium", "High", "Critical"];
const qualificationOptions = ["Qualified", "Disqualified"];
const assigneeOptions = ["Technical", "Engineer", "Manager", "Other"];

const Configurations = () => {
  const [data, setData] = useState(initialData);

  const columns = [
    { accessorKey: "alertType", header: "Alert Type" },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ getValue, row, column, table }) => {
        const initialValue = getValue();
        return (
          <Select
            value={initialValue}
            onValueChange={(value) => {
              table.options.meta?.updateData(row.index, column.id, value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "qualificationType",
      header: "Qualification Type",
      cell: ({ getValue, row, column, table }) => {
        const initialValue = getValue();
        return (
          <Select
            value={initialValue}
            onValueChange={(value) => {
              table.options.meta?.updateData(row.index, column.id, value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select qualification" />
            </SelectTrigger>
            <SelectContent>
              {qualificationOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "assignee",
      header: "Assignee",
      cell: ({ getValue, row, column, table }) => {
        const initialValue = getValue();
        return (
          <Select
            value={initialValue}
            onValueChange={(value) => {
              table.options.meta?.updateData(row.index, column.id, value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              {assigneeOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  const handleSave = () => {
    // Here you would typically send the updated data to your backend
    console.log("Saving configurations:", data);
    // Implement your save logic here
  };

  return (
    <div className="w-full p-2 bg-card ">
      <h2 className="text-2xl font-bold mb-4">Alert Configurations</h2>
      <div className="rounded-md border mb-4">
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
      <Button onClick={handleSave}>Save Configurations</Button>
    </div>
  );
};

export default Configurations;
