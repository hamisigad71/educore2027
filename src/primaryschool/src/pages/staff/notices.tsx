import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

import {
  Bell, AlertTriangle, Info, Calendar,
  Clock, Filter, Search, ChevronRight,
  Pin, CheckCircle2, Users, Megaphone,
  BookOpen, ThumbsUp, Eye, X
} from "lucide-react";
import { cn } from "@/lib/utils";

type NoticeType = "urgent" | "general" | "event";
type Tab = "all" | "important" | "archived";

interface Notice {
  id: number;
  title: string;
  date: string;
  time: string;
  type: NoticeType;
  body: string;
  fullBody: string;
  pinned: boolean;
  acknowledged: number;
  viewed: boolean;
  archived: boolean;
  author: string;
  department: string;
}

const NOTICES: Notice[] = [
  {
    id: 1,
    title: "Staff Meeting — Friday 3:00 PM",
    date: "2025-09-26", time: "09:30 AM",
    type: "urgent",
    body: "Urgent discussion on school security protocols and the updated maintenance schedule for Q4.",
    fullBody: "All staff are required to attend the general meeting scheduled for Friday, 26 September 2025 at 3:00 PM in the Main Hall.\n\nAgenda:\n1. Security protocol review\n2. Maintenance schedule for Q4 2025\n3. Staff welfare updates\n4. Any Other Business (AOB)\n\nKindly confirm your attendance by Thursday EOD. Refreshments will be provided.",
    pinned: true, acknowledged: 18, viewed: true, archived: false,
    author: "Principal Kariuki", department: "Administration",
  },
  {
    id: 2,
    title: "Saturday Campus Cleanup — Voluntary",
    date: "2025-09-27", time: "08:00 AM",
    type: "event",
    body: "Voluntary staff session for campus beautification ahead of the upcoming Open Day.",
    fullBody: "The school is organizing a voluntary campus beautification session on Saturday, 27 September 2025 from 8:00 AM to 12:00 PM.\n\nActivities include:\n- Painting and touch-ups\n- Garden maintenance\n- General cleaning\n\nRefreshments and a small appreciation token will be provided to all staff who attend. Please inform your supervisor if you plan to join.",
    pinned: false, acknowledged: 7, viewed: false, archived: false,
    author: "Mr. Omondi", department: "Operations",
  },
  {
    id: 3,
    title: "Quarterly Payroll Bank Forms Update",
    date: "2025-09-20", time: "11:00 AM",
    type: "general",
    body: "Updated bank account forms are now available in the admin office for any staff requiring changes.",
    fullBody: "The Finance Department has released updated bank account change forms for Q4 2025 payroll processing.\n\nStaff who wish to update their banking details must:\n1. Collect the form from the Admin Office\n2. Fill in all required fields\n3. Attach a copy of their bank statement\n4. Submit by 30 September 2025\n\nLate submissions will be processed in the following month's payroll cycle.",
    pinned: false, acknowledged: 12, viewed: true, archived: false,
    author: "Finance Dept.", department: "Finance",
  },
  {
    id: 4,
    title: "Health & Safety Training — October 5th",
    date: "2025-09-18", time: "10:00 AM",
    type: "general",
    body: "Mandatory first aid and fire evacuation refresher training for all operational staff.",
    fullBody: "All operational staff are required to attend the annual Health & Safety refresher training on 5 October 2025.\n\nVenue: Science Lab Block B\nTime: 9:00 AM — 12:00 PM\n\nTopics covered:\n- Basic first aid\n- Fire evacuation procedures\n- Chemical handling safety\n\nAttendance is mandatory. Absences must be pre-approved by HOD.",
    pinned: false, acknowledged: 24, viewed: true, archived: true,
    author: "Safety Officer", department: "Health & Safety",
  },
];

