import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Stethoscope, UserIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const mockVisits = [
  { id: "VIS-991", student: "Dennis Mwangi", complaint: "Mild Fever, Headache", temp: "38.2°C", diagnosis: "Common Cold", prescribed: "Paracetamol x6", status: "Treated", time: "09:30 AM" },
  { id: "VIS-992", student: "Alice Kendi", complaint: "Stomach Ache", temp: "36.8°C", diagnosis: "Food poisoning suspected", prescribed: "Antacids, Rest", status: "In Bedrest", time: "11:15 AM" },
  { id: "VIS-993", student: "Victor Onyango", complaint: "Sports Injury - Knee", temp: "37.0°C", diagnosis: "Waiting for Doctor", prescribed: "None", status: "Waiting", time: "02:00 PM" },
];

export default function SanatoriumVisits() {
  const [q, setQ] = useState("");

  const filtered = mockVisits.filter(req => 
    req.student.toLowerCase().includes(q.toLowerCase()) ||
    req.complaint.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Daily Clinic Log" 
        subtitle="Manage daily walk-ins, patient queuing, and treatment records." 
        actions={
          <div className="flex gap-2">
            <Button className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold">
              <Stethoscope size={14}/> Admit Walk-In
            </Button>
          </div>
        }
      />

      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-5 pb-4">
             <div>
              <CardTitle className="text-base font-bold text-slate-900 leading-none">Today's Visits</CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1">Oct 26, 2026</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search patient..." 
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
                 <TableHead className="w-12 pl-6 py-3"></TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Patient Details</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Chief Complaint & Vitals</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Treatment Plan</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                     <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                        <UserIcon size={14}/>
                     </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">{item.student}</span>
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5"><Clock size={10}/> {item.time}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                       <span className="text-[11px] font-medium text-slate-800">{item.complaint}</span>
                       <span className="text-[10px] text-rose-500 font-mono mt-0.5">Temp: {item.temp}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                       <span className="text-[11px] font-bold text-slate-700">{item.diagnosis}</span>
                       <span className="text-[10px] text-indigo-600 font-medium bg-indigo-50 px-1 py-0.5 w-max rounded mt-1">{item.prescribed}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border-0 px-2 py-0.5",
                        item.status === "Treated" ? "bg-emerald-50 text-emerald-700" :
                        item.status === "In Bedrest" ? "bg-amber-50 text-amber-700" :
                        "bg-rose-50 text-rose-700 animate-pulse"
                      )}>
                        {item.status}
                      </Badge>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 gap-2 bg-white border border-slate-200 text-xs text-slate-600 font-bold hover:text-indigo-600 hover:border-indigo-200 shadow-sm">
                      Consult Notes
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
