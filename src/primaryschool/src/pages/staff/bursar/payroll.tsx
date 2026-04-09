import React from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Wallet, TrendingDown, CreditCard, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const payrollList = [
  { name: "Mrs. Grace Wanjiru", role: "Class Teacher – Grade 4A", salary: 38000, status: "Paid", month: "Apr 2025" },
  { name: "Mr. Kevin Otieno", role: "Class Teacher – Grade 5B", salary: 35000, status: "Paid", month: "Apr 2025" },
  { name: "Ms. Faith Achieng", role: "Deputy Head Teacher", salary: 52000, status: "Pending", month: "Apr 2025" },
  { name: "Mr. Samuel Kamau", role: "Support Staff", salary: 18000, status: "Paid", month: "Apr 2025" },
  { name: "Mrs. Jane Mwangi", role: "Secretary", salary: 25000, status: "Pending", month: "Apr 2025" },
];

export default function BursarPayroll() {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Payroll Management"
        subtitle="Track and process monthly staff salary payments."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="h-9 text-xs border-slate-200 font-bold gap-2">
              <Download size={14} /> Payslips
            </Button>
            <Button className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 font-bold gap-2">
              <CreditCard size={14} /> Process Payroll
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Monthly Bill", val: "KSh 312K", icon: Wallet, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Disbursed", val: "KSh 214K", icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Pending", val: "KSh 98K", icon: TrendingDown, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Total Staff", val: "28", icon: Wallet, color: "text-amber-600", bg: "bg-amber-50" },
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
            <CardTitle className="text-base font-bold text-slate-900 leading-none">Staff Payroll — April 2025</CardTitle>
          </div>
          <Separator className="bg-slate-50" />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-50">
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Staff Member</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Role</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Salary (KSh)</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Month</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollList.map((r) => (
                <TableRow key={r.name} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4 text-xs font-bold text-slate-900 group-hover:text-indigo-700">{r.name}</TableCell>
                  <TableCell className="py-4 text-xs text-slate-500">{r.role}</TableCell>
                  <TableCell className="py-4 text-xs font-mono text-slate-700">{r.salary.toLocaleString()}</TableCell>
                  <TableCell className="py-4 text-xs text-slate-500">{r.month}</TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Badge className={cn("text-[9px] font-bold border-0",
                      r.status === "Paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
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
