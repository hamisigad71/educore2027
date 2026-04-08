import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { useAuth } from "@/context/AuthContext";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

import {
  CheckCircle2, MapPin, Clock, Download,
  TrendingUp, Calendar, AlertCircle,
  Timer, Fingerprint, Sun, XCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AttendanceRecord {
  date: string;
  day: string;
  checkIn: string;
  checkOut: string;
  duration: string;
  status: "Present" | "Absent" | "Late";
  shiftType: string;
}

const RECORDS: AttendanceRecord[] = [
  { date: "2025-09-27", day: "Saturday", checkIn: "07:30 AM", checkOut: "04:45 PM", duration: "9.2h", status: "Present", shiftType: "Morning" },
  { date: "2025-09-26", day: "Friday",   checkIn: "07:25 AM", checkOut: "05:00 PM", duration: "9.5h", status: "Present", shiftType: "Morning" },
  { date: "2025-09-25", day: "Thursday", checkIn: "08:10 AM", checkOut: "04:30 PM", duration: "8.3h", status: "Late",    shiftType: "Morning" },
  { date: "2025-09-24", day: "Wednesday",checkIn: "---",       checkOut: "---",       duration: "0h",   status: "Absent",  shiftType: "Morning" },
  { date: "2025-09-23", day: "Tuesday",  checkIn: "07:28 AM", checkOut: "04:55 PM", duration: "9.4h", status: "Present", shiftType: "Morning" },
  { date: "2025-09-22", day: "Monday",   checkIn: "07:31 AM", checkOut: "05:10 PM", duration: "9.6h", status: "Present", shiftType: "Morning" },
];

const STATUS_CONFIG = {
  Present: { className: "bg-emerald-50 text-emerald-700 border border-emerald-100", icon: CheckCircle2, iconColor: "text-emerald-500" },
  Absent:  { className: "bg-rose-50 text-rose-700 border border-rose-100",         icon: XCircle,      iconColor: "text-rose-500" },
  Late:    { className: "bg-amber-50 text-amber-700 border border-amber-100",       icon: AlertCircle,  iconColor: "text-amber-500" },
};

export default function StaffAttendance() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [punchedIn, setPunchedIn] = useState(false);
  const [punchTime, setPunchTime] = useState("");
  const [detailRecord, setDetailRecord] = useState<AttendanceRecord | null>(null);

  const presentCount = RECORDS.filter(r => r.status === "Present").length;
  const lateCount    = RECORDS.filter(r => r.status === "Late").length;
  const absentCount  = RECORDS.filter(r => r.status === "Absent").length;
  const attendanceRate = Math.round((presentCount / RECORDS.length) * 100);
  const avgHours = (
    RECORDS.filter(r => r.duration !== "0h")
      .reduce((acc, r) => acc + parseFloat(r.duration), 0) /
    RECORDS.filter(r => r.duration !== "0h").length
  ).toFixed(1);

  const handlePunch = () => {
    const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setPunchedIn(true);
    setPunchTime(now);
    toast({ title: "Check-in Successful", description: `Arrival recorded at ${now}` });
  };

  const downloadCSV = () => {
    const rows = [
      ["Date","Day","Check In","Check Out","Duration","Status"],
      ...RECORDS.map(r => [r.date, r.day, r.checkIn, r.checkOut, r.duration, r.status])
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "timesheet.csv"; a.click();
    toast({ title: "Timesheet exported", description: "Your CSV has been downloaded." });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Records"
        subtitle="Monitor your work hours and presence history"
        actions={
          <Button
            onClick={handlePunch}
            disabled={punchedIn}
            className={cn(
              "shadow-sm gap-1.5 text-xs h-9 font-semibold",
              punchedIn
                ? "bg-emerald-600 hover:bg-emerald-600 text-white cursor-default"
                : "bg-indigo-600 hover:bg-indigo-700 text-white"
            )}
          >
            <Fingerprint size={14} />
            {punchedIn ? `Checked In · ${punchTime}` : "Punch In Now"}
          </Button>
        }
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Attendance Rate", value: `${attendanceRate}%`, icon: TrendingUp, bg: "bg-indigo-50", color: "text-indigo-600" },
          { label: "Days Present",    value: presentCount,          icon: CheckCircle2, bg: "bg-emerald-50", color: "text-emerald-600" },
          { label: "Days Absent",     value: absentCount,           icon: XCircle,      bg: "bg-rose-50",    color: "text-rose-600" },
          { label: "Avg Hours/Day",   value: `${avgHours}h`,        icon: Timer,        bg: "bg-amber-50",   color: "text-amber-600" },
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

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly summary */}
        <div className="space-y-4">
          <Card className="shadow-sm border-slate-200/80">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Calendar size={18} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">September 2025</p>
                  <p className="text-xl font-bold text-slate-900">{presentCount} / {RECORDS.length} days</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Present", count: presentCount, color: "bg-emerald-500", total: RECORDS.length },
                  { label: "Late",    count: lateCount,    color: "bg-amber-500",   total: RECORDS.length },
                  { label: "Absent",  count: absentCount,  color: "bg-rose-500",    total: RECORDS.length },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-semibold text-slate-500">{item.label}</span>
                      <span className="text-[11px] font-bold text-slate-700">{item.count} days</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", item.color)}
                        style={{ width: `${(item.count / item.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-5" />

              <div className="grid grid-cols-5 gap-1.5">
                {RECORDS.slice().reverse().map((r, i) => (
                  <div
                    key={i}
                    title={`${r.date} — ${r.status}`}
                    className={cn(
                      "h-7 w-full rounded-md flex items-center justify-center text-[9px] font-bold cursor-default",
                      r.status === "Present" ? "bg-emerald-100 text-emerald-700" :
                      r.status === "Late"    ? "bg-amber-100 text-amber-700" :
                                               "bg-rose-100 text-rose-700"
                    )}
                  >
                    {r.date.split("-")[2]}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-3 font-medium text-center">
                Attendance heatmap — {RECORDS.length} days shown
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200/80 border-l-4 border-l-indigo-600">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <MapPin size={16} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Geofencing Active</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Attendance is validated against school GPS coordinates. Keep location services enabled.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance log table */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200/80">
          <CardHeader className="px-6 py-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Staff Log History</CardTitle>
              <CardDescription className="text-xs mt-0.5">Click a row to view details</CardDescription>
            </div>
            <Button
              variant="outline" size="sm"
              onClick={downloadCSV}
              className="h-8 text-[11px] font-semibold border-slate-200 gap-1.5 text-slate-600"
            >
              <Download size={12} /> Export CSV
            </Button>
          </CardHeader>
          <ScrollArea className="h-[420px]">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-100">
                  {["Date", "Clock In", "Clock Out", "Duration", "Status"].map(h => (
                    <TableHead key={h} className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 first:pl-6 last:pr-6 last:text-right">
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {RECORDS.map((r, i) => {
                  const cfg = STATUS_CONFIG[r.status];
                  return (
                    <TableRow
                      key={i}
                      onClick={() => setDetailRecord(r)}
                      className="hover:bg-slate-50/60 border-b border-slate-50 last:border-0 cursor-pointer transition-colors group"
                    >
                      <TableCell className="pl-6 py-4">
                        <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">{r.date}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{r.day}</p>
                      </TableCell>
                      <TableCell className="py-4 text-xs font-mono font-semibold text-slate-600 text-center">
                        {r.checkIn}
                      </TableCell>
                      <TableCell className="py-4 text-xs font-mono font-semibold text-slate-600 text-center">
                        {r.checkOut}
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <Badge variant="outline" className="text-[10px] font-semibold border-slate-200 bg-slate-50 text-slate-500 px-2 py-0">
                          {r.duration}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 py-4 text-right">
                        <Badge className={cn("text-[10px] font-semibold px-2 py-0.5 border rounded-full", cfg.className)}>
                          {r.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      </div>

      {/* Record Detail Dialog */}
      <Dialog open={!!detailRecord} onOpenChange={() => setDetailRecord(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Shift Details</DialogTitle>
          </DialogHeader>
          {detailRecord && (() => {
            const cfg = STATUS_CONFIG[detailRecord.status];
            return (
              <div className="space-y-4 py-1">
                <div className={cn("rounded-xl p-4 flex items-center gap-3 border", cfg.className)}>
                  <cfg.icon size={20} className={cfg.iconColor} />
                  <div>
                    <p className="text-sm font-semibold">{detailRecord.status}</p>
                    <p className="text-xs opacity-70">{detailRecord.day}, {detailRecord.date}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Check In",  value: detailRecord.checkIn  },
                    { label: "Check Out", value: detailRecord.checkOut },
                    { label: "Duration",  value: detailRecord.duration },
                    { label: "Shift",     value: detailRecord.shiftType },
                  ].map(item => (
                    <div key={item.label} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5 font-mono">{item.value}</p>
                    </div>
                  ))}
                </div>
                <DialogClose asChild>
                  <Button variant="outline" size="sm" className="w-full text-xs font-semibold">Close</Button>
                </DialogClose>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}