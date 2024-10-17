"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

const data = [
  {
    jobId: "JOB001",
    metersId: "100123,100124,100125",
    osBranch: "main",
    osVersion: "v2.1.0",
    status: "Completed",
    pushStatus: "Success",
    pushedAt: "2024-09-23 14:30:00",
    pushedBy: "John Doe",
  },
  {
    jobId: "JOB002",
    metersId: "100126,100127",
    osBranch: "develop",
    osVersion: "v2.2.0-beta",
    status: "In Progress",
    pushStatus: "Pending",
    pushedAt: "2024-09-23 15:45:00",
    pushedBy: "Jane Smith",
  },
  {
    jobId: "JOB003",
    metersId: "100128,100129,100130,100131",
    osBranch: "feature/new-ui",
    osVersion: "v2.1.1",
    status: "Failed",
    pushStatus: "Error",
    pushedAt: "2024-09-23 16:15:00",
    pushedBy: "Bob Johnson",
  },
];

const MeterReleaseViewJob = () => {
  return (
    <Card className=" mx-auto p-2 bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job ID</TableHead>
            <TableHead>Device ID</TableHead>
            <TableHead>OS Branch</TableHead>
            <TableHead>OS Version</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Push Status</TableHead>
            <TableHead>Pushed At</TableHead>
            <TableHead>Pushed By</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((job) => (
            <TableRow key={job.jobId}>
              <TableCell>{job.jobId}</TableCell>
              <TableCell>{job.metersId}</TableCell>
              <TableCell>{job.osBranch}</TableCell>
              <TableCell>{job.osVersion}</TableCell>
              <TableCell>{job.status}</TableCell>
              <TableCell>{job.pushStatus}</TableCell>
              <TableCell>{job.pushedAt}</TableCell>
              <TableCell>{job.pushedBy}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default MeterReleaseViewJob;
