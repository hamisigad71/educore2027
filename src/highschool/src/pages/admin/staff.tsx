import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter, Users, Activity, Target, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const mockStaff = [
  { id: "STF-001", name: "David Ochieng", role: "Head of Operations", department: "Operations", performance: 92, tasksCompleted: 45, status: "Active" },
  { id: "STF-002", name: "Loveth Gitau", role: "Chief Bursar", department: "Bursar", performance: 98, tasksCompleted: 112, status: "Active" },
  { id: "STF-003", name: "Vincent Kariuki", role: "IT Administrator", department: "Inventory & Labs", performance: 76, tasksCompleted: 28, status: "Active" },
  { id: "STF-004", name: "Mercy Wanjala", role: "Librarian", department: "Library", performance: 88, tasksCompleted: 64, status: "Active" },
  { id: "STF-005", name: "Dr. Evans Korir", role: "School Nurse", department: "Sanatorium", performance: 95, tasksCompleted: 215, status: "Active" },
];

export default function AdminStaffManagement() {
  const [q, setQ] = useState("");

  const filtered = mockStaff.filter(req => 
    req.name.toLowerCase().includes(q.toLowerCase()) ||
    req.role.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Staff Management" 
        subtitle="Track staff performance, duties, and overall workforce productivity." 
        actions={
          <div className="flex gap-2">
            <Button className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold">
              <Plus size={14}/> Add Staff Member
            </Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
         {[
           { title: "Total Staff", val: "42", icon: Users, color: "text-indigo-500" },
           { title: "Avg Performance", val: "88%", icon: Activity, color: "text-emerald-500" },
           { title: "Active Tasks", val: "124", icon: Target, color: "text-amber-500" },
           { title: "Cleared Duties", val: "956", icon: ShieldCheck, color: "text-blue-500" }
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
              <CardTitle className="text-base font-bold text-slate-900 leading-none">Workforce Directory</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search staff... " 
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
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Staff Profile</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Department</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Performance Index</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Tasks Completed</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">{item.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5">{item.id} • {item.role}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-[11px] font-bold text-slate-700">{item.department}</span>
                  </TableCell>
                  <TableCell className="py-4">
                     <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                           <div className={cn("h-full", item.performance > 85 ? "bg-emerald-500" : item.performance > 50 ? "bg-amber-500" : "bg-rose-500")} style={{width: `${item.performance}%`}}></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">{item.performance}%</span>
                     </div>
                  </TableCell>
                  <TableCell className="py-4">
                     <span className="text-[11px] font-medium text-slate-600">{item.tasksCompleted} Tasks</span>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 gap-2 bg-white border border-slate-200 text-xs text-slate-600 font-bold hover:text-indigo-600 hover:border-indigo-200 shadow-sm">
                      Evaluate
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
