import React from "react";
import { Card } from "@/components/ui/card";
import {
  SubTabs,
  SubTabsContent,
  SubTabsList,
  SubTabsTrigger,
} from "@/components/ui/sub-tabs";
import InstallationComponent from "@/components/tabs/asset_management/install_asset/Installation";
import ReplacementComponent from "@/components/tabs/asset_management/install_asset/Replacement";
import UninstallationComponent from "@/components/tabs/asset_management/install_asset/Unistallation";
import InProgressInstallationComponent from "@/components/tabs/asset_management/install_asset/InProgress";
import FailedInstallationComponent from "@/components/tabs/asset_management/install_asset/FailedInstallation";

const Page = () => {
  return (
    <Card className="h-fit w-full min-h-[50vh]">
      <SubTabs defaultValue="installation">
        {/* Tab List */}
        <SubTabsList className="mb-4">
          <SubTabsTrigger value="installation">Installtion</SubTabsTrigger>
          <SubTabsTrigger value="replacement">Replacement</SubTabsTrigger>
          <SubTabsTrigger value="uninstall">Uninstall</SubTabsTrigger>
          <SubTabsTrigger value="inprogress">In Progress</SubTabsTrigger>
          <SubTabsTrigger value="failed">Failed Installtion</SubTabsTrigger>
        </SubTabsList>

        {/* Tab Content */}
        <SubTabsContent value="installation">
          <InstallationComponent/>
        </SubTabsContent>
        <SubTabsContent value="replacement">
          <ReplacementComponent/>
        </SubTabsContent>
        <SubTabsContent value="uninstall">
          <UninstallationComponent/>
        </SubTabsContent>
        <SubTabsContent value="inprogress">
          <InProgressInstallationComponent/>
        </SubTabsContent>
        <SubTabsContent value="failed">
          <FailedInstallationComponent/>
        </SubTabsContent>
      </SubTabs>
    </Card>
  );
};

export default Page;
