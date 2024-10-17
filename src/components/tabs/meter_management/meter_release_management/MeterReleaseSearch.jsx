import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
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
    appliedSwVersion: "v1.0.0",
    pushedSwVersion: "v1.0.1",
    appliedOn: "2023-05-01",
    pushedOn: "2023-05-15",
  },
  {
    id: 2,
    meterId: "100002",
    hhId: "HH002",
    appliedSwVersion: "v1.0.1",
    pushedSwVersion: "v1.0.2",
    appliedOn: "2023-05-10",
    pushedOn: "2023-05-25",
  },
  {
    id: 3,
    meterId: "100003",
    hhId: "HH003",
    appliedSwVersion: "v1.0.0",
    pushedSwVersion: "v1.0.1",
    appliedOn: "2023-05-05",
    pushedOn: "2023-05-20",
  },
  {
    id: 4,
    meterId: "100004",
    hhId: "HH004",
    appliedSwVersion: "v1.0.2",
    pushedSwVersion: "v1.0.3",
    appliedOn: "2023-05-15",
    pushedOn: "2023-05-30",
  },
  {
    id: 5,
    meterId: "100005",
    hhId: "HH005",
    appliedSwVersion: "v1.0.1",
    pushedSwVersion: "v1.0.2",
    appliedOn: "2023-05-20",
    pushedOn: "2023-06-05",
  },
];

const MeterReleaseSearch = () => {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");

  const handleSearch = () => {
    const filteredData = initialData.filter((item) =>
      Object.values(item).some((val) =>
        val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setData(filteredData);
  };

  const handleFilter = (filterType) => {
    setFilter(filterType);
    const filteredData = initialData.filter((item) =>
      item[filterType]
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setData(filteredData);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilter("");
    setData(initialData);
  };

  return (
    <div className="p-4">
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-72"
        />
        <Button onClick={handleSearch}>Search</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Filter</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleFilter("meterId")}>
              Device ID
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilter("hhId")}>
              HH ID
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilter("appliedSwVersion")}>
              Applied SW Version
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilter("pushedSwVersion")}>
              Pushed SW Version
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilter("appliedOn")}>
              Applied On
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilter("pushedOn")}>
              Pushed On
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={handleReset} variant="outline">
          Reset
        </Button>
      </div>

      <Table>
        <TableCaption>Device Release Data</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Device ID</TableHead>
            <TableHead>HH ID</TableHead>
            <TableHead>Applied SW Version</TableHead>
            <TableHead>Pushed SW Version</TableHead>
            <TableHead>Applied On</TableHead>
            <TableHead>Pushed On</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.meterId}</TableCell>
              <TableCell>{item.hhId}</TableCell>
              <TableCell>{item.appliedSwVersion}</TableCell>
              <TableCell>{item.pushedSwVersion}</TableCell>
              <TableCell>{item.appliedOn}</TableCell>
              <TableCell>{item.pushedOn}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MeterReleaseSearch;
