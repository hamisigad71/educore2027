import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter, Home, Bed, UserCircle, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

const mockAllocations = [
  { id: "ALC-100", student: "Daniel Komen", form: "Form 3", house: "Tsavo House", room: "Room 12B", bed: "Lower Bunk", status: "Allocated", date: "Jan 10, 2026" },
  { id: "ALC-101", student: "Grace Mbugua", form: "Form 1", house: "Mara House", room: "Room 04A", bed: "Single", status: "Allocated", date: "Jan 12, 2026" },
  { id: "ALC-102", student: "Johnston Kipchumba", form: "Form 2", house: "Amboseli House", room: "Pending", bed: "Pending", status: "Pending", date: "-" },
  { id: "ALC-103", student: "Faith Wanjiku", form: "Form 4", house: "Serengeti House", room: "Room 01C", bed: "Upper Bunk", status: "Allocated", date: "Jan 05, 2026" },
];

export default function BoardingAllocations() {
  const [q, setQ] = useState("");

  const filtered = mockAllocations.filter(req => 
    req.student.toLowerCase().includes(q.toLowerCase()) ||
    req.house.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Dormitory Allocations" 
        subtitle="Manage student housing, rooms, and bed assignments." 
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="h-9 gap-2 text-xs font-bold text-slate-700">
              <Filter size={14}/> House Filter
            </Button>
            <Button className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold">
              <Bed size={14}/> Auto-Allocate
            </Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
         {[
           { title: "Total Capacity", val: "850", icon: Home, color: "text-slate-500" },
           { title: "Beds Occupied", val: "792", icon: Bed, color: "text-indigo-500" },
           { title: "Available Beds", val: "58", icon: Bed, color: "text-emerald-500" },
           { title: "Pending Allocations", val: "14", icon: UserCircle, color: "text-amber-500" }
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
              <CardTitle className="text-base font-bold text-slate-900 leading-none">Accommodation Log</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search student or house..." 
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
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">House</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Room / Bed</TableHead>
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
                    <span className="text-xs font-medium text-slate-700">{item.house}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-slate-900">{item.room}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5 border border-slate-200 rounded px-1 w-max">{item.bed}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border-0 px-2 py-0.5",
                        item.status === "Allocated" ? "bg-emerald-50 text-emerald-700" :
                        "bg-amber-50 text-amber-700"
                      )}>
                        {item.status}
                      </Badge>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 gap-2 bg-white border border-slate-200 text-xs text-slate-600 font-bold hover:text-indigo-600 hover:border-indigo-200 shadow-sm">
                      <Edit3 size={14}/> Update
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
