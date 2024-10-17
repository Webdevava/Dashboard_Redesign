import React from "react";
import { Card } from "@/components/ui/card";
import FieldActivity_Meter from "@/components/tabs/asset_management/field_ativity_ledger/FieldActivity_Meter";

const Page = () => {
  return (
    <Card className="h-fit w-full min-h-[50vh]">
      <FieldActivity_Meter/>
    </Card>
  );
};

export default Page;
