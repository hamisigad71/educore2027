import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout";
import { studentsSeed } from "@/primaryschool/src/data/mockData";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

// lucide
import { 
  Users, CheckCircle2, XCircle, AlertTriangle,
  Search, Download, History, TrendingUp,
  Calendar, ArrowRight, Clock, UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

export default function AdminAttendance() {
  const [klass, setKlass] = useState("Grade 5A");
  const classes = useMemo(() => Array.from(new Set(studentsSeed.map((s) => s.klass))), []);
  const list = studentsSeed.filter((s) => s.klass === klass);
  
  const [present, setPresent] = useState<Record<string, boolean>>(
    () => Object.fromEntries(list.map((s) => [s.id, Math.random() > 0.1]))
  );

  const presentCount = Object.values(present).filter(Boolean).length;
  const absentCount = list.length - presentCount;
  const attendanceRate = list.length > 0 ? Math.round((presentCount / list.length) * 100) : 0;
  
  const today = new Date().toLocaleDateString("en-KE", { 
    weekday: "long", 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });

  const weeklyData = [
    { day: "Monday", rate: 92, students: 28 },
    { day: "Tuesday", rate: 95, students: 29 },
    { day: "Wednesday", rate: 89, students: 27 },
    { day: "Thursday", rate: 94, students: 29 },
    { day: "Friday", rate: 88, students: 26 }
  ];

  const weeklyAvg = weeklyData.reduce((sum, day) => sum + day.rate, 0) / weeklyData.length;

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Attendance Management" 
        subtitle={`Daily attendance tracking for ${today}`} 
        actions={
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm font-bold text-xs"
            >
              <History size={14} className="mr-2" /> View History
            </Button>
            <Button 
              className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 font-bold text-xs px-5 border-0"
            >
              <Download size={14} className="mr-2" /> Export Report
            </Button>
          </div>
        }
      />

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Students", val: list.length, sub: `In ${klass}`, icon: Users, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
          { label: "Present Today", val: presentCount, sub: `${attendanceRate}% rate`, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
          { label: "Absent Today", val: absentCount, sub: absentCount > 0 ? "Action required" : "Perfect day", icon: XCircle, color: "bg-rose-50 text-rose-600 border-rose-100" },
          { label: "Weekly Average", val: `${weeklyAvg.toFixed(1)}%`, sub: "Current performance", icon: TrendingUp, color: "bg-amber-50 text-amber-600 border-amber-100" },
        ].map((item, i) => (
          <Card key={i} className="shadow-sm border-slate-200/80 group hover:border-indigo-200 transition-all overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border transition-all group-hover:scale-105", item.color)}>
                  <item.icon size={22} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{item.val}</p>
                  <p className="text-[13px] font-bold text-slate-500 mt-2 uppercase tracking-tight">{item.label}</p>
                  <p className={cn("text-[10px] mt-1 font-medium", i === 1 ? "text-emerald-600" : i === 2 && absentCount > 0 ? "text-rose-600" : "text-slate-400")}>
                    {item.sub}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-3">
        {/* Enhanced Daily Attendance Roster */}
        <Card className="xl:col-span-2 shadow-sm border-slate-200/80 overflow-hidden">
          <CardHeader className="px-6 py-5 border-b border-slate-50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div>
                  <CardTitle className="text-base font-bold text-slate-900">Daily Attendance Register</CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-1">
                    Live roster for {klass} session
                  </CardDescription>
               </div>
               <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 mr-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">
                      {new Date().toLocaleTimeString("en-KE", { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <Select value={klass} onValueChange={setKlass}>
                    <SelectTrigger className="w-[140px] h-9 border-slate-200 bg-white font-bold text-xs shadow-sm">
                       <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                    </SelectContent>
                  </Select>
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Attendance Summary Bar */}
            <div className="px-6 py-5 bg-indigo-50/20 border-b border-indigo-100/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  Progress Index: <span className="text-indigo-600">{presentCount} presented</span> / {list.length} students
                </p>
                <Badge className="bg-indigo-600 text-white border-0 text-[10px] font-bold px-2 py-0.5 rounded-full">{attendanceRate}%</Badge>
              </div>
              <Progress value={attendanceRate} className="h-2 bg-slate-100 shadow-inner overflow-hidden [&>div]:bg-indigo-600" />
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-slate-50">
                    <TableHead className="pl-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Student Identity</TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Admission</TableHead>
                    <TableHead className="py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Current Status</TableHead>
                    <TableHead className="pr-6 py-4 text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                   {list.map((s) => (
                    <TableRow 
                      key={s.id} 
                      className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors group"
                    >
                       <TableCell className="pl-6 py-5">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 ring-2 ring-slate-100 ring-offset-2 overflow-hidden shadow-sm">
                              <AvatarImage src={s.photo} alt={s.name} className="object-cover" />
                              <AvatarFallback className="text-[10px] font-bold bg-indigo-50 text-indigo-700">
                                {initials(s.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-bold text-slate-900 leading-tight group-hover:text-indigo-900 transition-colors">{s.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium mt-1">Student ID # {s.id}</p>
                            </div>
                          </div>
                       </TableCell>
                       <TableCell className="py-5">
                         <span className="text-xs font-mono font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                           {s.admission}
                         </span>
                       </TableCell>
                       <TableCell className="py-5 text-center">
                          <Badge variant="outline" className={cn(
                            "text-[10px] font-bold px-3 py-1 rounded-full border shadow-sm transition-all",
                            present[s.id] 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          )}>
                             <div className="flex items-center gap-1.5 uppercase tracking-wider">
                               {present[s.id] ? <CheckCircle2 size={12} strokeWidth={3} /> : <XCircle size={12} strokeWidth={3} />}
                               {present[s.id] ? "Present" : "Absent"}
                             </div>
                          </Badge>
                       </TableCell>
                       <TableCell className="pr-6 py-5 text-right font-bold">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className={cn(
                              "h-9 text-[11px] font-bold px-4 rounded-xl border transition-all duration-200",
                              present[s.id] 
                                ? "text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-100 hover:border-rose-200" 
                                : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-100 hover:border-emerald-200"
                            )}
                            onClick={() => setPresent((p) => ({ ...p, [s.id]: !p[s.id] }))}>
                            {present[s.id] ? "Mark Absent" : "Mark Present"}
                          </Button>
                       </TableCell>
                    </TableRow>
                   ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Analytics Sidebar */}
        <div className="space-y-6">
           {/* Weekly Trends */}
           <Card className="shadow-sm border-slate-200/80 group">
              <CardHeader className="px-6 py-5 border-b border-slate-50 flex flex-row items-center justify-between">
                 <div>
                   <CardTitle className="text-base font-bold text-slate-900">Weekly Flow</CardTitle>
                   <CardDescription className="text-xs">Class performance trends</CardDescription>
                 </div>
                 <Badge className="bg-indigo-50 text-indigo-700 border-0 text-[10px] px-2 font-bold uppercase tracking-widest">Analytics</Badge>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                 {weeklyData.map((data, i) => {
                    const isToday = i === new Date().getDay() - 1;
                    return (
                      <div key={data.day} className="space-y-2 group/item">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                             <span className={cn(
                               "text-xs font-bold transition-colors",
                               isToday ? "text-indigo-900" : "text-slate-500 group-hover/item:text-indigo-900"
                             )}>
                               {data.day}
                             </span>
                             {isToday && <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />}
                           </div>
                           <div className="text-right">
                             <p className="text-[11px] font-bold text-slate-900">{data.rate}%</p>
                             <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{data.students} ATTD</p>
                           </div>
                        </div>
                        <Progress 
                          value={data.rate} 
                          className="h-1.5 bg-slate-100 shadow-inner overflow-hidden [&>div]:bg-indigo-600"
                        />
                      </div>
                    );
                 })}
                 
                 <Separator className="bg-slate-50" />
                 
                 <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest leading-none mb-1">
                        Weekly Avg
                      </p>
                      <h4 className="text-2xl font-bold text-emerald-900 leading-none">{weeklyAvg.toFixed(1)}%</h4>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-emerald-100">
                       <TrendingUp size={20} className="text-emerald-500" />
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Enhanced SMS Alerts Card */}
           <Card className="shadow-md border-indigo-100 bg-indigo-50/40 overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                <UserCheck size={80} className="text-indigo-600" />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-9 w-9 rounded-xl bg-white border border-indigo-100 flex items-center justify-center shadow-sm">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 tracking-tight">Smart Notifications</h4>
                </div>
                
                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8">
                  Configure automated parent alerts for students with irregular attendance patterns or consecutive absences.
                </p>
                
                <div className="space-y-2.5">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-10 font-bold text-xs shadow-lg shadow-indigo-100 border-0 group-hover:-translate-y-0.5 transition-transform uppercase tracking-wider">
                    Configure Alerts <ArrowRight className="h-3.5 w-3.5 ml-2" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-9 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 text-[10px] font-bold uppercase tracking-widest"
                  >
                    View History Report
                  </Button>
                </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}