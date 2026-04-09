import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, BookOpen, GraduationCap, Users, TrendingUp, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const academicRecords = [
  { student: "Alice Mwangi", grade: "Grade 4A", term1: 78, term2: 82, term3: 85, overall: "B+" },
  { student: "Brian Otieno", grade: "Grade 5B", term1: 65, term2: 70, term3: 68, overall: "C+" },
  { student: "Cynthia Kamau", grade: "Grade 3C", term1: 90, term2: 88, term3: 93, overall: "A" },
  { student: "Daniel Njoroge", grade: "Grade 2A", term1: 55, term2: 60, term3: 58, overall: "C" },
  { student: "Emily Wanjiru", grade: "Grade 6B", term1: 85, term2: 89, term3: 91, overall: "A-" },
];

export default function HeadTeacherAcademics() {
  const [q, setQ] = useState("");
  const filtered = academicRecords.filter(r =>
    r.student.toLowerCase().includes(q.toLowerCase()) || r.grade.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Academic Records"
        subtitle="Manage and review student academic performance across all grades."
        actions={
          <Button className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 font-bold gap-2">
            <Plus size={14} /> New Assessment
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Students", val: "623", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Grades Running", val: "8", icon: GraduationCap, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Term Average", val: "76%", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Subjects Tracked", val: "9", icon: BookOpen, color: "text-sky-600", bg: "bg-sky-50" },
        ].map((s) => (
          <Card key={s.label} className="shadow-sm border-slate-200/80">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", s.bg)}>
                  <s.icon size={15} className={s.color} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
              </div>
              <p className="text-2xl font-bold text-slate-900">{s.val}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between px-6 pt-5 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 leading-none">Student Academic Scores</CardTitle>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search student..." value={q} onChange={(e) => setQ(e.target.value)}
                className="pl-9 h-9 w-[220px] text-xs bg-slate-50 border-slate-200" />
            </div>
          </div>
          <Separator className="bg-slate-50" />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-50">
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Student</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Grade</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Term 1</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Term 2</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Term 3</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.student} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4 text-xs font-bold text-slate-900 group-hover:text-indigo-700">{r.student}</TableCell>
                  <TableCell className="py-4 text-xs text-slate-600">{r.grade}</TableCell>
                  <TableCell className="py-4 text-xs font-medium">{r.term1}%</TableCell>
                  <TableCell className="py-4 text-xs font-medium">{r.term2}%</TableCell>
                  <TableCell className="py-4 text-xs font-medium">{r.term3}%</TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Badge className={cn("text-[9px] font-bold border-0",
                      r.overall.startsWith("A") ? "bg-emerald-50 text-emerald-700" :
                      r.overall.startsWith("B") ? "bg-sky-50 text-sky-700" :
                      "bg-amber-50 text-amber-700"
                    )}>{r.overall}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
