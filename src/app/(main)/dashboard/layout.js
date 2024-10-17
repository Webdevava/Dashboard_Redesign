"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { name: "Overview", href: "/dashboard/overview" },
  { name: "Live Charts", href: "/dashboard/live-charts" },
  { name: "Analytics", href: "/dashboard/analytics" },
];

export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (pathname === "/dashboard") {
      router.push(tabs[0].href);
    }
  }, [pathname, router]);

  if (pathname === "/dashboard") {
    return null;
  }

  const currentTab =
    tabs.find((tab) => pathname.startsWith(tab.href))?.name || tabs[0].name;

  return (
    <div className="min-h-[90vh]">
      <Tabs value={currentTab} className="w-fit">
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
