import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, ArrowRightLeft, Upload, FileSignature } from "lucide-react";
import { cn } from "@/lib/utils";

const mockTransfers = [
  { id: "TRN-001", student: "Caleb Njuguna", form: "Form 2", type: "Inbound", fromTo: "St. Patrick's High", reason: "Relocation", status: "Approved", date: "Oct 20, 2026" },
  { id: "TRN-002", student: "Anita Wambui", form: "Form 3", type: "Outbound", fromTo: "Greensteds Int.", reason: "Curriculum Change", status: "Pending Clearance", date: "Oct 24, 2026" },
  { id: "TRN-003", student: "Felix Otieno", form: "Form 1", type: "Inbound", fromTo: "Lakehouse Academy", reason: "Academic Upgrade", status: "Under Review", date: "Oct 26, 2026" },
];

export default function AdmissionsTransfers() {
  const [q, setQ] = useState("");

  const filtered = mockTransfers.filter(req => 
    req.student.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Student Transfers" 
        subtitle="Manage inbound enrollments and outbound student clearance processes." 
        actions={
          <div className="flex gap-2">
            <Button className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold">
              <ArrowRightLeft size={14}/> Init Transfer
            </Button>
          </div>
        }
      />
      
      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-5 pb-4">
             <div>
              <CardTitle className="text-base font-bold text-slate-900 leading-none">Transfer Register</CardTitle>
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
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Direction</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">School / Reason</TableHead>
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
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5">{item.id} • {item.form}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border",
                        item.type === "Inbound" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        "bg-rose-50 text-rose-700 border-rose-200"
                      )}>
                        {item.type}
                      </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-slate-700">{item.fromTo}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">{item.reason}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border-0 px-2 py-0.5 rounded-full",
                        item.status === "Approved" ? "bg-emerald-50 text-emerald-700" :
                        item.status === "Pending Clearance" ? "bg-amber-50 text-amber-700" :
                        "bg-blue-50 text-blue-700"
                      )}>
                        {item.status}
                      </Badge>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 gap-2 bg-white border border-slate-200 text-xs text-slate-600 font-bold hover:text-indigo-600 hover:border-indigo-200 shadow-sm">
                      <FileSignature size={14}/> Process
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
