import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";


// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// lucide
import { 
  Clock, ChevronRight, Activity, 
  Landmark, BookOpen, Stethoscope,
  Shield, Bus, GraduationCap, Package,
  TrendingUp, LayoutDashboard, Search,
  Users, Wrench
} from "lucide-react";
import { cn } from "@/lib/utils";

const modules = [
  { 
    id: "bursar", 
    title: "Bursar's Office", 
    desc: "Fee collection, payroll, and school expenditures manager.",
    path: "/highschool/staff/bursar",
    icon: Landmark,
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    cat: "Finance"
  },
  { 
    id: "admissions", 
    title: "Admissions Center", 
    desc: "Manage Form 1 intake pipeline and student registration.",
    path: "/highschool/staff/admissions",
    icon: GraduationCap,
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    cat: "Admin"
  },
  { 
    id: "inventory", 
    title: "Asset & Inventory", 
    desc: "Specialized tracker for Lab equipment and ICT infrastructure.",
    path: "/highschool/staff/inventory",
    icon: Package,
    color: "bg-purple-50 text-purple-600 border-purple-100",
    cat: "Acad Support"
  },
  { 
    id: "library", 
    title: "School Library", 
    desc: "Book cataloging, checkouts, and student circulation records.",
    path: "/highschool/staff/library",
    icon: BookOpen,
    color: "bg-amber-50 text-amber-600 border-amber-100",
    cat: "Acad Support"
  },
  { 
    id: "sanatorium", 
    title: "Health Clinic", 
    desc: "School nurse log for student health and medical stock.",
    path: "/highschool/staff/sanatorium",
    icon: Stethoscope,
    color: "bg-rose-50 text-rose-600 border-rose-100",
    cat: "Welfare"
  },
  { 
    id: "boarding", 
    title: "Boarding & Welfare", 
    desc: "Matron/Patron dashboard for dormitory occupancy.",
    path: "/highschool/staff/boarding",
    icon: Activity,
    color: "bg-blue-50 text-blue-600 border-blue-100",
    cat: "Welfare"
  },
  { 
    id: "operations", 
    title: "Site Operations", 
    desc: "Security logs, maintenance orders, and transport routes.",
    path: "/highschool/staff/operations",
    icon: Shield,
    color: "bg-slate-50 text-slate-600 border-slate-100",
    cat: "Ops & Security"
  },
];

