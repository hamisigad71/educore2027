import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { LogoFull } from "@/components/Logo";

// shadcn/ui
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

// lucide
import {
  Menu,
  Search,
  LogOut,
  Bell,
  Settings,
  User,
  ChevronRight,
  Home,
  Keyboard,
  HelpCircle,
  BookOpen,
  CreditCard,
  Users,
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  Sun,
  Moon,
  ExternalLink,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Notification = {
  id: string;
  type: "success" | "warning" | "info";
  title: string;
  desc: string;
  time: string;
  read: boolean;
};

// ─── Mock notifications ───────────────────────────────────────────────────────

const NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "warning",
    title: "Fee deadline approaching",
    desc: "14 students have unpaid balances due in 3 days",
    time: "2 min ago",
    read: false,
  },
  {
    id: "2",
    type: "success",
    title: "Term 2 results published",
    desc: "Grade 8 exam results are now visible to parents",
    time: "1 hr ago",
    read: false,
  },
  {
    id: "3",
    type: "info",
    title: "New teacher registered",
    desc: "Ms. Alice Njeri joined the Mathematics department",
    time: "3 hrs ago",
    read: false,
  },
  {
    id: "4",
    type: "success",
    title: "Attendance synced",
    desc: "Today's attendance records have been saved",
    time: "Yesterday",
    read: true,
  },
  {
    id: "5",
    type: "info",
    title: "System maintenance",
    desc: "Scheduled downtime on Sunday 02:00–04:00 AM",
    time: "2 days ago",
    read: true,
  },
];

// ─── Quick-search suggestions ─────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: "Students", icon: <Users size={14} />, href: "/admin/students" },
  { label: "Fee Records", icon: <CreditCard size={14} />, href: "/admin/fees" },
  { label: "Teachers", icon: <BookOpen size={14} />, href: "/admin/teachers" },
  { label: "Reports", icon: <ExternalLink size={14} />, href: "/admin/reports" },
];

// ─── Breadcrumb helper ────────────────────────────────────────────────────────

function useBreadcrumbs() {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  return parts.map((p, i) => ({
    label: p.charAt(0).toUpperCase() + p.slice(1),
    href: "/" + parts.slice(0, i + 1).join("/"),
    isLast: i === parts.length - 1,
  }));
}

// ─── Notification icon ────────────────────────────────────────────────────────

