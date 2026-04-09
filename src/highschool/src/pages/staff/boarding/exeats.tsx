import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, MapPin, Calendar, Clock, CheckCircle2, FileX2 } from "lucide-react";
import { cn } from "@/lib/utils";

const mockExeats = [
  { id: "EX-4011", student: "Amos Kirui", form: "Form 2", reason: "Medical Checkup", type: "Day Out", departure: "Oct 26, 08:00 AM", return: "Oct 26, 04:00 PM", status: "Active" },
  { id: "EX-4012", student: "Linda Gacheru", form: "Form 4", reason: "Family Emergency", type: "Overnight", departure: "Oct 25, 05:00 PM", return: "Oct 28, 08:00 AM", status: "Approved" },
  { id: "EX-4013", student: "Victor Onyango", form: "Form 1", reason: "Dental Appt", type: "Day Out", departure: "Oct 27, 09:00 AM", return: "Oct 27, 02:00 PM", status: "Pending" },
  { id: "EX-4014", student: "Mercy Kendi", form: "Form 3", reason: "Visa Processing", type: "Overnight", departure: "Oct 24, 02:00 PM", return: "Oct 25, 04:00 PM", status: "Returned" },
];

export default function BoardingExeats() {
  const [q, setQ] = useState("");

  const filtered = mockExeats.filter(req => 
    req.student.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Leave Passes (Exeats)" 
        subtitle="Manage student leave permissions, gate passes, and return tracking." 
        actions={
          <div className="flex gap-2">
             <Button className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold">
              <Calendar size={14}/> Request Pass
            </Button>
          </div>
        }
      />
      
      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-5 pb-4">
             <div>
              <CardTitle className="text-base font-bold text-slate-900 leading-none">Exeat Log</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search by student name..." 
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
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Type / Reason</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Approval</TableHead>
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
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-700">{item.type}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">{item.reason}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col text-[10px] text-slate-600">
                      <div className="flex items-center gap-1.5"><Clock size={10} className="text-rose-400"/> Out: {item.departure}</div>
                      <div className="flex items-center gap-1.5 mt-1"><Clock size={10} className="text-emerald-400"/> In: &nbsp;&nbsp;&nbsp;{item.return}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border-0 px-2 py-0.5 rounded-full",
                        item.status === "Approved" ? "bg-blue-50 text-blue-700" :
                        item.status === "Active" ? "bg-amber-100 text-amber-800 animate-pulse" :
                        item.status === "Returned" ? "bg-emerald-50 text-emerald-700" :
                        "bg-slate-100 text-slate-700"
                      )}>
                        {item.status}
                      </Badge>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                     {item.status === "Pending" ? (
                       <Button variant="ghost" size="sm" className="h-8 gap-2 bg-indigo-50 border border-indigo-100 text-[10px] text-indigo-700 font-bold hover:text-indigo-800 hover:bg-indigo-100 shadow-sm">
                         Review
                       </Button>
                     ) : item.status === "Active" ? (
                       <Button variant="ghost" size="sm" className="h-8 gap-2 bg-emerald-50 border border-emerald-100 text-[10px] text-emerald-700 font-bold hover:text-emerald-800 hover:bg-emerald-100 shadow-sm">
                         <CheckCircle2 size={12}/> Check-In
                       </Button>
                     ) : (
                       <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                         <FileX2 size={14}/>
                       </Button>
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
