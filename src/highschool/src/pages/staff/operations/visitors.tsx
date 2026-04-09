import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, MapPin, UserCheck, ShieldCheck, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const mockVisitors = [
  { id: "VST-001", name: "David Ochieng", idNumber: "23456789", host: "Principal's Office", purpose: "Admissions Interview", timeIn: "10:15 AM", timeOut: "-", status: "On Campus" },
  { id: "VST-002", name: "Jane Gitau", idNumber: "12345678", host: "Ms. Wanjiku (Chemistry)", purpose: "Parent-Teacher Meeting", timeIn: "08:30 AM", timeOut: "09:45 AM", status: "Signed Out" },
  { id: "VST-003", name: "Technician - Safaricom", idNumber: "98765432", host: "IT Department", purpose: "Network Repair", timeIn: "11:00 AM", timeOut: "-", status: "On Campus" },
];

export default function OperationsVisitors() {
  const [q, setQ] = useState("");

  const filtered = mockVisitors.filter(req => 
    req.name.toLowerCase().includes(q.toLowerCase()) ||
    req.host.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Gate & Visitor Registry" 
        subtitle="Manage visitor access, school hosts, and gate security logs." 
        actions={
          <div className="flex gap-2">
            <Button className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold">
              <UserCheck size={14}/> Sign In Visitor
            </Button>
          </div>
        }
      />
      
      <Card className="shadow-sm border-emerald-200/80 bg-emerald-50/30">
         <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <ShieldCheck size={24} className="text-emerald-600"/>
               <div>
                  <h4 className="text-sm font-bold text-slate-900">Campus Status: Secure</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">There are currently 12 logged visitors on campus.</p>
               </div>
            </div>
            <Button variant="outline" className="h-8 gap-2 border-emerald-200 text-emerald-700 bg-white">
               View Evacuation Manifest
            </Button>
         </CardContent>
      </Card>

      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-5 pb-4">
             <div>
              <CardTitle className="text-base font-bold text-slate-900 leading-none">Security Log</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search visitor or ID..." 
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
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Visitor Profile</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Host & Purpose</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Log Times</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Gate Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">{item.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 border border-slate-200 w-max px-1 bg-slate-100 rounded">ID: {item.idNumber} / Pass: {item.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-700">{item.host}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">{item.purpose}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                     <div className="flex flex-col gap-1 text-[10px] font-medium text-slate-600">
                        <span className="text-emerald-600 border border-emerald-100 bg-emerald-50 px-1 rounded w-max">IN: {item.timeIn}</span>
                        {item.timeOut !== "-" && <span className="text-slate-500 border border-slate-200 bg-slate-50 px-1 rounded w-max">OUT: {item.timeOut}</span>}
                     </div>
                  </TableCell>
                  <TableCell className="py-4">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border-0 px-2 py-0.5",
                        item.status === "On Campus" ? "bg-indigo-50 text-indigo-700 animate-pulse" :
                        "bg-slate-100 text-slate-700"
                      )}>
                        {item.status}
                      </Badge>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    {item.status === "On Campus" ? (
                      <Button variant="ghost" size="sm" className="h-8 gap-1.5 bg-rose-50 border border-rose-100 text-[10px] text-rose-600 font-bold hover:text-rose-700 hover:bg-rose-100 shadow-sm rounded-full">
                        <LogOut size={12}/> Sign Out
                      </Button>
                    ) : (
                      <span className="text-[10px] italic text-slate-400 font-medium">Cleared</span>
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
