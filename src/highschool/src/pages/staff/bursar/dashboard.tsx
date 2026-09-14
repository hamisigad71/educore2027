import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout";
import { getDashboardStats, DashboardStats } from "@/lib/api";
import { currency } from "../../../data/mockData";
import { Link } from "react-router-dom";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

// lucide
import { 
  CreditCard, Wallet,
  Printer, ArrowUpRight,
  AlertCircle, FileText,
  Landmark, PieChart, Banknote, ShoppingBag,
  ChevronRight, Activity, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function BursarDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getDashboardStats();
        setStats(res);
      } catch (err) {
        console.error("Bursar stats error:", err);
      }
    }
    loadData();
  }, []);

  const totalFees = stats?.totalFeeBilled ?? 139500;
  const collected = stats?.totalFeePaid ?? 76500;
  const outstanding = stats?.totalFeeBalance ?? 63000;
  const percentage = totalFees > 0 ? Math.round((collected / totalFees) * 100) : 0;

  const modules = [
    { title: "Fee Collection", desc: "Manage payments & arrears", icon: CreditCard, path: "/highschool/staff/bursar/fees", color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Staff Payroll", desc: "Salaries & statutory logs", icon: Banknote, path: "/highschool/staff/bursar/payroll", color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Expenditures", desc: "Procurement & utility bills", icon: ShoppingBag, path: "/highschool/staff/bursar/expenses", color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Financial Reports", desc: "Statements & audit trails", icon: FileText, path: "/highschool/staff/bursar/reports", color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Bursar's Office" 
        subtitle="Financial oversight, departmental modules, and institutional health" 
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-700 bg-white shadow-sm font-bold text-xs gap-1.5 px-4">
              <Printer size={14} /> Month End Summary
            </Button>
            <Button className="h-9 bg-indigo-600 hover:bg-indigo-700 shadow-sm text-xs font-bold gap-1.5 px-4">
              <Activity size={14} /> Auditor's View
            </Button>
          </div>
        }
      />

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Fees Collected", value: currency(collected), trend: "+12.5%", up: true, icon: Landmark, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Outstanding Fees", value: currency(totalFees - collected), trend: "-2.1%", up: false, icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Payroll Budget", value: currency(3200000), trend: "Stable", up: true, icon: Wallet, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Operating Exp", value: currency(850000), trend: "+5.1%", up: false, icon: PieChart, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((s) => (
          <Card key={s.label} className="shadow-sm border-slate-200/80">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                 <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center border", s.bg)}>
                   <s.icon size={14} className={s.color} />
                 </div>
                 {s.trend !== "Stable" && (
                   <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", s.up ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-rose-600 bg-rose-50 border-rose-100")}>
                     {s.trend}
                   </span>
                 )}
              </div>
              <p className="text-xl font-bold text-slate-900 tracking-tighter">{s.value}</p>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Module Launcher */}
         <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modules.map((m) => (
              <Link key={m.title} to={m.path}>
                <Card className="h-full border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition-all group cursor-pointer relative overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-8">
                       <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center border shadow-sm transition-transform group-hover:scale-110", m.bg)}>
                         <m.icon size={22} className={m.color} />
                       </div>
                       <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h4 className="font-black text-slate-900 tracking-tight text-lg leading-none">{m.title}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-2">{m.desc}</p>
                    
                    <div className="mt-6 flex items-center text-[10px] font-black text-indigo-600 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                      Open Module <ArrowUpRight size={12} className="ml-1" />
                    </div>
                  </CardContent>
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-indigo-50/50 transition-colors -z-1" />
                </Card>
              </Link>
            ))}
         </div>

         <Card className="shadow-sm border-slate-200/80 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
               <CardTitle className="text-sm font-bold text-slate-900 border-l-2 border-indigo-500 pl-3">Term Collection Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
               <div className="space-y-3">
                  <div className="flex justify-between items-end">
                     <span className="text-2xl font-black text-slate-900 tracking-tighter">{percentage}%</span>
                     <span className="text-xs font-bold text-slate-500">Collected</span>
                  </div>
                  <Progress value={percentage} className="h-2.5 bg-slate-100 [&>div]:bg-indigo-600 rounded-full" />
                  <div className="flex justify-between text-[11px] font-bold text-slate-400 tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                     <span>{currency(collected)}</span>
                     <span>Target: {currency(totalFees)}</span>
                  </div>
               </div>

               <Separator className="bg-slate-50" />

               <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Critical Alerts</p>
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-3 group">
                     <AlertCircle size={16} className="text-rose-500 mt-0.5 shrink-0" />
                     <div>
                        <p className="text-xs font-bold text-rose-900">42 Students in Arrears</p>
                        <p className="text-[10px] text-rose-700/70 mt-1 font-medium leading-relaxed">System has flagged 42 students from Form 4 with balances above KSh 50,000.</p>
                     </div>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                     <Clock size={16} className="text-amber-500 mt-0.5 shrink-0" />
                     <div>
                        <p className="text-xs font-bold text-amber-900">Payroll Cutoff Tomorrow</p>
                        <p className="text-[10px] text-amber-700/70 mt-1 font-medium leading-relaxed">Verify all staff bank details before the 25th May cutoff.</p>
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
