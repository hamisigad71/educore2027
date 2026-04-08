import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout";
import { teachersSeed, studentsSeed, Student } from "../../data/mockData";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

// lucide
import { 
  Users, Search, Filter, MoreHorizontal, 
  ChevronRight, Phone, Mail, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── helpers ─────────────────────────────────────────────────────────────────

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeacherStudents() {
  const teacher = teachersSeed[0];
  const [q, setQ] = useState("");
  const [klassFilter, setKlassFilter] = useState("All");

  const myStudents = useMemo(
    () => studentsSeed.filter((s) => teacher.classes.includes(s.klass)),
    [teacher]
  );

  const filtered = useMemo(
    () =>
      myStudents.filter(
        (s) =>
          (klassFilter === "All" || s.klass === klassFilter) &&
          s.name.toLowerCase().includes(q.toLowerCase())
      ),
    [myStudents, q, klassFilter]
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Students" 
        subtitle={`Tracking ${myStudents.length} students across your assigned classes`} 
      />

      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0 border-b border-slate-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pt-5 pb-4">
            <div>
              <CardTitle className="text-base font-semibold">Student Directory</CardTitle>
              <CardDescription className="text-xs">Academic performance and background info</CardDescription>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search students…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-9 h-9 w-[200px] text-xs bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20"
                />
              </div>
              <Select value={klassFilter} onValueChange={setKlassFilter}>
                <SelectTrigger className="h-9 w-[130px] text-xs bg-slate-50 border-slate-200">
                   <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Classes</SelectItem>
                  {teacher.classes.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-50">
                  <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Student</TableHead>
                  <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Class</TableHead>
                  <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Parent / Phone</TableHead>
                  <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Attendance</TableHead>
                  <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Pergrade.</TableHead>
                  <TableHead className="pr-6 py-3 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
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

                    <TableCell className="py-4">
                      <Badge variant="outline" className="text-[10px] font-bold border-indigo-100 text-indigo-700 bg-indigo-50 px-2 py-0">
                        {s.klass}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-4">
                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-slate-700">{s.parent ?? "N/A"}</p>
                        <p className="text-[10px] font-mono text-slate-400">{s.phone}</p>
                      </div>
                    </TableCell>

                    <TableCell className="py-4">
                       <div className="w-24 space-y-1.5">
                          <div className="flex justify-between items-center text-[9px] font-bold">
                            <span className={cn(s.attendance < 75 ? "text-rose-500" : "text-slate-400")}>{s.attendance}%</span>
                          </div>
                          <Progress value={s.attendance} className={cn("h-1 bg-slate-100", 
                            s.attendance < 75 ? "[&>div]:bg-rose-500" : "[&>div]:bg-indigo-500"
                          )} />
                       </div>
                    </TableCell>

                    <TableCell className="py-4 font-bold text-sm text-slate-900">
                      {s.performance}%
                    </TableCell>

                    <TableCell className="pr-6 py-4 text-right">
                       <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-slate-50 gap-1 font-bold">
                        Details <ChevronRight size={12} />
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
