import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout";
import { teachersSeed } from "../../data/mockData";
import { getAttendanceRoster, recordAttendance, AttendanceRosterItem } from "@/lib/api";

// shadcn/ui
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

// lucide
import { Save, History } from "lucide-react";
import { cn } from "@/lib/utils";

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

export default function TeacherAttendance() {
  const teacher = teachersSeed[0];
  const [klass, setKlass] = useState(teacher.classes[0]);
  const [roster, setRoster] = useState<AttendanceRosterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await getAttendanceRoster();
        setRoster(data);
      } catch (err) {
        console.error("Attendance fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function handleStatusToggle(studentId: string, currentStatus: "present" | "absent" | "late") {
    const nextMap: Record<string, "present" | "absent" | "late"> = {
      present: "absent",
      absent: "late",
      late: "present",
    };
    const newStatus = nextMap[currentStatus];

    // Optimistic UI update
    setRoster((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, status: newStatus } : item))
    );

    try {
      await recordAttendance({ studentId, status: newStatus });
      toast({
        title: "Attendance Saved 🎉",
        description: `Student status set to ${newStatus.toUpperCase()}`,
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Save Error",
        description: err.message || "Failed to update attendance record.",
      });
    }
  }

  const presentCount = roster.filter((r) => r.status === "present").length;
  const absentCount = roster.filter((r) => r.status === "absent").length;
  const lateCount = roster.filter((r) => r.status === "late").length;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Daily Attendance" 
        subtitle="Mark student presence for your assigned classes in real-time" 
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200 text-slate-600 gap-1.5 font-bold">
              <History size={14} /> View History
            </Button>
            <Button 
              onClick={() => toast({ title: "Sync Complete", description: "All attendance records pushed to Supabase." })}
              size="sm" className="h-9 bg-indigo-600 hover:bg-indigo-700 shadow-sm text-xs gap-1.5 font-bold">
              <Save size={14} /> Submit Roster
            </Button>
          </div>
        }
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Select Learning Group</p>
          <Select value={klass} onValueChange={(v) => v && setKlass(v)}>
            <SelectTrigger className="w-[180px] h-10 border-slate-200 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {teacher.classes.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-xl px-4 py-2.5 shadow-sm">
           <div className="flex items-center gap-1.5">
             <div className="h-2 w-2 rounded-full bg-emerald-500" />
             <span className="text-[11px] font-bold text-slate-600">{presentCount} Present</span>
           </div>
           <Separator orientation="vertical" className="h-4" />
           <div className="flex items-center gap-1.5">
             <div className="h-2 w-2 rounded-full bg-amber-500" />
             <span className="text-[11px] font-bold text-slate-600">{lateCount} Late</span>
           </div>
           <Separator orientation="vertical" className="h-4" />
           <div className="flex items-center gap-1.5">
             <div className="h-2 w-2 rounded-full bg-rose-500" />
             <span className="text-[11px] font-bold text-slate-600">{absentCount} Absent</span>
           </div>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200/80">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-50">
                 <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Student</TableHead>
                 <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Admission No.</TableHead>
                 <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Status (Click to toggle)</TableHead>
                 <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roster.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-[10px] font-bold bg-indigo-50 text-indigo-700">
                            {initials(s.studentName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 leading-tight">{s.studentName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 tracking-tight font-medium uppercase">{s.className}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 text-xs font-mono text-slate-500">
                      {s.admissionNumber}
                    </TableCell>

                    <TableCell className="py-4 text-center">
                       <button
                         onClick={() => handleStatusToggle(s.studentId, s.status)}
                         className={cn(
                           "inline-flex items-center justify-center h-8 px-4 rounded-full text-[10px] font-bold border-2 transition-all cursor-pointer shadow-xs",
                           s.status === "absent" 
                            ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100" 
                            : s.status === "late"
                            ? "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                            : "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                         )}
                       >
                         {s.status.toUpperCase()}
                       </button>
                    </TableCell>

                    <TableCell className="pr-6 py-4 text-right">
                       <input 
                         type="text" 
                         defaultValue={s.remarks || ""}
                         onBlur={(e) => recordAttendance({ studentId: s.studentId, status: s.status, remarks: e.target.value })}
                         placeholder="Add note..."
                         className="h-8 text-[10px] border-b border-transparent focus:border-indigo-300 outline-none bg-transparent placeholder:text-slate-300 text-right w-36" 
                       />
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
