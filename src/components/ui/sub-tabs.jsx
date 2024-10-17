"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"; // Import ScrollArea and ScrollBar

const SubTabs = TabsPrimitive.Root;

const SubTabsList = React.forwardRef(({ className, ...props }, ref) => (
  <ScrollArea>
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "flex h-fit items-center justify-between  bg-transparent   border-b text-muted-foreground  w-fit",
        className
      )}
      {...props}
    />
    <ScrollBar orientation="horizontal" /> {/* Add a horizontal ScrollBar */}
  </ScrollArea>
));
SubTabsList.displayName = TabsPrimitive.List.displayName;

const SubTabsTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap  w-full px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  data-[state=active]:text-foreground  data-[state=active]:font-bold data-[state=active]:border-b-2 border-primary",

      className
    )}
    {...props}
  />
));
SubTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const SubTabsContent = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
SubTabsContent.displayName = TabsPrimitive.Content.displayName;

export { SubTabs, SubTabsList, SubTabsTrigger, SubTabsContent };
