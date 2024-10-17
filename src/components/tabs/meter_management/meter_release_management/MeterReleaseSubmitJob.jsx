"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MeterReleaseSubmitJob = () => {
  const [meterId, setMeterId] = useState("");
  const [osBranch, setOsBranch] = useState("");
  const [osVersion, setOsVersion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Submitting job:", { meterId, osBranch, osVersion });
    // Add your submission logic here
  };

  const handleClear = () => {
    setMeterId("");
    setOsBranch("");
    setOsVersion("");
  };

  return (
    <Card className=" mx-auto bg-card">
      <CardHeader>
        <CardTitle>Submit Device Release Job</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-6 items-center">
            <div className="space-y-2">
              <Label htmlFor="meterId">Device ID</Label>
              <Input
                id="meterId"
                placeholder="Enter Device ID"
                value={meterId}
                onChange={(e) => setMeterId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="osBranch">OS Branch</Label>
              <Select value={osBranch} onValueChange={setOsBranch}>
                <SelectTrigger id="osBranch">
                  <SelectValue placeholder="Select OS Branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">Main</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="osVersion">OS Version</Label>
              <Select value={osVersion} onValueChange={setOsVersion}>
                <SelectTrigger id="osVersion">
                  <SelectValue placeholder="Select OS Version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="v1.0.0">v1.0.0</SelectItem>
                  <SelectItem value="v1.1.0">v1.1.0</SelectItem>
                  <SelectItem value="v1.2.0">v1.2.0</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex space-x-2 w-full justify-end">
            <Button type="submit">Submit Job</Button>
            <Button type="button" variant="outline" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MeterReleaseSubmitJob;
