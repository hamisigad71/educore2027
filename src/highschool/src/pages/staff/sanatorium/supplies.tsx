import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter, Pill, Bandage, Stethoscope, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

const mockSupplies = [
  { id: "RX-100", item: "Paracetamol 500mg", type: "Medication", unit: "Tablets", stock: 1200, status: "In Stock" },
  { id: "RX-101", item: "Amoxicillin 250mg", type: "Antibiotics", unit: "Capsules", stock: 150, status: "Low Stock" },
  { id: "RX-102", item: "First Aid Bandages", type: "Consumables", unit: "Boxes", stock: 45, status: "In Stock" },
  { id: "RX-103", item: "Asthma Inhalers (Salbutamol)", type: "Specialized", unit: "Inhalers", stock: 2, status: "Critical" },
];

export default function SanatoriumSupplies() {
  const [q, setQ] = useState("");

  const filtered = mockSupplies.filter(req => 
    req.item.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Dispensary Supplies" 
        subtitle="Manage pharmaceutical inventory, first-aid kits, and medical equipment." 
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="h-9 gap-2 text-xs font-bold text-slate-700">
              <Filter size={14}/> Filter Categories
            </Button>
            <Button className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold">
              <Plus size={14}/> Add Supply
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
         {[
           { title: "Medications", val: "48", icon: Pill, color: "text-blue-500" },
           { title: "Consumables", val: "32", icon: Bandage, color: "text-slate-500" },
           { title: "Equipment", val: "15", icon: Stethoscope, color: "text-emerald-500" },
           { title: "Low Stock Alerts", val: "4", icon: AlertCircle, color: "text-rose-500", customIcon: true }
         ].map((stat, i) => (
            <Card key={i} className="shadow-sm border-slate-200/80">
               <CardContent className="p-5 flex items-center justify-between">
                  <div>
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                     <p className="text-2xl font-bold text-slate-900 mt-1">{stat.val}</p>
                  </div>
                  <div className={cn("h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center", stat.color)}>
                     {stat.customIcon ? <Settings2 size={18} className="text-rose-500" /> : <stat.icon size={18} />}
                  </div>
               </CardContent>
            </Card>
         ))}
      </div>

      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-5 pb-4">
             <div>
              <CardTitle className="text-base font-bold text-slate-900 leading-none">Inventory Ledger</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search item name..." 
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
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Supply Item</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">In Stock</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">{item.item}</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5">{item.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <span className="text-sm font-bold font-mono text-slate-800">{item.stock}</span>
                    <span className="text-[10px] text-slate-400 ml-1 block">{item.unit}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="text-[11px] font-medium text-slate-700">{item.type}</span>
                  </TableCell>
                  <TableCell className="py-4">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border-0 px-2 py-0.5",
                        item.status === "In Stock" ? "bg-emerald-50 text-emerald-700" :
                        item.status === "Low Stock" ? "bg-amber-50 text-amber-700 animate-pulse" :
                        "bg-rose-50 text-rose-700"
                      )}>
                        {item.status}
                      </Badge>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 gap-2 bg-white border border-slate-200 text-xs text-slate-600 font-bold hover:text-indigo-600 hover:border-indigo-200 shadow-sm">
                      Update Stock
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
