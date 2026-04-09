import React from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingDown, Wallet, FileText, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const expenses = [
  { description: "Textbook Purchase – Grade 3", category: "Academic", amount: 45000, date: "2025-04-01", approved: true },
  { description: "Electricity Bill – April", category: "Utilities", amount: 12000, date: "2025-04-02", approved: true },
  { description: "Maintenance – Roof Repair", category: "Maintenance", amount: 78000, date: "2025-03-28", approved: false },
  { description: "Sports Equipment", category: "Extra-Curricular", amount: 15000, date: "2025-04-03", approved: true },
  { description: "Cleaning Supplies", category: "Operations", amount: 6500, date: "2025-04-05", approved: true },
];

export default function BursarExpenses() {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Expense Tracking"
        subtitle="Monitor and approve school expenditure across all departments."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="h-9 text-xs border-slate-200 font-bold gap-2">
              <FileText size={14} /> Expense Report
            </Button>
            <Button className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 font-bold gap-2">
              <Plus size={14} /> Log Expense
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "This Month", val: "KSh 156K", icon: TrendingDown, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "This Term", val: "KSh 423K", icon: Wallet, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Pending Approval", val: "3", icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Categories", val: "8", icon: Wallet, color: "text-sky-600", bg: "bg-sky-50" },
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
            <CardTitle className="text-base font-bold text-slate-900 leading-none">Recent Expenditures</CardTitle>
          </div>
          <Separator className="bg-slate-50" />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-50">
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Amount (KSh)</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Date</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((r) => (
                <TableRow key={r.description} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4 text-xs font-bold text-slate-900 group-hover:text-indigo-700">{r.description}</TableCell>
                  <TableCell className="py-4 text-xs text-slate-500">{r.category}</TableCell>
                  <TableCell className="py-4 text-xs font-mono text-slate-700">{r.amount.toLocaleString()}</TableCell>
                  <TableCell className="py-4 text-xs font-mono text-slate-400">{r.date}</TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Badge className={cn("text-[9px] font-bold border-0",
                      r.approved ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    )}>{r.approved ? "Approved" : "Pending"}</Badge>
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
