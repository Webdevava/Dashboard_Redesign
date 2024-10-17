import React from "react";
import { Card } from "@/components/ui/card";
import FileUploadAssets from "@/components/tabs/asset_management/FileUploadAssets";

const Page = () => {
  return (
    <Card className="h-fit w-full min-h-[50vh]">
      <FileUploadAssets/>
    </Card>
  );
};

export default Page;
