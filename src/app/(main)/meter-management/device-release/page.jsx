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
import MeterReleaseSearch from "@/components/tabs/meter_management/meter_release_management/MeterReleaseSearch";
import MeterReleaseHistory from "@/components/tabs/meter_management/meter_release_management/MeterReleaseHistory";
import MeterReleaseSubmitJob from "@/components/tabs/meter_management/meter_release_management/MeterReleaseSubmitJob";
import MeterReleaseViewJob from "@/components/tabs/meter_management/meter_release_management/MeterReleaseViewJob";

const VALID_TABS = ["search", "history", "submit-job", "view-job"];
const DEFAULT_TAB = "search";

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
          <SubTabsTrigger value="search">Search</SubTabsTrigger>
          <SubTabsTrigger value="history">History</SubTabsTrigger>
          <SubTabsTrigger value="submit-job">Submit Job</SubTabsTrigger>
          <SubTabsTrigger value="view-job">View Job</SubTabsTrigger>
        </SubTabsList>

        {/* Tab Content */}
        <SubTabsContent value="search">
          <MeterReleaseSearch/>
        </SubTabsContent>
        <SubTabsContent value="history">
          <MeterReleaseHistory/>
        </SubTabsContent>
        <SubTabsContent value="submit-job">
          <MeterReleaseSubmitJob/>
        </SubTabsContent>
        <SubTabsContent value="view-job">
          <MeterReleaseViewJob/>
        </SubTabsContent>
      </SubTabs>
    </Card>
  );
};

export default Page;
