import React from "react";
import { Card } from "@/components/ui/card";
import {
  SubTabs,
  SubTabsContent,
  SubTabsList,
  SubTabsTrigger,
} from "@/components/ui/sub-tabs";
import MasterData_Meter from "@/components/tabs/asset_management/master_data/MasterData_Meter";
import MasterData_Remote from "@/components/tabs/asset_management/master_data/MasterData_Remote";

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
          <MasterData_Meter/>
        </SubTabsContent>
        <SubTabsContent value="remote">
          <MasterData_Remote/>
        </SubTabsContent>
      </SubTabs>
    </Card>
  );
};

export default Page;
