import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/icons";
import {
  Home,
  Sparkles,
  TrendingUp,
  Palette,
  Users,
  Settings,
  LifeBuoy,
} from "lucide-react";
import type { ReactNode } from "react";
import Link from "next/link";

const menuItems = [
  {
    href: "#",
    icon: Home,
    label: "Dashboard",
    tooltip: "Dashboard",
  },
  {
    href: "#",
    icon: Sparkles,
    label: "Story Studio",
    tooltip: "Story Studio",
  },
  {
    href: "#",
    icon: TrendingUp,
    label: "Market Pulse",
    tooltip: "Market Pulse",
  },
  {
    href: "#",
    icon: Palette,
    label: "The Muse",
    tooltip: "The Muse",
  },
  {
    href: "#",
    icon: Users,
    label: "Artisan Circle",
    tooltip: "Artisan Circle",
  },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader className="items-center justify-center p-4">
          <Logo className="size-7 text-primary group-data-[collapsible=icon]:size-7" />
          <span className="text-lg font-headline font-semibold text-primary transition-all group-data-[collapsible=icon]:-translate-x-8 group-data-[collapsible=icon]:opacity-0">
            KalpanaAI
          </span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  tooltip={{
                    children: item.tooltip,
                    className: "bg-primary text-primary-foreground",
                  }}
                  isActive={item.label === "Dashboard"}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings">
                <Link href="#">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Support">
                <Link href="#">
                  <LifeBuoy />
                  <span>Support</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
