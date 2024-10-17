import ViewReleaseSummary from "@/components/tabs/meter_management/ViewReleaseSummary";
import { Card } from "@/components/ui/card";
import React from "react";

const page = () => {
  return <Card className=" h-full w-full min-h-fit">
    <ViewReleaseSummary/>
  </Card>;
};

export default page;
