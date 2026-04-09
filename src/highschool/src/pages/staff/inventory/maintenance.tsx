import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Filter, Wrench, AlertCircle, Clock, CheckCircle2, FileText, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

const mockWorkOrders = [
  { id: "WO-24-089", asset: "Projector Epson", location: "Lecture Hall A", issue: "Bulb burnt out", priority: "High", status: "Pending", date: "Oct 24, 2026" },
  { id: "WO-24-090", asset: "Microscope Binocular", location: "Biology Lab", issue: "Lens calibration needed", priority: "Medium", status: "In Progress", date: "Oct 22, 2026" },
  { id: "WO-24-091", asset: "Network Switch", location: "Admin Block", issue: "Port 5 failing", priority: "Critical", status: "Resolved", date: "Oct 20, 2026" },
  { id: "WO-24-092", asset: "Plumbing", location: "Boys Dormitory", issue: "Leaking faucet", priority: "Low", status: "Pending", date: "Oct 25, 2026" },
];

export default function InventoryMaintenance() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("All");

  const filtered = mockWorkOrders.filter(item => 
    (status === "All" || item.status === status) &&
    (item.asset.toLowerCase().includes(q.toLowerCase()) || item.issue.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Maintenance & Work Orders" 
        subtitle="Manage repairs, facility maintenance logs, and asset servicing." 
        actions={
          <div className="flex gap-2">
            <Button className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold">
              <Plus size={14}/> Create Work Order
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
         {[
           { title: "Pending Fixes", val: "12", icon: Clock, color: "text-amber-500" },
           { title: "In Progress", val: "4", icon: Settings2, color: "text-blue-500" },
           { title: "Resolved (This Week)", val: "28", icon: CheckCircle2, color: "text-emerald-500" }
         ].map((stat, i) => (
            <Card key={i} className="shadow-sm border-slate-200/80">
               <CardContent className="p-5 flex items-center justify-between">
                  <div>
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                     <p className="text-2xl font-bold text-slate-900 mt-1">{stat.val}</p>
                  </div>
                  <div className={cn("h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center", stat.color)}>
                     <stat.icon size={18} />
                  </div>
               </CardContent>
            </Card>
         ))}
      </div>
      
      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-5 pb-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 leading-none">Job Logs</CardTitle>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search issue or asset..." 
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-9 h-9 w-[240px] text-xs bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20"
                />
              </div>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-9 w-[130px] text-xs bg-slate-50 border-slate-200 font-medium">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Jobs</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator className="bg-slate-50" />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-50">
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Work Order</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Issue Description</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Priority</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">{item.asset}</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5">{item.id} • {item.location}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                     <p className="text-xs text-slate-600 font-medium truncate max-w-[200px]">{item.issue}</p>
                     <p className="text-[10px] text-slate-400 mt-0.5">Reported: {item.date}</p>
                  </TableCell>
                  <TableCell className="py-4">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border border-slate-200 px-2 py-0.5 rounded-full",
                        item.priority === "Critical" ? "text-rose-600 bg-rose-50 border-rose-200" :
                        item.priority === "High" ? "text-amber-600 bg-amber-50 border-amber-200" :
                        "text-slate-600 bg-slate-50"
                      )}>
                        {item.priority}
                      </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border-0 px-2 py-0.5",
                        item.status === "Resolved" ? "bg-emerald-50 text-emerald-700" :
                        item.status === "In Progress" ? "bg-blue-50 text-blue-700" :
                        "bg-slate-100 text-slate-700"
                      )}>
                        {item.status}
                      </Badge>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 gap-2 bg-white border border-slate-200 text-xs text-slate-600 font-bold hover:text-indigo-600 hover:border-indigo-200 shadow-sm">
                      <FileText size={14}/> View
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
