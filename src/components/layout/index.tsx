import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

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
  Shield,
  ChevronRight,
  Landmark, Banknote, ShoppingBag, 
  Stethoscope, Pill, ActivitySquare,
  UserPlus, Archive, Package,
  Wrench, Bus, ShieldAlert,
  Bed, Scale, Library,
  FileText, BadgeDollarSign, MapPin, Building2,
  Utensils, Coffee
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
      { to: "/admin/staff", label: "Staff", icon: Users },
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
    groupLabel: "Academic",
    items: [
      { to: "/teacher/classes",     label: "My Classes",     icon: Users, badge: "5" },
      { to: "/teacher/lessons",     label: "Lesson Planner", icon: BookOpen },
      { to: "/teacher/timetable",   label: "My Timetable",   icon: CalendarClock },
      { to: "/teacher/resources",   label: "Resources",      icon: Library },
      { to: "/teacher/assignments", label: "Assignments",    icon: FileText },
    ],
  },
  {
    groupLabel: "Teaching",
    items: [
      { to: "/teacher/students",   label: "Students",    icon: GraduationCap },
      { to: "/teacher/marks",      label: "Enter Marks", icon: ClipboardList },
      { to: "/teacher/attendance", label: "Attendance",  icon: CalendarDays },
    ],
  },
  {
    groupLabel: "Welfare & Conduct",
    items: [
      { to: "/teacher/conduct", label: "Behavioral Log", icon: ShieldAlert },
      { to: "/teacher/welfare", label: "Student Welfare", icon: Stethoscope },
    ],
  },
  {
    groupLabel: "Management",
    items: [
      { to: "/teacher/analytics", label: "Analytics",      icon: BarChart3 },
      { to: "/teacher/requests",  label: "Leaves & Reqs",  icon: Archive },
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
      { to: "/parent-and-student-portal/resources",  label: "Learning Hub",    icon: Library         },
      { to: "/parent-and-student-portal/reports",    label: "Termly Reports",  icon: FileText        },
    ],
  },
  {
    groupLabel: "Communication",
    items: [
      { to: "/parent-and-student-portal/calendar",   label: "School Calendar", icon: CalendarClock   },
      { to: "/parent-and-student-portal/notices",    label: "Notice Board",    icon: Bell            },
      { to: "/parent-and-student-portal/messages",   label: "Teacher Chat",    icon: Users           },
    ],
  },
  {
    groupLabel: "Finance",
    items: [
      { to: "/parent-and-student-portal/fees",       label: "Fees & Payments", icon: Wallet, badge: "Bal", badgeVariant: "warning" },
    ],
  },
  {
    groupLabel: "Logistics & Welfare",
    items: [
      { to: "/parent-and-student-portal/transport",  label: "Transport",       icon: Bus             },
      { to: "/parent-and-student-portal/conduct",    label: "Conduct Log",     icon: Shield          },
      {to: "/parent-and-student-portal/meals",      label: "Meal Planner",    icon: Utensils        },
      { to: "/parent-and-student-portal/activities", label: "Co-curricular",   icon: Zap             },
    ],
  },
  {
    groupLabel: "Administrative",
    items: [
      { to: "/parent-and-student-portal/vault",      label: "Document Vault",  icon: Archive         },
      { to: "/parent-and-student-portal/store",      label: "Uniform Store",   icon: ShoppingBag     },
    ],
  },
  {
    groupLabel: "Account",
    items: [
      { to: "/parent-and-student-portal/profile",    label: "Profile",         icon: User            },
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

// ─── Helper for High School prefixing ──────────────────────────────────────────

function prefixNav(nav: NavGroup[], prefix: string): NavGroup[] {
  return nav.map(group => ({
    ...group,
    items: group.items.map(item => ({
      ...item,
      to: `${prefix}${item.to}`
    }))
  }));
}



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
          "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-200 select-none my-0.5",
          collapsed ? "justify-center px-0 w-10 mx-auto h-10" : "h-10",
          isActive
            ? "bg-indigo-50/80 text-indigo-700 shadow-[inset_0_0_0_1px_rgba(79,70,229,0.1)]"
            : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Active indicator bar */}
          {!collapsed && isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-indigo-600" />
          )}

          <item.icon
            size={18}
            className={cn(
              "shrink-0 transition-colors duration-200",
              isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600/80"
            )}
          />

          {!collapsed && (
            <>
              <span className={cn(
                "flex-1 leading-none tracking-tight",
                isActive ? "font-semibold" : "font-medium"
              )}>
                {item.label}
              </span>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-md border leading-none ml-1",
                    isActive
                      ? "bg-indigo-100 text-indigo-700 border-indigo-200"
                      : BADGE_CLASSES[item.badgeVariant ?? "default"]
                  )}
                >
                  {item.badge}
                </span>
              )}
            </>
          )}

          {/* Hover indicator bar - subtle */}
          {!collapsed && !isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-3 rounded-full bg-slate-200 transition-all duration-200" />
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
  const { portal } = useAuth();
  const portalLabel = portal === "highschool" ? "High School" : "Primary School";

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

        {/* ── Header / Role Identity ─────────────────────────── */}
        <div className={cn(
          "shrink-0 flex items-center gap-3 transition-all duration-300",
          collapsed ? "flex-col py-4" : "px-5 py-5 pb-4"
        )}>
          {/* Role Icon Area */}
          <div className={cn(
            "rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 transition-all duration-300",
            collapsed ? "h-10 w-10" : "h-11 w-11 shadow-indigo-200/50",
            roleColor
          )}>
            {roleIcon ?? <Building2 size={collapsed ? 20 : 22} />}
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h2 className="text-[15px] font-bold text-slate-900 truncate tracking-tight">{label}</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{portalLabel}</span>
              </div>
            </div>
          )}

          {onToggleCollapse && !collapsed && (
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onToggleCollapse}
                    className="h-8 w-8 flex items-center justify-center rounded-xl border border-slate-100 text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all duration-200"
                  >
                    <ChevronLeft size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">Collapse menu</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {collapsed && onToggleCollapse && (
          <div className="px-3 pb-2 pt-1 flex justify-center">
            <button
              onClick={onToggleCollapse}
              className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all duration-200"
            >
              <ChevronRight size={16} />
            </button>
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
                    <Zap size={13} className="text-white" />
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
      roleIcon={<Building2 size={17} className="text-white" />}
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
  const { department, portal } = useAuth();

  // Build department-specific module nav for primary school
  const deptNav: NavGroup[] = React.useMemo(() => {
    if (portal === "highschool") return []; // HS uses its own HSStaffSidebar

    const deptBaseNav: Record<string, NavGroup[]> = {
      headteacher: [{
        groupLabel: "Head Teacher",
        items: [
          { to: "/staff/headteacher",           label: "Overview",   icon: LayoutDashboard },
          { to: "/staff/headteacher/academics",  label: "Academics",  icon: BookOpen },
          { to: "/staff/headteacher/reports",    label: "Reports",    icon: ClipboardList },
        ],
      }],
      bursar: [{
        groupLabel: "Bursar's Office",
        items: [
          { to: "/staff/bursar",          label: "Fees Dashboard", icon: LayoutDashboard },
          { to: "/staff/bursar/payroll",  label: "Payroll",        icon: Wallet },
          { to: "/staff/bursar/expenses", label: "Expenses",       icon: Banknote },
        ],
      }],
      secretary: [{
        groupLabel: "Secretary",
        items: [
          { to: "/staff/secretary",                 label: "Admissions",      icon: LayoutDashboard },
          { to: "/staff/secretary/correspondence",  label: "Correspondence",  icon: Bell },
          { to: "/staff/secretary/records",         label: "Student Records", icon: ClipboardList },
        ],
      }],
      canteen: [{
        groupLabel: "Canteen",
        items: [
          { to: "/staff/canteen",           label: "Meal Planner", icon: LayoutDashboard },
          { to: "/staff/canteen/inventory", label: "Food Inventory", icon: Package },
        ],
      }],
    };

    return deptBaseNav[department ?? ""] ?? [];
  }, [department, portal]);

  const combinedNav: NavGroup[] = [
    {
      items: [
        { to: "/staff/dashboard", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    ...deptNav,
    {
      groupLabel: "Work",
      items: [
        { to: "/staff/tasks",      label: "My Tasks",     icon: ClipboardList, badge: "3", badgeVariant: "warning" },
        { to: "/staff/attendance", label: "Attendance",   icon: CalendarDays },
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

  return (
    <Sidebar
      nav={combinedNav}
      label="Staff Portal"
      roleColor="bg-amber-600"
      roleIcon={<ClipboardList size={17} className="text-white" />}
      {...props}
    />
  );
}

export function HSAdminSidebar(props: PublicSidebarProps) {
  return (
    <Sidebar
      nav={hsAdminNav}
      label="HS Admin Portal"
      roleColor="bg-indigo-700"
      roleIcon={<Building2 size={17} className="text-white" />}
      {...props}
    />
  );
}

export function HSTeacherSidebar(props: PublicSidebarProps) {
  return (
    <Sidebar
      nav={hsTeacherNav}
      label="HS Teacher Portal"
      roleColor="bg-sky-700"
      roleIcon={<BookOpen size={17} className="text-white" />}
      {...props}
    />
  );
}

export function HSPortalSidebar(props: PublicSidebarProps) {
  return (
    <Sidebar
      nav={hsPortalNav}
      label="HS Parent / Student"
      roleColor="bg-emerald-700"
      roleIcon={<Users size={17} className="text-white" />}
      {...props}
    />
  );
}

export function HSStaffSidebar(props: PublicSidebarProps & { department?: string }) {
  let nav = hsStaffNav;
  let label = "HS Staff Portal";
  let color = "bg-amber-700";
  let icon = <ClipboardList size={17} className="text-white" />;

  switch (props.department) {
    case "bursar":
      nav = bursarNav;
      label = "Bursar's Office";
      color = "bg-emerald-700";
      icon = <Landmark size={17} className="text-white" />;
      break;
    case "admissions":
      nav = admissionsNav;
      label = "Admissions Office";
      color = "bg-indigo-700";
      icon = <UserPlus size={17} className="text-white" />;
      break;
    case "library":
      nav = libraryNav;
      label = "School Library";
      color = "bg-blue-700";
      icon = <Library size={17} className="text-white" />;
      break;
    case "sanatorium":
      nav = sanatoriumNav;
      label = "Sanatorium / Clinic";
      color = "bg-rose-700";
      icon = <Stethoscope size={17} className="text-white" />;
      break;
    case "inventory":
      nav = inventoryNav;
      label = "Inventory & Labs";
      color = "bg-slate-700";
      icon = <Package size={17} className="text-white" />;
      break;
    case "boarding":
      nav = boardingNav;
      label = "Boarding & Welfare";
      color = "bg-purple-700";
      icon = <Bed size={17} className="text-white" />;
      break;
    case "operations":
      nav = operationsNav;
      label = "Ops & Security";
      color = "bg-orange-700";
      icon = <ShieldAlert size={17} className="text-white" />;
      break;
  }

  return (
    <Sidebar
      nav={nav}
      label={label}
      roleColor={color}
      roleIcon={icon}
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
  { to: "/admin/staff",      label: "Staff",    icon: Users       },
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

// ─── High School Navs ────────────────────────────────────────────────────────

export const hsAdminNav = prefixNav(adminNav, "/highschool");
export const hsTeacherNav = prefixNav(teacherNav, "/highschool");
export const hsPortalNav = prefixNav(portalNav, "/highschool");
export const hsStaffNav = prefixNav(staffNav, "/highschool");

// ─── Specialized High School Staff Navs ─────────────────────────────────────

export const bursarNav: NavGroup[] = [
  {
    items: [{ to: "/highschool/staff/bursar", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    groupLabel: "Finance",
    items: [
      { to: "/highschool/staff/bursar/fees", label: "Fee Collection", icon: Landmark },
      { to: "/highschool/staff/bursar/payroll", label: "Staff Payroll", icon: Banknote },
      { to: "/highschool/staff/bursar/expenses", label: "Expenditures", icon: ShoppingBag },
    ],
  },
  {
    groupLabel: "System",
    items: [
      { to: "/highschool/staff/bursar/reports", label: "Financial Reports", icon: BarChart3 },
    ],
  },
];

export const admissionsNav: NavGroup[] = [
  {
    items: [{ to: "/highschool/staff/admissions", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    groupLabel: "Registration",
    items: [
      { to: "/highschool/staff/admissions/inquiries", label: "Inquiries", icon: UserPlus },
      { to: "/highschool/staff/admissions/enrollment", label: "Enrollment", icon: Users },
      { to: "/highschool/staff/admissions/transfers", label: "Transfers", icon: Archive },
    ],
  },
];

export const libraryNav: NavGroup[] = [
  {
    items: [{ to: "/highschool/staff/library", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    groupLabel: "Library Ops",
    items: [
      { to: "/highschool/staff/library/catalog", label: "Book Catalog", icon: Library },
      { to: "/highschool/staff/library/circulation", label: "Circulation", icon: BookOpen },
      { to: "/highschool/staff/library/fines", label: "Library Fines", icon: BadgeDollarSign },
    ],
  },
];

export const sanatoriumNav: NavGroup[] = [
  {
    items: [{ to: "/highschool/staff/sanatorium", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    groupLabel: "Medical",
    items: [
      { to: "/highschool/staff/sanatorium/records", label: "Medical Records", icon: FileText },
      { to: "/highschool/staff/sanatorium/visits", label: "Clinic Visits", icon: ActivitySquare },
      { to: "/highschool/staff/sanatorium/supplies", label: "Supplies Stock", icon: Pill },
    ],
  },
];

export const inventoryNav: NavGroup[] = [
  {
    items: [{ to: "/highschool/staff/inventory", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    groupLabel: "Inventory",
    items: [
      { to: "/highschool/staff/inventory/assets", label: "Asset Tracking", icon: Package },
      { to: "/highschool/staff/inventory/requests", label: "Procurement", icon: ClipboardList },
      { to: "/highschool/staff/inventory/maintenance", label: "IT & Maintenance", icon: Wrench },
    ],
  },
];

export const boardingNav: NavGroup[] = [
  {
    items: [{ to: "/highschool/staff/boarding", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    groupLabel: "Welfare",
    items: [
      { to: "/highschool/staff/boarding/allocations", label: "Allocations", icon: Bed },
      { to: "/highschool/staff/boarding/incidents", label: "Incidents", icon: Scale },
      { to: "/highschool/staff/boarding/exeats", label: "Exeat Passes", icon: MapPin },
    ],
  },
];

export const operationsNav: NavGroup[] = [
  {
    items: [{ to: "/highschool/staff/operations", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    groupLabel: "Operational",
    items: [
      { to: "/highschool/staff/operations/visitors", label: "Visitor Logs", icon: ShieldAlert },
      { to: "/highschool/staff/operations/transport", label: "Transport", icon: Bus },
      { to: "/highschool/staff/operations/work-orders", label: "Work Orders", icon: Wrench },
    ],
  },
];

export const hsAdminBottomNav = adminBottomNav.map(i => ({ ...i, to: `/highschool${i.to}` }));
export const hsTeacherBottomNav = teacherBottomNav.map(i => ({ ...i, to: `/highschool${i.to}` }));
export const hsPortalBottomNav = portalBottomNav.map(i => ({ ...i, to: `/highschool${i.to}` }));
export const hsStaffBottomNav = staffBottomNav.map(i => ({ ...i, to: `/highschool${i.to}` }));

export function getHSStaffBottomNav(department?: string) {
  if (!department) return hsStaffBottomNav;

  const base = `/highschool/staff/${department}`;
  
  switch (department) {
    case "bursar":
      return [
        { to: base, label: "Home", icon: LayoutDashboard },
        { to: `${base}/fees`, label: "Fees", icon: Landmark },
        { to: `${base}/payroll`, label: "Payroll", icon: Banknote },
        { to: `${base}/expenses`, label: "Expenses", icon: ShoppingBag },
        { to: "/highschool/staff/profile", label: "Profile", icon: User },
      ];
    case "admissions":
      return [
        { to: base, label: "Home", icon: LayoutDashboard },
        { to: `${base}#intake`, label: "Intake", icon: UserPlus },
        { to: `${base}#roster`, label: "Roster", icon: Users },
        { to: "/highschool/staff/profile", label: "Profile", icon: User },
      ];
    case "sanatorium":
      return [
        { to: base, label: "Home", icon: LayoutDashboard },
        { to: `${base}#patients`, label: "Patients", icon: ActivitySquare },
        { to: `${base}#pharmacy`, label: "Pharmacy", icon: Pill },
        { to: "/highschool/staff/profile", label: "Profile", icon: User },
      ];
    default:
      return [
        { to: base, label: "Home", icon: LayoutDashboard },
        { to: "/highschool/staff/tasks", label: "Tasks", icon: ClipboardList },
        { to: "/highschool/staff/profile", label: "Profile", icon: User },
      ];
  }
}

// ─── Page Header ──────────────────────────────────────────────────────────────

export function PageHeader({
  title,
  subtitle,
  actions,
  badge,
  variant = "default",
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  badge?: { label: string; variant?: "default" | "success" | "warning" | "danger" };
  variant?: "default" | "banner";
}) {
  if (variant === "banner") {
    return (
      <div className="relative overflow-hidden rounded-[24px] bg-primary text-white p-6 sm:p-8 mb-8 shadow-xl shadow-indigo-200/20">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 h-full w-1/2 opacity-10 pointer-events-none select-none">
          <Building2 size={180} className="absolute -right-4 -bottom-8 rotate-12" />
        </div>
        <div className="absolute top-0 left-1/4 h-full w-1/4 bg-white/5 skew-x-[30deg] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="text-indigo-100/80 text-xs sm:text-sm font-medium mb-1.5 uppercase tracking-widest">{subtitle}</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 flex items-center justify-center sm:justify-start gap-3">
              {title}
            </h1>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-indigo-100/70 text-[11px] font-semibold uppercase tracking-wider">
               <MapPin size={12} /> Greenwood High School
            </div>
          </div>
          {actions && (
            <div className="shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7">
      <div className="flex items-start gap-3">
        {/* Vertical accent */}
        <div className="w-1 h-10 rounded-full bg-primary mt-0.5 shrink-0 hidden sm:block" />
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-[22px] font-semibold text-foreground tracking-tight leading-tight">
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
            <p className="text-sm text-muted-foreground mt-1 leading-snug">{subtitle}</p>
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