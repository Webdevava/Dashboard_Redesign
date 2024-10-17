import React from "react";
import { Card } from "@/components/ui/card";
import HHFieldStatus from "@/components/tabs/asset_management/HHFieldStatus";

const Page = () => {
  return (
    <Card className="h-fit w-full min-h-[50vh]">
      <HHFieldStatus/>
    </Card>
  );
};

export default Page;
