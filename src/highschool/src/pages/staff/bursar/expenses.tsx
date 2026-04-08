import React from "react";
import { PageHeader } from "@/components/layout";
import { currency } from "../../../data/mockData";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

// lucide
import { 
  ShoppingBag, Zap,
  Plus, Download, Filter,
  CreditCard, Truck
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BursarExpenses() {
  const expenses = [
    { id: "EXP-101", item: "Laboratory Reagents Batch #12", category: "Academic", merchant: "ScienceCorp Ltd", amount: 45000, date: "2025-05-18", status: "Approved" },
    { id: "EXP-102", item: "Electricity Bill (May)", category: "Utilities", merchant: "Kenya Power", amount: 120000, date: "2025-05-20", status: "Verified" },
    { id: "EXP-103", item: "School Bus Diesel (200L)", category: "Transport", merchant: "Shell Service", amount: 38000, date: "2025-05-22", status: "Paid" },
    { id: "EXP-104", item: "Staffroom Refreshments", category: "Welfare", merchant: "QuickMart", amount: 8500, date: "2025-05-24", status: "Approved" },
    { id: "EXP-105", item: "Main Gate Painting", category: "Maintenance", merchant: "Crown Paints", amount: 12500, date: "2025-05-25", status: "Pending" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Expenditure & Procurement" 
        subtitle="Track school operational costs, utility payments, and vendor invoices" 
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-700 bg-white shadow-sm font-bold text-xs gap-1.5 px-4">
              <Download size={14} /> Expenditure Summary
            </Button>
            <Button className="h-9 bg-indigo-600 hover:bg-indigo-700 shadow-sm text-xs font-bold gap-1.5 px-4">
              <Plus size={14} /> New Voucher
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[
          { label: "Monthly Budget", value: currency(2500000), icon: CreditCard, color: "text-slate-400" },
          { label: "Spent to Date", value: currency(1840000), icon: ShoppingBag, color: "text-indigo-600" },
          { label: "Utilities Pool", value: currency(450000), icon: Zap, color: "text-amber-500" },
          { label: "Remaining Balance", value: currency(660000), icon: Wallet, color: "text-emerald-500" },
        ].map((stat, i) => (
          <Card key={i} className="shadow-sm border-slate-200/80">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                  <stat.icon size={14} className={stat.color} />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              </div>
              <p className="text-xl font-bold text-slate-900 tracking-tighter">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between px-6 pt-5 pb-4">
             <div>
                <CardTitle className="text-base font-bold text-slate-900 leading-none">Operational Expenditure Ledger</CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-1.5 font-medium">Tracking all vouchers and procurement orders for current month</CardDescription>
             </div>
             <div className="flex items-center gap-2">
                <Input placeholder="Filter by voucher or vendor..." className="h-9 w-[220px] text-xs bg-slate-50 border-slate-200" />
                <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200"><Filter size={14} /></Button>
             </div>
          </div>
          <Separator className="bg-slate-50" />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
             <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-50">
                   <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Order ID & Date</TableHead>
                   <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</TableHead>
                   <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</TableHead>
                   <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Vendor / Merchant</TableHead>
                   <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Amount</TableHead>
                </TableRow>
             </TableHeader>
             <TableBody>
                {expenses.map((exp) => (
                  <TableRow key={exp.id} className="group hover:bg-slate-50/50 transition-colors">
                     <TableCell className="pl-6 py-4">
                        <p className="text-xs font-bold text-slate-900">{exp.id}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{exp.date}</p>
                     </TableCell>
                     <TableCell className="py-4 text-xs font-semibold text-slate-700 leading-snug">{exp.item}</TableCell>
                     <TableCell className="py-4">
                        <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-500 font-bold text-[9px] px-2 uppercase tracking-wide">
                          {exp.category}
                        </Badge>
                     </TableCell>
                     <TableCell className="py-4 text-xs font-medium text-slate-600 flex items-center gap-1.5">
                        <Truck size={12} className="text-slate-300" /> {exp.merchant}
                     </TableCell>
                     <TableCell className="pr-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                           <p className="text-sm font-bold text-slate-900 tracking-tighter">{currency(exp.amount)}</p>
                           <Badge className={cn(
                             "text-[9px] font-bold border-0 px-2",
                             exp.status === "Paid" ? "bg-emerald-50 text-emerald-700" :
                             exp.status === "Pending" ? "bg-amber-50 text-amber-700" :
                             "bg-indigo-50 text-indigo-700"
                           )}>{exp.status}</Badge>
                        </div>
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

function Wallet({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/><path d="M2 17h1"/></svg>;
}
