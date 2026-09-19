import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { studentsSeed, marksSeed } from "@/primaryschool/src/data/mockData";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

// lucide
import { 
  Trophy, Search, Download, 
  BarChart3, Award, ChevronRight,
  TrendingUp, Star, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

export default function AdminResults() {
  const [klass, setKlass] = useState("Grade 5A");
  const [exam, setExam] = useState("Term 2 - Finals");
  
  const subjects = ["Mathematics", "English", "Science", "Social Studies", "CRE"];
  const list = studentsSeed.filter((s) => s.klass === klass);

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
          { label: "Students Indexed", val: list.length, sub: "Verified for Term 2", icon: Star, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
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

      <div className="flex flex-col lg:flex-row items-end justify-between gap-4">
         <div className="flex flex-wrap gap-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Active Level</Label>
              <Select value={klass} onValueChange={setKlass}>
                 <SelectTrigger className="w-[160px] h-10 border-slate-200 bg-white shadow-sm font-bold">
                    <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                    <SelectItem value="Grade 5A">Grade 5A</SelectItem>
                    <SelectItem value="Grade 6B">Grade 6B</SelectItem>
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
                      <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Grade</TableHead>
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
