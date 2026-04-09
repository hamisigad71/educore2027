import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, AlertTriangle, ShieldAlert, Gavel, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

const mockIncidents = [
  { id: "INC-26-001", student: "Dennis Mwangi", nature: "Bullying", level: "Severe", location: "Tsavo Dormitory", status: "Under Investigation", date: "Oct 25, 2026" },
  { id: "INC-26-002", student: "Brian Juma", nature: "Noise Disturbance", level: "Minor", location: "Dining Hall", status: "Resolved", date: "Oct 24, 2026" },
  { id: "INC-26-003", student: "Alice Kendi", nature: "Contraband", level: "Major", location: "Classroom 3B", status: "Pending Disciplinary", date: "Oct 22, 2026" },
];

export default function BoardingIncidents() {
  const [q, setQ] = useState("");

  const filtered = mockIncidents.filter(req => 
    req.student.toLowerCase().includes(q.toLowerCase()) ||
    req.nature.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Disciplinary Incidents" 
        subtitle="Log rule violations, behavioral issues, and disciplinary actions." 
        actions={
          <div className="flex gap-2">
             <Button className="h-9 gap-2 bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-sm border-0">
              <ShieldAlert size={14}/> Report Incident
            </Button>
          </div>
        }
      />
      
      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-5 pb-4">
             <div>
              <CardTitle className="text-base font-bold text-slate-900 leading-none">Incident Register</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search student or issue..." 
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
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Offender(s)</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Nature of Incident</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Severity</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Action Status</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">{item.student}</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5">{item.id} • {item.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-700">{item.nature}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">Loc: {item.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border px-1.5 py-0",
                        item.level === "Severe" ? "bg-rose-50 border-rose-200 text-rose-700" :
                        item.level === "Major" ? "bg-amber-50 border-amber-200 text-amber-700" :
                        "bg-slate-50 border-slate-200 text-slate-600"
                      )}>
                        {item.level}
                      </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border-0 px-2 py-0.5 rounded-full",
                        item.status === "Resolved" ? "bg-emerald-50 text-emerald-700" :
                        item.status === "Under Investigation" ? "bg-orange-50 text-orange-700" :
                        "bg-purple-50 text-purple-700"
                      )}>
                        {item.status}
                      </Badge>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 gap-1.5 bg-white border border-slate-200 text-xs text-slate-600 font-bold hover:text-indigo-600 hover:border-indigo-200 shadow-sm">
                      <Scale size={14}/> Hear Case
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
