"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HiOutlineViewGrid,
  HiOutlineGlobe,
  HiOutlineDocumentText,
  HiOutlineCog,
  HiOutlineCreditCard,
  HiOutlineQuestionMarkCircle,
  HiChevronLeft,
  HiChevronRight,
  HiOutlineLogout,
  HiMenu,
  HiX,
  HiOutlineUser,
} from "react-icons/hi";
import { RiRobot2Line } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const mainNavItems = [
  { name: "Oversikt", href: "/dashboard", icon: HiOutlineViewGrid },
  { name: "Plattformer", href: "/dashboard/platforms", icon: HiOutlineGlobe },
  { name: "Forespørsler", href: "/dashboard/requests", icon: HiOutlineDocumentText },
  { name: "AI Assistent", href: "/dashboard/assistant", icon: RiRobot2Line },
];

const supportNavItems = [
  { name: "Innstillinger", href: "/dashboard/settings", icon: HiOutlineCog },
  { name: "Fakturering", href: "/dashboard/billing", icon: HiOutlineCreditCard },
  { name: "Hjelp", href: "/dashboard/help", icon: HiOutlineQuestionMarkCircle },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border bg-card shadow-sm md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <HiX size={20} /> : <HiMenu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-card transition-all duration-300",
          isCollapsed ? "w-[72px]" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image
              src="/delete.svg"
              alt="SlettMeg Logo"
              width={36}
              height={36}
              className="h-9 w-9 shrink-0"
            />
            {!isCollapsed && (
              <span className="text-lg font-semibold tracking-tight">SlettMeg</span>
            )}
          </Link>
          <button
            className="hidden h-8 w-8 items-center justify-center rounded-md hover:bg-muted md:flex"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <HiChevronRight size={16} />
            ) : (
              <HiChevronLeft size={16} />
            )}
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Meny
              </p>
            )}
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    isCollapsed && "justify-center px-0"
                  )}
                  onClick={() => setIsMobileOpen(false)}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>

          <div className="my-4 h-px bg-border" />

          <div className="space-y-1">
            {!isCollapsed && (
              <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Konto
              </p>
            )}
            {supportNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    isCollapsed && "justify-center px-0"
                  )}
                  onClick={() => setIsMobileOpen(false)}
                  title={isCollapsed ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="border-t p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg p-2",
              isCollapsed && "justify-center"
            )}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
              <HiOutlineUser size={16} className="text-muted-foreground" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 truncate">
                <p className="truncate text-sm font-medium">Demo Bruker</p>
                <p className="truncate text-xs text-muted-foreground">demo@example.com</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            className={cn(
              "mt-2 w-full justify-start gap-3 text-muted-foreground",
              isCollapsed && "justify-center px-0"
            )}
          >
            <HiOutlineLogout size={16} className="shrink-0" />
            {!isCollapsed && <span>Logg ut</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
