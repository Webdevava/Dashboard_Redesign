"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { name: "Stock Tracker", href: "/assets-management/stock-tracker" },
  { name: "Master Data", href: "/assets-management/master-data" },
  { name: "Field Activity Ledger", href: "/assets-management/field-activity" },
  { name: "Test Archive", href: "/assets-management/test-archive" },
  { name: "Conflicts", href: "/assets-management/conflicts" },
  { name: "File Upload Assets", href: "/assets-management/file-upload" },
  { name: "HH Info History", href: "/assets-management/hh-info" },
  { name: "HH Field Status", href: "/assets-management/hh-field" },
  { name: "Install Assets", href: "/assets-management/install-assets" },
];

export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (pathname === "/assets-management") {
      router.push(tabs[0].href);
    }
  }, [pathname, router]);

  if (pathname === "/assets-management") {
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
