import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { medicalLogsSeed } from "../../../data/mockData";

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
  Pill, Search, 
  Filter, Plus, User,
  Thermometer, Activity,
  AlertCircle, ChevronRight,
  Clipboard, ActivitySquare,
  HeartPulse
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SanatoriumPortal() {
  const [q, setQ] = useState("");
  
  const stats = [
    { label: "Patient Logs", value: 34, icon: Clipboard, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Medicine Stock", value: 124, icon: Pill, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Active Observations", value: 3, icon: Activity, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Referrals", value: 1, icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Sanatorium & Health Clinic" 
        subtitle="Manage student medical records, clinic visits, and first aid supplies" 
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-700 bg-white shadow-sm font-bold text-xs gap-1.5 px-4 shadow-sm">
              <ActivitySquare size={14} /> Health Reports
            </Button>
            <Button className="h-9 bg-indigo-600 hover:bg-indigo-700 shadow-sm text-xs font-bold gap-1.5 px-4 shadow-sm">
              <Plus size={14} /> Log New Visit
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-sm border-slate-200/80 group hover:border-indigo-100 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center border", s.bg)}>
                  <s.icon size={15} className={s.color} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{s.label}</p>
              </div>
              <p className="text-2xl font-bold text-slate-900 leading-none tracking-tight">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Clinic Visit Logs */}
        <Card className="xl:col-span-2 shadow-sm border-slate-200/80">
          <CardHeader className="p-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-5 pb-4">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 leading-none">Clinic Visit History</CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-1">Daily log of student treatments and observations</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                 <div className="relative">
                   <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <Input 
                     placeholder="Search names or complaints..." 
                     value={q}
                     onChange={(e) => setQ(e.target.value)}
                     className="pl-9 h-9 w-[220px] text-xs bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20"
                   />
                 </div>
                 <Button variant="outline" size="sm" className="h-9 border-slate-200">
                   <Filter size={14} className="text-slate-400" />
                 </Button>
              </div>
            </div>
            <Separator className="bg-slate-50" />
          </CardHeader>
          <CardContent className="p-0">
             <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-slate-50">
                    <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Student Name</TableHead>
                    <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Complaint</TableHead>
                    <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Date</TableHead>
                    <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                    <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicalLogsSeed.map((log) => (
                    <TableRow key={log.id} className="group hover:bg-slate-50/50 transition-colors">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200 group-hover:bg-white group-hover:border-indigo-100 transition-all">
                            <User size={14} className="text-slate-400 group-hover:text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-indigo-700 transition-colors">{log.studentName}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Primary Student</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                         <div className="space-y-0.5">
                            <p className="text-xs font-medium text-slate-700">{log.complaint}</p>
                            <p className="text-[10px] text-slate-400 italic">Rx: {log.treatment}</p>
                         </div>
                      </TableCell>
                      <TableCell className="py-4 text-xs text-slate-500 font-medium">{log.date}</TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className={cn(
                          "text-[9px] font-bold border-0 px-2 py-0",
                          log.status === "Discharged" ? "bg-emerald-50 text-emerald-700" :
                          log.status === "Observation" ? "bg-amber-50 text-amber-700" :
                          "bg-rose-50 text-rose-700"
                        )}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 py-4 text-right">
                         <Button size="sm" variant="ghost" className="h-8 text-[11px] font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 gap-1">
                           Update <ChevronRight size={14} />
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
             </Table>
          </CardContent>
        </Card>

        {/* Medical Inventory & Support */}
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200/80">
            <CardHeader className="pb-3 px-6 pt-5">
               <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Medical Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pt-2 pb-6">
               {[
                 { name: "Paracetamol 500mg", stock: 120, status: "Normal" },
                 { name: "Amoxicillin Caps", stock: 15, status: "Low" },
                 { name: "First Aid Bandages", stock: 45, status: "Normal" },
                 { name: "Antiseptic Liquid", stock: 2, status: "Low" },
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                       <Thermometer size={14} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                       <span className="text-xs font-medium text-slate-700">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className={cn("text-xs font-bold", item.status === "Low" ? "text-rose-500" : "text-slate-500")}>{item.stock}</span>
                       <div className={cn("h-1.5 w-1.5 rounded-full", item.status === "Low" ? "bg-rose-500 animate-pulse" : "bg-emerald-500")} />
                    </div>
                 </div>
               ))}
               <Button variant="outline" className="w-full h-10 rounded-xl border-slate-200 text-slate-400 font-bold text-[11px] hover:text-indigo-600 group mt-2">
                 <Plus size={14} className="mr-2 group-hover:scale-110 transition-transform" /> Reorder Supplies
               </Button>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200/80 bg-slate-900 text-white p-6 relative overflow-hidden group">
            <div className="relative z-10 space-y-4">
               <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                   <HeartPulse size={20} className="text-rose-400" />
                 </div>
                 <h4 className="text-sm font-bold">Emergency Referral</h4>
               </div>
               <p className="text-[11px] text-slate-400 leading-relaxed">Ensure all referral forms for off-campus hospital visits are signed by the Principal and parent notified immediately.</p>
               <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-9 text-[11px] rounded-xl shadow-lg shadow-rose-900/20">
                 Initiate Emergency Log
               </Button>
            </div>
            {/* Background glows */}
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-rose-500/10 blur-3xl pointer-events-none group-hover:bg-rose-500/20 transition-all" />
          </Card>
        </div>
      </div>
    </div>
  );
}
