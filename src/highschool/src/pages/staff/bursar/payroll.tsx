import React from "react";
import { PageHeader } from "@/components/layout";
import { currency } from "../../../data/mockData";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

// lucide
import { 
  Banknote, FileCheck,
  History, CheckCircle2,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BursarPayroll() {
  const staff = [
    { name: "John Doe", role: "Principal", base: 120000, deductions: 24000, net: 96000, status: "Paid" },
    { name: "Loveth Smith", role: "Sr. Teacher", base: 85000, deductions: 15000, net: 70000, status: "Paid" },
    { name: "Kevin Njoroge", role: "Bursar", base: 75000, deductions: 12000, net: 63000, status: "Processing" },
    { name: "Mary Atieno", role: "Nurse", base: 65000, deductions: 10000, net: 55000, status: "Pending" },
    { name: "Collins Juma", role: "Driver", base: 35000, deductions: 5000, net: 30000, status: "Pending" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Payroll & HR Finance" 
        subtitle="Manage staff salaries, statutory deductions, and monthly disbursements" 
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-700 bg-white shadow-sm font-bold text-xs gap-1.5 px-4">
              <History size={14} /> Pay History
            </Button>
            <Button className="h-9 bg-indigo-600 hover:bg-indigo-700 shadow-sm text-xs font-bold gap-1.5 px-4">
              <Banknote size={14} /> Process Payroll
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-sm border-slate-200/80">
          <CardHeader className="p-0">
             <div className="flex items-center justify-between px-6 pt-5 pb-4">
               <div>
                  <CardTitle className="text-base font-bold text-slate-900 leading-none">Monthly Staff Disbursement</CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-1.5">Payroll for the month of May 2025</CardDescription>
               </div>
               <Badge className="bg-emerald-50 text-emerald-700 border-0 font-bold px-3">BATCH #2025-05</Badge>
             </div>
             <Separator className="bg-slate-50" />
          </CardHeader>
          <CardContent className="p-0">
             <Table>
                <TableHeader>
                   <TableRow className="hover:bg-transparent border-b border-slate-50">
                      <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Staff Member</TableHead>
                      <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Department</TableHead>
                      <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Gross Pay</TableHead>
                      <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Statutory</TableHead>
                      <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Net Salary</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   {staff.map((s, i) => (
                     <TableRow key={i} className="group hover:bg-slate-50/50 transition-colors">
                        <TableCell className="pl-6 py-4">
                           <p className="text-xs font-bold text-slate-900 leading-tight">{s.name}</p>
                           <p className="text-[10px] text-slate-400 font-medium mt-0.5">{s.role}</p>
                        </TableCell>
                        <TableCell className="py-4 font-medium text-slate-500 text-xs">Admin / Academic</TableCell>
                        <TableCell className="py-4 font-mono text-xs font-bold text-slate-700">{currency(s.base)}</TableCell>
                        <TableCell className="py-4 font-mono text-xs text-rose-500 font-bold">-{currency(s.deductions)}</TableCell>
                        <TableCell className="pr-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-3">
                              <span className="text-[13px] font-bold text-slate-900 tracking-tighter">{currency(s.net)}</span>
                              <Badge className={cn(
                                "text-[9px] font-bold border-0 px-2",
                                s.status === "Paid" ? "bg-emerald-50 text-emerald-700" :
                                s.status === "Processing" ? "bg-indigo-50 text-indigo-700 animate-pulse" :
                                "bg-slate-50 text-slate-400"
                              )}>{s.status}</Badge>
                           </div>
                        </TableCell>
                     </TableRow>
                   ))}
                </TableBody>
             </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
           <Card className="shadow-sm border-slate-200/80">
              <CardHeader className="pb-3 px-6 pt-5">
                 <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                   <Briefcase size={16} className="text-indigo-600" /> Statutory Filings
                 </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                 {[
                   { label: "PAYE Returns", p: 100, date: "Submitted" },
                   { label: "NSSF Contributions", p: 100, date: "Submitted" },
                   { label: "NHIF Contributions", p: 45, date: "Due in 3 days" },
                   { label: "Housing Levy", p: 10, date: "Pending" },
                 ].map((tax, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between items-end">
                         <p className="text-xs font-bold text-slate-700">{tax.label}</p>
                         <p className={cn("text-[9px] font-black uppercase tracking-widest", tax.p === 100 ? "text-emerald-500" : "text-amber-500")}>
                           {tax.date}
                         </p>
                      </div>
                      <Progress value={tax.p} className={cn("h-1.5 bg-slate-100 rounded-full", tax.p === 100 ? "[&>div]:bg-emerald-500" : "[&>div]:bg-amber-500")} />
                   </div>
                 ))}
              </CardContent>
           </Card>

           <Card className="shadow-sm border-slate-200/80 bg-slate-900 text-white overflow-hidden p-6 relative group">
              <div className="relative z-10 space-y-4 text-center items-center flex flex-col">
                 <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <FileCheck size={24} className="text-emerald-400" />
                 </div>
                 <div className="space-y-1">
                    <h4 className="text-sm font-bold">Payroll Reconciled</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed px-4">All monthly salary data matches bank disbursement statements. Audit trail secured.</p>
                 </div>
                 <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9 text-[11px] rounded-xl border border-white/10 shadow-lg">
                    Download P9 Forms
                 </Button>
              </div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />
           </Card>
        </div>
      </div>
    </div>
  );
}