function NotifIcon({ type }: { type: Notification["type"] }) {
  if (type === "success")
    return <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />;
  if (type === "warning")
    return <AlertCircle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />;
  return <Info size={14} className="text-indigo-500 flex-shrink-0 mt-0.5" />;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Topbar({
  onMenu,
  portalLabel,
  userImg,
  userName,
}: {
  onMenu: () => void;
  portalLabel: string;
  userImg?: string;
  userName?: string;
}) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const breadcrumbs = useBreadcrumbs();

  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const searchRef = useRef<HTMLInputElement>(null);

  const unread = notifications.filter((n) => !n.read).length;
  const displayName = user?.name || userName || "User Account";
  const displayRole = user?.role || "Staff";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Keyboard shortcut: Cmd/Ctrl+K → focus search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
      if (e.key === "Escape") setSearchOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function dismissNotif(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <header className="sticky top-0 z-40 flex flex-col shrink-0 bg-white border-b border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">

      {/* ── Main bar ──────────────────────────────────────────────────── */}
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">

        {/* Mobile hamburger */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onMenu}
          className="lg:hidden h-9 w-9 p-0 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg"
        >
          <Menu size={18} />
        </Button>

        {/* Logo */}
        <div className="flex items-center shrink-0 mr-2">
          <LogoFull className="h-14 w-auto" />
        </div>

        {/* Portal badge */}
        <Badge
          variant="outline"
          className="hidden lg:inline-flex bg-indigo-50 text-indigo-700 border-indigo-200 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 shrink-0 translate-y-[13px]"
        >
          {portalLabel}
        </Badge>

        <div className="flex-1" />

        {/* ── Search bar ─────────────────────────────────────────────── */}
        <div className="hidden md:flex relative w-[280px] lg:w-[340px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            ref={searchRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
            placeholder="Search anything…"
            className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-16 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-300 focus:bg-white placeholder:text-slate-400"
          />
          {/* Keyboard shortcut hint */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
            <kbd className="inline-flex items-center h-5 px-1.5 rounded border border-slate-200 bg-slate-100 text-[10px] font-mono text-slate-400">⌘K</kbd>
          </div>

          {/* Search dropdown */}
          {searchOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Quick Links</p>
              </div>
              {QUICK_LINKS.filter((l) =>
                q === "" || l.label.toLowerCase().includes(q.toLowerCase())
              ).map((l) => (
                <button
                  key={l.href}
                  onMouseDown={() => navigate(l.href)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  <span className="text-slate-400">{l.icon}</span>
                  {l.label}
                  <ChevronRight size={12} className="ml-auto text-slate-300" />
                </button>
              ))}
              {q && (
                <div className="px-3 py-2.5 border-t border-slate-100">
                  <button
                    onMouseDown={() => navigate(`/admin/search?q=${q}`)}
                    className="flex items-center gap-2 text-xs text-indigo-600 font-medium w-full hover:underline"
                  >
                    <Search size={12} />
                    Search for "{q}"
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right actions ──────────────────────────────────────────── */}
        <div className="flex items-center gap-1.5">

          {/* Keyboard shortcut hint (desktop only) */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden xl:flex items-center gap-1.5 h-9 px-3 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            <Keyboard size={13} />
            <span className="font-medium">Shortcuts</span>
          </Button>

          {/* Help */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden lg:flex items-center gap-1.5 h-9 px-3 text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg"
            onClick={() => navigate("/help")}
          >
            <HelpCircle size={13} />
            <span className="font-medium">Help</span>
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

          {/* Notifications bell */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-9 w-9 p-0 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <Bell size={17} />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white leading-none">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[360px] p-0 shadow-xl border-slate-200 rounded-xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Notifications</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {unread > 0 ? `${unread} unread` : "All caught up"}
                  </p>
                </div>
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="divide-y divide-slate-100 max-h-[340px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center py-10 text-center">
                    <Bell size={28} className="text-slate-200 mb-2" />
                    <p className="text-xs text-slate-400">No notifications</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "flex gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group",
                        !n.read && "bg-indigo-50/30"
                      )}
                    >
                      <NotifIcon type={n.type} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn("text-xs leading-tight", n.read ? "text-slate-600 font-normal" : "text-slate-900 font-semibold")}>
                            {n.title}
                          </p>
                          <button
                            onClick={() => dismissNotif(n.id)}
                            className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-slate-500 transition-opacity flex-shrink-0"
                          >
                            <X size={12} />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{n.desc}</p>
                        <p className="text-[10px] text-slate-300 mt-1">{n.time}</p>
                      </div>
                      {!n.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
                <button
                  onClick={() => navigate("/notifications")}
                  className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 w-full justify-center hover:underline"
                >
                  View all notifications <ChevronRight size={12} />
                </button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Settings shortcut */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/settings")}
            className="h-9 w-9 p-0 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
          >
            <Settings size={16} />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 pl-1 hover:bg-slate-50 rounded-xl pr-2 py-1 transition-colors group">
                <Avatar className="h-8 w-8 ring-2 ring-slate-100 group-hover:ring-indigo-200 transition-all shadow-sm">
                  <AvatarImage src={userImg || user?.photo} className="object-cover" />
                  <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-slate-900 leading-tight max-w-[110px] truncate">
                    {displayName}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5 capitalize">{displayRole}</p>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[220px] shadow-xl border-slate-200 rounded-xl p-1.5 mt-1">
              {/* User info header */}
              <div className="flex items-center gap-2.5 px-2.5 py-2 mb-1">
                <Avatar className="h-9 w-9 ring-2 ring-slate-100">
                  <AvatarImage src={userImg || user?.photo} className="object-cover" />
                  <AvatarFallback className="bg-indigo-50 text-indigo-700 font-bold text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">{displayName}</p>
                  <p className="text-[10px] text-slate-400 capitalize mt-0.5">{displayRole}</p>
                </div>
              </div>

              <DropdownMenuSeparator className="my-1" />

              <DropdownMenuItem
                className="gap-2.5 text-xs cursor-pointer rounded-lg px-2.5 py-2"
                onClick={() => navigate("/profile")}
              >
                <User size={13} className="text-slate-400" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2.5 text-xs cursor-pointer rounded-lg px-2.5 py-2"
                onClick={() => navigate("/settings")}
              >
                <Settings size={13} className="text-slate-400" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="gap-2.5 text-xs cursor-pointer rounded-lg px-2.5 py-2"
                onClick={() => navigate("/help")}
              >
                <HelpCircle size={13} className="text-slate-400" />
                Help & Support
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1" />

              <DropdownMenuItem
                className="gap-2.5 text-xs cursor-pointer rounded-lg px-2.5 py-2 text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                onClick={handleLogout}
              >
                <LogOut size={13} />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── Breadcrumb bar ──────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 px-6 h-9 border-t border-slate-100 bg-slate-50/60 overflow-x-auto scrollbar-none">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-slate-400 hover:text-indigo-600 transition-colors flex-shrink-0"
        >
          <Home size={12} />
        </button>
        {breadcrumbs.map((b) => (
          <React.Fragment key={b.href}>
            <ChevronRight size={11} className="text-slate-300 flex-shrink-0" />
            <button
              onClick={() => !b.isLast && navigate(b.href)}
              className={cn(
                "text-[11px] font-medium whitespace-nowrap transition-colors flex-shrink-0",
                b.isLast
                  ? "text-slate-700 cursor-default"
                  : "text-slate-400 hover:text-indigo-600 cursor-pointer"
              )}
            >
              {b.label}
            </button>
          </React.Fragment>
        ))}

        <div className="flex-1" />

        {/* Live indicator */}
        <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Bright Futures Academy</span>
        </div>
      </div>
    </header>
  );
}