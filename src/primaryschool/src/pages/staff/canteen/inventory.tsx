import React from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Package, ShoppingCart, AlertCircle, TrendingDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const inventory = [
  { item: "Flour (Kg)", category: "Staples", inStock: 120, minLevel: 50, lastRestocked: "2025-04-01", status: "OK" },
  { item: "Cooking Oil (Litres)", category: "Staples", inStock: 18, minLevel: 20, lastRestocked: "2025-03-28", status: "Low" },
  { item: "Sugar (Kg)", category: "Beverages", inStock: 45, minLevel: 30, lastRestocked: "2025-04-01", status: "OK" },
  { item: "Beans (Kg)", category: "Proteins", inStock: 60, minLevel: 40, lastRestocked: "2025-04-03", status: "OK" },
  { item: "Rice (Kg)", category: "Staples", inStock: 10, minLevel: 40, lastRestocked: "2025-03-20", status: "Critical" },
  { item: "Sukuma Wiki (Bundles)", category: "Vegetables", inStock: 35, minLevel: 20, lastRestocked: "2025-04-08", status: "OK" },
];

export default function CanteenInventory() {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Food Inventory"
        subtitle="Monitor canteen food supply levels and manage restocking orders."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="h-9 text-xs border-slate-200 font-bold gap-2">
              <ShoppingCart size={14} /> Purchase Order
            </Button>
            <Button className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 font-bold gap-2">
              <Plus size={14} /> Add Stock
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Items", val: "24", icon: Package, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "OK Levels", val: "19", icon: Package, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Low Stock", val: "3", icon: TrendingDown, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Critical", val: "2", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((s) => (
          <Card key={s.label} className="shadow-sm border-slate-200/80">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", s.bg)}>
                  <s.icon size={15} className={s.color} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
              </div>
              <p className="text-2xl font-bold text-slate-900">{s.val}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="px-6 pt-5 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 leading-none">Current Stock Levels</CardTitle>
          </div>
          <Separator className="bg-slate-50" />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-50">
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Item</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">In Stock</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Min Level</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Last Restocked</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((r) => (
                <TableRow key={r.item} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4 text-xs font-bold text-slate-900 group-hover:text-indigo-700">{r.item}</TableCell>
                  <TableCell className="py-4 text-xs text-slate-500">{r.category}</TableCell>
                  <TableCell className="py-4 text-xs font-medium text-slate-700">{r.inStock}</TableCell>
                  <TableCell className="py-4 text-xs text-slate-400">{r.minLevel}</TableCell>
                  <TableCell className="py-4 text-xs font-mono text-slate-400">{r.lastRestocked}</TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Badge className={cn("text-[9px] font-bold border-0",
                      r.status === "OK" ? "bg-emerald-50 text-emerald-700" :
                      r.status === "Low" ? "bg-amber-50 text-amber-700" :
                      "bg-rose-50 text-rose-700"
                    )}>{r.status}</Badge>
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
