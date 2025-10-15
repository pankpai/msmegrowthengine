import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Gauge, Home, Layers, User, LogOut } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getAccount, type AccountDetails } from "@/lib/auth";

import { Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();
  const isActive = (path: string) => location.pathname === path;

  const topTitle = useMemo(() => {
    const segs = location.pathname.split("/").filter(Boolean);
    const last = segs[segs.length - 1] || "dashboard";
    return last.charAt(0).toUpperCase() + last.slice(1);
  }, [location.pathname]);

  const initial = (user?.name?.[0] || user?.email?.[0] || "U").toUpperCase();
  const displayName = user?.name || user?.email || "User";
  const account: AccountDetails | null = getAccount();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarGroup>
            <SidebarGroupLabel>Overview</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isActive("/")}
                    onClick={() => navigate("/")}
                  >
                    {" "}
                    <Home /> <span>Home</span>{" "}
                  </SidebarMenuButton>
                </SidebarMenuItem> */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isActive("/dashboard")}
                    onClick={() => navigate("/dashboard")}
                  >
                    <Gauge /> <span>Dashboard</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isActive("/profile")}
                    onClick={() => navigate("/profile")}
                  >
                    <User /> <span>Profile</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={isActive("/services")}
                    onClick={() => navigate("/services")}
                  >
                    <Layers /> <span>Services</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent />
        <SidebarFooter>
          <div className="p-2 flex flex-col gap-2 w-full">
            <HoverCard openDelay={150} closeDelay={100}>
              <HoverCardTrigger asChild>
                <SidebarMenuButton
                  onClick={() => navigate("/profile")}
                  className="justify-start"
                >
                  <div className="flex items-center gap-2">
                    <div className="grid size-6 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-xs">
                      {initial}
                    </div>
                    <span className="text-sm">{displayName}</span>
                  </div>
                </SidebarMenuButton>
              </HoverCardTrigger>
              <HoverCardContent side="top" align="start" className="w-72">
                <div className="flex items-start gap-3">
                  <div className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-sm font-semibold">
                    {initial}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {displayName}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {account?.email}
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded border p-2">
                        <div className="text-[10px] text-muted-foreground">
                          Plan
                        </div>
                        <div className="font-medium">{account?.plan}</div>
                      </div>
                      <div className="rounded border p-2">
                        <div className="text-[10px] text-muted-foreground">
                          Days left
                        </div>
                        <div className="font-medium">{account?.daysLeft}</div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-primary underline">
                      Click to open profile
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            <SidebarMenuButton
              onClick={() => {
                handleLogout();
              }}
              className="justify-start"
            >
              <LogOut /> <span>Logout</span>
            </SidebarMenuButton>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div className="border-b bg-background/80 backdrop-blur">
          <div className="container flex h-12 items-center gap-2">
            <SidebarTrigger />
            <div className="ml-2 text-sm text-muted-foreground">{topTitle}</div>
          </div>
        </div>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
