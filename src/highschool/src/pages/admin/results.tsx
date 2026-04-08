import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { studentsSeed, marksSeed, classesSeed } from "@/highschool/src/data/mockData";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

// lucide
import { 
  Trophy, Search, Download, 
  BarChart3, Award, ChevronRight,
  TrendingUp, Star, Filter, CheckCircle2,
  Clock, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

export default function AdminResults() {
  const [klass, setKlass] = useState("Form 4 Red");
  const [exam, setExam] = useState("Term 2 - Finals");
  
  const list = studentsSeed.filter((s) => s.klass === klass);

  const submissions = [
    { subject: "Mathematics", teacher: "Mr. Omondi", status: "Finalized", color: "text-emerald-600 bg-emerald-50", icon: CheckCircle2 },
    { subject: "English", teacher: "Ms. Wanjiku", status: "In Progress", color: "text-amber-600 bg-amber-50", icon: Clock },
    { subject: "Physics", teacher: "Dr. Mutua", status: "Finalized", color: "text-emerald-600 bg-emerald-50", icon: CheckCircle2 },
    { subject: "Biology", teacher: "Mrs. Otieno", status: "Pending", color: "text-slate-400 bg-slate-50", icon: AlertCircle },
    { subject: "History", teacher: "Mr. Kamau", status: "Draft", color: "text-slate-400 bg-slate-50", icon: AlertCircle },
  ];

  const subjectStats = [
    { name: "Mathematics", mean: "78.4%", trend: "+5.2%", status: "up" },
    { name: "English", mean: "72.1%", trend: "-1.8%", status: "down" },
    { name: "Physics", mean: "81.5%", trend: "+3.4%", status: "up" },
    { name: "Biology", mean: "69.8%", trend: "+0.5%", status: "up" },
    { name: "Geography", mean: "74.2%", trend: "+2.1%", status: "up" },
    { name: "Kiswahili", mean: "76.4%", trend: "+1.2%", status: "up" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Grading & Results" 
        subtitle="Monitor school-wide academic performance and exam outcomes" 
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-700 bg-white shadow-sm gap-1.5 font-bold text-xs ring-offset-2">
              <Download size={14} /> Export Marks
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm gap-1.5 font-bold text-xs h-9 shadow-indigo-100 border-0">
               <Award size={14} /> Publish Results
            </Button>
          </div>
        }
      />

      {/* Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Overall Mean", val: "76.4%", sub: "+1.2% from T1", icon: BarChart3, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
          { label: "Top Student", val: "94.0%", sub: "Mercy Achieng (G5A)", icon: Trophy, color: "bg-amber-50 text-amber-600 border-amber-100" },
          { label: "Submissions", val: "12 / 16", sub: "Subjects Graded", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
          { label: "Target Growth", val: "80.0%", sub: "End of year goal", icon: TrendingUp, color: "bg-purple-50 text-purple-600 border-purple-100" },
        ].map((item, i) => (
          <Card key={i} className="shadow-sm border-slate-200/80 group overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border transition-all group-hover:scale-105", item.color)}>
                  <item.icon size={18} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{item.val}</p>
              <p className="text-[13px] font-medium text-slate-500 mt-2">{item.label}</p>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">{item.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Submissions Tracker */}
        <Card className="lg:col-span-1 shadow-sm border-slate-200/80">
          <CardHeader className="pb-3">
             <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Clock size={16} className="text-indigo-600" />
                Submissions Tracker
             </CardTitle>
             <CardDescription className="text-[11px]">Teacher grading progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {submissions.map((sub) => (
              <div key={sub.subject} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-50 bg-slate-50/30">
                <div className="flex items-center gap-3">
                  <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", sub.color)}>
                    <sub.icon size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{sub.subject}</p>
                    <p className="text-[10px] text-slate-500">{sub.teacher}</p>
                  </div>
                </div>
                <Badge className={cn("text-[9px] font-bold border-0", sub.color)}>
                  {sub.status}
                </Badge>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-9">
              View All Submissions
            </Button>
          </CardContent>
        </Card>

        {/* Subject Breakdown */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200/80">
          <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
             <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                   <BarChart3 size={16} className="text-indigo-600" />
                   Subject Performance
                </CardTitle>
                <CardDescription className="text-[11px]">Across active level</CardDescription>
             </div>
             <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold gap-1 border-slate-200 bg-white">
                <Filter size={12} /> Analyze Trends
             </Button>
          </CardHeader>
          <CardContent>
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {subjectStats.map((stat) => (
                  <div key={stat.name} className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 transition-colors group">
                     <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">{stat.name}</span>
                        <span className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                          stat.status === "up" ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                        )}>
                          {stat.trend}
                        </span>
                     </div>
                     <div className="flex items-end justify-between">
                        <p className="text-2xl font-bold text-slate-900">{stat.mean}</p>
                        <div className="w-24 pb-1">
                           <Progress value={parseFloat(stat.mean)} className="h-1 bg-slate-50 [&>div]:bg-indigo-500" />
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col lg:flex-row items-end justify-between gap-4">
         <div className="flex flex-wrap gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Active Level</Label>
              <Select value={klass} onValueChange={setKlass}>
                 <SelectTrigger className="w-[160px] h-10 border-slate-200 bg-white shadow-sm font-bold">
                    <SelectValue />
                 </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                     {classesSeed.map((c) => (
                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                     ))}
                  </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
               <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Examination Hub</Label>
               <Select value={exam} onValueChange={setExam}>
                 <SelectTrigger className="w-[200px] h-10 border-slate-200 bg-white shadow-sm font-bold">
                    <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                    <SelectItem value="Term 2 - Finals">Term 2 - Finals</SelectItem>
                    <SelectItem value="Term 2 - Mid Term">Term 2 - Mid Term</SelectItem>
                 </SelectContent>
              </Select>
            </div>
         </div>

         <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Find student record..." className="h-10 pl-9 pr-4 rounded-xl border-slate-200 bg-white w-64 text-sm" />
         </div>
      </div>

      <Card className="shadow-sm border-slate-200/80">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
             <Table>
                <TableHeader>
                   <TableRow className="hover:bg-transparent border-b border-slate-50">
                      <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Position / Student</TableHead>
                      <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Mean Score</TableHead>
                      <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Form</TableHead>
                      <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                      <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Performance Index</TableHead>
                      <TableHead className="pr-6 py-3 text-right"></TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   {list.map((s, i) => (
                      <TableRow key={s.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors group">
                         <TableCell className="pl-6 py-4">
                            <div className="flex items-center gap-4">
                               <span className="text-xs font-bold text-slate-300 w-4 group-hover:text-indigo-600 transition-colors">{i + 1}</span>
                               <Avatar className="h-9 w-9">
                                  <AvatarImage src={s.photo} alt={s.name} />
                                  <AvatarFallback className="text-[10px] font-bold bg-indigo-50 text-indigo-700">
                                     {initials(s.name)}
                                  </AvatarFallback>
                               </Avatar>
                               <div>
                                  <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-900 leading-tight transition-colors">{s.name}</p>
                                  <p className="text-[10px] text-slate-400 mt-0.5 tracking-tight font-medium uppercase">{s.admission}</p>
                               </div>
                            </div>
                         </TableCell>
                         <TableCell className="py-4 text-center">
                            <span className="text-sm font-bold text-slate-900">{s.performance}%</span>
                         </TableCell>
                         <TableCell className="py-4 text-center">
                            <Badge className={cn(
                               "text-[10px] font-bold px-2 py-0.5 border-0 rounded-full",
                               s.performance >= 80 ? "bg-emerald-50 text-emerald-700" :
                               s.performance >= 60 ? "bg-indigo-50 text-indigo-700" :
                               "bg-amber-50 text-amber-700"
                            )}>
                               {s.performance >= 80 ? "A" : s.performance >= 70 ? "B" : s.performance >= 60 ? "C" : "D"}
                            </Badge>
                         </TableCell>
                         <TableCell className="py-4">
                            <Badge variant="outline" className="text-[9px] font-bold bg-slate-50 text-slate-500 border-slate-200">
                               Verified
                            </Badge>
                         </TableCell>
                         <TableCell className="py-4">
                            <div className="w-32">
                               <Progress value={s.performance} className={cn(
                                  "h-1 bg-slate-50 shadow-inner [&>div]:transition-all",
                                  s.performance >= 80 ? "[&>div]:bg-emerald-500" : "[&>div]:bg-indigo-500"
                               )} />
                            </div>
                         </TableCell>
                         <TableCell className="pr-6 py-4 text-right">
                            <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-slate-400 hover:text-indigo-600 gap-1 px-4 border-0">
                               Full Report <ChevronRight size={14} />
                            </Button>
                         </TableCell>
                      </TableRow>
                   ))}
                </TableBody>
             </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
