import React, { useState } from "react";
import { PageHeader } from "@/components/layout";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

// lucide
import { 
  Home, Users, AlertCircle, 
  CheckCircle2, Clock, ShieldAlert,
  Moon, Coffee, UserCheck, 
  ChevronRight, ArrowUpRight, Plus,
  Layers, Bed
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BoardingPortal() {
  const dorms = [
    { name: "Mt. Kenya House", occupancy: 118, capacity: 120, status: "Nearly Full", color: "bg-indigo-600" },
    { name: "Aberdare House", occupancy: 95, capacity: 120, status: "Spaced", color: "bg-emerald-500" },
    { name: "Kilimanjaro House", occupancy: 120, capacity: 120, status: "Full", color: "bg-rose-500" },
    { name: "Elgon House", occupancy: 105, capacity: 120, status: "Spaced", color: "bg-amber-500" },
  ];

  const recentIncidents = [
    { id: "inc-1", student: "Victor Owino", dorm: "Mt. Kenya", type: "Health", time: "10:15 PM", status: "Resolved", priority: "Low" },
    { id: "inc-2", student: "Amani Otieno", dorm: "Elgon", type: "Discipline", time: "11:30 PM", status: "Pending", priority: "High" },
    { id: "inc-3", student: "Collins Juma", dorm: "Kilimanjaro", type: "Maintenance", time: "09:00 PM", status: "Ongoing", priority: "Normal" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Boarding & Welfare" 
        subtitle="Dormitory management, student housing assignments, and welfare logs" 
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-700 bg-white shadow-sm font-bold text-xs gap-1.5 px-4">
              <Moon size={14} /> Evening Roll Call
            </Button>
            <Button className="h-9 bg-indigo-600 hover:bg-indigo-700 shadow-sm text-xs font-bold gap-1.5 px-4">
              <Plus size={14} /> Incident Report
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dorms.map((dorm) => (
          <Card key={dorm.name} className="shadow-sm border-slate-200/80 group hover:border-indigo-100 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
                  <Home size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <Badge variant="outline" className={cn(
                  "text-[9px] font-bold border-0 px-2",
                  dorm.status === "Full" ? "bg-rose-50 text-rose-700" :
                  dorm.status === "Nearly Full" ? "bg-amber-50 text-amber-700" :
                  "bg-emerald-50 text-emerald-700"
                )}>
                  {dorm.status}
                </Badge>
              </div>
              <p className="text-lg font-bold text-slate-900 leading-tight">{dorm.name}</p>
              <div className="mt-4 space-y-2">
                 <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                    <span>Occupancy</span>
                    <span className="text-slate-900">{dorm.occupancy} / {dorm.capacity}</span>
                 </div>
                 <Progress value={(dorm.occupancy / dorm.capacity) * 100} className={cn("h-1.5 bg-slate-100 rounded-full", `[&>div]:${dorm.color}`)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Incident Logs */}
        <Card className="xl:col-span-2 shadow-sm border-slate-200/80">
          <CardHeader className="p-0">
             <div className="flex items-center justify-between px-6 pt-5 pb-4">
               <div>
                 <CardTitle className="text-base font-bold text-slate-900 leading-none">Welfare & Discipline Log</CardTitle>
                 <CardDescription className="text-xs text-slate-500 mt-1">Evening records and dormitory night-shift reports</CardDescription>
               </div>
               <Button variant="ghost" size="sm" className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 h-8 gap-1">
                 View Historical Logs <ArrowUpRight size={12} />
               </Button>
             </div>
             <Separator className="bg-slate-50" />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-50">
                  <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Student</TableHead>
                  <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Dormitory</TableHead>
                  <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</TableHead>
                  <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Priority</TableHead>
                  <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentIncidents.map((inc) => (
                  <TableRow key={inc.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-6 py-4">
                       <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{inc.student}</p>
                       <p className="text-[10px] text-slate-400 mt-0.5">{inc.time}</p>
                    </TableCell>
                    <TableCell className="py-4 text-xs text-slate-500 font-medium">{inc.dorm}</TableCell>
                    <TableCell className="py-4">
                       <Badge variant="outline" className="bg-slate-50 text-slate-500 border-0 font-bold text-[9px] px-2">
                         {inc.type}
                       </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                       <div className="flex items-center gap-1.5">
                          <div className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            inc.priority === "High" ? "bg-rose-500 animate-pulse" :
                            inc.priority === "Normal" ? "bg-amber-500" : "bg-slate-300"
                          )} />
                          <span className="text-[11px] font-bold text-slate-700">{inc.priority}</span>
                       </div>
                    </TableCell>
                    <TableCell className="pr-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <span className={cn(
                            "text-[10px] font-bold",
                            inc.status === "Resolved" ? "text-emerald-600" :
                            inc.status === "Pending" ? "text-amber-600" : "text-indigo-600"
                          )}>{inc.status}</span>
                          <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-400 transition-colors" />
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Boarding Toolbox */}
        <div className="space-y-6">
           <Card className="shadow-sm border-slate-200/80">
             <CardHeader className="pb-3 px-6 pt-5">
               <CardTitle className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Matron's Toolbox</CardTitle>
             </CardHeader>
             <CardContent className="space-y-3 px-6 pt-2 pb-6">
               {[
                 { label: "Room Assignment", icon: Bed, color: "text-indigo-600", bg: "bg-indigo-50" },
                 { label: "Laundry Schedule", icon: Coffee, color: "text-emerald-600", bg: "bg-emerald-50" },
                 { label: "Night Shift Setup", icon: Moon, color: "text-purple-600", bg: "bg-purple-50" },
                 { label: "Bed Capacity Audit", icon: Layers, color: "text-amber-600", bg: "bg-amber-50" },
               ].map((tool) => (
                 <button key={tool.label} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:border-indigo-100 hover:bg-white transition-all group shadow-sm hover:shadow-md">
                   <div className="flex items-center gap-3">
                     <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", tool.bg)}>
                       <tool.icon size={14} className={tool.color} />
                     </div>
                     <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">{tool.label}</span>
                   </div>
                   <Plus size={14} className="text-slate-300 group-hover:text-indigo-400" />
                 </button>
               ))}
             </CardContent>
           </Card>

           <Card className="shadow-sm border-slate-200/80 bg-slate-900 text-white overflow-hidden p-6 group">
              <div className="relative z-10 space-y-4">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                      <ShieldAlert size={20} className="text-indigo-400" />
                    </div>
                    <h4 className="text-sm font-bold">Welfare Incident</h4>
                 </div>
                 <p className="text-[11px] text-slate-400 leading-relaxed">Safety first. Any dormitory incident involving injury or damage must be logged and reported to the Deputy Principal's office within 2 hours.</p>
                 <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold h-9 text-[11px] rounded-xl transition-all">
                    Initiate Security Log
                 </Button>
              </div>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none group-hover:bg-indigo-500/20 transition-all text-indigo-500" />
           </Card>
        </div>
      </div>
    </div>
  );
}
