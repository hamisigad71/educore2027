import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Download, Plus, ClipboardList, TrendingUp, Users, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const reports = [
  { title: "End of Term 2 Report", date: "2025-04-02", type: "Academic", status: "Published", author: "Head Teacher" },
  { title: "Annual Enrollment Report", date: "2025-03-15", type: "Administrative", status: "Published", author: "Secretary" },
  { title: "Teacher Performance Review", date: "2025-02-28", type: "HR", status: "Draft", author: "Head Teacher" },
  { title: "School Development Plan", date: "2025-01-10", type: "Planning", status: "Published", author: "Head Teacher" },
  { title: "Mid-Term Academic Summary", date: "2025-02-12", type: "Academic", status: "Published", author: "Deputy Head" },
];

export default function HeadTeacherReports() {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="School Reports"
        subtitle="Generate, review, and publish official school reports and documents."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="h-9 text-xs border-slate-200 font-bold gap-2">
              <Download size={14} /> Export
            </Button>
            <Button className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 font-bold gap-2">
              <Plus size={14} /> New Report
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Reports", val: "24", icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Published", val: "19", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "This Term", val: "5", icon: ClipboardList, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Contributors", val: "8", icon: Users, color: "text-sky-600", bg: "bg-sky-50" },
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
            <CardTitle className="text-base font-bold text-slate-900 leading-none">Recent School Reports</CardTitle>
          </div>
          <Separator className="bg-slate-50" />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-50">
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Report Title</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Type</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Date</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Author</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((r) => (
                <TableRow key={r.title} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4 text-xs font-bold text-slate-900 group-hover:text-indigo-700">{r.title}</TableCell>
                  <TableCell className="py-4 text-xs text-slate-500">{r.type}</TableCell>
                  <TableCell className="py-4 text-xs font-mono text-slate-500">{r.date}</TableCell>
                  <TableCell className="py-4 text-xs text-slate-600">{r.author}</TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Badge className={cn("text-[9px] font-bold border-0",
                      r.status === "Published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
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
