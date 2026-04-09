import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Landmark, TrendingUp, AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const feeRecords = [
  { student: "Alice Mwangi", grade: "Grade 4A", amount: 12500, paid: 12500, balance: 0, status: "Paid" },
  { student: "Brian Otieno", grade: "Grade 5B", amount: 12500, paid: 8000, balance: 4500, status: "Partial" },
  { student: "Cynthia Kamau", grade: "Grade 3C", amount: 12500, paid: 0, balance: 12500, status: "Unpaid" },
  { student: "Daniel Njoroge", grade: "Grade 2A", amount: 12500, paid: 12500, balance: 0, status: "Paid" },
  { student: "Emily Wanjiru", grade: "Grade 6B", amount: 12500, paid: 10000, balance: 2500, status: "Partial" },
];

export default function BursarPortal() {
  const [q, setQ] = useState("");
  const filtered = feeRecords.filter(r =>
    r.student.toLowerCase().includes(q.toLowerCase()) || r.grade.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Bursar's Office"
        subtitle="Manage fee collections, track balances, and generate financial summaries."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="h-9 text-xs border-slate-200 font-bold gap-2">
              <TrendingUp size={14} /> Fee Report
            </Button>
            <Button className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 font-bold gap-2">
              <Plus size={14} /> Record Payment
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Expected", val: "KSh 7.8M", icon: Landmark, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Collected", val: "KSh 5.4M", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Outstanding", val: "KSh 2.4M", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Payment Rate", val: "69%", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
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
            <CardTitle className="text-base font-bold text-slate-900 leading-none">Fee Collection Status</CardTitle>
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
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Expected</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Paid</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Balance</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.student} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4 text-xs font-bold text-slate-900 group-hover:text-indigo-700">{r.student}</TableCell>
                  <TableCell className="py-4 text-xs text-slate-500">{r.grade}</TableCell>
                  <TableCell className="py-4 text-xs font-mono text-slate-700">KSh {r.amount.toLocaleString()}</TableCell>
                  <TableCell className="py-4 text-xs font-mono text-emerald-700">KSh {r.paid.toLocaleString()}</TableCell>
                  <TableCell className="py-4 text-xs font-mono text-rose-600">KSh {r.balance.toLocaleString()}</TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Badge className={cn("text-[9px] font-bold border-0",
                      r.status === "Paid" ? "bg-emerald-50 text-emerald-700" :
                      r.status === "Partial" ? "bg-amber-50 text-amber-700" :
                      "bg-rose-50 text-rose-700"
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
