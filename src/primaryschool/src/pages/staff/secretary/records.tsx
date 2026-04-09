import React from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Users, FolderOpen, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const records = [
  { student: "Alice Mwangi", grade: "Grade 4A", dob: "2015-03-12", guardian: "Mrs. Mwangi", documents: "KCPE Cert, Birth Cert", complete: true },
  { student: "Brian Otieno", grade: "Grade 5B", dob: "2014-07-22", guardian: "Mr. Otieno", documents: "Birth Cert only", complete: false },
  { student: "Cynthia Kamau", grade: "Grade 3C", dob: "2016-01-05", guardian: "Mrs. Kamau", documents: "All docs on file", complete: true },
  { student: "Daniel Njoroge", grade: "Grade 2A", dob: "2017-09-18", guardian: "Mr. Njoroge", documents: "Awaiting transfer docs", complete: false },
];

export default function SecretaryRecords() {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Student Records"
        subtitle="Maintain and verify student documentation and official school records."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="h-9 text-xs border-slate-200 font-bold gap-2">
              <FileText size={14} /> Print Records
            </Button>
            <Button className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 font-bold gap-2">
              <Plus size={14} /> Add Record
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Records", val: "623", icon: FolderOpen, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Complete Files", val: "589", icon: FileText, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Incomplete", val: "34", icon: Search, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "New This Term", val: "24", icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
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
          <div className="px-6 pt-5 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 leading-none">Student Document Registry</CardTitle>
          </div>
          <Separator className="bg-slate-50" />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-50">
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Student</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Grade</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">D.O.B</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Documents on File</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Record Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((r) => (
                <TableRow key={r.student} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">{r.student}</p>
                    <p className="text-[10px] text-slate-400">{r.guardian}</p>
                  </TableCell>
                  <TableCell className="py-4 text-xs text-slate-500">{r.grade}</TableCell>
                  <TableCell className="py-4 text-xs font-mono text-slate-400">{r.dob}</TableCell>
                  <TableCell className="py-4 text-xs text-slate-600">{r.documents}</TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Badge className={cn("text-[9px] font-bold border-0",
                      r.complete ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    )}>{r.complete ? "Complete" : "Incomplete"}</Badge>
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
