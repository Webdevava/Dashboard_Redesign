"use client";

import React, { useState } from "react";
import { FileUpload } from "@/components/ui/fileUpload";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function FileUploadAssets() {
  const [files, setFiles] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  const handleFileUpload = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    console.log(newFiles);
  };

  const handleUpload = () => {
    console.log("Uploading files:", files);
    console.log("Selected option:", selectedOption);
    // Implement your upload logic here
  };

  const handleReset = () => {
    setFiles([]);
    setSelectedOption("");
  };

  return (
    <div className="w-full mx-auto space-y-4">
      <Select value={selectedOption} onValueChange={setSelectedOption}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select file type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="meter">Meter Field Status</SelectItem>
          <SelectItem value="remote">Remote Field Status</SelectItem>
          <SelectItem value="household">Household Field Status</SelectItem>
          <SelectItem value="remoteInfo">Remote Info</SelectItem>
          <SelectItem value="householdInfo">Household Info</SelectItem>
        </SelectContent>
      </Select>

      <div className="w-full min-h-96 border border-dashed bg-card dark:bg-black border-neutral-200 dark:border-neutral-800 rounded-xl">
        <FileUpload
          onChange={handleFileUpload}
          files={files}
          setFiles={setFiles}
        />
      </div>

      {files.length > 0 && (
        <div className="flex justify-end space-x-2">
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
          <Button onClick={handleUpload}>Upload</Button>
        </div>
      )}
    </div>
  );
}

export default FileUploadAssets;
