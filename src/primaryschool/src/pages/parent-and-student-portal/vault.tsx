import { FileText, Download, ShieldCheck, Search, Filter, History, Trash2, Plus, Lock, Eye, ChevronRight, Share2 } from "lucide-react";
import { FeatureHeader } from "@/components/portal/FeatureHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const DOCUMENTS = [
  { id: 1, name: "Admission_Letter_2024.pdf", size: "1.2 MB", date: "Jan 12, 2024", type: "Official", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
  { id: 2, name: "Term_1_Report_Card.pdf", size: "850 KB", date: "April 05, 2024", type: "Academic", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: 3, name: "Medical_Clearance_Form.pdf", size: "2.1 MB", date: "May 20, 2024", type: "Health", icon: FileText, color: "text-rose-500", bg: "bg-rose-50" },
  { id: 4, name: "School_Policies_v2.pdf", size: "4.5 MB", date: "June 01, 2024", type: "Administrative", icon: Lock, color: "text-indigo-600", bg: "bg-indigo-50" },
];

export default function PortalVault() {
  return (
    <div className="space-y-8 pb-12">
      <FeatureHeader 
        title="Document Vault" 
        description="A secure repository for sensitive academic and administrative documents. Access official letters, certificates, and forms anytime."
        badge="Secure Storage"
        icon={<ShieldCheck className="size-8 text-indigo-400" />}
        actions={
          <Button className="bg-indigo-600 hover:bg-black text-white shadow-lg shadow-indigo-100 gap-2 font-medium h-11 px-8 rounded-2xl group transition-all">
            <Plus size={18} /> Upload Doc
          </Button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-8">
         <div className="flex-1 space-y-6">
            <Card className="border-slate-200/60 shadow-soft bg-white rounded-[32px] overflow-hidden">
               <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                     <h3 className="text-xl font-medium text-slate-900 tracking-tight">Recent Documents</h3>
                     <Badge variant="outline" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 py-1 rounded-xl h-auto">4 Files</Badge>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
                        <input type="text" placeholder="Search vault..." className="bg-slate-50/50 border border-slate-100 rounded-xl pl-9 pr-4 py-2 text-xs font-medium w-48 lg:w-64 outline-none focus:border-indigo-300" />
                     </div>
                     <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 border border-slate-100 hover:bg-slate-50">
                        <Filter size={16} />
                     </Button>
                  </div>
               </div>

               <CardContent className="p-0">
                  <div className="divide-y divide-slate-50">
                     {DOCUMENTS.map((doc) => (
                        <div key={doc.id} className="p-8 flex flex-col md:flex-row gap-6 hover:bg-slate-50/50 transition-colors group">
                           <div className="shrink-0">
                              <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110", doc.bg)}>
                                 <doc.icon className={cn("size-7", doc.color)} />
                              </div>
                           </div>
                           
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1.5">
                                 <h4 className="text-[15px] font-medium text-slate-900 tracking-tight truncate group-hover:text-indigo-600 transition-colors">{doc.name}</h4>
                                 <Badge className="bg-slate-100 text-slate-500 border-0 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">{doc.type}</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em]">
                                 <span className="flex items-center gap-1.5"><Download size={12} className="text-slate-300" /> {doc.size}</span>
                                 <span>Modified: {doc.date}</span>
                              </div>
                           </div>

                           <div className="flex items-center gap-2 md:justify-end">
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                                 <Eye size={18} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50">
                                 <Download size={18} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                                 <Trash2 size={18} />
                              </Button>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            <div className="p-8 rounded-[32px] bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-indigo-100">
               <Lock className="absolute -bottom-8 -right-8 size-40 text-white/10" />
               <div className="flex-1 relative z-10 text-center md:text-left">
                  <h4 className="text-xl font-medium tracking-tight mb-2">End-to-End Encryption</h4>
                  <p className="text-indigo-100/70 text-xs font-medium leading-relaxed max-w-lg">
                    All documents stored in your vault are protected with enterprise-grade encryption. Your data is your own, and all access is strictly logged and audited.
                  </p>
               </div>
               <Button className="bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] uppercase tracking-widest h-12 px-8 rounded-2xl shrink-0 backdrop-blur-md border border-white/20">
                  Security Log <History size={14} className="ml-2" />
               </Button>
            </div>
         </div>

         <div className="w-full lg:w-80 space-y-6">
            <Card className="border-slate-200 shadow-soft bg-white rounded-[32px] overflow-hidden p-8">
               <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                     <ShieldCheck size={18} className="text-indigo-600" />
                  </div>
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Vault Analytics</h5>
               </div>
               
               <div className="space-y-6">
                  <div>
                     <div className="flex justify-between items-center mb-2">
                        <span className="text-[11px] font-medium text-slate-500">Storage Used</span>
                        <span className="text-[11px] font-bold text-slate-900">9.1 MB / 1 GB</span>
                     </div>
                     <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: '1%' }} />
                     </div>
                  </div>
               </div>

               <div className="mt-8 pt-8 border-t border-slate-50">
                  <Button variant="ghost" className="w-full justify-between text-slate-600 font-bold text-[10px] uppercase tracking-widest group p-0 hover:bg-transparent">
                     Request Document <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="ghost" className="w-full justify-between text-slate-600 font-bold text-[10px] uppercase tracking-widest group p-0 hover:bg-transparent mt-4">
                     Share Vault Access <Share2 size={14} />
                  </Button>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
