import React from "react";
import { PageHeader } from "@/components/layout";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// lucide
import { 
  Calendar, Clock, Filter, 
  Download, Printer, ChevronRight,
  BookOpen, User
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminTimetable() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const slots = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM"];

  const subjects = [
    { day: "Monday", time: "08:00 AM", subject: "Math", teacher: "Mr. Ouko", class: "G5A" },
    { day: "Monday", time: "10:00 AM", subject: "Science", teacher: "Ms. Wanza", class: "G5A" },
    { day: "Tuesday", time: "09:00 AM", subject: "English", teacher: "Mr. Kavoi", class: "G5A" },
    { day: "Wednesday", time: "08:00 AM", subject: "SST", teacher: "Mrs. Mutua", class: "G6B" },
    { day: "Thursday", time: "11:00 AM", subject: "P.R.E", teacher: "Ms. Wamae", class: "G6B" },
    { day: "Friday", time: "02:00 PM", subject: "Art", teacher: "Mr. Kimani", class: "G5A" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Weekly Timetable" 
        subtitle="School-wide schedule management and resource allocation" 
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-700 bg-white shadow-sm gap-1.5 font-bold text-xs">
              <Printer size={14} /> Print Schedule
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm gap-1.5 font-bold text-xs h-9">
              <Download size={14} /> Export PDF
            </Button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-1 rounded-2xl bg-slate-100/50 border border-slate-100">
         <div className="flex flex-wrap gap-1">
            {["Standard View", "Resource View", "Exam Schedule"].map((v, i) => (
              <button key={i} className={cn(
                "h-8 px-5 rounded-xl text-[11px] font-bold transition-all",
                i === 0 ? "bg-white text-indigo-700 shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-900"
              )}>
                {v}
              </button>
            ))}
         </div>
         <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 gap-1.5">
            <Filter size={12} /> Master Filter
         </Button>
      </div>

      <Card className="shadow-sm border-slate-200/80 overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse bg-white">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="py-4 px-6 border-r border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400 text-left w-32">Daily Slots</th>
                {days.map(day => (
                  <th key={day} className="py-4 px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 text-center">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {slots.map(time => (
                <tr key={time} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="py-5 px-6 border-r border-slate-100 bg-slate-50/20">
                     <div className="flex items-center gap-2">
                       <Clock size={12} className="text-slate-300" />
                       <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{time}</span>
                     </div>
                  </td>
                  {days.map(day => {
                    const match = subjects.find(s => s.day === day && s.time === time);
                    return (
                      <td key={day} className="p-2 border-r border-slate-50 last:border-r-0">
                        {match ? (
                          <div className="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 group/item hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:-translate-y-0.5 transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                               <p className="text-xs font-bold transition-colors uppercase tracking-tight">{match.subject}</p>
                               <Badge className="bg-white/50 text-[8px] font-bold px-1.5 h-4 border-0 group-hover/item:bg-white/20 group-hover/item:text-white transition-colors">{match.class}</Badge>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-medium opacity-60 flex items-center gap-1">
                                 <User size={10} /> {match.teacher}
                               </p>
                               <p className="text-[9px] font-bold flex items-center gap-1">
                                 <span className="h-1 w-1 rounded-full bg-indigo-400 group-hover/item:bg-white" /> Room 104
                               </p>
                            </div>
                          </div>
                        ) : (
                          <div className="h-16 flex items-center justify-center opacity-0 group-hover:opacity-10 transition-opacity">
                             <div className="h-10 w-full border-2 border-dashed border-slate-200 rounded-xl" />
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
      
      <div className="flex border-t border-slate-50 pt-6">
         <Card className="flex-1 shadow-sm border-slate-100 bg-slate-50/30">
            <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                  <div className="h-1 w-8 rounded-full bg-indigo-600" />
                  <p className="text-xs font-medium text-slate-500">Conflicts Detected? <span className="text-rose-600 font-bold ml-1">0 issues found</span></p>
               </div>
               <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-white gap-1.5 px-6 shadow-sm border-0">
                  Refactor Resource Flow <ChevronRight size={14} />
               </Button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
