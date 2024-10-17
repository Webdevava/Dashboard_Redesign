"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { name: "User Management", href: "/user-management/manage-users" },
  { name: "Role Management", href: "/user-management/role-management" },
];

export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    if (pathname === "/user-management") {
      router.push(tabs[0].href);
    }
  }, [pathname, router]);

  if (pathname === "/user-management") {
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
              className="w-fit"
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
