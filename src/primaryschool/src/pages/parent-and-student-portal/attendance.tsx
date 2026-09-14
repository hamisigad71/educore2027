import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout";
import { studentsSeed } from "@/primaryschool/src/data/mockData";
import { getParentChildren, getStudentAttendance } from "@/lib/api";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

import {
  CheckCircle2, AlertCircle, Cloud, Download,
  Calendar, TrendingUp, XCircle, Clock,
  BarChart2, FileText, Upload, BookOpen,
  ChevronRight, Info
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "monthly" | "daily";

const MONTHLY_DATA = [
  { month: "January",  rate: 98, present: 20, absent: 0,  late: 1,  status: "Excellent" },
  { month: "February", rate: 95, present: 19, absent: 1,  late: 0,  status: "Good" },
  { month: "March",    rate: 92, present: 22, absent: 2,  late: 1,  status: "Good" },
  { month: "April",    rate: 88, present: 18, absent: 2,  late: 2,  status: "Warning" },
  { month: "May",      rate: 94, present: 20, absent: 1,  late: 1,  status: "Good" },
  { month: "June",     rate: 96, present: 21, absent: 0,  late: 2,  status: "Excellent" },
];

const DAILY_RECORDS = [
  { date: "2025-06-27", subject: "Mathematics",        status: "Present", time: "07:55 AM" },
  { date: "2025-06-26", subject: "English Language",   status: "Present", time: "08:02 AM" },
  { date: "2025-06-25", subject: "Biology",            status: "Late",    time: "08:22 AM" },
  { date: "2025-06-24", subject: "Physics",            status: "Absent",  time: "---" },
  { date: "2025-06-23", subject: "Chemistry",          status: "Present", time: "07:58 AM" },
  { date: "2025-06-20", subject: "History",            status: "Present", time: "07:50 AM" },
  { date: "2025-06-19", subject: "Geography",          status: "Present", time: "07:53 AM" },
  { date: "2025-06-18", subject: "Computer Science",   status: "Late",    time: "08:19 AM" },
];

const STATUS_CONFIG = {
  Present:  { badge: "bg-emerald-50 text-emerald-700 border border-emerald-100", dot: "bg-emerald-500", icon: CheckCircle2, iconColor: "text-emerald-500" },
  Absent:   { badge: "bg-rose-50 text-rose-700 border border-rose-100",         dot: "bg-rose-500",    icon: XCircle,      iconColor: "text-rose-500" },
  Late:     { badge: "bg-amber-50 text-amber-700 border border-amber-100",      dot: "bg-amber-500",   icon: Clock,        iconColor: "text-amber-500" },
};

const MONTH_STATUS = {
  Excellent: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  Good:      "bg-indigo-50 text-indigo-700 border border-indigo-100",
  Warning:   "bg-amber-50 text-amber-700 border border-amber-100",
};

export default function PortalAttendance() {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("monthly");
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveDate, setLeaveDate] = useState("");
  const [leaveFile, setLeaveFile] = useState("");
  const [detailMonth, setDetailMonth] = useState<(typeof MONTHLY_DATA)[0] | null>(null);

  const [childData, setChildData] = useState<any>(null);
  const [liveAttendance, setLiveAttendance] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const children = await getParentChildren();
        if (children && children.length > 0) {
          const mainChild = children[0];
          setChildData(mainChild);
          const att = await getStudentAttendance(mainChild.id);
          setLiveAttendance(att);
        }
      } catch (err) {}
    }
    loadData();
  }, []);

  const student = childData ? {
    id: childData.id,
    name: childData.name,
    attendance: liveAttendance ? liveAttendance.rate : 0
  } : studentsSeed[0];

  const totalPresent  = (childData && liveAttendance) ? liveAttendance.present : MONTHLY_DATA.reduce((s, m) => s + m.present, 0);
  const totalAbsent   = (childData && liveAttendance) ? (liveAttendance.total - liveAttendance.present) : MONTHLY_DATA.reduce((s, m) => s + m.absent,  0);
  const totalLate     = (childData && liveAttendance) ? 0 : MONTHLY_DATA.reduce((s, m) => s + m.late,    0);
  const totalDays     = (childData && liveAttendance) ? liveAttendance.total : totalPresent + totalAbsent + totalLate;
  const overallRate   = (childData && liveAttendance) ? liveAttendance.rate : Math.round((totalPresent / totalDays) * 100) || 0;

  const submitLeave = () => {
    if (!leaveDate || !leaveReason) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    toast({ title: "Leave request submitted", description: "Your request has been sent to the class teacher for review." });
    setLeaveOpen(false);
    setLeaveReason(""); setLeaveDate(""); setLeaveFile("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Tracking"
        subtitle="Monitor your presence and engagement in daily learning sessions"
        actions={
          <Button
            variant="outline" size="sm"
            className="bg-white border-slate-200 text-slate-700 shadow-sm gap-1.5 font-semibold text-xs h-9"
          >
            <Download size={13} /> Export Record
          </Button>
        }
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Overall Rate",    value: `${overallRate}%`,  icon: TrendingUp,    bg: "bg-indigo-50",  color: "text-indigo-600"  },
          { label: "Days Present",    value: totalPresent,        icon: CheckCircle2,  bg: "bg-emerald-50", color: "text-emerald-600" },
          { label: "Days Absent",     value: totalAbsent,         icon: XCircle,       bg: "bg-rose-50",    color: "text-rose-600"    },
          { label: "Late Arrivals",   value: totalLate,           icon: Clock,         bg: "bg-amber-50",   color: "text-amber-600"   },
        ].map(kpi => (
          <Card key={kpi.label} className="shadow-sm border-slate-200/80 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <CardContent className="p-3.5 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
              <div className={cn("h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm", kpi.bg)}>
                <kpi.icon size={16} className={cn("sm:w-[18px] sm:h-[18px]", kpi.color)} />
              </div>
              <div className="min-w-0 w-full">
                <p className="text-lg sm:text-2xl font-bold text-slate-900 leading-tight truncate">{kpi.value}</p>
                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate mt-0.5">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Summary card */}
        <div className="space-y-4">
          <Card className="shadow-sm border-slate-200/80 bg-white overflow-hidden relative">
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 60%)" }}
            />
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Yearly Rate</p>
                  <h3 className="text-4xl font-bold tracking-tight text-slate-900">{student.attendance}%</h3>
                  <p className="text-xs text-slate-500 mt-1">2025 Academic Year</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <BarChart2 size={20} className="text-indigo-600" />
                </div>
              </div>

              <div className="space-y-4 pt-1">
                <Progress value={student.attendance} className="h-2 bg-slate-100 mb-4 [&>div]:bg-indigo-500 shadow-inner" />

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                  {[
                    { label: "Present", count: totalPresent, color: "text-emerald-600" },
                    { label: "Absent",  count: totalAbsent,  color: "text-rose-600"    },
                    { label: "Late",    count: totalLate,    color: "text-amber-600"   },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <div className={cn("text-lg font-bold", s.color)}>{s.count}</div>
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mini heatmap */}
          <Card className="shadow-sm border-slate-200/80">
            <CardHeader className="px-5 py-4 border-b border-slate-100">
              <CardTitle className="text-xs font-semibold text-slate-700">Recent Days</CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="grid grid-cols-4 gap-2">
                {DAILY_RECORDS.map((r, i) => {
                  const cfg = STATUS_CONFIG[r.status as keyof typeof STATUS_CONFIG];
                  return (
                    <div
                      key={i}
                      title={`${r.date} — ${r.status}`}
                      className={cn(
                        "h-9 rounded-lg flex flex-col items-center justify-center gap-0.5 border cursor-default",
                        r.status === "Present" ? "bg-emerald-50 border-emerald-100" :
                        r.status === "Late"    ? "bg-amber-50 border-amber-100" :
                                                 "bg-rose-50 border-rose-100"
                      )}
                    >
                      <div className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                      <span className="text-[9px] font-bold text-slate-500">
                        {r.date.split("-")[2]}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-center gap-4 mt-4 text-[10px] font-semibold text-slate-400">
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Present</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500 inline-block" /> Late</span>
                <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500 inline-block" /> Absent</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Monthly / Daily tabs */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200/80">
          <CardHeader className="px-6 py-4 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-semibold">Attendance Breakdown</CardTitle>
                <CardDescription className="text-xs mt-0.5">Term 1 &amp; 2 · 2025 Academic Year</CardDescription>
              </div>
              <Tabs value={tab} onValueChange={v => setTab(v as Tab)}>
                <TabsList className="h-8 bg-slate-100 p-0.5 rounded-lg">
                  <TabsTrigger value="monthly" className="text-[11px] font-semibold h-7 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">Monthly</TabsTrigger>
                  <TabsTrigger value="daily"   className="text-[11px] font-semibold h-7 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">Daily Log</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>

          <ScrollArea className="h-[420px]">
            <CardContent className="p-5">
              {tab === "monthly" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {MONTHLY_DATA.map((m, i) => (
                    <div
                      key={i}
                      onClick={() => setDetailMonth(m)}
                      className="p-4 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors">{m.month}</span>
                        <Badge className={cn("text-[10px] font-semibold px-2 py-0 border rounded-full", MONTH_STATUS[m.status as keyof typeof MONTH_STATUS])}>
                          {m.status}
                        </Badge>
                      </div>

                      <div className="flex items-end justify-between mb-2">
                        <span className="text-2xl font-bold text-slate-900">{m.rate}%</span>
                        <div className="text-right text-[10px] text-slate-400 font-medium">
                          <div>{m.present} present</div>
                          <div>{m.absent + m.late} missed</div>
                        </div>
                      </div>

                      <Progress
                        value={m.rate}
                        className={cn(
                          "h-1.5 bg-slate-100",
                          m.rate >= 95 ? "[&>div]:bg-emerald-500" :
                          m.rate >= 90 ? "[&>div]:bg-indigo-600" :
                                         "[&>div]:bg-amber-500"
                        )}
                      />

                      <div className="flex items-center justify-end mt-2 text-[10px] text-indigo-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity gap-0.5">
                        View details <ChevronRight size={10} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === "daily" && (
                <div className="space-y-2">
                  {DAILY_RECORDS.map((r, i) => {
                    const cfg = STATUS_CONFIG[r.status as keyof typeof STATUS_CONFIG];
                    const Icon = cfg.icon;
                    return (
                      <div
                        key={i}
                        className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-100 bg-white hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border",
                            r.status === "Present" ? "bg-emerald-50 border-emerald-100" :
                            r.status === "Late"    ? "bg-amber-50 border-amber-100" :
                                                     "bg-rose-50 border-rose-100"
                          )}>
                            <Icon size={14} className={cfg.iconColor} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-800 transition-colors">{r.subject}</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{r.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-slate-500 font-semibold">{r.time}</span>
                          <Badge className={cn("text-[10px] font-semibold px-2 py-0 border rounded-full", cfg.badge)}>
                            {r.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </ScrollArea>
        </Card>
      </div>

      {/* Leave request banner */}
      <Card className="shadow-sm border-slate-200/80 border-l-4 border-l-indigo-600">
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <FileText size={18} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Need to request a leave?</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed max-w-lg">
                Submit a leave request with a supporting document — doctor's note or guardian's letter — for record correction.
              </p>
            </div>
          </div>
          <Button
            onClick={() => setLeaveOpen(true)}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold gap-1.5 h-9 shrink-0"
          >
            <Upload size={13} /> Submit Request
          </Button>
        </CardContent>
      </Card>

      {/* Month detail dialog */}
      <Dialog open={!!detailMonth} onOpenChange={() => setDetailMonth(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {detailMonth?.month} — Attendance Details
            </DialogTitle>
          </DialogHeader>
          {detailMonth && (
            <div className="space-y-4 py-1">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Attendance Rate</p>
                  <p className="text-4xl font-bold text-slate-900">{detailMonth.rate}%</p>
                </div>
                <Badge className={cn("text-[10px] font-semibold px-2.5 py-0.5 border rounded-full", MONTH_STATUS[detailMonth.status as keyof typeof MONTH_STATUS])}>
                  {detailMonth.status}
                </Badge>
              </div>

              <Progress
                value={detailMonth.rate}
                className={cn(
                  "h-2 bg-slate-100",
                  detailMonth.rate >= 95 ? "[&>div]:bg-emerald-500" :
                  detailMonth.rate >= 90 ? "[&>div]:bg-indigo-600" :
                                           "[&>div]:bg-amber-500"
                )}
              />

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Present", value: detailMonth.present, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
                  { label: "Absent",  value: detailMonth.absent,  color: "text-rose-600",    bg: "bg-rose-50 border-rose-100"       },
                  { label: "Late",    value: detailMonth.late,    color: "text-amber-600",   bg: "bg-amber-50 border-amber-100"     },
                ].map(s => (
                  <div key={s.label} className={cn("rounded-xl p-3 border text-center", s.bg)}>
                    <p className={cn("text-xl font-bold", s.color)}>{s.value}</p>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex items-start gap-2">
                <Info size={13} className="text-slate-400 mt-0.5 shrink-0" />
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Attendance below 90% may affect your academic standing. Contact your class teacher for corrections.
                </p>
              </div>

              <DialogClose render={<Button variant="outline" size="sm" className="w-full text-xs font-semibold" />}>Close</DialogClose>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Leave request dialog */}
      <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Submit Leave Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Date of Absence <span className="text-rose-500">*</span></Label>
              <Input
                type="date"
                value={leaveDate}
                onChange={e => setLeaveDate(e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Reason <span className="text-rose-500">*</span></Label>
              <Textarea
                value={leaveReason}
                onChange={e => setLeaveReason(e.target.value)}
                placeholder="Briefly describe the reason for your absence..."
                className="text-sm resize-none"
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Supporting Document</Label>
              <div className="border border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50 hover:bg-indigo-50/30 hover:border-indigo-200 transition-all cursor-pointer">
                <Upload size={18} className="mx-auto text-slate-400 mb-1" />
                <p className="text-[11px] font-semibold text-slate-500">Click to upload or drag &amp; drop</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Doctor's note, guardian letter (PDF, JPG)</p>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose render={<Button variant="outline" size="sm" className="text-xs" />}>Cancel</DialogClose>
            <Button
              size="sm"
              onClick={submitLeave}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold gap-1.5"
            >
              <Upload size={12} /> Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}