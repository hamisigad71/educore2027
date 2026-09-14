import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout";
import { getTeacherProfile, getTeacherStudents, recordExamResult, TeacherProfile, StudentItem, calculateKcseGrade } from "@/lib/api";

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
  ChevronRight, Award, History, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

export default function TeacherMarks() {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [klass, setKlass] = useState<string>("");
  const [exam, setExam] = useState("Term 2 - Mid Term");
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [marks, setMarks] = useState<Record<string, number>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const p = await getTeacherProfile();
        if (p) {
          setProfile(p);
          if (p.classes.length > 0) {
            setKlass(p.classes[0]);
            const stds = await getTeacherStudents(p.classes);
            setStudents(stds);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoaded(true);
      }
    }
    loadData();
  }, []);

  const myStudents = students.filter((s) => s.className === klass);

  const handlePushToPortal = async () => {
    setIsSaving(true);
    let successCount = 0;
    try {
      if (!profile) return;
      const promises = Object.keys(marks).map(async (studentId) => {
        const ms = marks[studentId];
        const rem = remarks[studentId] || "";
        await recordExamResult({
          studentId,
          subject: profile.subject,
          marksObtained: ms,
          maxMarks: 100,
          remarks: rem
        });
        successCount++;
      });
      await Promise.all(promises);
      toast({ title: "Marks Saved", description: `Successfully pushed ${successCount} records to portal.` });
      // Clear forms
      setMarks({});
      setRemarks({});
    } catch (err) {
      toast({ title: "Error", description: "Failed to push some records.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const updateMark = (id: string, val: string) => {
    const v = parseInt(val, 10);
    if (!isNaN(v)) setMarks(prev => ({ ...prev, [id]: v }));
    else {
      const copy = {...marks};
      delete copy[id];
      setMarks(copy);
    }
  };

  const updateRemark = (id: string, val: string) => {
    setRemarks(prev => ({ ...prev, [id]: val }));
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Marks Entry" 
        subtitle="Record and manage student academic performance" 
        actions={
          <div className="flex items-center gap-2">
            <Button 
                onClick={handlePushToPortal}
                disabled={isSaving || Object.keys(marks).length === 0}
                size="sm" className="h-9 bg-indigo-600 hover:bg-indigo-700 shadow-sm text-xs gap-1.5 font-bold">
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
              Push To Portal
            </Button>
          </div>
        }
      />

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="flex flex-wrap gap-4">
           <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Class</p>
            <Select value={klass} onValueChange={setKlass} disabled={!isLoaded || !profile || profile.classes.length === 0}>
              <SelectTrigger className="w-[160px] h-10 border-slate-200 bg-white shadow-sm">
                <SelectValue placeholder={isLoaded ? "Select Class" : "Loading..."} />
              </SelectTrigger>
              <SelectContent>
                {profile?.classes.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">ExLovethtion / Assessment</p>
            <Select value={exam} onValueChange={setExam}>
              <SelectTrigger className="w-[220px] h-10 border-slate-200 bg-white shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Term 2 - Starter">Term 2 - Entry Exam</SelectItem>
                <SelectItem value="Term 2 - Mid Term">Term 2 - Mid Term</SelectItem>
                <SelectItem value="Term 2 - Finals">Term 2- Finals</SelectItem>
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
                 <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Grade</TableHead>
                 <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myStudents.length === 0 && isLoaded && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-slate-400 text-sm">No students assigned to {klass || "this class"}</TableCell>
                </TableRow>
              )}
              {myStudents.map((s) => {
                const mk = marks[s.id];
                const gradeInfo = mk !== undefined ? calculateKcseGrade(mk) : null;
                
                return (
                <TableRow key={s.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-[10px] font-bold bg-indigo-50 text-indigo-700">
                            {initials(s.name)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-semibold text-slate-900 leading-tight">{s.name}</p>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                       <Badge variant="outline" className="bg-slate-50 text-slate-500 border-0 font-bold text-[10px]">
                         {profile?.subject || "Subject"}
                       </Badge>
                    </TableCell>

                    <TableCell className="py-4">
                       <Input 
                         type="number" 
                         value={mk !== undefined ? mk : ""}
                         onChange={(e) => updateMark(s.id, e.target.value)}
                         placeholder="0"
                         className="h-9 w-20 text-center text-sm font-bold border-slate-200 focus:border-indigo-400" 
                       />
                    </TableCell>

                    <TableCell className="py-4 text-center">
                       {gradeInfo ? (
                         <span className={cn(
                           "h-8 w-8 inline-flex items-center justify-center rounded-lg font-bold text-xs border",
                           mk !== undefined && mk >= 80 ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                           mk !== undefined && mk >= 60 ? "bg-indigo-50 text-indigo-700 border-indigo-100" :
                           "bg-amber-50 text-amber-700 border-amber-100"
                         )}>
                           {gradeInfo.grade}
                         </span>
                       ) : <span className="text-xs text-slate-300">-</span>}
                    </TableCell>

                    <TableCell className="pr-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                         <input 
                           type="text" 
                           value={remarks[s.id] || ""}
                           onChange={(e) => updateRemark(s.id, e.target.value)}
                           placeholder={gradeInfo?.remarks || "Excellent work..."} 
                           className="h-8 text-[11px] text-right border-0 border-b border-transparent focus:border-indigo-300 outline-none bg-transparent placeholder:text-slate-300 text-slate-600 focus:text-indigo-900"
                         />
                         <ChevronRight size={14} className="text-slate-300" />
                       </div>
                    </TableCell>
                </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
