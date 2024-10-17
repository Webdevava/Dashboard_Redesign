"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    hhId: "HH001",
    swVersion: "v1.0.0",
    action: "Applied",
    updatedOn: "2023-05-01",
    updatedBy: "John Doe",
  },
  {
    id: 2,
    hhId: "HH001",
    swVersion: "v1.0.1",
    action: "Pushed",
    updatedOn: "2023-05-15",
    updatedBy: "Jane Smith",
  },
  {
    id: 3,
    hhId: "HH002",
    swVersion: "v1.0.1",
    action: "Applied",
    updatedOn: "2023-05-10",
    updatedBy: "John Doe",
  },
  {
    id: 4,
    hhId: "HH002",
    swVersion: "v1.0.2",
    action: "Pushed",
    updatedOn: "2023-05-25",
    updatedBy: "Jane Smith",
  },
  {
    id: 5,
    hhId: "HH003",
    swVersion: "v1.0.0",
    action: "Applied",
    updatedOn: "2023-05-05",
    updatedBy: "John Doe",
  },
  {
    id: 6,
    hhId: "HH003",
    swVersion: "v1.0.1",
    action: "Pushed",
    updatedOn: "2023-05-20",
    updatedBy: "Jane Smith",
  },
];

const MeterReleaseHistory = () => {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    const filteredData = initialData.filter((item) =>
      Object.values(item).some((val) =>
        val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setData(filteredData);
  };

  return (
    <div className="p-4 bg-card">
      <div className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-72"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <Table>
        <TableCaption>Device Release History</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>HH ID</TableHead>
            <TableHead>S/W Version</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Updated On</TableHead>
            <TableHead>Updated By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.hhId}</TableCell>
              <TableCell>{item.swVersion}</TableCell>
              <TableCell>{item.action}</TableCell>
              <TableCell>{item.updatedOn}</TableCell>
              <TableCell>{item.updatedBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MeterReleaseHistory;
