"use client";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Mail,
  ChevronLeft,
  Menu,
  X,
  Settings,
  LogOut,
  Bookmark,
  MessageSquare,
  FileText,
  Languages,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUserFromToken } from "@/Hooks/useUserFromToken";
import { GoogleTranslate } from "./GoogleTranslate";

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useUserFromToken();

  const adminNavItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/",
    },
    { title: "Users", icon: <Users className="h-5 w-5" />, href: "/users" },
    {
      title: "Classes",
      icon: <BookOpen className="h-5 w-5" />,
      href: "/classes",
    },
    {
      title: "Results",
      icon: <GraduationCap className="h-5 w-5" />,
      href: "/results",
    },
    {
      title: "Messages",
      icon: <Mail className="h-5 w-5" />,
      href: "/messages",
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/settings",
    },
  ];

  const teacherNavItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/",
    },

    {
      title: "Give Results",
      icon: <FileText className="h-5 w-5" />,
      href: "/give-results",
    },
    {
      title: "Messages",
      icon: <MessageSquare className="h-5 w-5" />,
      href: "/messages",
    },
  ];

  const studentNavItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/",
    },
    {
      title: "My Results",
      icon: <Bookmark className="h-5 w-5" />,
      href: "/my-results",
    },
  ];

  const navItems =
    user?.role === "admin"
      ? adminNavItems
      : user?.role === "teacher"
      ? teacherNavItems
      : studentNavItems;

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="rounded-lg shadow-sm bg-background/80 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-background border-r z-40 transition-all duration-300 ease-in-out",
          "shadow-lg",
          isCollapsed ? "w-20" : "w-64",
          !isMobileOpen && "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div
            className={cn(
              "flex items-center p-4 border-b",
              "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground",
              isCollapsed ? "justify-center" : "justify-between"
            )}
          >
            {!isCollapsed && (
              <h1 className="text-xl font-bold tracking-tight">SchoolPro</h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary/80 rounded-full"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ChevronLeft
                className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  isCollapsed && "rotate-180"
                )}
              />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-2 px-1">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center p-3 rounded-lg transition-colors mx-1",
                        "hover:bg-accent hover:text-accent-foreground",
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground",
                        isCollapsed ? "justify-center" : "justify-start gap-3"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute left-0 w-1 h-6 rounded-r-full transition-all",
                          isActive ? "bg-primary" : "bg-transparent"
                        )}
                      />
                      {item.icon}
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="px-4 py-3 border-b  flex items-center gap-5  w-full">
            <div className="flex mr5 items-center gap-2 text-sm text-muted-foreground">
              <Languages className="h-4 w-4" />
              <span>Language:</span>
            </div>
            <div className="mt-2">
              <GoogleTranslate />
            </div>
          </div>

          {/* User Profile */}
          <div
            className={cn(
              "p-3 border-t",
              isCollapsed ? "flex justify-center" : ""
            )}
          >
            <div
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg",
                isCollapsed ? "justify-center" : "justify-between"
              )}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="overflow-hidden">
                    <p className="font-medium truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize truncate">
                      {user?.role || "Student"}
                    </p>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
