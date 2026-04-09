import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { inventorySeed, InventoryItem } from "../../../data/mockData";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// lucide
import { 
  Package, Box, Search, 
  Filter, AlertTriangle, Plus,
  FlaskConical, Monitor, Wrench,
  Utensils, ChevronRight, History,
  ArrowDownCircle, ArrowUpCircle,
  ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function InventoryPortal() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = inventorySeed.filter(item => 
    (category === "All" || item.category === category) &&
    item.name.toLowerCase().includes(q.toLowerCase())
  );

  const stats = [
    { label: "Total Items", value: inventorySeed.length, icon: Package, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Low Stock", value: inventorySeed.filter(i => i.status === "Low Stock").length, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Lab Units", value: 420, icon: FlaskConical, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "ICT Devices", value: 85, icon: Monitor, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  const categoryIcons: Record<string, any> = {
    "Science Lab": FlaskConical,
    "ICT": Monitor,
    "Maintenance": Wrench,
    "Kitchen": Utensils,
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Asset & Inventory Management" 
        subtitle="Track school supplies, laboratory equipment, and ICT infrastructure" 
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-700 bg-white shadow-sm font-bold text-xs gap-1.5 px-4">
              <History size={14} /> Audit Log
            </Button>
            <Button className="h-9 bg-indigo-600 hover:bg-indigo-700 shadow-sm text-xs font-bold gap-1.5 px-4">
              <Plus size={14} /> New Item
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-sm border-slate-200/80 hover:border-indigo-100 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center border", s.bg)}>
                  <s.icon size={15} className={s.color} />
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
              </div>
              <p className="text-2xl font-bold text-slate-900 leading-none tracking-tight">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-5 pb-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 leading-none">Stock Ledger</CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1">Real-time inventory of all school departments</CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search assets..." 
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-9 h-9 w-[220px] text-xs bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20"
                />
              </div>
              <Select value={category} onValueChange={(v) => setCategory(v ?? "All")}>
                <SelectTrigger className="h-9 w-[140px] text-xs bg-slate-50 border-slate-200 font-medium">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Departments</SelectItem>
                  <SelectItem value="Science Lab">Science Lab</SelectItem>
                  <SelectItem value="ICT">ICT Center</SelectItem>
                  <SelectItem value="Kitchen">Dining Hall</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
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
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Item Name</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Department</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">In Stock</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => {
                const Icon = categoryIcons[item.category] || Box;
                return (
                  <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 group-hover:bg-white group-hover:border-indigo-200 transition-all">
                          <Icon size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{item.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-[11px] font-medium text-slate-500 uppercase tracking-tight">{item.category}</span>
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <span className="text-sm font-mono font-bold text-slate-700">{item.stock}</span>
                      <span className="text-[10px] text-slate-400 font-medium ml-1">{item.unit}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border-0 px-2 py-0",
                        item.status === "In Stock" ? "bg-emerald-50 text-emerald-700" :
                        item.status === "Low Stock" ? "bg-amber-50 text-amber-700" :
                        "bg-rose-50 text-rose-700"
                      )}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-indigo-600 hover:bg-indigo-50"><ArrowUpCircle size={14} /></Button>
                         <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-rose-600 hover:bg-rose-50"><ArrowDownCircle size={14} /></Button>
                         <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:bg-slate-100"><ChevronRight size={14} /></Button>
                       </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-50">
             <div className="flex items-center justify-between">
                <p className="text-[10px] text-slate-400 font-medium italic">* Low stock alerts triggered automatically at ≤ 10% capacity</p>
                <Button variant="ghost" className="text-[11px] font-bold text-indigo-600 gap-1.5 h-6 hover:bg-transparent">
                  View Full Stock Details <ArrowUpRight size={12} />
                </Button>
             </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
