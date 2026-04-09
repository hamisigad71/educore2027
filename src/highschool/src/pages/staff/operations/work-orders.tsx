import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter, Hammer, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const mockFacilityJobs = [
  { id: "FAC-901", title: "Dining Hall Roof Leak", location: "Main Dining Hall", priority: "High", assignedTo: "Plumbing Team", status: "In Progress", date: "Oct 25, 2026" },
  { id: "FAC-902", title: "Broken Window Pane", location: "Classroom Form 2B", priority: "Medium", assignedTo: "Carpentry", status: "Pending", date: "Oct 26, 2026" },
  { id: "FAC-903", title: "Sports Field Mowing", location: "Main Field", priority: "Low", assignedTo: "Groundsmen", status: "Completed", date: "Oct 20, 2026" },
];

export default function OperationsWorkOrders() {
  const [q, setQ] = useState("");

  const filtered = mockFacilityJobs.filter(req => 
    req.title.toLowerCase().includes(q.toLowerCase()) ||
    req.location.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Facility Work Orders" 
        subtitle="Manage campus repairs, groundskeeping tasks, and facility upgrades." 
        actions={
          <div className="flex gap-2">
            <Button className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold">
              <Plus size={14}/> New Work Order
            </Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
         {[
           { title: "Active Tickets", val: "24", icon: Hammer, color: "text-indigo-500" },
           { title: "High Priority", val: "3", icon: AlertTriangle, color: "text-rose-500" },
           { title: "Pending Assignment", val: "8", icon: Clock, color: "text-amber-500" },
           { title: "Completed (7 Days)", val: "15", icon: CheckCircle, color: "text-emerald-500" }
         ].map((stat, i) => (
            <Card key={i} className="shadow-sm border-slate-200/80">
               <CardContent className="p-5 flex items-center gap-3">
                  <div className={cn("h-10 w-10 shrink-0 rounded-full bg-slate-50 flex items-center justify-center", stat.color)}>
                     <stat.icon size={18} />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                     <p className="text-xl font-bold text-slate-900 leading-none mt-1">{stat.val}</p>
                  </div>
               </CardContent>
            </Card>
         ))}
      </div>

      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-5 pb-4">
             <div>
              <CardTitle className="text-base font-bold text-slate-900 leading-none">Task Board</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search task or location..." 
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-9 h-9 w-[260px] text-xs bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20"
                />
              </div>
              <Button variant="outline" className="h-9 w-9 p-0 bg-slate-50 text-slate-500 border-slate-200 shrink-0">
                <Filter size={14}/>
              </Button>
            </div>
          </div>
          <Separator className="bg-slate-50" />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-50">
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Job Description</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Priority & Team</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Date Logged</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">{item.title}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">{item.location} • <span className="font-mono">{item.id}</span></span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col items-start gap-1">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border rounded-sm px-1 py-0 shadow-none",
                        item.priority === "High" ? "bg-rose-50 border-rose-200 text-rose-700" :
                        item.priority === "Medium" ? "bg-amber-50 border-amber-200 text-amber-700" :
                        "bg-slate-50 border-slate-200 text-slate-600"
                      )}>
                        {item.priority} Priority
                      </Badge>
                      <span className="text-[10px] font-medium text-slate-700 mt-1">{item.assignedTo}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                     <span className="text-[11px] font-medium text-slate-600">{item.date}</span>
                  </TableCell>
                  <TableCell className="py-4">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border-0 px-2 py-0.5",
                        item.status === "Completed" ? "bg-emerald-50 text-emerald-700" :
                        item.status === "In Progress" ? "bg-blue-50 text-blue-700 animate-pulse" :
                        "bg-slate-100 text-slate-700"
                      )}>
                        {item.status}
                      </Badge>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 gap-2 bg-white border border-slate-200 text-[10px] text-slate-600 font-bold hover:text-indigo-600 hover:border-indigo-200 shadow-sm">
                      Inspect
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
