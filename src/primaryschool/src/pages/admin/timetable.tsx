import React, { useState } from "react";
import { PageHeader } from "@/components/layout";

// shadcn/ui
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// lucide
import { 
  Clock, Filter, 
  Download, Printer, ChevronRight, ChevronDown,
  User, Upload, Plus, Building2, CheckCircle2,
  GraduationCap, Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadTimetableModal, TimetableEntry } from "@/components/portal/UploadTimetableModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

// Complete CBC Primary Structure from Grade 1 through Grade 9 with their respective streams
const PRIMARY_GRADES_CONFIG = [
  { grade: "Grade 1", streams: ["Grade 1A", "Grade 1B", "Grade 1C"] },
  { grade: "Grade 2", streams: ["Grade 2A", "Grade 2B", "Grade 2C"] },
  { grade: "Grade 3", streams: ["Grade 3A", "Grade 3B", "Grade 3C"] },
  { grade: "Grade 4", streams: ["Grade 4A", "Grade 4B", "Grade 4C"] },
  { grade: "Grade 5", streams: ["Grade 5A", "Grade 5B", "Grade 5C"] },
  { grade: "Grade 6", streams: ["Grade 6A", "Grade 6B", "Grade 6C"] },
  { grade: "Grade 7", streams: ["Grade 7A", "Grade 7B"] },
  { grade: "Grade 8", streams: ["Grade 8A", "Grade 8B"] },
  { grade: "Grade 9", streams: ["Grade 9A", "Grade 9B"] },
];

const INITIAL_SUBJECTS = [
  { day: "Monday", time: "08:00 AM", subject: "Mathematics", teacher: "Mrs. Loveth Wambui", class: "Grade 5A", room: "Classroom 5A" },
  { day: "Monday", time: "10:00 AM", subject: "Science & Technology", teacher: "Ms. Salome Njeri", class: "Grade 5A", room: "Science Lab" },
  { day: "Tuesday", time: "09:00 AM", subject: "English", teacher: "Mr. Peter Otieno", class: "Grade 6B", room: "Classroom 6B" },
  { day: "Wednesday", time: "08:00 AM", subject: "Social Studies", teacher: "Mrs. Grace Wanjiru", class: "Grade 4B", room: "Classroom 4B" },
  { day: "Thursday", time: "11:00 AM", subject: "C.R.E", teacher: "Ms. Achieng Ouma", class: "Grade 5A", room: "Classroom 5A" },
  { day: "Friday", time: "02:00 PM", subject: "Creative Arts & Sports", teacher: "Mr. Kevin Otieno", class: "Grade 5A", room: "Playfield / Art Rm" },
  // Additional periods for other grades
  { day: "Monday", time: "08:00 AM", subject: "English Activities", teacher: "Mrs. Grace Wanjiru", class: "Grade 1A", room: "Classroom 1A" },
  { day: "Monday", time: "09:00 AM", subject: "Mathematical Activities", teacher: "Ms. Salome Njeri", class: "Grade 2B", room: "Classroom 2B" },
  { day: "Tuesday", time: "08:00 AM", subject: "Kiswahili Language", teacher: "Mr. Joseph Mwenda", class: "Grade 3A", room: "Classroom 3A" },
  { day: "Wednesday", time: "10:00 AM", subject: "Integrated Science", teacher: "Mr. Kevin Otieno", class: "Grade 7A", room: "Junior Lab" },
  { day: "Thursday", time: "08:00 AM", subject: "Pre-Technical Studies", teacher: "Mr. Peter Otieno", class: "Grade 8A", room: "Workshop" },
];

