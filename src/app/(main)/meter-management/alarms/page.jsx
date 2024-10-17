"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import {
  SubTabs,
  SubTabsContent,
  SubTabsList,
  SubTabsTrigger,
} from "@/components/ui/sub-tabs";
import Remote from "@/components/tabs/asset_management/stock_tracker/Remote";
import Summary from "@/components/tabs/asset_management/stock_tracker/Summary";
import FieldAlarms from "@/components/tabs/meter_management/alerts/FieldAlarms";
import DerivedAlarms from "@/components/tabs/meter_management/alerts/DerivedAlarms";
import Configurations from "@/components/tabs/meter_management/alerts/Configurations";

const VALID_TABS = ["field-alarms", "derived-alarms", "config"];
const DEFAULT_TAB = "field-alarms";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current tab from URL or use default
  const currentTab = searchParams.get("tab") || DEFAULT_TAB;

  // Update URL when tab changes
  const handleTabChange = (value) => {
    const url = new URL(window.location.href);
    url.searchParams.set("tab", value);
    router.push(url.pathname + url.search);
  };

  // Set default tab in URL if no tab is specified
  useEffect(() => {
    const tabParam = searchParams.get("tab");

    if (!tabParam) {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", DEFAULT_TAB);
      router.push(url.pathname + url.search, { replace: true }); // Using replace to avoid adding to history
      return;
    }

    // Validate and correct invalid tab values
    if (!VALID_TABS.includes(tabParam)) {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", DEFAULT_TAB);
      router.push(url.pathname + url.search, { replace: true });
    }
  }, [searchParams, router]);

  return (
    <Card className="h-fit w-full min-h-[50vh]">
      <SubTabs value={currentTab} onValueChange={handleTabChange}>
        {/* Tab List */}
        <SubTabsList className="mb-4">
          <SubTabsTrigger value="field-alarms">Field Alarms</SubTabsTrigger>
          <SubTabsTrigger value="derived-alarms">Derived Alarms</SubTabsTrigger>
          <SubTabsTrigger value="config">Configurations</SubTabsTrigger>
        </SubTabsList>

        {/* Tab Content */}
        <SubTabsContent value="field-alarms">
          <FieldAlarms />
        </SubTabsContent>
        <SubTabsContent value="derived-alarms">
          <DerivedAlarms/>
        </SubTabsContent>
        <SubTabsContent value="config">
          <Configurations/>
        </SubTabsContent>
      </SubTabs>
    </Card>
  );
};

export default Page;
