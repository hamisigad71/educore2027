import { FeatureHeader } from "@/components/portal/FeatureHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  ShieldCheck, AlertCircle, 
  History, Info, ChevronRight,
  TrendingUp, Star, Zap, UserCheck
} from "lucide-react";

const CONDUCT_DATA = {
  meritPoints: 124,
  disciplineCases: 0,
  standing: "Excellent",
  logs: [
    { id: 1, type: "merit", title: "Exceptional Science Project", points: 20, date: "June 03, 2024", note: "Outstanding presentation and research in the annual science fair." },
    { id: 2, type: "merit", title: "Peer Support Leadership", points: 15, date: "May 28, 2024", note: "Assisted younger students during the library reading session." },
    { id: 3, type: "standing", title: "Monthly Conduct Review", points: 50, date: "May 01, 2024", note: "Maintained a consistent record of punctuality and respect." },
    { id: 4, type: "merit", title: "Sportsmanship Award", points: 10, date: "April 20, 2024", note: "Demonstrated great teamwork during the inter-class football match." },
  ]
};

export default function PortalConduct() {
  return (
    <div className="space-y-8 pb-12">
      <FeatureHeader 
        title="Discipline & Merit Log" 
        description="A transparent record of behavioral milestones, merit points, and discipline history. Celebrating positive choices and character growth."
        badge="Behavioral Insights"
        icon={<ShieldCheck className="size-8 text-indigo-400" />}
        actions={
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-medium h-10 px-6 rounded-2xl backdrop-blur-md">
            <History className="size-4 mr-2" /> Full History
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
         {/* Stats Cards */}
         <Card className="border-emerald-100 bg-emerald-50/20 shadow-soft rounded-[32px] overflow-hidden group">
            <CardContent className="p-8">
               <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-100">
                     <Star size={24} />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none mb-1.5">Merit Points</p>
                     <p className="text-3xl font-medium text-slate-900 tracking-tight leading-none">{CONDUCT_DATA.meritPoints}</p>
                  </div>
               </div>
               <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic">
                  +12% increase from the previous term
               </p>
            </CardContent>
         </Card>

         <Card className="border-rose-100 bg-rose-50/20 shadow-soft rounded-[32px] overflow-hidden group">
            <CardContent className="p-8">
               <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-100">
                     <AlertCircle size={24} />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest leading-none mb-1.5">Discipline Cases</p>
                     <p className="text-3xl font-medium text-slate-900 tracking-tight leading-none">{CONDUCT_DATA.disciplineCases}</p>
                  </div>
               </div>
               <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic">
                  Clear record for this academic year
               </p>
            </CardContent>
         </Card>

         <Card className="border-indigo-100 bg-indigo-50/20 shadow-soft rounded-[32px] overflow-hidden group">
            <CardContent className="p-8">
               <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100">
                     <Zap size={24} />
                  </div>
                  <div>
                     <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none mb-1.5">Overall Standing</p>
                     <p className="text-3xl font-medium text-slate-900 tracking-tight leading-none">{CONDUCT_DATA.standing}</p>
                  </div>
               </div>
               <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic">
                  Top 5% of the student body
               </p>
            </CardContent>
         </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
         <Card className="lg:col-span-3 border-slate-200/60 shadow-soft bg-white rounded-[32px] overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
               <h3 className="text-xl font-medium text-slate-900 tracking-tight">Recent Activity</h3>
               <Button variant="ghost" className="text-indigo-600 font-bold text-[11px] uppercase tracking-widest hover:bg-indigo-50 rounded-xl px-4 h-9">
                  Download Report
               </Button>
            </div>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-50">
                  {CONDUCT_DATA.logs.map((log) => (
                     <div key={log.id} className="p-8 flex flex-col md:flex-row gap-6 hover:bg-slate-50/50 transition-colors group">
                        <div className="shrink-0 flex flex-col items-center gap-2">
                           <div className={cn(
                             "h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 transition-transform group-hover:scale-110",
                             log.type === "merit" ? "bg-emerald-600 shadow-emerald-100" : "bg-indigo-600 shadow-indigo-100"
                           )}>
                              {log.type === "merit" ? <Star size={24} /> : <UserCheck size={24} />}
                           </div>
                           <Badge variant="outline" className={cn(
                             "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border-0",
                             log.type === "merit" ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                           )}>
                             +{log.points}
                           </Badge>
                        </div>
                        
                        <div className="flex-1">
                           <div className="flex items-center justify-between mb-2">
                              <h4 className="text-[15px] font-medium text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{log.title}</h4>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.date}</span>
                           </div>
                           <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">
                              {log.note}
                           </p>
                           <Button variant="ghost" className="h-8 px-3 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600 hover:bg-white border-transparent">
                              View Certificate <ChevronRight size={14} className="ml-1" />
                           </Button>
                        </div>
                     </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <div className="space-y-6">
            <Card className="border-indigo-100 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-[32px] overflow-hidden p-8 shadow-2xl shadow-indigo-200/40">
               <TrendingUp className="size-8 text-indigo-200 mb-6" />
               <h4 className="text-lg font-medium tracking-tight mb-3">Road to Next Milestone</h4>
               <p className="text-indigo-100/70 text-xs font-medium leading-relaxed mb-6">
                  You are only <span className="text-white font-bold underline decoration-indigo-400">26 points</span> away from earning the "Student of the Term" badge!
               </p>
               <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: '82%' }} />
               </div>
               <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-indigo-200/50">
                  <span>Current: 124</span>
                  <span>Goal: 150</span>
               </div>
            </Card>

            <div className="p-6 rounded-[32px] border border-slate-200 bg-white shadow-soft">
               <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-xl bg-orange-50 flex items-center justify-center">
                     <Info className="size-4 text-orange-500" />
                  </div>
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Policy Reminder</h5>
               </div>
               <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                  Points are reset at the beginning of each academic year. View our behavioral policy for more details on point allocation.
               </p>
               <Button variant="link" className="text-indigo-600 font-bold text-[11px] uppercase tracking-widest p-0 h-auto">
                  Behavioral Policy <ChevronRight size={14} />
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
}
