import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, CodeIcon, GitBranchIcon, UsersIcon } from "lucide-react";

const osVersions = [
  {
    version: "v2.1.0",
    releaseDate: "2024-09-15",
    codename: "Stable Stallion",
    branch: "main",
    features: [
      "Improved power management",
      "Enhanced security protocols",
      "New user interface",
    ],
    bugfixes: [
      "Fixed intermittent connection issues",
      "Resolved data reporting inaccuracies",
    ],
    contributors: ["John Doe", "Jane Smith", "Alice Johnson"],
    status: "stable",
  },
  {
    version: "v2.2.0-beta",
    releaseDate: "2024-09-20",
    codename: "Swift Cheetah",
    branch: "develop",
    features: [
      "Real-time data processing",
      "Advanced analytics dashboard",
      "Multi-language support",
    ],
    bugfixes: [
      "Addressed memory leak in long-running processes",
      "Fixed timezone handling issues",
    ],
    contributors: ["Bob Wilson", "Carol Taylor", "David Brown"],
    status: "beta",
  },
  {
    version: "v2.0.1",
    releaseDate: "2024-08-30",
    codename: "Reliable Rhino",
    branch: "main",
    features: ["Minor performance optimizations"],
    bugfixes: [
      "Critical security patch for remote access vulnerability",
      "Fixed data synchronization issues",
    ],
    contributors: ["Eve Anderson", "Frank Thomas"],
    status: "stable",
  },
];

const ViewReleaseSummary = () => {
  return (
    <ScrollArea className="bg-card w-full rounded-md border p-4">
      <Accordion type="single" collapsible className="w-full">
        {osVersions.map((os, index) => (
          <AccordionItem value={`item-${index}`} key={os.version}>
            <AccordionTrigger>
              <div className="flex justify-between items-center w-full">
                <span className="text-lg font-semibold">
                  {os.version} - {os.codename}
                </span>
                <Badge
                  variant={os.status === "stable" ? "default" : "secondary"}
                  className="ml-2"
                >
                  {os.status}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Released on {os.releaseDate}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <GitBranchIcon className="h-4 w-4" />
                  <span>Branch: {os.branch}</span>
                </div>
                <div>
                  <h3 className="font-semibold flex items-center">
                    <CodeIcon className="h-4 w-4 mr-2" />
                    Features
                  </h3>
                  <ul className="list-disc list-inside ml-4">
                    {os.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold flex items-center">
                    <CodeIcon className="h-4 w-4 mr-2" />
                    Bug Fixes
                  </h3>
                  <ul className="list-disc list-inside ml-4">
                    {os.bugfixes.map((bugfix, index) => (
                      <li key={index}>{bugfix}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold flex items-center">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    Contributors
                  </h3>
                  <p>{os.contributors.join(", ")}</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  );
};

export default ViewReleaseSummary;
