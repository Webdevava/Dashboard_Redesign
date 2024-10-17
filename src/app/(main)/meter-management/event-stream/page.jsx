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
import EventStreamRecords from "@/components/tabs/meter_management/event_stream/EventStreamRecords";
import Plot from "@/components/tabs/meter_management/event_stream/Plot";
import RetrievalRequest from "@/components/tabs/meter_management/event_stream/RetrivalRequest";

const VALID_TABS = ["records", "plot", "retrive"];
const DEFAULT_TAB = "records";

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
          <SubTabsTrigger value="records">Records</SubTabsTrigger>
          <SubTabsTrigger value="plot">Plot</SubTabsTrigger>
          <SubTabsTrigger value="retrive">Retrival Request</SubTabsTrigger>
        </SubTabsList>

        {/* Tab Content */}
        <SubTabsContent value="records">
          <EventStreamRecords/>
        </SubTabsContent>
        <SubTabsContent value="plot">
          <Plot/>
        </SubTabsContent>
        <SubTabsContent value="retrive">
          <RetrievalRequest/>
        </SubTabsContent>
      </SubTabs>
    </Card>
  );
};

export default Page;
