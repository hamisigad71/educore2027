import React from "react";
import { PageHeader } from "@/components/layout";
import { marksSeed, studentsSeed } from "@/primaryschool/src/data/mockData";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

// lucide
import { 
  Trophy, TrendingUp, Download, 
  ChevronRight, ArrowRight, Award,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PortalResults() {
  const student = studentsSeed[0];
  const marks = marksSeed.filter((m) => m.studentId === student.id);
  const avg = marks.length ? Math.round(marks.reduce((t, m) => t + m.score, 0) / marks.length) : 0;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Academic Performance" 
        subtitle="Review your current marks, grades and teacher remarks" 
        actions={
          <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-700 shadow-sm gap-1.5 font-bold text-xs h-9">
            <Download size={14} /> Full Transcript
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Overview Stats */}
        <Card className="shadow-sm border-indigo-100 bg-white group hover:border-indigo-300 transition-all hover:shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                <Trophy size={18} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">Mean Score Grade</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{avg}%</h3>
                   <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 shadow-sm">+2.4%</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 pt-5 border-t border-indigo-50">
               <div>
                  <div className="flex justify-between items-center text-[11px] font-bold mb-2">
                    <span className="text-slate-500 uppercase tracking-tight">Academic Ranking</span>
                    <span className="text-indigo-600">8 / 38 Students</span>
                  </div>
                  <Progress value={avg} className="h-1.5 bg-slate-100 [&>div]:bg-indigo-600 shadow-inner" />
               </div>
               <div className="pt-2">
                  <p className="text-[10px] font-bold text-slate-400 tracking-tight leading-relaxed uppercase opacity-70">
                    Performing better than 84% of peers.
                  </p>
               </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card className="md:col-span-2 shadow-sm border-indigo-100/60 overflow-hidden">
          <CardHeader className="px-6 py-5 border-b border-indigo-50 bg-indigo-50/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 tracking-tight">Subject Performance</CardTitle>
                <CardDescription className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Term 2 • Comprehensive Report</CardDescription>
              </div>
              <BookOpen size={20} className="text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
             <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-slate-50">
                    <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Subject</TableHead>
                    <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Score</TableHead>
                    <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Grade</TableHead>
                    <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marks.map((m, i) => (
                    <TableRow key={i} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors group">
                      <TableCell className="pl-6 py-4">
                         <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                             <BookOpen size={14} />
                           </div>
                           <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-900 transition-colors uppercase tracking-tighter">{m.subject}</p>
                         </div>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                         <span className="text-sm font-medium text-slate-900">{m.score}</span>
                         <span className="text-[10px] text-slate-400 font-bold ml-1">/ 100</span>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                         <Badge variant="outline" className={cn(
                           "text-[10px] font-bold px-2.5 py-0.5 border-0 rounded-full",
                           m.score >= 80 ? "bg-emerald-50 text-emerald-700" :
                           m.score >= 60 ? "bg-indigo-50 text-indigo-700" :
                           "bg-amber-50 text-amber-700"
                         )}>
                           {m.grade}
                         </Badge>
                      </TableCell>
                      <TableCell className="pr-6 py-4 text-right">
                         <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                            {m.score >= 80 ? "Exceptional" : m.score >= 65 ? "Well Done" : "Consistent Effort"}
                         </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      <div className="p-1 rounded-3xl bg-indigo-50/50 border border-indigo-100/50">
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-600">
                <TrendingUp size={24} />
             </div>
             <div>
               <h4 className="text-sm font-bold text-indigo-900 leading-tight mb-1">Weekly Insight</h4>
               <p className="text-xs text-indigo-700/70 font-medium">Your Mathematics score increased by 4% since the last assessment. Great job on English too!</p>
             </div>
           </div>
           <Button variant="ghost" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-white gap-1.5 px-6 shrink-0 h-10 shadow-sm border-0">
             Explore Details <ArrowRight size={14} />
           </Button>
        </div>
      </div>
    </div>
  );
}
