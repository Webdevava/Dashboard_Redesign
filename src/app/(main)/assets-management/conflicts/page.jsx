import React from "react";
import { Card } from "@/components/ui/card";
import ConflictHarmonizer from "@/components/tabs/asset_management/ConflictHarmonizer";

const Page = () => {
  return (
    <Card className="h-fit w-full min-h-[50vh]">
      <ConflictHarmonizer />
    </Card>
  );
};

export default Page;
