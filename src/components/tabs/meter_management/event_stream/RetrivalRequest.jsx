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
import { Search } from "lucide-react";

const initialData = [
  {
    id: 1,
    meterId: "100001",
    hhId: "HH001",
    hwVersion: "v1.0.0",
    status: "Installed",
    lastEODDateTime: "2023-05-01 23:59:59",
    installDate: "2023-01-15",
  },
  {
    id: 2,
    meterId: "100002",
    hhId: "HH002",
    hwVersion: "v1.1.0",
    status: "Installed",
    lastEODDateTime: "2023-05-02 23:59:59",
    installDate: "2023-02-20",
  },
  {
    id: 3,
    meterId: "100003",
    hhId: "HH003",
    hwVersion: "v1.2.0",
    status: "Installed",
    lastEODDateTime: "2023-05-03 23:59:59",
    installDate: "2023-03-10",
  },
  {
    id: 4,
    meterId: "100004",
    hhId: "HH004",
    hwVersion: "v1.0.1",
    status: "Installed",
    lastEODDateTime: "2023-05-04 23:59:59",
    installDate: "2023-04-05",
  },
  {
    id: 5,
    meterId: "100005",
    hhId: "HH005",
    hwVersion: "v1.1.1",
    status: "Installed",
    lastEODDateTime: "2023-05-05 23:59:59",
    installDate: "2023-05-12",
  },
  {
    id: 6,
    meterId: "100006",
    hhId: "HH006",
    hwVersion: "v1.2.1",
    status: "Installed",
    lastEODDateTime: "2023-05-06 23:59:59",
    installDate: "2023-06-18",
  },
  {
    id: 7,
    meterId: "100007",
    hhId: "HH007",
    hwVersion: "v1.0.2",
    status: "Installed",
    lastEODDateTime: "2023-05-07 23:59:59",
    installDate: "2023-07-22",
  },
  {
    id: 8,
    meterId: "100008",
    hhId: "HH008",
    hwVersion: "v1.1.2",
    status: "Installed",
    lastEODDateTime: "2023-05-08 23:59:59",
    installDate: "2023-08-30",
  },
  {
    id: 9,
    meterId: "100009",
    hhId: "HH009",
    hwVersion: "v1.2.2",
    status: "Installed",
    lastEODDateTime: "2023-05-09 23:59:59",
    installDate: "2023-09-14",
  },
  {
    id: 10,
    meterId: "100010",
    hhId: "HH010",
    hwVersion: "v1.0.3",
    status: "Installed",
    lastEODDateTime: "2023-05-10 23:59:59",
    installDate: "2023-10-25",
  },
];

const RetrievalRequest = () => {
  const [data, setData] = useState(initialData);
  const [selectedRows, setSelectedRows] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

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
    {
      accessorKey: "meterId",
      header: "Device ID",
    },
    {
      accessorKey: "hhId",
      header: "HH ID",
    },
    {
      accessorKey: "hwVersion",
      header: "H/W Version",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "lastEODDateTime",
      header: "Last EOD DateTime",
    },
    {
      accessorKey: "installDate",
      header: "Install Date",
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

  const handleRetrieveRequest = () => {
    const updatedData = data.map((row) => {
      if (selectedRows[row.id]) {
        return { ...row, status: "Retrieval in Progress" };
      }
      return row;
    });
    setData(updatedData);
    setSelectedRows({});
  };

  return (
    <div className="w-full p-2 bg-card">
      <div className="flex items-center mb-4">
        <div className="flex-1 flex items-center max-w-96 rounded-full bg-background">
          <Input
            placeholder="Search Devices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className=" rounded-full border-none"
          />
          <Button onClick={handleSearch} className="rounded-full">
            <Search className="h-4 w-4" /> Search
          </Button>
        </div>
        <Button
          onClick={handleRetrieveRequest}
          className="ml-auto"
          disabled={Object.keys(selectedRows).length === 0}
        >
          Send Retrieve Request
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
};

export default RetrievalRequest;
