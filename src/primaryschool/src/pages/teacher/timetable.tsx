import React from "react";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Users,
  Download,
  Printer,
  CalendarDays
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const TimetablePage = () => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const hours = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM"];

  const schedule: Record<string, any> = {
    "Mon-08:00 AM": { subject: "Science", class: "6A", room: "Lab 2", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    "Mon-10:00 AM": { subject: "Science", class: "6B", room: "Lab 2", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    "Tue-09:00 AM": { subject: "Math", class: "7A", room: "Room 104", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
    "Tue-11:00 AM": { subject: "Math", class: "7B", room: "Room 105", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
    "Wed-08:00 AM": { subject: "Science", class: "6A", room: "Lab 2", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    "Wed-01:00 PM": { subject: "Club", class: "Enviro", room: "Garden", color: "bg-amber-50 text-amber-700 border-amber-100" },
    "Thu-10:00 AM": { subject: "Math", class: "7A", room: "Room 104", color: "bg-indigo-50 text-indigo-700 border-indigo-100" },
    "Fri-09:00 AM": { subject: "Science", class: "6B", room: "Lab 2", color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  };

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Timetable</h1>
          <p className="text-slate-500 font-medium">Weekly teaching schedule and venue allocations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" className="rounded-xl">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700">
            Current Week
          </Button>
        </div>
      </div>

      {/* Date Navigator */}
      <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9"><ChevronLeft size={18} /></Button>
          <div className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50/50 rounded-xl">
            <CalendarDays size={16} className="text-indigo-600" />
            <span className="text-sm font-bold text-indigo-700">May 4 - May 10, 2025</span>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9"><ChevronRight size={18} /></Button>
        </div>
        <div className="flex items-center gap-2 pr-2">
          <Badge variant="outline" className="rounded-lg h-7 font-bold text-[10px] uppercase tracking-wider text-slate-400">Term 2</Badge>
          <Badge variant="outline" className="rounded-lg h-7 font-bold text-[10px] uppercase tracking-wider text-slate-400">Week 6</Badge>
        </div>
      </div>

      {/* Timetable Grid */}
      <Card className="border-slate-100 overflow-hidden shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="py-4 px-6 border-b border-slate-100 text-left w-24">
                    <Clock size={16} className="text-slate-400 mx-auto" />
                  </th>
                  {days.map(day => (
                    <th key={day} className="py-4 px-4 border-b border-slate-100 text-center min-w-[140px]">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{day}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map(hour => (
                  <tr key={hour} className="group">
                    <td className="py-6 px-4 border-r border-b border-slate-100 text-center">
                      <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">{hour}</span>
                    </td>
                    {days.map(day => {
                      const session = schedule[`${day}-${hour}`];
                      return (
                        <td key={day} className="p-2 border-r border-b border-slate-100 align-top group-hover:bg-slate-50/30 transition-colors">
                          {session ? (
                            <div className={cn(
                              "p-3 rounded-xl border border-transparent hover:border-current hover:shadow-sm transition-all duration-200 cursor-pointer",
                              session.color
                            )}>
                              <div className="flex flex-col gap-1.5">
                                <span className="text-xs font-bold leading-none">{session.subject}</span>
                                <div className="flex items-center justify-between mt-1">
                                  <div className="flex items-center gap-1 opacity-70">
                                    <Users size={10} />
                                    <span className="text-[10px] font-bold">{session.class}</span>
                                  </div>
                                  <div className="flex items-center gap-1 opacity-70">
                                    <MapPin size={10} />
                                    <span className="text-[10px] font-bold">{session.room}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="min-h-[60px]" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Legend & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-slate-100 shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-base">Teaching Load Summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 font-medium">Total Weekly Hours</span>
              <span className="font-bold text-slate-900">22.5 hrs</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full w-[75%]" />
            </div>
            <p className="text-[10px] text-slate-400 leading-normal italic">
              *Your maximum teaching load is 30 hours per week as per school policy.
            </p>
          </CardContent>
        </Card>
        
        <div className="flex flex-col justify-center gap-2">
           <div className="flex items-center gap-3 p-3 rounded-xl bg-indigo-50/40 border border-indigo-100/50">
             <div className="h-2 w-2 rounded-full bg-indigo-600" />
             <span className="text-xs font-bold text-slate-700">Mathematics Dept</span>
           </div>
           <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/40 border border-emerald-100/50">
             <div className="h-2 w-2 rounded-full bg-emerald-600" />
             <span className="text-xs font-bold text-slate-700">Science Dept</span>
           </div>
           <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50/40 border border-amber-100/50">
             <div className="h-2 w-2 rounded-full bg-amber-600" />
             <span className="text-xs font-bold text-slate-700">Extra-Curricular Tasks</span>
           </div>
        </div>
      </div>
    </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default TimetablePage;
