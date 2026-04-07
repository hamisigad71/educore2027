import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LogoFull } from "@/components/Logo";

// shadcn/ui
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// lucide
import {
  ChevronLeft,
  LayoutDashboard,
  Users,
  UserSquare2,
  GraduationCap,
  Wallet,
  BarChart3,
  CalendarDays,
  CalendarClock,
  Settings,
  ClipboardList,
  Bell,
  User,
  Zap,
  Crown,
  BookOpen,
  TrendingUp,
  Shield,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export { Topbar } from "./Topbar";
export { BottomNav } from "./BottomNav";

// ─── Types ────────────────────────────────────────────────────────────────────

type NavItem = {
  to: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "danger";
};

type NavGroup = {
  groupLabel?: string;
  items: NavItem[];
};

// ─── Nav definitions ─────────────────────────────────────────────────────────

const adminNav: NavGroup[] = [
  {
    items: [
      { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    groupLabel: "People",
    items: [
      { to: "/admin/students",  label: "Students",  icon: GraduationCap, badge: "248" },
      { to: "/admin/teachers",  label: "Teachers",  icon: UserSquare2,   badge: "18"  },
      { to: "/admin/classes",   label: "Classes",   icon: Users,         badge: "12"  },
    ],
  },
  {
    groupLabel: "Academic",
    items: [
      { to: "/admin/results",    label: "Results",    icon: BarChart3    },
      { to: "/admin/attendance", label: "Attendance", icon: CalendarDays },
      { to: "/admin/timetable",  label: "Timetable",  icon: CalendarClock },
    ],
  },
  {
    groupLabel: "Finance",
    items: [
      { to: "/admin/fees", label: "Fees", icon: Wallet, badge: "14", badgeVariant: "warning" },
    ],
  },
  {
    groupLabel: "System",
    items: [
      { to: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

const teacherNav: NavGroup[] = [
  {
    items: [
      { to: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    groupLabel: "Teaching",
    items: [
      { to: "/teacher/classes",    label: "My Classes",  icon: Users,          badge: "5"  },
      { to: "/teacher/students",   label: "Students",    icon: GraduationCap              },
      { to: "/teacher/marks",      label: "Enter Marks", icon: ClipboardList              },
      { to: "/teacher/attendance", label: "Attendance",  icon: CalendarDays               },
    ],
  },
  {
    groupLabel: "Account",
    items: [
      { to: "/teacher/profile", label: "Profile", icon: User },
    ],
  },
];

const portalNav: NavGroup[] = [
  {
    items: [
      { to: "/parent-and-student-portal/dashboard",  label: "Overview",        icon: LayoutDashboard },
    ],
  },
  {
    groupLabel: "Academics",
    items: [
      { to: "/parent-and-student-portal/results",    label: "Results",         icon: BarChart3       },
      { to: "/parent-and-student-portal/attendance", label: "Attendance",      icon: CalendarDays    },
    ],
  },
  {
    groupLabel: "Finance",
    items: [
      { to: "/parent-and-student-portal/fees", label: "Fees & Payments", icon: Wallet, badge: "Bal", badgeVariant: "warning" },
    ],
  },
  {
    groupLabel: "Account",
    items: [
      { to: "/parent-and-student-portal/profile", label: "Profile", icon: User },
    ],
  },
];

const staffNav: NavGroup[] = [
  {
    items: [
      { to: "/staff/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    groupLabel: "Work",
    items: [
      { to: "/staff/tasks",      label: "My Tasks",     icon: ClipboardList, badge: "3", badgeVariant: "warning" },
      { to: "/staff/attendance", label: "Attendance",   icon: CalendarDays   },
      { to: "/staff/notices",    label: "Notice Board", icon: Bell, badge: "2", badgeVariant: "default" },
    ],
  },
  {
    groupLabel: "Account",
    items: [
      { to: "/staff/profile", label: "Profile", icon: User },
    ],
  },
];

// ─── Badge colour map ─────────────────────────────────────────────────────────

const BADGE_CLASSES: Record<string, string> = {
  default: "bg-indigo-50 text-indigo-600 border-indigo-200",
  success: "bg-emerald-50 text-emerald-600 border-emerald-200",
  warning: "bg-amber-50 text-amber-600 border-amber-200",
  danger:  "bg-rose-50 text-rose-600 border-rose-200",
};

// ─── Single nav item ──────────────────────────────────────────────────────────

function NavItemLink({
  item,
  collapsed,
  onClose,
}: {
  item: NavItem;
  collapsed: boolean;
  onClose: () => void;
}) {
  const link = (
    <NavLink
      to={item.to}
      onClick={onClose}
      className={({ isActive }) =>
        cn(
          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-150 select-none",
          collapsed ? "justify-center px-0 w-10 mx-auto" : "",
          isActive
            ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Left accent bar */}
          {!collapsed && !isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 group-hover:h-5 rounded-full bg-indigo-400 transition-all duration-200" />
          )}

          <item.icon
            size={17}
            className={cn(
              "shrink-0 transition-colors duration-150",
              isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-500"
            )}
          />

          {!collapsed && (
            <>
              <span className="flex-1 leading-none">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded-md border leading-none",
                    isActive
                      ? "bg-white/20 text-white border-white/30"
                      : BADGE_CLASSES[item.badgeVariant ?? "default"]
                  )}
                >
                  {item.badge}
                </span>
              )}
            </>
          )}
        </>
      )}
    </NavLink>
  );

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right" className="text-xs font-medium">
            {item.label}
            {item.badge && (
              <span className="ml-1.5 text-[10px] opacity-70">({item.badge})</span>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return link;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  nav: NavGroup[];
  label: string;
  roleColor?: string;
  roleIcon?: React.ReactNode;
  open: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

function Sidebar({
  nav,
  label,
  roleColor = "bg-indigo-600",
  roleIcon,
  open,
  onClose,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] transition-all duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed z-50 lg:z-auto lg:static inset-y-0 left-0 shrink-0 flex flex-col h-full",
          "bg-white border-r border-slate-200/80",
          "transition-all duration-300 ease-in-out lg:translate-x-0 overflow-hidden",
          collapsed ? "w-[68px]" : "w-[256px]",
          open ? "translate-x-0 shadow-2xl shadow-slate-900/10" : "-translate-x-full lg:translate-x-0"
        )}
      >

        {/* ── Collapse toggle / role icon ─────────────────────────── */}
        {onToggleCollapse && (
          <div className={cn(
            "shrink-0 pt-3 pb-2",
            collapsed ? "flex flex-col items-center gap-2" : "px-4 flex justify-end"
          )}>
            {/* Role icon — collapsed only */}
            {collapsed && (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={cn(
                      "h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-md mb-1",
                      roleColor
                    )}>
                      {roleIcon ?? <Crown size={18} fill="currentColor" />}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs font-medium">{label}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onToggleCollapse}
                    className={cn(
                      "hidden lg:flex items-center justify-center rounded-lg border border-slate-200 text-slate-400",
                      "hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-150",
                      collapsed ? "h-9 w-9" : "h-7 w-7"
                    )}
                  >
                    <ChevronLeft
                      size={14}
                      className={cn("transition-transform duration-300", collapsed && "rotate-180")}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  {collapsed ? "Expand" : "Collapse"} sidebar
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* ── Navigation ──────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4 mt-1 scrollbar-none">
          <ul className="space-y-0.5">
            {nav.map((group, gi) => (
              <React.Fragment key={gi}>
                {/* Group label */}
                {group.groupLabel && !collapsed && (
                  <li className="pt-4 pb-1.5 px-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400 select-none">
                      {group.groupLabel}
                    </p>
                  </li>
                )}
                {collapsed && gi > 0 && (
                  <li className="pt-3 pb-1 flex justify-center">
                    <div className="w-5 border-t border-slate-100" />
                  </li>
                )}
                {group.items.map((item) => (
                  <li key={item.to}>
                    <NavItemLink item={item} collapsed={collapsed} onClose={onClose} />
                  </li>
                ))}
              </React.Fragment>
            ))}
          </ul>
        </nav>

        {/* ── Bottom section ───────────────────────────────────────── */}
        {!collapsed && (
          <div className="shrink-0 px-3 pb-4 space-y-3">
            <Separator className="mb-3" />

            {/* School info row */}
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Shield size={14} className="text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-800 truncate leading-tight">
                  Bright Futures Academy
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <p className="text-[10px] text-slate-400">Live · Term 2, 2025</p>
                </div>
              </div>
              <ChevronRight size={12} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
            </div>

            {/* Pro promo card */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100/80 p-4 relative overflow-hidden">
              {/* Decorative orb */}
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-indigo-200/30 pointer-events-none" />
              <div className="absolute -left-4 -bottom-4 h-14 w-14 rounded-full bg-violet-200/20 pointer-events-none" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-300/50">
                    <Crown size={13} className="text-white" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                    Pro Feature
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-900 leading-snug">
                  Automate Fee Collection
                </p>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                  Collect fees instantly via M-PESA API & STK Push.
                </p>
                <button
                  onClick={() => navigate("/admin/settings?tab=integrations")}
                  className={cn(
                    "mt-3 w-full h-8 rounded-xl text-[11px] font-semibold transition-all duration-150",
                    "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200",
                    "flex items-center justify-center gap-1.5"
                  )}
                >
                  <Zap size={11} fill="currentColor" />
                  Enable Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed bottom icon */}
        {collapsed && (
          <div className="shrink-0 pb-4 flex flex-col items-center gap-2">
            <Separator className="w-8 mb-1" />
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => navigate("/admin/settings")}
                    className="h-9 w-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                  >
                    <Settings size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">Settings</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </aside>
    </>
  );
}

// ─── Role variants ────────────────────────────────────────────────────────────

interface PublicSidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AdminSidebar(props: PublicSidebarProps) {
  return (
    <Sidebar
      nav={adminNav}
      label="Admin Portal"
      roleColor="bg-indigo-600"
      roleIcon={<Crown size={17} className="text-white" />}
      {...props}
    />
  );
}

export function TeacherSidebar(props: PublicSidebarProps) {
  return (
    <Sidebar
      nav={teacherNav}
      label="Teacher Portal"
      roleColor="bg-sky-600"
      roleIcon={<BookOpen size={17} className="text-white" />}
      {...props}
    />
  );
}

export function PortalSidebar(props: PublicSidebarProps) {
  return (
    <Sidebar
      nav={portalNav}
      label="Parent / Student"
      roleColor="bg-emerald-600"
      roleIcon={<Users size={17} className="text-white" />}
      {...props}
    />
  );
}

export function StaffSidebar(props: PublicSidebarProps) {
  return (
    <Sidebar
      nav={staffNav}
      label="Staff / Workers"
      roleColor="bg-amber-600"
      roleIcon={<ClipboardList size={17} className="text-white" />}
      {...props}
    />
  );
}

// ─── Bottom Nav Items ──────────────────────────────────────────────────────────

export const adminBottomNav = [
  { to: "/admin/dashboard",  label: "Home",     icon: LayoutDashboard },
  { to: "/admin/students",   label: "Students", icon: GraduationCap   },
  { to: "/admin/teachers",   label: "Teachers", icon: UserSquare2    },
  { to: "/admin/fees",       label: "Fees",     icon: Wallet         },
  { to: "/admin/settings",   label: "Settings", icon: Settings       },
];

export const teacherBottomNav = [
  { to: "/teacher/dashboard",  label: "Home",       icon: LayoutDashboard },
  { to: "/teacher/classes",    label: "Classes",    icon: Users           },
  { to: "/teacher/marks",      label: "Marks",      icon: ClipboardList   },
  { to: "/teacher/attendance", label: "Attendance", icon: CalendarDays    },
  { to: "/teacher/profile",    label: "Profile",    icon: User           },
];

export const portalBottomNav = [
  { to: "/parent-and-student-portal/dashboard",  label: "Home",       icon: LayoutDashboard },
  { to: "/parent-and-student-portal/results",    label: "Results",    icon: BarChart3       },
  { to: "/parent-and-student-portal/attendance", label: "Attendance", icon: CalendarDays    },
  { to: "/parent-and-student-portal/fees",       label: "Fees",       icon: Wallet         },
  { to: "/parent-and-student-portal/profile",    label: "Profile",    icon: User           },
];

export const staffBottomNav = [
  { to: "/staff/dashboard",  label: "Home",     icon: LayoutDashboard },
  { to: "/staff/tasks",      label: "Tasks",    icon: ClipboardList   },
  { to: "/staff/attendance", label: "Attendance", icon: CalendarDays    },
  { to: "/staff/notices",    label: "Notices",  icon: Bell           },
  { to: "/staff/profile",    label: "Profile",  icon: User           },
];

// ─── Page Header ──────────────────────────────────────────────────────────────

export function PageHeader({
  title,
  subtitle,
  actions,
  badge,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  badge?: { label: string; variant?: "default" | "success" | "warning" | "danger" };
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7">
      <div className="flex items-start gap-3">
        {/* Vertical accent */}
        <div className="w-1 h-10 rounded-full bg-indigo-600 mt-0.5 shrink-0 hidden sm:block" />
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight leading-tight">
              {title}
            </h1>
            {badge && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-semibold border px-2 py-0.5",
                  BADGE_CLASSES[badge.variant ?? "default"]
                )}
              >
                {badge.label}
              </Badge>
            )}
          </div>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1 leading-snug">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
}