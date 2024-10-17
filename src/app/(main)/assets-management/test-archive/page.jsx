import React from "react";
import { Card } from "@/components/ui/card";
import TestArchive from "@/components/tabs/asset_management/TestArchive";

const Page = () => {
  return (
    <Card className="h-fit w-full min-h-[50vh]">
      <TestArchive/>
    </Card>
  );
};

export default Page;
