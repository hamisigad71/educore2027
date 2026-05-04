import React from "react";
import { 
  FileText, 
  Plus, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  AlertCircle,
  MoreVertical,
  BarChart2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const AssignmentsPage = () => {
  const activeAssignments = [
    { title: "Weekly Science Lab Report", class: "Grade 6A", due: "In 2 days", submissions: 32, total: 40, status: "Ongoing", priority: "High" },
    { title: "Ancient Civilizations Essay", class: "Grade 7C", due: "May 12", submissions: 15, total: 38, status: "Ongoing", priority: "Medium" },
    { title: "Linear Equations Quiz", class: "Grade 8B", due: "Today", submissions: 42, total: 42, status: "Completed", priority: "Normal" },
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Assignments</h1>
          <p className="text-slate-500 font-medium">Create and track student tasks, projects, and assessments.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200">
            <BarChart2 className="h-4 w-4 mr-2" />
            Insights
          </Button>
          <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100">
            <Plus className="h-4 w-4 mr-2" />
            New Assignment
          </Button>
        </div>
      </div>

      {/* Grid of Workload */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Active Tasks", val: "8", color: "bg-indigo-600" },
          { label: "Submissions Today", val: "124", color: "bg-emerald-500" },
          { label: "Marking Pending", val: "18", color: "bg-amber-500" },
          { label: "Overdue", val: "2", color: "bg-rose-500" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm group hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="pt-6">
               <div className="flex justify-between items-start">
                 <div>
                   <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                   <p className="text-2xl font-black text-slate-900">{stat.val}</p>
                 </div>
                 <div className={cn("h-1 w-12 rounded-full", stat.color)} />
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-bold text-slate-900">Ongoing Assessments</h2>
          <Badge variant="outline" className="rounded-full text-[10px] font-bold text-slate-400">3 ACTIVE</Badge>
        </div>

        {activeAssignments.map((task, i) => {
          const progressVal = (task.submissions / task.total) * 100;
          return (
            <Card key={i} className="border-slate-100 hover:shadow-md transition-all duration-300 overflow-hidden group">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="p-6 flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                           <Badge className={cn(
                             "rounded-md text-[10px] border-none",
                             task.priority === "High" ? "bg-rose-50 text-rose-600" : 
                             task.priority === "Medium" ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-600"
                           )}>
                             {task.priority} Priority
                           </Badge>
                           <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{task.class}</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">{task.title}</h3>
                      </div>
                      
                      <div className="flex items-center gap-8">
                         <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Due By</span>
                            <div className="flex items-center gap-2">
                               <Calendar size={14} className="text-slate-400" />
                               <span className={cn(
                                 "text-sm font-bold",
                                 task.due === "Today" ? "text-rose-600" : "text-slate-700"
                               )}>{task.due}</span>
                            </div>
                         </div>
                         <div className="flex flex-col items-end min-w-[100px]">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Submissions</span>
                            <span className="text-sm font-bold text-slate-900">{task.submissions} / {task.total}</span>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                       <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                         <span>COMPLETION RATE</span>
                         <span>{Math.round(progressVal)}%</span>
                       </div>
                       <Progress value={progressVal} className="h-1.5 bg-slate-100" />
                    </div>
                  </div>

                  <div className="md:w-16 bg-slate-50/50 md:self-stretch border-t md:border-t-0 md:border-l border-slate-100 flex md:flex-col items-center justify-center p-3 gap-2">
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white hover:shadow-sm text-slate-400 hover:text-indigo-600 transition-all">
                        <BarChart2 size={18} />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white hover:shadow-sm text-slate-400 hover:text-emerald-600 transition-all">
                        <CheckCircle2 size={18} />
                      </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default AssignmentsPage;
