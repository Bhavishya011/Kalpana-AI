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
  LineChart,
} from "lucide-react";
import type { ReactNode } from "react";
import Link from "next/link";
import type { getDictionary } from "@/lib/i18n/dictionaries";
import { usePathname } from "next/navigation";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>["dashboard"];

export function DashboardLayout({
  children,
  dictionary,
}: {
  children: ReactNode;
  dictionary: Dictionary;
}) {
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'en-US';

  const menuItems = [
    {
      href: `/${lang}`,
      icon: Home,
      label: dictionary.sidebar.dashboard,
      tooltip: dictionary.sidebar.dashboard,
      path: `/${lang}`,
    },
    {
      href: `/${lang}/story-studio`,
      icon: Sparkles,
      label: dictionary.sidebar.storyStudio,
      tooltip: dictionary.sidebar.storyStudio,
      path: `/${lang}/story-studio`,
    },
    {
        href: `/${lang}/sales-analytics`,
        icon: LineChart,
        label: dictionary.sidebar.salesAnalytics,
        tooltip: dictionary.sidebar.salesAnalytics,
        path: `/${lang}/sales-analytics`,
    },
    {
      href: `/${lang}/the-muse`,
      icon: Palette,
      label: dictionary.sidebar.theMuse,
      tooltip: dictionary.sidebar.theMuse,
      path: `/${lang}/the-muse`,
    },
    {
      href: `/${lang}/artisan-circle`,
      icon: Users,
      label: dictionary.sidebar.artisanCircle,
      tooltip: dictionary.sidebar.artisanCircle,
      path: `/${lang}/artisan-circle`,
    },
  ];
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
                  isActive={pathname === item.path}
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
              <SidebarMenuButton asChild tooltip={dictionary.sidebar.settings}>
                <Link href="#">
                  <Settings />
                  <span>{dictionary.sidebar.settings}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={dictionary.sidebar.support}>
                <Link href="#">
                  <LifeBuoy />
                  <span>{dictionary.sidebar.support}</span>
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
