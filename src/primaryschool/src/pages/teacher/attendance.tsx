import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { teachersSeed, studentsSeed } from "@/primaryschool/src/data/mockData";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

// lucide
import { 
  CheckCircle2, Clock, Calendar, 
  Search, Save, ArrowLeft, History
} from "lucide-react";
import { cn } from "@/lib/utils";

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

export default function TeacherAttendance() {
  const teacher = teachersSeed[0];
  const [klass, setKlass] = useState(teacher.classes[0]);
  const myStudents = studentsSeed.filter((s) => s.klass === klass);
  const [absent, setAbsent] = useState<string[]>([]);
  const { toast } = useToast();

  function toggle(id: string) {
    setAbsent((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Daily Attendance" 
        subtitle="Mark student presence for your assigned classes" 
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200 text-slate-600 gap-1.5 font-bold">
              <History size={14} /> View History
            </Button>
            <Button 
                onClick={() => toast({ title: "Attendance Saved", description: "Records updated for " + klass })}
                size="sm" className="h-9 bg-indigo-600 hover:bg-indigo-700 shadow-sm text-xs gap-1.5 font-bold">
              <Save size={14} /> Submit Records
            </Button>
          </div>
        }
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Select Learning Group</p>
          <Select value={klass} onValueChange={setKlass}>
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
             <span className="text-[11px] font-bold text-slate-600">{myStudents.length - absent.length} Present</span>
           </div>
           <Separator orientation="vertical" className="h-4" />
           <div className="flex items-center gap-1.5">
             <div className="h-2 w-2 rounded-full bg-rose-500" />
             <span className="text-[11px] font-bold text-slate-600">{absent.length} Absent</span>
           </div>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200/80">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-50">
                 <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Student</TableHead>
                 <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Roll No.</TableHead>
                 <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Status</TableHead>
                 <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myStudents.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors">
                   <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={s.photo} alt={s.name} />
                          <AvatarFallback className="text-[10px] font-bold bg-indigo-50 text-indigo-700">
                            {initials(s.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 leading-tight">{s.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 tracking-tight font-medium uppercase">{s.admission}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 text-xs font-mono text-slate-500">
                      {s.admission.split("/").pop()}
                    </TableCell>

                    <TableCell className="py-4 text-center">
                       <button
                         onClick={() => toggle(s.id)}
                         className={cn(
                           "inline-flex items-center justify-center h-8 px-4 rounded-full text-[10px] font-bold border-2 transition-all",
                           absent.includes(s.id) 
                            ? "bg-rose-50 text-rose-600 border-rose-200" 
                            : "bg-emerald-50 text-emerald-600 border-emerald-200"
                         )}
                       >
                         {absent.includes(s.id) ? "ABSENT" : "PRESENT"}
                       </button>
                    </TableCell>

                    <TableCell className="pr-6 py-4 text-right">
                       <input 
                         type="text" 
                         placeholder="Add note..."
                         className="h-8 text-[10px] border-b border-transparent focus:border-indigo-300 outline-none bg-transparent placeholder:text-slate-300 text-right w-32" 
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
