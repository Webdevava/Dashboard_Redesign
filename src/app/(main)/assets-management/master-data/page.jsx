import React from "react";
import { Card } from "@/components/ui/card";
import {
  SubTabs,
  SubTabsContent,
  SubTabsList,
  SubTabsTrigger,
} from "@/components/ui/sub-tabs"; // Import Tabs components
import Meter from "@/components/tabs/asset_management/stock_tracker/Meter";
import Remote from "@/components/tabs/asset_management/stock_tracker/Remote";
import Summary from "@/components/tabs/asset_management/stock_tracker/Summary";

const Page = () => {
  return (
    <Card className="h-fit w-full min-h-[50vh]">
      <SubTabs defaultValue="meter">
        {/* Tab List */}
        <SubTabsList className="mb-4">
          <SubTabsTrigger value="meter">Meter</SubTabsTrigger>
          <SubTabsTrigger value="remote">Remote</SubTabsTrigger>
        </SubTabsList>

        {/* Tab Content */}
        <SubTabsContent value="meter">
          <Meter />
        </SubTabsContent>
        <SubTabsContent value="remote">
          <Remote />
        </SubTabsContent>
      </SubTabs>
    </Card>
  );
};

export default Page;
