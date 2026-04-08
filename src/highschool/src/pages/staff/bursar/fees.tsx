import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { feesSeed, currency } from "../../../data/mockData";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

// lucide
import { 
  Search, Download, Plus, Filter,
  TrendingUp,
  Clock, Landmark, CreditCard,
  CheckCircle2, Ban
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BursarFees() {
  const [q, setQ] = useState("");

  const filteredFees = feesSeed.filter(f => 
    f.studentId.toLowerCase().includes(q.toLowerCase()) || 
    f.receipt.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Fee Management" 
        subtitle="Track student payments, arrears, and generate financial receipts" 
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-700 bg-white shadow-sm font-bold text-xs gap-1.5 px-4">
              <Download size={14} /> Export CSV
            </Button>
            <Button className="h-9 bg-indigo-600 hover:bg-indigo-700 shadow-sm text-xs font-bold gap-1.5 px-4">
              <Plus size={14} /> Receive Payment
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {[
            { label: "Term 2 Target", value: currency(12500000), icon: Landmark, color: "text-indigo-600" },
            { label: "Total Collected", value: currency(8420000), icon: CheckCircle2, color: "text-emerald-600" },
            { label: "Outstanding", value: currency(4080000), icon: Clock, color: "text-amber-600" },
            { label: "Defaulters", value: "42 Students", icon: Ban, color: "text-rose-600" },
          ].map((stat, i) => (
            <Card key={i} className="shadow-sm border-slate-200/80">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                    <stat.icon size={14} className={stat.color} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                </div>
                <p className="text-xl font-bold text-slate-900 tracking-tighter">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
      </div>

      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 pt-5 pb-4 gap-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 leading-none">Transaction Ledger</CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1.5 font-medium tracking-tight">Viewing all validated fee payments for the current academic term</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search receipt or ID..." 
                  className="pl-9 h-9 w-[200px] text-xs bg-slate-50 border-slate-200" 
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200 text-slate-400">
                <Filter size={14} />
              </Button>
            </div>
          </div>
          <Separator className="bg-slate-50" />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-50">
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Date</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Student Name / ID</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Receipt #</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Method</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFees.map((f) => (
                <TableRow key={f.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4 text-xs font-medium text-slate-500">{f.date}</TableCell>
                  <TableCell className="py-4">
                    <p className="text-xs font-bold text-slate-900">{f.studentId}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Form 4 Blue</p>
                  </TableCell>
                  <TableCell className="py-4">
                    <code className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200/50">{f.receipt}</code>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                       <CreditCard size={12} className="text-indigo-400" />
                       <span className="text-[11px] font-bold text-slate-600">{f.method}</span>
                    </div>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <span className="text-sm font-bold text-slate-900 tracking-tighter">{currency(f.amount)}</span>
                       <TrendingUp size={14} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="p-4 bg-slate-50/30 text-center border-t border-slate-50">
             <p className="text-[11px] font-medium text-slate-400">Showing {filteredFees.length} transactions match your current filters</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
