"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PanelsTopLeft,
  Radio,
  Gauge,
  Users,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSidebarStore } from "../../stores/sidebarStore";

const AssetManagementIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 21"
    fill="none"
    className={className}
  >
    <path
      d="M10.8381 11.475V10.2H9.56309V11.475H1.91309V15.3H3.18809V12.75H9.56309V15.3H10.8381V12.75H17.2131V15.3H18.4881V11.475H10.8381Z"
      fill="currentColor"
    />
    <path
      d="M2.5502 20.4C2.04297 20.4 1.55652 20.1985 1.19785 19.8398C0.83919 19.4812 0.637695 18.9947 0.637695 18.4875C0.637695 17.9803 0.83919 17.4938 1.19785 17.1352C1.55652 16.7765 2.04297 16.575 2.5502 16.575C3.05742 16.575 3.54387 16.7765 3.90254 17.1352C4.2612 17.4938 4.46269 17.9803 4.46269 18.4875C4.46269 18.9947 4.2612 19.4812 3.90254 19.8398C3.54387 20.1985 3.05742 20.4 2.5502 20.4ZM2.5502 17.85C2.38112 17.85 2.21897 17.9172 2.09941 18.0367C1.97986 18.1563 1.9127 18.3184 1.9127 18.4875C1.9127 18.6566 1.97986 18.8187 2.09941 18.9383C2.21897 19.0578 2.38112 19.125 2.5502 19.125C2.71927 19.125 2.88142 19.0578 3.00098 18.9383C3.12053 18.8187 3.1877 18.6566 3.1877 18.4875C3.1877 18.3184 3.12053 18.1563 3.00098 18.0367C2.88142 17.9172 2.71927 17.85 2.5502 17.85ZM10.2002 20.4C9.69297 20.4 9.20652 20.1985 8.84785 19.8398C8.48919 19.4812 8.28769 18.9947 8.28769 18.4875C8.28769 17.9803 8.48919 17.4938 8.84785 17.1352C9.20652 16.7765 9.69297 16.575 10.2002 16.575C10.7074 16.575 11.1939 16.7765 11.5525 17.1352C11.9112 17.4938 12.1127 17.9803 12.1127 18.4875C12.1127 18.9947 11.9112 19.4812 11.5525 19.8398C11.1939 20.1985 10.7074 20.4 10.2002 20.4ZM10.2002 17.85C10.0311 17.85 9.86897 17.9172 9.74941 18.0367C9.62986 18.1563 9.56269 18.3184 9.56269 18.4875C9.56269 18.6566 9.62986 18.8187 9.74941 18.9383C9.86897 19.0578 10.0311 19.125 10.2002 19.125C10.3693 19.125 10.5314 19.0578 10.651 18.9383C10.7705 18.8187 10.8377 18.6566 10.8377 18.4875C10.8377 18.3184 10.7705 18.1563 10.651 18.0367C10.5314 17.9172 10.3693 17.85 10.2002 17.85ZM17.8502 20.4C17.343 20.4 16.8565 20.1985 16.4979 19.8398C16.1392 19.4812 15.9377 18.9947 15.9377 18.4875C15.9377 17.9803 16.1392 17.4938 16.4979 17.1352C16.8565 16.7765 17.343 16.575 17.8502 16.575C18.3574 16.575 18.8439 16.7765 19.2025 17.1352C19.5612 17.4938 19.7627 17.9803 19.7627 18.4875C19.7627 18.9947 19.5612 19.4812 19.2025 19.8398C18.8439 20.1985 18.3574 20.4 17.8502 20.4ZM17.8502 17.85C17.6811 17.85 17.519 17.9172 17.3994 18.0367C17.2799 18.1563 17.2127 18.3184 17.2127 18.4875C17.2127 18.6566 17.2799 18.8187 17.3994 18.9383C17.519 19.0578 17.6811 19.125 17.8502 19.125C18.0193 19.125 18.1814 19.0578 18.301 18.9383C18.4205 18.8187 18.4877 18.6566 18.4877 18.4875C18.4877 18.3184 18.4205 18.1563 18.301 18.0367C18.1814 17.9172 18.0193 17.85 17.8502 17.85ZM14.6627 5.1V3.825H13.3239C13.2414 3.42685 13.0834 3.04816 12.8586 2.70937L13.8084 1.7595L12.9032 0.85425L11.9533 1.80412C11.6145 1.57926 11.2358 1.4213 10.8377 1.33875V0H9.56269V1.33875C9.16454 1.4213 8.78586 1.57926 8.44707 1.80412L7.49719 0.85425L6.59194 1.7595L7.54182 2.70937C7.31696 3.04816 7.15899 3.42685 7.07644 3.825H5.73769V5.1H7.07644C7.15899 5.49815 7.31696 5.87684 7.54182 6.21562L6.59194 7.1655L7.49082 8.06437L8.44069 7.1145C8.78092 7.34236 9.16186 7.50253 9.56269 7.58625V8.925H10.8377V7.58625C11.2358 7.50253 11.6145 7.34236 11.9533 7.1145L12.9032 8.06437L13.8084 7.1655L12.8586 6.21562C13.0834 5.87684 13.2414 5.49815 13.3239 5.1H14.6627ZM10.2002 6.3C9.63195 6.3 9.08619 6.07732 8.68361 5.67474C8.28103 5.27216 8.05835 4.7264 8.05835 4.15812C8.05835 3.58985 8.28103 3.04409 8.68361 2.64151C9.08619 2.23893 9.63195 2.01625 10.2002 2.01625C10.7685 2.01625 11.3142 2.23893 11.7168 2.64151C12.1194 3.04409 12.3421 3.58985 12.3421 4.15812C12.3421 4.7264 12.1194 5.27216 11.7168 5.67474C11.3142 6.07732 10.7685 6.3 10.2002 6.3Z"
      fill="currentColor"
    />
  </svg>
);

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: PanelsTopLeft,
  },
  {
    label: "Asset Management",
    href: "/assets-management",
    icon: AssetManagementIcon,
  },
  {
    label: "Live Monitoring",
    href: "/live-monitoring",
    icon: Radio,
  },
  {
    label: "Device Management",
    href: "/meter-management",
    icon: Gauge,
  },
  {
    label: "User Management",
    href: "/user-management",
    icon: Users,
  },
];