const TYPE_CONFIG: Record<NoticeType, {
  label: string;
  badgeClass: string;
  iconBg: string;
  iconColor: string;
  icon: React.ElementType;
}> = {
  urgent:  { label: "URGENT",  badgeClass: "bg-rose-100 text-rose-700 border border-rose-200",   iconBg: "bg-rose-50 border-rose-100",     iconColor: "text-rose-500",   icon: AlertTriangle },
  general: { label: "GENERAL", badgeClass: "bg-indigo-100 text-indigo-700 border border-indigo-200", iconBg: "bg-indigo-50 border-indigo-100", iconColor: "text-indigo-500", icon: Info },
  event:   { label: "EVENT",   badgeClass: "bg-emerald-100 text-emerald-700 border border-emerald-200", iconBg: "bg-emerald-50 border-emerald-100", iconColor: "text-emerald-500", icon: Calendar },
};

export default function StaffNotices() {
  const { toast } = useToast();
  const [notices, setNotices] = useState<Notice[]>(NOTICES);
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [openNotice, setOpenNotice] = useState<Notice | null>(null);

  const filtered = useMemo(() => {
    return notices.filter(n => {
      const matchesQuery = n.title.toLowerCase().includes(query.toLowerCase()) ||
                           n.body.toLowerCase().includes(query.toLowerCase());
      const matchesTab =
        tab === "all"       ? !n.archived :
        tab === "important" ? n.pinned || n.type === "urgent" :
                              n.archived;
      return matchesQuery && matchesTab;
    });
  }, [notices, query, tab]);

  const unreadCount = notices.filter(n => !n.viewed && !n.archived).length;

  const acknowledge = (id: number) => {
    setNotices(prev => prev.map(n => n.id === id
      ? { ...n, acknowledged: n.acknowledged + 1, viewed: true } : n
    ));
    toast({ title: "Acknowledged", description: "Your response has been recorded." });
  };

  const markRead = (notice: Notice) => {
    if (!notice.viewed) {
      setNotices(prev => prev.map(n => n.id === notice.id ? { ...n, viewed: true } : n));
    }
    setOpenNotice({ ...notice, viewed: true });
  };

  const archive = (id: number) => {
    setNotices(prev => prev.map(n => n.id === id ? { ...n, archived: true } : n));
    toast({ title: "Notice archived" });
    setOpenNotice(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Official Notices"
        subtitle="Important announcements and updates from school management"
        actions={
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Badge className="bg-rose-500 text-white border-0 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                {unreadCount} unread
              </Badge>
            )}
            <Button variant="outline" size="sm" className="h-9 text-xs font-semibold border-slate-200 gap-1.5">
              <Bell size={13} /> Mark All Read
            </Button>
          </div>
        }
      />

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Notices", value: notices.filter(n => !n.archived).length, icon: Megaphone,    bg: "bg-indigo-50",  color: "text-indigo-600" },
          { label: "Urgent",        value: notices.filter(n => n.type === "urgent").length, icon: AlertTriangle, bg: "bg-rose-50",    color: "text-rose-600" },
          { label: "Unread",        value: unreadCount,                                     icon: Eye,           bg: "bg-amber-50",   color: "text-amber-600" },
          { label: "Acknowledged",  value: notices.filter(n => n.viewed).length,            icon: ThumbsUp,      bg: "bg-emerald-50", color: "text-emerald-600" },
        ].map(kpi => (
          <Card key={kpi.label} className="shadow-sm border-slate-200/80">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", kpi.bg)}>
                <kpi.icon size={18} className={kpi.color} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{kpi.label}</p>
                <p className="text-2xl font-bold text-slate-900 leading-tight">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={v => setTab(v as Tab)}>
          <TabsList className="h-9 bg-slate-100 p-0.5 rounded-xl">
            <TabsTrigger value="all"       className="text-xs font-semibold h-8 px-5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">All</TabsTrigger>
            <TabsTrigger value="important" className="text-xs font-semibold h-8 px-5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">Important</TabsTrigger>
            <TabsTrigger value="archived"  className="text-xs font-semibold h-8 px-5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">Archived</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search notices..."
            className="h-9 pl-8 pr-4 text-xs w-52 border-slate-200 bg-white"
          />
        </div>
      </div>

      {/* Notice cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <Card className="shadow-sm border-slate-200/80">
            <CardContent className="py-16 flex flex-col items-center text-slate-400">
              <Bell size={32} className="mb-2 opacity-30" />
              <p className="text-sm font-medium">No notices found</p>
            </CardContent>
          </Card>
        )}

        {filtered.map(n => {
          const cfg = TYPE_CONFIG[n.type];
          const Icon = cfg.icon;
          return (
            <Card
              key={n.id}
              className={cn(
                "shadow-sm border-slate-200/80 group transition-all hover:shadow-md relative overflow-hidden",
                n.pinned && "border-l-4 border-l-indigo-600",
                !n.viewed && "bg-indigo-50/30"
              )}
            >
              {!n.viewed && (
                <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-indigo-100" />
              )}
              {n.pinned && (
                <div className="absolute top-0 left-0">
                  <div className="bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-br-lg tracking-widest uppercase">
                    Pinned
                  </div>
                </div>
              )}

              <CardContent className={cn("p-6", n.pinned && "pt-8")}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border",
                      cfg.iconBg
                    )}>
                      <Icon size={17} className={cfg.iconColor} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-800 transition-colors leading-snug">
                        {n.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-medium">
                        <span className="flex items-center gap-1"><Calendar size={10} /> {n.date}</span>
                        <span className="text-slate-200">|</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {n.time}</span>
                        <span className="text-slate-200">|</span>
                        <span>{n.author} · {n.department}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={cn("text-[10px] font-bold px-2.5 py-0.5 border rounded-full shrink-0", cfg.badgeClass)}>
                    {cfg.label}
                  </Badge>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-5 max-w-3xl">
                  {n.body}
                </p>

                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => markRead(n)}
                      className="h-8 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1.5 px-3"
                    >
                      Read Full Details <ChevronRight size={13} />
                    </Button>
                    <Separator orientation="vertical" className="h-4" />
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => acknowledge(n.id)}
                      className="h-8 text-xs font-semibold text-slate-400 hover:text-slate-700 hover:bg-slate-50 gap-1.5 px-3"
                    >
                      <ThumbsUp size={12} /> Acknowledge ({n.acknowledged})
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                    <Eye size={11} />
                    <span>{n.acknowledged} staff acknowledged</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Full notice Sheet */}
      <Sheet open={!!openNotice} onOpenChange={() => setOpenNotice(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0">
          {openNotice && (() => {
            const cfg = TYPE_CONFIG[openNotice.type];
            const Icon = cfg.icon;
            return (
              <ScrollArea className="h-full">
                <div className="p-6 space-y-5">
                  <SheetHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border", cfg.iconBg)}>
                          <Icon size={17} className={cfg.iconColor} />
                        </div>
                        <Badge className={cn("text-[10px] font-bold px-2.5 py-0.5 border rounded-full", cfg.badgeClass)}>
                          {cfg.label}
                        </Badge>
                      </div>
                      <SheetClose asChild>
                        <button className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-slate-400 transition-colors">
                          <X size={15} />
                        </button>
                      </SheetClose>
                    </div>
                    <SheetTitle className="text-base font-semibold text-slate-900 mt-3 leading-snug">
                      {openNotice.title}
                    </SheetTitle>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium mt-1">
                      <span className="flex items-center gap-1"><Calendar size={10}/> {openNotice.date}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock size={10}/> {openNotice.time}</span>
                    </div>
                  </SheetHeader>

                  <Separator />

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">From</p>
                    <p className="text-sm font-semibold text-slate-800">{openNotice.author}</p>
                    <p className="text-xs text-slate-500">{openNotice.department}</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Notice Content</p>
                    <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                      {openNotice.fullBody}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Users size={13} />
                      <span>{openNotice.acknowledged} staff acknowledged</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => acknowledge(openNotice.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold gap-1.5 h-10"
                    >
                      <ThumbsUp size={14} /> Acknowledge Notice
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => archive(openNotice.id)}
                      className="text-xs font-semibold border-slate-200 text-slate-600 gap-1.5 h-10"
                    >
                      Archive
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            );
          })()}
        </SheetContent>
      </Sheet>

      <Toaster />
    </div>
  );
}