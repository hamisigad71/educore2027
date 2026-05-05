import { FeatureHeader } from "@/components/portal/FeatureHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Download, Eye, TrendingUp,
  Award, CheckCircle2, User,
  FileDown, Bookmark
} from "lucide-react";
import { cn } from "@/lib/utils";

const REPORTS = [
  { term: "Term 1, 2024", date: "April 05, 2024", avg: 82, rank: "5/38", status: "Published", type: "End of Term" },
  { term: "Half Term, 2024", date: "Feb 15, 2024", avg: 78, rank: "12/38", status: "Published", type: "Formative" },
  { term: "Term 3, 2023", date: "Dec 10, 2023", avg: 85, rank: "3/38", status: "Archived", type: "End of Year" },
  { term: "Term 2, 2023", date: "Aug 12, 2023", avg: 80, rank: "8/38", status: "Archived", type: "End of Term" },
];

export default function PortalReports() {
  return (
    <div className="space-y-8 pb-12">
      <FeatureHeader 
        title="Termly Reports" 
        description="Access and download your formal academic report cards, teacher evaluations, and performance certificates in one secure location."
        badge="Academic Records"
        actions={
          <Button className="bg-indigo-600 hover:bg-black text-white shadow-lg shadow-indigo-100 gap-2 font-medium h-11 px-8 rounded-2xl group transition-all">
            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
            Download All (ZIP)
          </Button>
        }
      />

      {/* Progress Summary Section */}
      <div className="grid gap-6 lg:grid-cols-4">
         <Card className="lg:col-span-3 border-indigo-100 bg-gradient-to-br from-white to-indigo-50/10 shadow-soft rounded-[32px] overflow-hidden group">
            <CardContent className="p-8 lg:p-10">
               <div className="flex flex-col lg:flex-row items-center gap-10">
                  <div className="h-24 w-24 rounded-3xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-2xl shadow-indigo-200 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                     <TrendingUp size={40} />
                  </div>
                  <div className="flex-1 text-center lg:text-left">
                     <div className="inline-flex items-center gap-2 mb-4">
                        <span className="h-[1px] w-5 bg-indigo-200" />
                        <p className="text-indigo-600 text-[11px] font-bold uppercase tracking-[0.2em]">Annual Growth</p>
                     </div>
                     <h3 className="text-2xl font-medium text-slate-900 tracking-tight leading-tight mb-4">
                        "Your performance has shown a consistent upward trend of +4.5% compared to the previous academic year."
                     </h3>
                     <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 pt-2">
                        <div className="flex items-center gap-2 bg-white border border-slate-100 px-3 py-1.5 rounded-xl shadow-sm">
                           <Award className="size-4 text-indigo-600" />
                           <span className="text-[11px] font-bold text-slate-700">Highest Category: Science & Tech</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-400 italic">Last Updated: Today, 09:42 AM</span>
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>

         <Card className="border-indigo-100 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[32px] overflow-hidden text-white flex flex-col justify-center p-8 shadow-xl shadow-indigo-100">
             <div className="flex items-center gap-2 mb-6">
                 <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
                    <Bookmark className="size-4 text-indigo-100" />
                 </div>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-100/60 text-center">Next Report</span>
             </div>
             <p className="text-sm font-medium text-indigo-50/80 leading-relaxed mb-6">
                 The Term 2 Full Assessment report card will be released on:
             </p>
             <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                 <p className="text-2xl font-medium tracking-tight mb-1">July 28th</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200">Countdown: 12 Days</p>
             </div>
         </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {REPORTS.map((report, i) => (
          <Card key={i} className="border-slate-200/60 shadow-soft bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 rounded-[32px] overflow-hidden group">
             <CardContent className="p-0">
                <div className="p-8">
                   <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                         <div className={cn(
                           "h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3",
                           report.status === "Published" ? "bg-indigo-600 shadow-indigo-100" : "bg-slate-500 shadow-slate-100"
                         )}>
                            <FileText size={28} />
                         </div>
                         <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-none mb-2">{report.type}</p>
                            <h4 className="text-lg font-medium text-slate-900 tracking-tight">{report.term}</h4>
                         </div>
                      </div>
                      <Badge variant="outline" className={cn(
                        "text-[10px] font-bold px-3 py-1 bg-white border-slate-200 tracking-widest uppercase rounded-xl",
                        report.status === "Published" ? "text-emerald-600 border-emerald-100 bg-emerald-50/50" : "text-slate-400"
                      )}>
                        {report.status}
                      </Badge>
                   </div>

                   <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 text-center">
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Avg Score</p>
                         <p className="text-xl font-medium text-slate-900">{report.avg}%</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 text-center">
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Class Rank</p>
                         <p className="text-xl font-medium text-slate-900">{report.rank}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 text-center">
                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Released On</p>
                         <p className="text-[11px] font-medium text-slate-500 mt-2">{report.date}</p>
                      </div>
                   </div>

                   <div className="flex gap-3">
                      <Button className="flex-1 bg-indigo-600 hover:bg-black text-white font-medium text-sm h-12 rounded-2xl gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95 border-0">
                         <FileDown size={18} /> Download PDF
                      </Button>
                      <Button variant="outline" className="size-12 rounded-2xl border-slate-200 text-slate-500 hover:bg-slate-50 p-0 flex items-center justify-center shrink-0">
                         <Eye size={18} />
                      </Button>
                   </div>
                </div>
                
                {/* Expandable Footer Area */}
                <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between group-hover:bg-indigo-50/30 transition-colors">
                   <div className="flex items-center gap-2">
                       <User size={14} className="text-slate-400" />
                       <span className="text-[10px] font-medium text-slate-500 tracking-tight">Verified by School Registrar</span>
                   </div>
                   <CheckCircle2 size={14} className="text-emerald-500" />
                </div>
             </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Notice */}
      <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 flex flex-col md:flex-row items-center gap-6">
         <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
            <FileText className="size-6 text-indigo-600" />
         </div>
         <div className="flex-1 text-center md:text-left">
            <h5 className="text-sm font-medium text-slate-900 mb-1">Missing reports?</h5>
            <p className="text-[13px] text-slate-500 font-medium">Historical reports prior to 2023 are available upon request from the School Administration office.</p>
         </div>
         <Button variant="ghost" className="text-indigo-600 font-bold text-xs uppercase tracking-widest hover:bg-indigo-50 rounded-xl px-6">
            Contact Admin
         </Button>
      </div>
    </div>
  );
}