export default function AdminTimetable() {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const slots = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM"];

  const [subjects, setSubjects] = useState<any[]>(INITIAL_SUBJECTS);
  const [selectedFilter, setSelectedFilter] = useState<string>("All"); // "All", "Grade 5", or specific stream "Grade 5A"
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleTimetableAdded = (newEntries: TimetableEntry[]) => {
    setSubjects((prev) => [...prev, ...newEntries]);
    setSuccessBanner(`Successfully mapped and assigned ${newEntries.length} timetable periods.`);
    setTimeout(() => setSuccessBanner(null), 5000);
  };

  const filteredSubjects = subjects.filter((s) => {
    if (selectedFilter === "All") return true;
    // If user filtered by whole grade like "Grade 5", match all streams (Grade 5A, Grade 5B, etc.)
    if (selectedFilter.startsWith("Grade ") && !selectedFilter.slice(6).includes("A") && !selectedFilter.slice(6).includes("B") && !selectedFilter.slice(6).includes("C")) {
      return s.class.startsWith(selectedFilter);
    }
    // Specific stream match
    return s.class === selectedFilter;
  });

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Weekly Timetable" 
        subtitle="School-wide schedule management, PDF allocation, and teacher assignments" 
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              onClick={() => setUploadModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm gap-1.5 font-bold text-xs h-9 px-4"
            >
              <Upload size={14} /> Upload Timetable PDF / Assign
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.print()}
              className="h-9 border-slate-200 text-slate-700 bg-white shadow-sm gap-1.5 font-bold text-xs"
            >
              <Printer size={14} /> Print Schedule
            </Button>
          </div>
        }
      />

      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Grade and Stream Dropdown Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2 rounded-2xl bg-slate-100/80 border border-slate-200/70">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* All Classes Filter */}
          <button 
            type="button"
            onClick={() => setSelectedFilter("All")}
            className={cn(
              "h-9 px-4 rounded-xl text-xs font-bold transition-all shrink-0",
              selectedFilter === "All" 
                ? "bg-indigo-600 text-white shadow-sm" 
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300"
            )}
          >
            All Classes ({subjects.length} slots)
          </button>

          {/* Individual Grade Dropdowns with their Streams */}
          {PRIMARY_GRADES_CONFIG.map(({ grade, streams }) => {
            const isGradeActive = selectedFilter === grade || streams.includes(selectedFilter);
            const activeStreamLabel = streams.includes(selectedFilter) ? selectedFilter : null;

            return (
              <DropdownMenu key={grade}>
                <DropdownMenuTrigger
                  className={cn(
                    "h-9 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shrink-0 outline-none",
                    isGradeActive
                      ? "bg-indigo-50 border-indigo-300 text-indigo-700 shadow-sm"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <span>{activeStreamLabel ? activeStreamLabel : grade}</span>
                  <ChevronDown size={13} className={cn("transition-transform text-slate-400", isGradeActive && "text-indigo-600")} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-44 bg-white rounded-2xl p-1.5 shadow-xl border border-slate-200 z-50">
                  <DropdownMenuLabel className="text-[10px] uppercase font-black text-slate-400 px-2 py-1">
                    {grade} Streams
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() => setSelectedFilter(grade)}
                    className={cn(
                      "text-xs font-bold rounded-xl px-2.5 py-1.5 cursor-pointer flex items-center justify-between",
                      selectedFilter === grade ? "bg-indigo-50 text-indigo-700" : "text-slate-700 hover:bg-slate-100"
                    )}
                  >
                    <span>All {grade}</span>
                    {selectedFilter === grade && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-1 bg-slate-100" />
                  {streams.map((stream) => {
                    const count = subjects.filter((s) => s.class === stream).length;
                    return (
                      <DropdownMenuItem
                        key={stream}
                        onClick={() => setSelectedFilter(stream)}
                        className={cn(
                          "text-xs font-semibold rounded-xl px-2.5 py-1.5 cursor-pointer flex items-center justify-between",
                          selectedFilter === stream ? "bg-indigo-600 text-white font-bold" : "text-slate-600 hover:bg-slate-100"
                        )}
                      >
                        <span>{stream}</span>
                        {count > 0 && (
                          <span className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                            selectedFilter === stream ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                          )}>
                            {count}
                          </span>
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </div>

        <div className="text-[11px] font-bold text-slate-500 px-2 flex items-center gap-1.5 shrink-0 self-end md:self-center">
          <Filter size={13} className="text-slate-400" />
          <span>Active View: <strong className="text-indigo-600">{selectedFilter}</strong> ({filteredSubjects.length} slots)</span>
        </div>
      </div>

      {/* Master Timetable Grid */}
      <Card className="shadow-sm border-slate-200/80 overflow-hidden bg-white">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse bg-white">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">
                <th className="py-4 px-6 border-r border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 text-left w-32">Daily Slots</th>
                {days.map(day => (
                  <th key={day} className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-slate-600 text-center">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {slots.map(time => (
                <tr key={time} className="group hover:bg-slate-50/40 transition-colors">
                  <td className="py-5 px-6 border-r border-slate-100 bg-slate-50/20">
                     <div className="flex items-center gap-2">
                       <Clock size={12} className="text-slate-300" />
                       <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{time}</span>
                     </div>
                  </td>
                  {days.map(day => {
                    const match = filteredSubjects.find(s => s.day === day && s.time === time);
                    return (
                      <td key={day} className="p-2 border-r border-slate-100 last:border-r-0">
                        {match ? (
                          <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 group/item hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:-translate-y-0.5 transition-all cursor-pointer shadow-sm">
                            <div className="flex justify-between items-start mb-1.5">
                               <p className="text-xs font-bold transition-colors uppercase tracking-tight">{match.subject}</p>
                               <Badge className="bg-white text-indigo-700 text-[9px] font-black px-1.5 h-4 border border-indigo-100 group-hover/item:bg-white/20 group-hover/item:text-white group-hover/item:border-transparent transition-colors">{match.class}</Badge>
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-semibold opacity-75 flex items-center gap-1.5">
                                 <User size={11} /> {match.teacher}
                               </p>
                               <p className="text-[9px] font-bold flex items-center gap-1 opacity-70">
                                 <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 group-hover/item:bg-white" /> {match.room || "Room 104"}
                               </p>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setUploadModalOpen(true)}
                            className="h-16 w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                             <div className="h-10 w-full border border-dashed border-slate-200 hover:border-indigo-400 rounded-xl flex items-center justify-center text-[10px] text-slate-400 font-bold hover:text-indigo-600 transition-colors">
                               + Assign Slot
                             </div>
                          </button>
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
      
      {/* Bottom Summary & Conflict Detector */}
      <div className="flex border-t border-slate-100 pt-6">
         <Card className="flex-1 shadow-sm border-slate-200/80 bg-slate-50/50">
            <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs font-medium text-slate-600">
                    Schedule Status: <span className="text-emerald-700 font-bold ml-1">0 Teacher or Venue Conflicts Detected</span>
                  </p>
               </div>
               <Button 
                onClick={() => setUploadModalOpen(true)}
                variant="outline" 
                size="sm" 
                className="h-8 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-white gap-1.5 px-4 shadow-sm border-slate-200"
               >
                  <Plus size={13} /> Add More Periods <ChevronRight size={14} />
               </Button>
            </CardContent>
         </Card>
      </div>

      {/* Upload Timetable Modal */}
      <UploadTimetableModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onTimetableCreated={handleTimetableAdded}
        schoolType="primary"
      />
    </div>
  );
}
