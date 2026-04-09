import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Receipt, CreditCard, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const mockFines = [
  { id: "FN-801", student: "Kevin Kiprop", form: "Form 3", reason: "Lost Book: Chemistry Form 3", amount: "KSh 850", status: "Unpaid", date: "Oct 15, 2026" },
  { id: "FN-802", student: "Daniel Komen", form: "Form 3", reason: "Late Return: 5 Days", amount: "KSh 100", status: "Paid", date: "Oct 20, 2026" },
  { id: "FN-803", student: "Faith Wanjiku", form: "Form 4", reason: "Damaged Cover: The Pearl", amount: "KSh 300", status: "Unpaid", date: "Oct 24, 2026" },
];

export default function LibraryFines() {
  const [q, setQ] = useState("");

  const filtered = mockFines.filter(req => 
    req.student.toLowerCase().includes(q.toLowerCase()) ||
    req.reason.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Fines & Damages" 
        subtitle="Manage billing for late returns, damaged, or lost library property." 
        actions={
          <div className="flex gap-2">
            <Button className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold">
              <Receipt size={14}/> Assess Fine
            </Button>
          </div>
        }
      />
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
         <AlertCircle className="text-amber-600" size={24}/>
         <div>
            <h4 className="text-xs font-bold text-amber-900">Uncleared Library Balances</h4>
            <p className="text-[11px] text-amber-700 mt-0.5">There are 12 students with uncleared library balances exceeding KSh 500. Clearance holds have been placed on their end-of-term reports.</p>
         </div>
      </div>

      <Card className="shadow-sm border-slate-200/80 mt-4">
        <CardHeader className="p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-5 pb-4">
             <div>
              <CardTitle className="text-base font-bold text-slate-900 leading-none">Fine Ledger</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search student..." 
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-9 h-9 w-[260px] text-xs bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>
          <Separator className="bg-slate-50" />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-50">
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Student</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Violation / Detail</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Amount</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Status</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">{item.student}</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5">{item.form}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-slate-700">{item.reason}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">Billed: {item.date} • {item.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <span className="text-xs font-bold font-mono text-slate-800">{item.amount}</span>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border-0 px-2 py-0.5 rounded-full inline-flex",
                        item.status === "Paid" ? "bg-emerald-50 text-emerald-700" :
                        "bg-rose-50 text-rose-700"
                      )}>
                        {item.status}
                      </Badge>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    {item.status === "Unpaid" ? (
                      <Button variant="ghost" size="sm" className="h-8 gap-1.5 bg-white border border-slate-200 text-[10px] text-slate-600 font-bold hover:text-indigo-600 hover:border-indigo-200 shadow-sm">
                        <CreditCard size={14}/> Mark Paid
                      </Button>
                    ) : (
                      <span className="text-[10px] italic text-slate-400">Cleared</span>
                    )}
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
