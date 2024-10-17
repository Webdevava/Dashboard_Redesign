"use client";

import * as React from "react";
import { ChevronDown, Ellipsis } from "lucide-react";
import {
  ColumnDef,
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
import { cn } from "@/lib/utils";

// Updated data structure with new fields
const data = [
  {
    meterId: "100001",
    hardwareVersion: "v2.1.0",
    fieldStatus: "Active",
    updatedOn: "2024-03-15",
    updatedBy: "John Doe",
    remarks: "Regular maintenance completed",
  },
  {
    meterId: "100002",
    hardwareVersion: "v2.1.1",
    fieldStatus: "Inactive",
    updatedOn: "2024-03-14",
    updatedBy: "Jane Smith",
    remarks: "Pending repair",
  },
  // ... more entries
];

// Updated column definitions
export const columns = [
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
    accessorKey: "fieldStatus",
    header: "Field Status",
    cell: ({ row }) => <div>{row.getValue("fieldStatus")}</div>,
  },
  {
    accessorKey: "updatedOn",
    header: "Updated On",
    cell: ({ row }) => <div>{row.getValue("updatedOn")}</div>,
  },
  {
    accessorKey: "updatedBy",
    header: "Updated By",
    cell: ({ row }) => <div>{row.getValue("updatedBy")}</div>,
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: ({ row }) => <div>{row.getValue("remarks")}</div>,
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

function FieldActivity_Meter() {
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredData, setFilteredData] = React.useState([]);

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
      {filteredData.length > 0 && (
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
      )}
    </div>
  );
}

export default FieldActivity_Meter;
