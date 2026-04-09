import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText, Users, UserPlus, Mail, Phone, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const admissionsList = [
  { name: "Kevin Omondi", grade: "Grade 1", date: "2025-04-01", guardian: "Mr. James Omondi", phone: "0722 100 200", status: "Enrolled" },
  { name: "Sharon Waweru", grade: "Grade 3", date: "2025-04-03", guardian: "Mrs. Waweru", phone: "0733 200 300", status: "Pending" },
  { name: "James Kipruto", grade: "Grade 4", date: "2025-04-05", guardian: "Mr. Kipruto", phone: "0712 300 400", status: "Enrolled" },
  { name: "Grace Mutua", grade: "Grade 2", date: "2025-04-06", guardian: "Mrs. Mutua", phone: "0741 400 500", status: "Under Review" },
];

export default function SecretaryPortal() {
  const [q, setQ] = useState("");
  const filtered = admissionsList.filter(r =>
    r.name.toLowerCase().includes(q.toLowerCase()) || r.grade.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Secretary's Office"
        subtitle="Handle admissions, correspondence records, and school administrative tasks."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="h-9 text-xs border-slate-200 font-bold gap-2">
              <FileText size={14} /> Generate Letter
            </Button>
            <Button className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 font-bold gap-2">
              <UserPlus size={14} /> New Admission
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "New Admissions", val: "24", icon: UserPlus, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Total Students", val: "623", icon: Users, color: "text-sky-600", bg: "bg-sky-50" },
          { label: "Letters Sent", val: "47", icon: Mail, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pending Records", val: "6", icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
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
            <CardTitle className="text-base font-bold text-slate-900 leading-none">Recent Admissions</CardTitle>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search..." value={q} onChange={(e) => setQ(e.target.value)}
                className="pl-9 h-9 w-[220px] text-xs bg-slate-50 border-slate-200" />
            </div>
          </div>
          <Separator className="bg-slate-50" />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-50">
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Student Name</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Grade</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Guardian</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Date</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.name} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4 text-xs font-bold text-slate-900 group-hover:text-indigo-700">{r.name}</TableCell>
                  <TableCell className="py-4 text-xs text-slate-500">{r.grade}</TableCell>
                  <TableCell className="py-4 text-xs text-slate-600">{r.guardian}</TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Phone size={11} className="text-slate-300" />{r.phone}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-xs font-mono text-slate-400">{r.date}</TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Badge className={cn("text-[9px] font-bold border-0",
                      r.status === "Enrolled" ? "bg-emerald-50 text-emerald-700" :
                      r.status === "Pending" ? "bg-amber-50 text-amber-700" :
                      "bg-sky-50 text-sky-700"
                    )}>{r.status}</Badge>
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
