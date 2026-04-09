import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, RotateCcw, ReplyAll, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const mockCirculation = [
  { id: "TXN-092", student: "Sarah Wanjiku", form: "Form 1", book: "Things Fall Apart", issueDate: "Oct 12, 2026", dueDate: "Oct 26, 2026", status: "Due Today" },
  { id: "TXN-093", student: "Kevin Kiprop", form: "Form 3", book: "Chemistry Form 3", issueDate: "Oct 01, 2026", dueDate: "Oct 15, 2026", status: "Overdue" },
  { id: "TXN-094", student: "Grace Mutuku", form: "Form 1", book: "River and the Source", issueDate: "Oct 22, 2026", dueDate: "Nov 05, 2026", status: "Borrowed" },
];

export default function LibraryCirculation() {
  const [q, setQ] = useState("");

  const filtered = mockCirculation.filter(req => 
    req.student.toLowerCase().includes(q.toLowerCase()) ||
    req.book.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Circulation & Lending" 
        subtitle="Track book checkouts, returns, and borrowing limits." 
        actions={
          <div className="flex gap-2">
            <Button className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold">
              <RotateCcw size={14}/> Issue / Return
            </Button>
          </div>
        }
      />
      
      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-5 pb-4">
             <div>
              <CardTitle className="text-base font-bold text-slate-900 leading-none">Active Borrows</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Scan ID or Search..." 
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
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Borrower</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Book Reference</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Timeline</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
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
                      <span className="text-xs font-medium text-slate-700">{item.book}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 font-mono">{item.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col text-[10px] text-slate-600 gap-1">
                      <span>Issued: {item.issueDate}</span>
                      <span className={cn(item.status === "Overdue" && "text-rose-600 font-bold")}>Due: {item.dueDate}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border-0 px-2 py-0.5",
                        item.status === "Borrowed" ? "bg-slate-100 text-slate-700" :
                        item.status === "Due Today" ? "bg-amber-50 text-amber-700" :
                        "bg-rose-50 text-rose-700 animate-pulse"
                      )}>
                        {item.status}
                      </Badge>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 gap-1.5 bg-emerald-50 border border-emerald-100 text-[10px] text-emerald-700 font-bold hover:text-emerald-800 hover:bg-emerald-100 shadow-sm">
                      <ReplyAll size={14}/> Return
                    </Button>
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
