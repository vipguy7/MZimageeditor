"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn(
      "fixed z-30 inset-y-0 left-0 w-64 bg-white border-r transition-transform transform md:translate-x-0 -translate-x-full md:static md:inset-auto md:transform-none flex flex-col shadow-lg",
      "max-h-screen overflow-y-auto",
      className
    )}
    {...props}
  >
    {children}
  </nav>
))
Sidebar.displayName = "Sidebar"

const SidebarToggleButton = ({ onClick }: { onClick: () => void }) => (
  <button
    className="fixed top-4 left-4 z-40 md:hidden p-2 bg-white rounded-full shadow"
    onClick={onClick}
    aria-label="Open sidebar"
  >
    <svg width="24" height="24" fill="none" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
  </button>
)

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-1 flex flex-col gap-2 p-4", className)}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <footer
    ref={ref}
    className={cn("p-4 border-t mt-auto bg-gray-50 text-xs text-gray-500 text-center", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

export {
  Sidebar,
  SidebarToggleButton,
  SidebarContent,
  SidebarFooter,
}
