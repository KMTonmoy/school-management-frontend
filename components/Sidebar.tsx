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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/",
    },
    {
      title: "Users",
      icon: <Users className="h-5 w-5" />,
      href: "/users",
    },
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

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full shadow-sm"
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
          "fixed top-0 left-0 h-screen bg-background border-r z-40",
          "shadow-lg transition-all duration-300",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div
            className={cn(
              "flex items-center justify-between p-4 border-b",
              isCollapsed ? "flex-col gap-2" : "flex-row"
            )}
          >
            {!isCollapsed && (
              <h1 className="text-xl font-semibold text-primary">SchoolPro</h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-accent"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ChevronLeft
                className={cn(
                  "h-5 w-5 transition-transform",
                  isCollapsed ? "rotate-180" : ""
                )}
              />
            </Button>
          </div>

          {/* Navigation items */}
          <nav className="flex-1 p-2 overflow-y-auto">
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
                        "flex items-center p-3 rounded-lg transition-colors relative",
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

          {/* User profile with logout */}
          <div
            className={cn(
              "p-4 border-t flex items-center",
              isCollapsed ? "justify-center" : "justify-between"
            )}
          >
            {!isCollapsed ? (
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white">
                  <span className="font-medium">A</span>
                </div>
                <div className="truncate flex-1">
                  <p className="font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground truncate">
                    admin@school.edu
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white">
                <span className="font-medium">A</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
