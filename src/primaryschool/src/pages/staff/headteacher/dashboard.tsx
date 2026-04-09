import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { School, Users, ClipboardList, TrendingUp, ChevronRight, BookOpen, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const classPerformance = [
  { className: "Grade 1A", teacher: "Mrs. Wanjiru", enrolled: 38, avgScore: 82, attendance: "96%", status: "Excellent" },
  { className: "Grade 2B", teacher: "Mr. Otieno", enrolled: 35, avgScore: 74, attendance: "91%", status: "Good" },
  { className: "Grade 3A", teacher: "Ms. Achieng", enrolled: 40, avgScore: 68, attendance: "88%", status: "Needs Attention" },
  { className: "Grade 4C", teacher: "Mrs. Mwangi", enrolled: 37, avgScore: 79, attendance: "93%", status: "Good" },
  { className: "Grade 5B", teacher: "Mr. Kamau", enrolled: 36, avgScore: 88, attendance: "97%", status: "Excellent" },
];

export default function HeadTeacherPortal() {
  const [activeTab, setActiveTab] = useState<"overview" | "classes">("overview");
  const summaryStats = [
    { label: "Total Enrollment", value: "623", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Classes Running", value: "18", icon: School, color: "text-sky-600", bg: "bg-sky-50" },
    { label: "Avg Performance", value: "78%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Avg Attendance", value: "93%", icon: CalendarCheck, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Head Teacher's Office"
        subtitle="Oversee academic progress, class performance, and school-wide metrics."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="h-9 text-xs border-slate-200 font-bold gap-2">
              <ClipboardList size={14} /> Academic Report
            </Button>
            <Button className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 font-bold gap-2">
              <BookOpen size={14} /> Timetable
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((s) => (
          <Card key={s.label} className="shadow-sm border-slate-200/80">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", s.bg)}>
                  <s.icon size={15} className={s.color} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none">{s.label}</p>
              </div>
              <p className="text-2xl font-bold text-slate-900 leading-none">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between px-6 pt-5 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 leading-none">Class Performance Overview</CardTitle>
            <Button variant="ghost" className="text-xs text-indigo-600 font-bold h-8 gap-1">
              View All <ChevronRight size={13} />
            </Button>
          </div>
          <Separator className="bg-slate-50" />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-50">
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Class</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Class Teacher</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Enrolled</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg Score</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Attendance</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classPerformance.map((c) => (
                <TableRow key={c.className} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4 text-xs font-bold text-slate-900 group-hover:text-indigo-700">{c.className}</TableCell>
                  <TableCell className="py-4 text-xs text-slate-600">{c.teacher}</TableCell>
                  <TableCell className="py-4 text-xs font-medium text-slate-700">{c.enrolled}</TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn("h-full", c.avgScore >= 80 ? "bg-emerald-500" : c.avgScore >= 60 ? "bg-amber-500" : "bg-rose-500")} style={{ width: `${c.avgScore}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-600">{c.avgScore}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-xs font-medium text-slate-600">{c.attendance}</TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Badge className={cn("text-[9px] font-bold border-0",
                      c.status === "Excellent" ? "bg-emerald-50 text-emerald-700" :
                      c.status === "Good" ? "bg-sky-50 text-sky-700" :
                      "bg-rose-50 text-rose-700"
                    )}>{c.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
