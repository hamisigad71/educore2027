import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, Filter, Monitor, FlaskConical, Box, MapPin, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const mockAssets = [
  { id: "AST-2024-001", name: "Dell Optiplex 7000", category: "ICT", location: "Computer Lab 1", condition: "Good", status: "Active" },
  { id: "AST-2024-002", name: "Microscope Binocular", category: "Science", location: "Biology Lab", condition: "Needs Repair", status: "Maintenance" },
  { id: "AST-2024-003", name: "Projector Epson", category: "AV", location: "Lecture Hall A", condition: "Good", status: "Active" },
  { id: "AST-2024-004", name: "Teacher Desk", category: "Furniture", location: "Staff Room", condition: "Excellent", status: "Active" },
  { id: "AST-2024-005", name: "Network Switch 24-Port", category: "ICT", location: "Server Room", condition: "Critical", status: "Retired" },
];

export default function InventoryAssets() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = mockAssets.filter(item => 
    (filter === "All" || item.category === filter) &&
    item.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Asset Tracking" 
        subtitle="Master catalog of school property, lab equipment, and furniture." 
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="h-9 gap-2 text-xs font-bold text-slate-700">
              <Filter size={14}/> Filters
            </Button>
            <Button className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold">
              <Plus size={14}/> Add Asset
            </Button>
          </div>
        }
      />
      
      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-5 pb-4">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 leading-none">Asset Database</CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-1">Manage and track all registered school assets</CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search by name or ID..." 
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-9 h-9 w-[240px] text-xs bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20"
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="h-9 w-[130px] text-xs bg-slate-50 border-slate-200 font-medium">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="ICT">ICT</SelectItem>
                  <SelectItem value="Science">Science Lab</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="AV">Audio/Visual</SelectItem>
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
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Asset Item</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Condition</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">{item.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5">{item.id} • {item.category}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <MapPin size={12} className="text-slate-400" />
                      {item.location}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border-0 px-2 py-0.5 rounded-full",
                        item.condition === "Good" || item.condition === "Excellent" ? "bg-emerald-50 text-emerald-700" :
                        item.condition === "Needs Repair" ? "bg-amber-50 text-amber-700" :
                        "bg-rose-50 text-rose-700"
                      )}>
                        {item.condition}
                      </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        item.status === "Active" ? "bg-emerald-500" : 
                        item.status === "Retired" ? "bg-slate-300" : "bg-amber-500"
                      )}></div>
                      <span className="text-[11px] font-medium text-slate-600">{item.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                      <MoreHorizontal size={14}/>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-slate-500 text-xs">
                    No assets found. Try adjusting your search query.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
