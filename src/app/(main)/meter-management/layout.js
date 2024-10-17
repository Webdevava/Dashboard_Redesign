"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { name: "Event Stream", href: "/meter-management/event-stream" },
  { name: "Alarms", href: "/meter-management/alarms" },
  { name: "Config & Update", href: "/meter-management/config-update" },
  { name: "Device Release Management", href: "/meter-management/device-release" },
  { name: "Device Insight Panel", href: "/meter-management/device-insight" },
  {
    name: "Installation Archive",
    href: "/meter-management/installation-archive",
  },
];

export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (pathname === "/meter-management") {
      router.push(tabs[0].href);
    }
  }, [pathname, router]);

  if (pathname === "/meter-management") {
    return null;
  }

  const currentTab =
    tabs.find((tab) => pathname.startsWith(tab.href))?.name || tabs[0].name;

  return (
    <div className="min-h-[90vh]">
      <Tabs value={currentTab} className="w-full">
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.name}
              value={tab.name}
              onClick={() => router.push(tab.href)}
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="pt-4"
        >
          <div className="mx-auto p-4">{children}</div>
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
