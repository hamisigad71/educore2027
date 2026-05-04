import React from "react";
import { 
  ShieldAlert, 
  Search, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar,
  MoreVertical,
  Flame,
  Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ConductPage = () => {
  const incidents = [
    { student: "John Doe", class: "6A", type: "Merit", reason: "Outstanding Teamwork", points: "+5", date: "Today", icon: Award, color: "text-emerald-600 bg-emerald-50", borderColor: "border-emerald-100" },
    { student: "Sarah Smith", class: "6A", type: "Demerit", reason: "Punctuality", points: "-2", date: "Yesterday", icon: Flame, color: "text-rose-600 bg-rose-50", borderColor: "border-rose-100" },
    { student: "Michael Brown", class: "7B", type: "Merit", reason: "Excellence in Science", points: "+10", date: "May 2", icon: Award, color: "text-emerald-600 bg-emerald-50", borderColor: "border-emerald-100" },
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Behavioral Log</h1>
          <p className="text-slate-500 font-medium">Monitor and record student conduct across your classes.</p>
        </div>
        <div className="flex items-center gap-3">
           <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100">
            <Plus className="h-4 w-4 mr-2" />
            Log New Incident
          </Button>
        </div>
      </div>

      {/* Sentiment Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-emerald-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Total Merits</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">342</span>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                    <TrendingUp size={12} /> 12%
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <Award size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-rose-50/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-rose-600 mb-1">Total Demerits</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">28</span>
                  <span className="text-xs font-bold text-rose-600 flex items-center gap-0.5">
                    <TrendingDown size={12} /> 5%
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600">
                <Flame size={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-indigo-50/30">
          <CardContent className="pt-6">
             <div className="flex items-center justify-between">
               <div>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 mb-1">Weekly Reports</p>
                 <div className="flex items-baseline gap-2">
                   <span className="text-3xl font-black text-slate-900">4</span>
                   <span className="text-xs font-bold text-slate-400">PENDING</span>
                 </div>
               </div>
               <div className="h-12 w-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                 <Calendar size={24} />
               </div>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Log List */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-slate-900">Recent Conduct Records</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input placeholder="Search students..." className="pl-9 h-8 rounded-lg text-xs border-slate-200" />
            </div>
          </div>

          <div className="space-y-3">
            {incidents.map((log, i) => (
              <Card key={i} className={cn("border bg-white shadow-none group transition-all hover:translate-x-1", log.borderColor)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", log.color)}>
                        <log.icon size={20} />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-bold text-slate-900">{log.student}</span>
                           <Badge variant="outline" className="rounded-md h-5 px-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider">{log.class}</Badge>
                        </div>
                        <p className="text-xs font-medium text-slate-500">{log.reason}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className={cn("text-sm font-black", log.type === "Merit" ? "text-emerald-600" : "text-rose-600")}>
                          {log.points}
                        </p>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">{log.date}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-300 hover:text-slate-600">
                        <MoreVertical size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-indigo-600 text-white overflow-hidden relative p-6">
             {/* Decorative pattern */}
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Users size={80} />
            </div>
            <div className="relative z-10 space-y-4">
              <h3 className="text-lg font-bold">Class of the Month</h3>
              <p className="text-indigo-100 text-xs leading-relaxed font-medium">
                Grade 6A has reached the milestone of 500 total merits this term!
              </p>
              <div className="flex -space-x-2">
                 {[1,2,3,4].map(n => (
                   <div key={n} className="h-8 w-8 rounded-full border-2 border-indigo-600 bg-indigo-400 flex items-center justify-center text-[10px] font-bold">
                     ST
                   </div>
                 ))}
                 <div className="h-8 w-8 rounded-full border-2 border-indigo-600 bg-indigo-800 flex items-center justify-center text-[10px] font-bold">
                   +36
                 </div>
              </div>
              <Button className="w-full bg-white text-indigo-600 hover:bg-slate-100 rounded-xl font-bold text-xs h-10 transition-colors mt-2">
                Congratulate Them
              </Button>
            </div>
          </Card>
          
          <Card className="border-slate-100 shadow-sm">
             <CardHeader className="pb-2">
               <CardTitle className="text-base">Quick Guidelines</CardTitle>
             </CardHeader>
             <CardContent className="space-y-3">
               <div className="flex gap-2 text-xs">
                 <Badge variant="outline" className="shrink-0 h-5 text-indigo-600 bg-indigo-50 border-indigo-100">Merits</Badge>
                 <p className="text-slate-500 font-medium">Focus on effort, teamwork, and voluntary assistance.</p>
               </div>
               <Separator className="bg-slate-50" />
               <div className="flex gap-2 text-xs">
                 <Badge variant="outline" className="shrink-0 h-5 text-rose-600 bg-rose-50 border-rose-100">Demerits</Badge>
                 <p className="text-slate-500 font-medium">Use for persistent pattern issues or safety concerns.</p>
               </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default ConductPage;
