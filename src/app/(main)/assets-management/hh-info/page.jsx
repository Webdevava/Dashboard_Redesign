import React from "react";
import { Card } from "@/components/ui/card";
import HHInfoHistory from "@/components/tabs/asset_management/HHInfoHistory";

const Page = () => {
  return (
    <Card className="h-fit w-full min-h-[50vh]">
      <HHInfoHistory/>
    </Card>
  );
};

export default Page;
