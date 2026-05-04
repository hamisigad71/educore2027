import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  Target, 
  Filter,
  Download,
  Calendar,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const AnalyticsPage = () => {
  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Class Analytics</h1>
          <p className="text-slate-500 font-medium">Performance insights and student progress tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Download className="h-4 w-4 mr-2" />
            Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Class Average", val: "78%", icon: BarChart3, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Attendance", val: "94%", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Top Performers", val: "12", icon: Award, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "At Risk", val: "3", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900">{stat.val}</p>
                </div>
                <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                  <stat.icon size={20} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-slate-100 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
               <div>
                  <CardTitle className="text-base font-bold">Performance Trends</CardTitle>
                  <CardDescription className="text-xs">Grade average progression term-over-term</CardDescription>
               </div>
               <div className="flex items-center gap-2">
                  <Badge className="bg-indigo-600 rounded-md text-[10px] uppercase font-bold tracking-wider">Physics</Badge>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Section 6A</Badge>
               </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
             <div className="h-64 flex items-end justify-between gap-4">
                {[45, 62, 58, 85, 72, 90, 78].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                    <div className="h-full w-full bg-slate-50 rounded-t-xl group-hover:bg-slate-100 transition-colors relative flex items-end">
                       <div 
                         className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-xl transition-all duration-1000 animate-in slide-in-from-bottom" 
                         style={{ height: `${val}%` }} 
                       />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">WK {i+1}</span>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold">Subject Targets</CardTitle>
            <CardDescription className="text-xs">Progress towards curriculum goals</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6 pt-2">
             {[
               { label: "Curriculum Coverage", val: 82 },
               { label: "Lab Work Completed", val: 65 },
               { label: "Formative Assessment", val: 94 },
               { label: "Extracurricular Focus", val: 40 },
             ].map((target, i) => (
               <div key={i} className="space-y-2">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-700">{target.label}</span>
                    <span className="text-xs font-bold text-slate-900">{target.val}%</span>
                 </div>
                 <Progress value={target.val} className="h-1.5 bg-slate-100" />
               </div>
             ))}
             
             <div className="mt-8 p-4 rounded-2xl bg-indigo-50 border border-indigo-100/50">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <Target size={18} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-indigo-900">Next Milestone</p>
                    <p className="text-[11px] font-medium text-indigo-700 leading-relaxed italic">
                      Final internal assessments should be completed by June 15th to stay on track.
                    </p>
                  </div>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default AnalyticsPage;