export default function StaffDashboard() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 pb-12">
      {/* ─── Modern Welcome Section ────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-8 text-white shadow-2xl border border-white/5 group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
          <LayoutDashboard size={180} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-white/10 shadow-2xl bg-white/5 ring-8 ring-white/5">
                <AvatarImage src={user?.photo} className="object-cover" />
                <AvatarFallback className="text-2xl font-black text-white bg-indigo-600">
                  {user?.name?.split(" ").map((n:any) => n[0]).slice(0,2).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-slate-400 text-sm font-bold tracking-widest uppercase">
                  {getGreeting()}, it's {currentTime.toLocaleDateString('en-KE', { weekday: 'long' })}
                </p>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight">{user?.name}</h2>
                <div className="flex gap-2 pt-2">
                  <Badge className="bg-white/10 text-slate-300 border-white/10 font-bold px-3 py-1 text-[10px] tracking-wider uppercase">
                    School Operations
                  </Badge>
                  <Badge className="bg-indigo-600/20 text-indigo-400 border-indigo-500/20 font-bold px-3 py-1 text-[10px] tracking-wider uppercase">
                    Verified Staff
                  </Badge>
                </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-md border border-white/10 text-center hover:bg-white/10 transition-colors">
                 <p className="text-3xl font-black text-white leading-none">08</p>
                 <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Open Tasks</p>
              </div>
              <div className="bg-indigo-600 rounded-2xl p-6 shadow-xl shadow-indigo-900/40 text-center hover:bg-indigo-500 transition-colors cursor-pointer">
                 <p className="text-3xl font-black text-white leading-none">94%</p>
                 <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mt-2">Compliance</p>
              </div>
           </div>
        </div>
        
        {/* Animated background glow */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ─── Specialized Modules Grid ────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between px-2">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Staff Control Center</h3>
                <p className="text-sm text-slate-500 font-medium">Select your specialized department to begin</p>
              </div>
              <Button variant="ghost" className="text-indigo-600 font-bold text-xs gap-1.5 hover:bg-indigo-50">
                Configure View <TrendingUp size={14} />
              </Button>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {modules.map((m) => (
                <Link key={m.id} to={m.path}>
                  <Card className="h-full border-slate-200/80 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group overflow-hidden relative cursor-pointer">
                    <CardContent className="p-6">
                       <div className="flex items-start justify-between mb-6">
                          <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center border shadow-sm transition-transform group-hover:scale-110 duration-300", m.color)}>
                             <m.icon size={22} strokeWidth={2.5} />
                          </div>
                          <Badge variant="outline" className="text-[9px] font-black tracking-wider uppercase border-slate-100 text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                             {m.cat}
                          </Badge>
                       </div>
                       <div className="space-y-1">
                          <h4 className="font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{m.title}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium">{m.desc}</p>
                       </div>
                       <div className="mt-6 flex items-center text-[11px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                          LAUNCH MODULE <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                       </div>
                    </CardContent>
                    {/* Hover decorative element */}
                    <div className="absolute -bottom-4 -right-4 h-16 w-16 bg-slate-50 rounded-full group-hover:bg-indigo-50 transition-colors -z-1" />
                  </Card>
                </Link>
              ))}
           </div>
        </div>

        {/* ─── Sidebar: Workflows & Duty ────────────────────────────────────── */}
        <div className="space-y-8">
           {/* Active Work Timer */}
           <Card className="shadow-2xl border-indigo-100 overflow-hidden group">
              <CardHeader className="bg-indigo-50/50 pb-4">
                 <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-600" />
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-indigo-900">Current Shift</CardTitle>
                 </div>
              </CardHeader>
              <CardContent className="p-6 text-center space-y-6">
                 <div className="space-y-1">
                   <p className="text-4xl font-black text-slate-900 tracking-tighter">04:12:05</p>
                   <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest leading-none">On-Campus Presence</p>
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 font-bold h-10 rounded-xl shadow-lg shadow-indigo-200">
                      Break
                    </Button>
                    <Button variant="outline" className="border-rose-200 text-rose-600 hover:bg-rose-50 font-bold h-10 rounded-xl">
                      Clock Out
                    </Button>
                 </div>
              </CardContent>
           </Card>

           {/* Emergency & Duty Section */}
           <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                 <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Duty Roster</h4>
                 <Badge className="bg-rose-500 text-white font-black text-[9px] border-0">3 URGENT</Badge>
              </div>
              
              <Card className="border-slate-200/80 shadow-sm overflow-hidden">
                 <CardContent className="p-0">
                    {[
                      { action: "Visitor Log", area: "Main Gate", time: "08:30 AM", type: "Security", icon: Shield, color: "text-emerald-500" },
                      { action: "Roll Call", area: "Hostel Zone", time: "09:00 PM", type: "Boarding", icon: Users, color: "text-indigo-500" },
                      { action: "Stock Audit", area: "Chemistry Lab", time: "Every Mon", type: "Inventory", icon: Wrench, color: "text-amber-500" },
                    ].map((duty, i) => (
                      <div key={i} className="flex items-center justify-between p-5 border-b border-slate-50 last:border-0 hover:bg-slate-50 cursor-pointer group transition-colors">
                         <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:border-indigo-100 transition-all">
                               <duty.icon size={16} className={cn("transition-colors", duty.color)} />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-slate-900">{duty.action}</p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{duty.area}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-xs font-bold text-slate-600">{duty.time}</p>
                            <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">{duty.type}</p>
                         </div>
                      </div>
                    ))}
                 </CardContent>
              </Card>
           </div>

           {/* Quick Search */}
           <Card className="bg-slate-100/50 border-slate-200 border-dashed border-2 p-6 flex flex-col items-center justify-center text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-slate-300">
                 <Search size={24} />
              </div>
              <p className="text-sm font-bold text-slate-900">Global Search</p>
              <p className="text-[11px] text-slate-500 font-medium px-4">Find students, assets, or records across all staff modules.</p>
              <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-white px-2 font-mono text-[10px] font-bold text-slate-400">
                 <span className="text-xs">⌘</span> K
              </kbd>
           </Card>
        </div>
      </div>

    </div>
  );
}