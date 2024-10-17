"use client";

import * as React from "react";
import { ChevronDown, Ellipsis } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
    sim1: "AIRTEL",
    sim2: "JIO",
    motherboardSerialNo: "MB001A2B3C",
    imeiSerialNo: "990000862471854",
    powerPcbSerialNo: "PWR001X2Y3Z",
    hardwareVersion: "v2.1.0",
    softwareVersion: "v3.5.2",
    ethernetMac: "00:1A:2B:3C:4D:5E",
    bleAddress: "00:11:22:33:44:55",
    wifiMac: "AA:BB:CC:DD:EE:FF",
    validFrom: "2024-01-01",
    validTo: "2025-12-31",
    updatedBy: "John Doe",
  },
  {
    meterId: "100002",
    sim1: "JIO",
    sim2: "VI",
    motherboardSerialNo: "MB002D4E5F",
    imeiSerialNo: "990000862471855",
    powerPcbSerialNo: "PWR002A3B4C",
    hardwareVersion: "v2.1.1",
    softwareVersion: "v3.5.3",
    ethernetMac: "00:2B:3C:4D:5E:6F",
    bleAddress: "11:22:33:44:55:66",
    wifiMac: "BB:CC:DD:EE:FF:00",
    validFrom: "2024-02-01",
    validTo: "2026-01-31",
    updatedBy: "Jane Smith",
  },
  // ... 8 more entries with similar structure
];

// Updated column definitions
export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "meterId",
    header: "Device ID",
    cell: ({ row }) => <div>{row.getValue("meterId")}</div>,
  },
  {
    accessorKey: "sim1",
    header: "SIM 1",
    cell: ({ row }) => <div>{row.getValue("sim1")}</div>,
  },
  {
    accessorKey: "sim2",
    header: "SIM 2",
    cell: ({ row }) => <div>{row.getValue("sim2")}</div>,
  },
  {
    accessorKey: "motherboardSerialNo",
    header: "Motherboard S. No",
    cell: ({ row }) => <div>{row.getValue("motherboardSerialNo")}</div>,
  },
  {
    accessorKey: "imeiSerialNo",
    header: "IMEI Sr No",
    cell: ({ row }) => <div>{row.getValue("imeiSerialNo")}</div>,
  },
  {
    accessorKey: "powerPcbSerialNo",
    header: "POWER PCB Sr No",
    cell: ({ row }) => <div>{row.getValue("powerPcbSerialNo")}</div>,
  },
  {
    accessorKey: "hardwareVersion",
    header: "H/W Version",
    cell: ({ row }) => <div>{row.getValue("hardwareVersion")}</div>,
  },
  {
    accessorKey: "softwareVersion",
    header: "S/W Version",
    cell: ({ row }) => <div>{row.getValue("softwareVersion")}</div>,
  },
  {
    accessorKey: "ethernetMac",
    header: "Ethernet MAC",
    cell: ({ row }) => <div>{row.getValue("ethernetMac")}</div>,
  },
  {
    accessorKey: "bleAddress",
    header: "BLE Address",
    cell: ({ row }) => <div>{row.getValue("bleAddress")}</div>,
  },
  {
    accessorKey: "wifiMac",
    header: "WiFi MAC",
    cell: ({ row }) => <div>{row.getValue("wifiMac")}</div>,
  },
  {
    accessorKey: "validFrom",
    header: "Valid From",
    cell: ({ row }) => <div>{row.getValue("validFrom")}</div>,
  },
  {
    accessorKey: "validTo",
    header: "Valid To",
    cell: ({ row }) => <div>{row.getValue("validTo")}</div>,
  },
  {
    accessorKey: "updatedBy",
    header: "Updated By",
    cell: ({ row }) => <div>{row.getValue("updatedBy")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
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

function MasterData_Meter() {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
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
      <div className="flex items-center mb-2">
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Filter Meters..."
            value={table.getColumn("meterId")?.getFilterValue() ?? ""}
            onChange={(event) =>
              table.getColumn("meterId")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />

          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Search Filters <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Card>
                <CardHeader>
                  <CardTitle>Apply filters</CardTitle>
                  <CardDescription>Use filters to further refine search</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="meterId">Device ID</Label>
                      <Input type="text" id="meterId" placeholder="M100001" />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="sim1">SIM 1</Label>
                      <Input type="text" id="sim1" placeholder="89910000123456789" />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="hardwareVersion">H/W Version</Label>
                      <Input type="text" id="hardwareVersion" placeholder="v2.1.0" />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label htmlFor="softwareVersion">S/W Version</Label>
                      <Input type="text" id="softwareVersion" placeholder="v3.5.2" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-4">
                  <Button variant="outline">Reset</Button>
                  <Button>Search</Button>
                </CardFooter>
              </Card>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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

export default MasterData_Meter;
