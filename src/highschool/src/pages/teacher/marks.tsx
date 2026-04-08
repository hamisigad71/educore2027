import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { teachersSeed, studentsSeed } from "@/highschool/src/data/mockData";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Separator } from "@/components/ui/separator";

// lucide
import { 
  FileEdit, Save, Search, 
  ChevronRight, Award, History
} from "lucide-react";
import { cn } from "@/lib/utils";

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

export default function TeacherMarks() {
  const teacher = teachersSeed[0];
  const [klass, setKlass] = useState(teacher.classes[0]);
  const [exam, setExam] = useState("Term 2 - Mid Term");
  const myStudents = studentsSeed.filter((s) => s.klass === klass);
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Marks Entry" 
        subtitle="Record and manage student academic performance" 
        actions={
          <div className="flex items-center gap-2">
            <Button 
                onClick={() => toast({ title: "Marks Saved", description: `Database updated for ${klass}` })}
                size="sm" className="h-9 bg-indigo-600 hover:bg-indigo-700 shadow-sm text-xs gap-1.5 font-bold">
              <Save size={14} /> Push To Portal
            </Button>
          </div>
        }
      />

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="flex flex-wrap gap-4">
           <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Class</p>
            <Select value={klass} onValueChange={setKlass}>
              <SelectTrigger className="w-[160px] h-10 border-slate-200 bg-white shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {teacher.classes.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Examination / Assessment</p>
            <Select value={exam} onValueChange={setExam}>
              <SelectTrigger className="w-[220px] h-10 border-slate-200 bg-white shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Term 2 - Starter">Term 2 - Entry Exam</SelectItem>
                <SelectItem value="Term 2 - Mid Term">Term 2 - Mid Term</SelectItem>
                <SelectItem value="Term 2 - Finals">Term 2 - Finals</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-1 rounded-xl bg-slate-100/50 border border-slate-100 flex items-center shadow-inner">
           <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold px-4 bg-white text-indigo-700 shadow-sm">List View</Button>
           <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold px-4 text-slate-500 hover:text-slate-900">Grid View</Button>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200/80">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-50">
                 <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Student</TableHead>
                 <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Subject</TableHead>
                 <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Score (%)</TableHead>
                 <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Form</TableHead>
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
                        <p className="text-sm font-semibold text-slate-900 leading-tight">{s.name}</p>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                       <Badge variant="outline" className="bg-slate-50 text-slate-500 border-0 font-bold text-[10px]">
                         {teacher.subject}
                       </Badge>
                    </TableCell>

                    <TableCell className="py-4">
                       <Input 
                         type="number" 
                         defaultValue={s.performance}
                         className="h-9 w-20 text-center text-sm font-bold border-slate-200 focus:border-indigo-400" 
                       />
                    </TableCell>

                    <TableCell className="py-4 text-center">
                       <span className={cn(
                         "h-8 w-8 inline-flex items-center justify-center rounded-lg font-bold text-xs border",
                         s.performance >= 80 ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                         s.performance >= 60 ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                         "bg-amber-50 text-amber-700 border-amber-100"
                       )}>
                         {s.performance >= 80 ? "A" : s.performance >= 70 ? "B" : s.performance >= 60 ? "C" : "D"}
                       </span>
                    </TableCell>

                    <TableCell className="pr-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <input 
                           type="text" 
                           placeholder="Excellent work..." 
                           className="h-8 text-[11px] text-right border-0 border-b border-transparent focus:border-indigo-300 outline-none bg-transparent placeholder:text-slate-300 text-slate-600 focus:text-indigo-900"
                         />
                         <ChevronRight size={14} className="text-slate-300" />
                       </div>
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