export default function MySidebar() {
  const pathname = usePathname();
  const { isExpanded, toggleSidebar } = useSidebarStore();

  const isActive = (href) => {
    return pathname.startsWith(href) && href !== "/";
  };

  return (
    <div
      className={`bg-card h-screen relative ${
        isExpanded ? "w-64" : "w-16"
      } hidden md:block transition-all duration-300 ease-in-out`}
      initial={false}
      animate={{ width: isExpanded ? 256 : 64 }}
    >
      <button
        onClick={toggleSidebar}
        className={`absolute top-2 p-1 shadow-lg rounded-full bg-card transition-all duration-300 ${
          isExpanded ? "left-[15rem]" : "left-[3.3rem]"
        }`}
      >
        {isExpanded ? (
          <ArrowLeft className="h-4 w-4" />
        ) : (
          <ArrowRight className="h-4 w-4" />
        )}
      </button>

      <div className="flex flex-col h-full p-2">
        <nav className="flex-1 flex flex-col">
          <TooltipProvider>
            {navItems.map((item) => (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link href={item.href}>
                    <Button
                      variant="ghost"
                      className={`  justify-start text-sm mb-2 ${
                        isActive(item.href)
                          ? "bg-secondary text-foreground font-bold"
                          : ""
                      } ${
                        isExpanded
                          ? "p-1 justify-start w-full"
                          : "px-2 justify-center w-fit"
                      }`}
                    >
                      <item.icon
                        className={`h-7 w-7 p-1 rounded-full ${
                          isExpanded ? "mr-2" : ""
                        } ${
                          isActive(item.href)
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}
                      />
                      {isExpanded && <span>{item.label}</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {!isExpanded && (
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </div>
    </div>
  );
}
