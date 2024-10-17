import React, { useState, useEffect } from "react";
import {
  Bell,
  Menu,
  Sun,
  Moon,
  Laptop,
  X,
  Search,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useTimezoneStore } from "@/stores/timezoneStore";
import { useThemeStore } from "@/stores/themeStore";
import Image from "next/image";

const NotificationItem = ({ Event_Name, ID, TS, Details, onDelete }) => (
  <div className="mb-4 p-3 bg-card rounded-xl relative">
    <button className="absolute top-2 right-2 " onClick={onDelete}>
      <X className="h-4 w-4" />
    </button>
    <h3 className="font-semibold">{Event_Name}</h3>
    <p className="text-sm ">ID: {ID}</p>
    <p className="text-sm ">{Details && JSON.stringify(Details)}</p>
    <p className="text-xs mt-1">{new Date(TS).toLocaleString()}</p>
  </div>
);

const SearchComponent = ({ onClose }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const pages = [
    { route: "/dashboard/overview",
      name: "Dashboard > Overview"
    },
    { route: "/dashboard/live-charts",
      name: "Dashboard > Live Charts"
    },
    { route: "/dashboard/analytics",
      name: "Dashboard > Analytics"
    },
    {
      route: "/assets-management/conflicts",
      name: "Assets Management > Conflicts",
    },
    {
      route: "/assets-management/field-activity",
      name: "Assets Management > Field Activity",
    },
    {
      route: "/assets-management/file-upload",
      name: "Assets Management > File Upload",
    },
    {
      route: "/assets-management/hh-field",
      name: "Assets Management > HH Field",
    },
    {
      route: "/assets-management/hh-info",
      name: "Assets Management > HH Info",
    },
    {
      route: "/assets-management/install-assets",
      name: "Assets Management > Install Assets",
    },
    {
      route: "/assets-management/master-data",
      name: "Assets Management > Master Data",
    },
    {
      route: "/assets-management/stock-tracker",
      name: "Assets Management > Stock Tracker",
    },
    {
      route: "/assets-management/test-archive",
      name: "Assets Management > Test Archive",
    },
    { route: "/live-monitoring", name: "Live Monitoring" },
    { route: "/meter-management/alarms", name: "Meter Management > Alarms" },
    {
      route: "/meter-management/config-update",
      name: "Meter Management > Config Update",
    },
    {
      route: "/meter-management/device-insight",
      name: "Meter Management > Device Insight",
    },
    {
      route: "/meter-management/device-release",
      name: "Meter Management > Device Release",
    },
    {
      route: "/meter-management/event-stream",
      name: "Meter Management > Event Stream",
    },
    {
      route: "/meter-management/installation-archive",
      name: "Meter Management > Installation Archive",
    },
    {
      route: "/user-management/manage-users",
      name: "User Management > Manage Users",
    },
    {
      route: "/user-management/role-management",
      name: "User Management > Role Management",
    },
  ];

  const filteredPages = pages.filter((page) =>
    page.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchClick = () => {
    setIsExpanded(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageSelect = (route) => {
    router.push(route);
    setIsExpanded(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ width: "40px" }}
      animate={{ width: isExpanded ? "300px" : "40px" }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {isExpanded ? (
        <Input
          type="text"
          placeholder="Search pages..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full pr-10"
          autoFocus
        />
      ) : (
        <Button variant="ghost" size="icon" onClick={handleSearchClick}>
          <Search className="h-6 w-6" />
        </Button>
      )}
      {isExpanded && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          onClick={() => setIsExpanded(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      <AnimatePresence>
        {isExpanded && filteredPages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full mt-2 bg-popover rounded-md shadow-lg z-50"
          >
            <ScrollArea className="h-64 rounded-xl border-2">
              {filteredPages.map((page, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-left"
                  onClick={() => handlePageSelect(page.route)}
                >
                  {page.name}
                </Button>
              ))}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function Topbar({ toggleSidebar }) {
  const { theme, setTheme } = useThemeStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [username, setUsername] = useState("");
  const { timezone, setTimezone } = useTimezoneStore();
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const name = Cookies.get("name");
    if (name) {
      setUsername(name);
    }

    const savedTheme = localStorage.getItem("theme") || "system";
    setTheme(savedTheme);
    applyTheme(savedTheme);

    // Set up WebSocket connection
    const ws = new WebSocket("ws://localhost:5000");

    ws.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prevNotifications) => [
        newNotification,
        ...prevNotifications,
      ]);
      setHasNewNotifications(true);
    };

    return () => {
      ws.close();
    };
  }, []);

  const deleteNotification = (index) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((_, i) => i !== index)
    );
  };

  const applyTheme = (newTheme) => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    let effectiveTheme = newTheme;
    if (newTheme === "system") {
      effectiveTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    root.classList.add(effectiveTheme);
    root.style.colorScheme = effectiveTheme;
  };

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-6 w-6" />;
      case "dark":
        return <Moon className="h-6 w-6" />;
      default:
        return <Laptop className="h-6 w-6" />;
    }
  };

  const handleLogout = () => {
    Cookies.remove("name");
    Cookies.remove("token");
    Cookies.remove("expiry");
    Cookies.remove("email");
    Cookies.remove("userId");
    router.push("/login");
  };

  const handleNotificationClick = () => {
    setIsSheetOpen(true);
    setHasNewNotifications(false);
  };

  return (
    <div className="bg-card px-4 py-2 flex justify-between items-center border-b z-50">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 lg:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
          <Image
            src="/images/inditronics-logo.png "
            height={40}
            width={40}
            alt="logo"
          />
          <h1 className="text-xl font-extrabold text-primary">Inditronics</h1>
        </div>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <SearchComponent onClose={() => {}} />
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotificationClick}
              className="relative"
            >
              <Bell className="h-6 w-6" />
              {hasNewNotifications && (
                <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Notifications</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-100px)] mt-4 pr-4">
              {notifications.map((notification, index) => (
                <NotificationItem
                  key={index}
                  {...notification}
                  onDelete={() => deleteNotification(index)}
                />
              ))}
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <Select value={timezone} onValueChange={setTimezone}>
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder={timezone} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="IST">IST</SelectItem>
              <SelectItem value="UTC">UTC</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              {getThemeIcon()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Choose theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => changeTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => changeTheme("system")}>
              <Laptop className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0">
              <Avatar>
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>
                  {username ? username.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{username || "User"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span className="text-red-500">Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
