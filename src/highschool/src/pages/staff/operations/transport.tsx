import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Bus, Navigation, Wrench, AlertTriangle, Route } from "lucide-react";
import { cn } from "@/lib/utils";

const mockTransport = [
  { id: "VEH-KCA-112H", vehicle: "School Bus - 62 Seater", driver: "Mr. Otieno", route: "Route 1: Nairobi CBD", condition: "Active", fuel: "75%", status: "On Route" },
  { id: "VEH-KCB-445B", vehicle: "Van - 14 Seater", driver: "John Kamau", route: "Staff Commute", condition: "Maintenance Required", fuel: "20%", status: "At Garage" },
  { id: "VEH-KCD-881J", vehicle: "School Bus - 33 Seater", driver: "Peter Njoroge", route: "Route 3: Westlands", condition: "Active", fuel: "90%", status: "Parked" },
];

export default function OperationsTransport() {
  const [q, setQ] = useState("");

  const filtered = mockTransport.filter(req => 
    req.vehicle.toLowerCase().includes(q.toLowerCase()) ||
    req.driver.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Fleet & Transport" 
        subtitle="Manage school vehicles, drivers, routes, and maintenance scheduling." 
        actions={
          <div className="flex gap-2">
            <Button className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold">
              <Plus size={14}/> Add Vehicle
            </Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
         {[
           { title: "Total Fleet", val: "12", icon: Bus, color: "text-slate-500" },
           { title: "On Route", val: "4", icon: Route, color: "text-emerald-500" },
           { title: "Parked", val: "7", icon: Navigation, color: "text-blue-500" },
           { title: "In Maintenance", val: "1", icon: Wrench, color: "text-amber-500" }
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
              <CardTitle className="text-base font-bold text-slate-900 leading-none">Vehicle Directory</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search plate or driver..." 
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
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Vehicle / Plates</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Driver & Route</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Fuel & Condition</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">{item.vehicle}</span>
                      <span className="text-[10px] text-indigo-700 font-mono mt-1 font-bold tracking-wider px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded w-max">{item.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-slate-700">{item.driver}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">{item.route}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                     <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1 w-16">
                           <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className={cn("h-full", parseInt(item.fuel) > 30 ? "bg-emerald-500" : "bg-rose-500")} style={{width: item.fuel}}></div>
                           </div>
                           <span className="text-[9px] text-slate-400 font-bold">{item.fuel} Tank</span>
                        </div>
                        {item.condition !== "Active" && <AlertTriangle size={14} className="text-amber-500"/>}
                     </div>
                  </TableCell>
                  <TableCell className="py-4">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border-0 px-2 py-0.5",
                        item.status === "On Route" ? "bg-emerald-50 text-emerald-700 animate-pulse" :
                        item.status === "At Garage" ? "bg-rose-50 text-rose-700" :
                        "bg-slate-100 text-slate-700"
                      )}>
                        {item.status}
                      </Badge>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 gap-2 bg-white border border-slate-200 text-xs text-slate-600 font-bold hover:text-indigo-600 hover:border-indigo-200 shadow-sm">
                      Dispatch
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
