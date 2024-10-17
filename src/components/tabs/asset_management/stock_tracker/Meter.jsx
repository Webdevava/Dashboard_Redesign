"use client";

import * as React from "react";
import { ChevronDown, Ellipsis, Search, Filter, RefreshCw } from "lucide-react";
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
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const data = [
  {
    meterId: "100001",
    status: "online",
    connectivityStatus: "connected",
    householdId: "HH1",
    householdStatus: "active",
    hardwareVersion: "v1.2.3",
    network: "SIM1",
    location: "Maharashtra",
    latLon: "40.7128° N, 74.0060° W",
  },
  {
    meterId: "100002",
    status: "offline",
    connectivityStatus: "disconnected",
    householdId: "HH2",
    householdStatus: "inactive",
    hardwareVersion: "v1.2.3",
    network: "SIM2",
    location: "Maharashtra",
    latLon: "34.0522° N, 118.2437° W",
  },
  // Add more data entries as needed
  {
    meterId: "100003",
    status: "online",
    connectivityStatus: "connected",
    householdId: "HH3",
    householdStatus: "active",
    hardwareVersion: "v1.2.4",
    network: "SIM1",
    location: "Maharashtra",
    latLon: "37.7749° N, 122.4194° W",
  },
  {
    meterId: "100004",
    status: "offline",
    connectivityStatus: "disconnected",
    householdId: "HH4",
    householdStatus: "inactive",
    hardwareVersion: "v1.2.5",
    network: "SIM2",
    location: "Maharashtra",
    latLon: "51.5074° N, 0.1278° W",
  },
  {
    meterId: "100005",
    status: "online",
    connectivityStatus: "connected",
    householdId: "HH5",
    householdStatus: "active",
    hardwareVersion: "v1.2.6",
    network: "SIM1",
    location: "Maharashtra",
    latLon: "48.8566° N, 2.3522° E",
  },
];

// Update the column definitions with new fields
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "connectivityStatus",
    header: "Connectivity Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("connectivityStatus")}</div>
    ),
  },
  {
    accessorKey: "householdId",
    header: "Household ID",
    cell: ({ row }) => <div>{row.getValue("householdId")}</div>,
  },
  {
    accessorKey: "householdStatus",
    header: "Household Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("householdStatus")}</div>
    ),
  },
  {
    accessorKey: "hardwareVersion",
    header: "Hardware Version",
    cell: ({ row }) => <div>{row.getValue("hardwareVersion")}</div>,
  },
  {
    accessorKey: "network",
    header: "Network",
    cell: ({ row }) => <div>{row.getValue("network")}</div>,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <div>{row.getValue("location")}</div>,
  },
  {
    accessorKey: "latLon",
    header: "Lat & Lon",
    cell: ({ row }) => <div>{row.getValue("latLon")}</div>,
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

function Meter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filters, setFilters] = React.useState({
    status: "",
    connectivityStatus: "",
    householdStatus: "",
    network: "",
  });

     React.useEffect(() => {
       const urlSearchTerm = searchParams.get("search");
       if (urlSearchTerm) {
         setSearchTerm(urlSearchTerm);
         table.getColumn("meterId")?.setFilterValue(urlSearchTerm);
       }
     }, [searchParams]);

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



 const handleSearch = () => {
   // Create a new URLSearchParams instance with current params
   const current = new URLSearchParams(Array.from(searchParams.entries()));

   // Update search parameter
   if (searchTerm) {
     current.set("search", searchTerm);
   } else {
     current.delete("search");
   }

   // Create the new URL
   const searchString = current.toString();
   const query = searchString ? `?${searchString}` : "";

   // Update the URL and apply search filter
   router.push(`${window.location.pathname}${query}`);
   table.getColumn("meterId")?.setFilterValue(searchTerm);
 };

 // Handle Enter key in search input
 const handleKeyPress = (e) => {
   if (e.key === "Enter") {
     handleSearch();
   }
 };

 const handleReset = () => {
   // Create a new URLSearchParams instance with current params
   const current = new URLSearchParams(Array.from(searchParams.entries()));
   current.delete("search");

   // Create the new URL
   const searchString = current.toString();
   const query = searchString ? `?${searchString}` : "";

   // Update URL and reset states
   router.push(`${window.location.pathname}${query}`);
   setSearchTerm("");
   setFilters({
     status: "",
     connectivityStatus: "",
     householdStatus: "",
     network: "",
   });
   table.resetColumnFilters();
 };

  



  const handleFilter = () => {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        table.getColumn(key)?.setFilterValue(value);
      }
    });
  };



  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div
          className={cn(
            "w-16 h-16 border-4 border-dashed rounded-full animate-spin",
            "border-border border-t-transparent"
          )}
        ></div>
      </div>
    );
  }

  return (
    <div className="w-full p-2 bg-card rounded-xl ">
      <div className="flex items-center justify-between mb-4 space-x-2">
        <div className="flex gap-4 items-center">
          <div className="flex-1 flex items-center max-w-96 rounded-full bg-background">
            <Input
              placeholder="Search Devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" /> Search
            </Button>
          </div>

          <div className="flex gap-4 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card p-4">
                {/* <DropdownMenuHeader>
                  <DropdownMenuTitle>Filter Meters</DropdownMenuTitle>
                </DropdownMenuHeader> */}
                <div className="grid grid-cols-2 gap-4 py-4">
                  <Select
                    onValueChange={(value) =>
                      setFilters({ ...filters, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(value) =>
                      setFilters({ ...filters, connectivityStatus: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Connectivity Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="connected">Connected</SelectItem>
                      <SelectItem value="disconnected">Disconnected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(value) =>
                      setFilters({ ...filters, householdStatus: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Household Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(value) =>
                      setFilters({ ...filters, network: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SIM1">SIM1</SelectItem>
                      <SelectItem value="SIM2">SIM2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({
                        status: "",
                        connectivityStatus: "",
                        householdStatus: "",
                        network: "",
                      })
                    }
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleFilter}>Apply Filters</Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={handleReset}
              variant="outline"
              className="rounded-full size-9 p-0"
            >
              <RefreshCw />
            </Button>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto rounded-full">
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

export default Meter;
