"use client";

import { useEffect, useState } from "react";
import Topbar from "@/components/navigation/Topbar";
import Sidebar from "@/components/navigation/Sidebar";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Toaster } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function MainLayout({ children }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [tokenExpired, setTokenExpired] = useState(false);
    const router = useRouter();

    useEffect(() => {
      const checkAuth = () => {
        const token = Cookies.get("token");
        const expiry = Cookies.get("expiry");

        if (!token) {
          // No token found, redirect to login
          router.push("/login");
        } else if (expiry && Date.now() > Number(expiry)) {
          // Token expired
          setTokenExpired(true);
          clearAuthCookies();
        }
      };

      checkAuth();
    }, [router]);

    const clearAuthCookies = () => {
      Cookies.remove("token");
      Cookies.remove("name");
      Cookies.remove("role");
      Cookies.remove("expiry");
      Cookies.remove("email");
    };

    const handleLoginRedirect = () => {
      setTokenExpired(false);
      router.push("/login");
    };

  const toggleMobileSidebar = () =>
    setIsMobileSidebarOpen(!isMobileSidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-background">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
      
        <div className="flex-1 overflow-auto p-4">
          <Toaster />
          <AlertDialog open={tokenExpired} onOpenChange={setTokenExpired}>
            <AlertDialogTrigger></AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Token Expired</AlertDialogTitle>
                <AlertDialogDescription>
                  Your session has expired. Please log in again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleLoginRedirect}>
                  Login Again
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {children}
        </div>
      </div>
    </div>
  );
}
