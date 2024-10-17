"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Search, Filter } from "lucide-react";

const data = [
  {
    meterId: "100001",
    hwVersion: "v1.2",
    hhId: "HH001",
    tvId: "TV001",
    remoteId: "RM001",
    installActiveFrom: "2024-01-01",
    installActiveTo: "2024-12-31",
    pairingActiveFrom: "2024-01-05",
    pairingActiveTo: "2024-12-25",
  },
  {
    meterId: "100002",
    hwVersion: "v1.3",
    hhId: "HH002",
    tvId: "TV002",
    remoteId: "RM002",
    installActiveFrom: "2024-02-01",
    installActiveTo: "2025-01-31",
    pairingActiveFrom: "2024-02-05",
    pairingActiveTo: "2025-01-25",
  },
  // Add more mock data as needed
];

const InstallationArchive = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [filters, setFilters] = useState({
    hwVersion: "",
    installActiveFrom: "",
    installActiveTo: "",
    pairingActiveFrom: "",
    pairingActiveTo: "",
  });

  const handleSearch = () => {
    const results = data.filter((item) =>
      Object.values(item).some((val) =>
        val.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredData(results);
  };

  const handleFilter = () => {
    const results = data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true; // skip empty filters
        return item[key].includes(value);
      });
    });
    setFilteredData(results);
  };

  return (
    <div className="space-y-4 bg-card p-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">Filter Options</h4>
                <p className="text-sm text-muted-foreground">
                  Refine your search with specific criteria.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="hwVersion">H/W Version</Label>
                  <Input
                    id="hwVersion"
                    value={filters.hwVersion}
                    onChange={(e) =>
                      setFilters({ ...filters, hwVersion: e.target.value })
                    }
                    className="col-span-2 h-8"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="installActiveFrom">Install Active From</Label>
                  <Input
                    id="installActiveFrom"
                    type="date"
                    value={filters.installActiveFrom}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        installActiveFrom: e.target.value,
                      })
                    }
                    className="col-span-2 h-8"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="installActiveTo">Install Active To</Label>
                  <Input
                    id="installActiveTo"
                    type="date"
                    value={filters.installActiveTo}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        installActiveTo: e.target.value,
                      })
                    }
                    className="col-span-2 h-8"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="pairingActiveFrom">Pairing Active From</Label>
                  <Input
                    id="pairingActiveFrom"
                    type="date"
                    value={filters.pairingActiveFrom}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        pairingActiveFrom: e.target.value,
                      })
                    }
                    className="col-span-2 h-8"
                  />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="pairingActiveTo">Pairing Active To</Label>
                  <Input
                    id="pairingActiveTo"
                    type="date"
                    value={filters.pairingActiveTo}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        pairingActiveTo: e.target.value,
                      })
                    }
                    className="col-span-2 h-8"
                  />
                </div>
              </div>
              <Button onClick={handleFilter}>Apply Filters</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <Table className="bg-card rounded-xl">
        <TableHeader>
          <TableRow>
            <TableHead>Device ID</TableHead>
            <TableHead>H/W Version</TableHead>
            <TableHead>HH ID</TableHead>
            <TableHead>TV ID</TableHead>
            <TableHead>Remote ID</TableHead>
            <TableHead>Install Active From</TableHead>
            <TableHead>Install Active To</TableHead>
            <TableHead>Pairing Active From</TableHead>
            <TableHead>Pairing Active To</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item) => (
            <TableRow key={item.meterId}>
              <TableCell>{item.meterId}</TableCell>
              <TableCell>{item.hwVersion}</TableCell>
              <TableCell>{item.hhId}</TableCell>
              <TableCell>{item.tvId}</TableCell>
              <TableCell>{item.remoteId}</TableCell>
              <TableCell>{item.installActiveFrom}</TableCell>
              <TableCell>{item.installActiveTo}</TableCell>
              <TableCell>{item.pairingActiveFrom}</TableCell>
              <TableCell>{item.pairingActiveTo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InstallationArchive;
