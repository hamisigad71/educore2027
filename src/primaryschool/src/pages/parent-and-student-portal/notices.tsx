import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FeatureHeader } from "@/components/portal/FeatureHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Bell, Mail, Megaphone,
  ChevronRight, 
  AlertCircle, Sparkles, Pin
} from "lucide-react";

const NOTICES = [
  { id: 1, title: "Upcoming Term 2 Mid-Term Parent-Teacher Meeting", category: "Meeting", date: "June 12, 2024", priority: "High", sender: "Head Teacher", content: "We invite all parents to attend the mid-term consultation session to discuss student progress and upcoming final assessments." },
  { id: 2, title: "New School Uniform Policy Update", category: "Policy", date: "June 10, 2024", priority: "Medium", sender: "Administration", content: "Effective next month, students are required to wear the official school tracksuits only on designated PE days." },
  { id: 3, title: "Inter-School Sports Day 2024", category: "Event", date: "June 15, 2024", priority: "Medium", sender: "Sports Dept", content: "Join us for a day of athletic excellence and school spirit at the main campus sports complex." },
  { id: 4, title: "Important: School Bus Route C Delay", category: "Transport", date: "June 11, 2024", priority: "High", sender: "Transport Dept", content: "Please be advised that Bus Route C is experiencing heavy traffic. Expect a delay of 20-30 minutes this afternoon." },
  { id: 5, title: "Annual Science Fair Participation", category: "Academic", date: "June 20, 2024", priority: "Low", sender: "Science Dept", content: "Calling all young scientists! Sign up for the annual fair and showcase your innovative projects." },
];

export default function PortalNotices() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = NOTICES.filter(n => {
    if (activeFilter === "important") return n.priority === "High";
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      <FeatureHeader 
        title="Notice Board" 
        description="Official school announcements, letters, and urgent memos delivered directly to your digital dashboard."
        badge="Communication Hub"
        icon={<Megaphone className="size-8 text-indigo-400" />}
        actions={
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-medium h-10 px-6 rounded-2xl backdrop-blur-md">
            <Mail className="size-4 mr-2" /> View Inbox
          </Button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4">
         <div className="flex bg-slate-100/50 p-1 rounded-2xl border border-slate-200/40">
            {[
              { id: "all", label: "All Notices", icon: Bell },
              { id: "important", label: "Important", icon: AlertCircle },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                  activeFilter === tab.id 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                    : "text-slate-500 hover:text-slate-900"
                )}
              >
                <tab.icon className="size-4" />
                {tab.label}
              </button>
            ))}
         </div>
         <p className="hidden md:block text-[10px] font-bold text-slate-400 uppercase tracking-widest">{filtered.length} Announcements Found</p>
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((notice, i) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="border-slate-200/60 shadow-soft bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 rounded-[32px] overflow-hidden group">
                 <CardContent className="p-0">
                    <div className="p-8 lg:p-10 flex flex-col lg:flex-row gap-8">
                       {/* Date/Status Info */}
                       <div className="shrink-0 flex flex-col items-center lg:w-24">
                          <div className="h-16 w-16 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center mb-3">
                             <span className="text-xl font-bold text-slate-900">{notice.date.split(' ')[1].replace(',', '')}</span>
                             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{notice.date.split(' ')[0]}</span>
                          </div>
                          {notice.priority === "High" && (
                            <Badge className="bg-rose-500/10 text-rose-600 border-rose-100 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                               URGENT
                            </Badge>
                          )}
                       </div>

                       {/* Main Content Area */}
                       <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                             <Badge variant="outline" className="bg-indigo-50 text-indigo-600 border-indigo-100 text-[10px] font-bold px-3 py-1 rounded-xl">
                                {notice.category}
                             </Badge>
                             <span className="h-1 w-1 rounded-full bg-slate-300" />
                             <span className="text-[11px] font-medium text-slate-400">By {notice.sender}</span>
                             {i < 1 && <Pin className="size-3 text-indigo-400 ml-auto" />}
                          </div>
                          
                          <h3 className="text-xl font-medium text-slate-900 tracking-tight mb-4 group-hover:text-indigo-600 transition-colors">
                             {notice.title}
                          </h3>
                          
                          <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6 line-clamp-2 lg:line-clamp-none">
                             {notice.content}
                          </p>

                          <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                             <div className="flex -space-x-2">
                                {[1,2,3].map(j => (
                                   <div key={j} className="h-6 w-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-600">
                                      HS
                                   </div>
                                ))}
                                <span className="text-[10px] font-bold text-slate-400 ml-4">+124 parents read</span>
                             </div>
                             
                             <Button variant="ghost" className="h-10 px-6 rounded-2xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 font-medium group/btn">
                                Mark as Read
                                <ChevronRight className="size-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                             </Button>
                          </div>
                       </div>
                    </div>
                 </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Helpful Hint */}
      <div className="bg-indigo-600 rounded-[32px] p-8 lg:p-12 text-white relative overflow-hidden group">
         <motion.div 
            className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
         />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
               <h4 className="text-2xl font-medium tracking-tight mb-3">Enable Push Notifications</h4>
               <p className="text-indigo-100 text-sm font-medium leading-relaxed opacity-80">
                  Stay updated instantly! Grant permission to receive school letters and emergency alerts directly on your device.
               </p>
            </div>
            <Button className="bg-white text-indigo-600 hover:bg-slate-100 h-12 px-8 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-black/10">
               <Sparkles className="size-4 mr-2" /> Allow Notifications
            </Button>
         </div>
      </div>
    </div>
  );
}
