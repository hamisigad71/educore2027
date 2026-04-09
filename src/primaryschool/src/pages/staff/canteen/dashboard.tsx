import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Utensils, Users, ShoppingCart, CheckCircle2, Plus, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const mealPlan = [
  { day: "Monday", breakfast: "Porridge & Bread", lunch: "Rice, Beans & Veggies", snack: "Fruit", served: 590, status: "Served" },
  { day: "Tuesday", breakfast: "Uji & Mandazi", lunch: "Ugali, Sukuma & Beef", snack: "Juice", served: 605, status: "Served" },
  { day: "Wednesday", breakfast: "Tea & Bread", lunch: "Chapati & Beef Stew", snack: "Biscuits", served: 598, status: "Served" },
  { day: "Thursday", breakfast: "Porridge & Egg", lunch: "Rice & Chicken", snack: "Banana", served: 0, status: "Scheduled" },
  { day: "Friday", breakfast: "Uji & Bread", lunch: "Pilau & Salad", snack: "Juice", served: 0, status: "Scheduled" },
];

export default function CanteenPortal() {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Canteen Management"
        subtitle="Plan daily meals, monitor food supply, and track student feeding program."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="h-9 text-xs border-slate-200 font-bold gap-2">
              <CalendarCheck size={14} /> Weekly Plan
            </Button>
            <Button className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 font-bold gap-2">
              <Plus size={14} /> Update Menu
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Students Fed Today", val: "598", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Meals This Week", val: "2,983", icon: Utensils, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Days Served", val: "3 / 5", icon: CheckCircle2, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Pending Orders", val: "2", icon: ShoppingCart, color: "text-rose-600", bg: "bg-rose-50" },
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
            <CardTitle className="text-base font-bold text-slate-900 leading-none">This Week's Meal Schedule</CardTitle>
          </div>
          <Separator className="bg-slate-50" />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-50">
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Day</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Breakfast</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Lunch</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Snack</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Served</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mealPlan.map((r) => (
                <TableRow key={r.day} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4 text-xs font-bold text-slate-900">{r.day}</TableCell>
                  <TableCell className="py-4 text-xs text-slate-600">{r.breakfast}</TableCell>
                  <TableCell className="py-4 text-xs text-slate-600">{r.lunch}</TableCell>
                  <TableCell className="py-4 text-xs text-slate-500">{r.snack}</TableCell>
                  <TableCell className="py-4 text-xs font-medium text-slate-600">{r.served > 0 ? r.served : "—"}</TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Badge className={cn("text-[9px] font-bold border-0",
                      r.status === "Served" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
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
