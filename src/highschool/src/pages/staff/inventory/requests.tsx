import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter, PackageOpen, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const mockRequests = [
  { id: "REQ-101", requester: "Mr. Omondi", dept: "Science Dept", item: "Beakers (500ml)", qty: 20, status: "Pending", date: "Oct 25, 2026" },
  { id: "REQ-102", requester: "Mrs. Njoroge", dept: "ICT Dept", item: "Wireless Mouse", qty: 5, status: "Approved", date: "Oct 24, 2026" },
  { id: "REQ-103", requester: "Coach Kamau", dept: "Sports", item: "Football", qty: 10, status: "Rejected", date: "Oct 23, 2026" },
  { id: "REQ-104", requester: "Kitchen Staff", dept: "Dining", item: "Cleaning Detergent", qty: 15, status: "Approved", date: "Oct 26, 2026" }
];

export default function InventoryRequests() {
  const [q, setQ] = useState("");

  const filtered = mockRequests.filter(req => 
    req.item.toLowerCase().includes(q.toLowerCase()) || 
    req.requester.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Procurement & Requisitions" 
        subtitle="Manage stock requests from staff and departments." 
        actions={
          <div className="flex gap-2">
            <Button className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold">
              <Plus size={14}/> Place Request
            </Button>
          </div>
        }
      />
      
      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-5 pb-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 leading-none">Requisition Queue</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search items or staff..." 
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
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Request Details</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Requester</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Approval</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">{item.item} <span className="text-slate-400 font-normal">x{item.qty}</span></span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5">{item.id} • {item.date}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-700">{item.requester}</span>
                      <span className="text-[10px] text-slate-400">{item.dept}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border-0 px-2 py-0.5 rounded-full",
                        item.status === "Approved" ? "bg-emerald-50 text-emerald-700" :
                        item.status === "Pending" ? "bg-amber-50 text-amber-700" :
                        "bg-rose-50 text-rose-700"
                      )}>
                        {item.status}
                      </Badge>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    {item.status === "Pending" ? (
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button size="sm" variant="ghost" className="h-7 w-7 p-0 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-full"><Check size={14}/></Button>
                         <Button size="sm" variant="ghost" className="h-7 w-7 p-0 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 rounded-full"><X size={14}/></Button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium italic">Action Taken</span>
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
