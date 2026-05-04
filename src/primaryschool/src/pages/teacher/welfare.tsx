import React from "react";
import { 
  Stethoscope, 
  Search, 
  Plus, 
  Heart, 
  Activity, 
  AlertCircle,
  MoreVertical,
  ChevronRight,
  MessageSquare,
  History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const WelfarePage = () => {
  const flags = [
     { student: "Lucy Hale", class: "6A", concern: "Persistent Cough", priority: "Low", date: "Today", status: "Reported" },
     { student: "Ben Atkins", class: "7B", concern: "Sudden Social Withdrawal", priority: "High", date: "Yesterday", status: "In Counseling" },
     { student: "Emma Watson", class: "6C", concern: "Severe Nut Allergy", priority: "Critical", date: "Ongoing", status: "Alert" },
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Student Welfare</h1>
          <p className="text-slate-500 font-medium">Monitor health and emotional well-being concerns in your classroom.</p>
        </div>
        <Button className="rounded-xl bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-100">
          <AlertCircle className="h-4 w-4 mr-2" />
          Flag Concern
        </Button>
      </div>

      {/* Welfare Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white overflow-hidden group">
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
                 <Heart size={24} />
               </div>
               <div>
                  <p className="text-3xl font-black text-slate-900 leading-none">12</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Active Cases</p>
               </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-white overflow-hidden group">
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                 <Activity size={24} />
               </div>
               <div>
                  <p className="text-3xl font-black text-slate-900 leading-none">3</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">High Priority</p>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden group">
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                 <History size={24} />
               </div>
               <div>
                  <p className="text-3xl font-black text-slate-900 leading-none">24</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Resolved (Term)</p>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Priority Monitor</h2>
              <Button variant="ghost" size="sm" className="text-xs font-bold text-indigo-600 rounded-lg">View Full Registry</Button>
           </div>
           
           <div className="space-y-4">
             {flags.map((flag, i) => (
               <Card key={i} className="border-slate-100 hover:shadow-sm transition-all group overflow-hidden">
                 <CardContent className="p-0">
                   <div className="flex flex-col md:flex-row items-stretch">
                     <div className={cn(
                       "w-1.5 shrink-0",
                       flag.priority === "Critical" ? "bg-rose-600" : 
                       flag.priority === "High" ? "bg-amber-500" : "bg-indigo-400"
                     )} />
                     <div className="flex-1 p-5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                           <Avatar className="h-10 w-10 border border-slate-100">
                             <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xs">
                               {flag.student.split(' ').map(n => n[0]).join('')}
                             </AvatarFallback>
                           </Avatar>
                           <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                 <span className="text-sm font-bold text-slate-900">{flag.student}</span>
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1.5 py-0.5 rounded bg-slate-50">{flag.class}</span>
                              </div>
                              <p className="text-[13px] font-medium text-slate-600">{flag.concern}</p>
                           </div>
                        </div>

                        <div className="flex items-center gap-6">
                           <div className="flex flex-col items-end">
                              <Badge className={cn(
                                "rounded-lg text-[10px] font-black uppercase tracking-wider mb-1 px-2 py-0.5 border-none",
                                flag.priority === "Critical" ? "bg-rose-50 text-rose-600" : 
                                flag.priority === "High" ? "bg-amber-50 text-amber-600" : "bg-indigo-50 text-indigo-600"
                              )}>
                                {flag.priority}
                              </Badge>
                              <span className="text-[10px] font-bold text-slate-400">{flag.status}</span>
                           </div>
                           <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 text-slate-300 hover:text-slate-600">
                             <ChevronRight size={20} />
                           </Button>
                        </div>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             ))}
           </div>
        </div>

        <div className="space-y-6">
           <Card className="border-slate-100 shadow-sm bg-gradient-to-br from-white to-slate-50/50">
             <CardHeader className="pb-3 border-b border-slate-50">
               <CardTitle className="text-base flex items-center gap-2">
                 <MessageSquare size={18} className="text-indigo-600" />
                 Counselor Chat
               </CardTitle>
             </CardHeader>
             <CardContent className="pt-4 space-y-4">
                <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 relative">
                   <p className="text-xs text-indigo-900 leading-relaxed italic">
                     "Hi Teacher, I've seen the report for Ben Atkins. I'll be meeting him tomorrow at 9 AM."
                   </p>
                   <p className="text-[10px] font-bold text-indigo-400 mt-2 text-right">— Mrs. Gomez (Counselor)</p>
                </div>
                <Input placeholder="Reply to Mrs. Gomez..." className="text-xs h-9 rounded-xl border-slate-200" />
                <Button className="w-full text-xs h-9 rounded-xl bg-slate-900 hover:bg-slate-800">Send Message</Button>
             </CardContent>
           </Card>

           <Card className="border-none shadow-sm bg-indigo-50 p-6 text-indigo-900">
              <h4 className="text-sm font-bold flex items-center gap-2 mb-3">
                <Stethoscope size={16} />
                Medical Alerts
              </h4>
              <ul className="space-y-2">
                 <li className="flex items-start gap-2 text-xs leading-tight font-medium">
                   <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1 shrink-0" />
                   Emma Watson: Severe Nut Allergy (Epipen in office)
                 </li>
                 <li className="flex items-start gap-2 text-xs leading-tight font-medium">
                   <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                   David Chen: Chronic Asthma (Inhaler in backpack)
                 </li>
              </ul>
           </Card>
        </div>
      </div>
    </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default WelfarePage;
