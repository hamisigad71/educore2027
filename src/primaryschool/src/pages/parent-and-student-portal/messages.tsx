import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FeatureHeader } from "@/components/portal/FeatureHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Send, Users, Search, Phone, Video, 
  MoreHorizontal, Paperclip, Smile,
  CheckCheck, ShieldCheck
} from "lucide-react";

const TEACHERS = [
  { id: 1, name: "Mrs. Sarah Johnson", role: "Class Teacher", subject: "English", status: "online", lastMsg: "Please ensure Tim's homework is submitted by tomorrow.", time: "10:24 AM", unread: 1, avatar: "SJ" },
  { id: 2, name: "Mr. David Chen", role: "Subject Teacher", subject: "Mathematics", status: "offline", lastMsg: "The algebra test results have been posted.", time: "Yesterday", unread: 0, avatar: "DC" },
  { id: 3, name: "Ms. Linda Mwangi", role: "Subject Teacher", subject: "Science", status: "online", lastMsg: "Great project work from Tim today!", time: "09:15 AM", unread: 0, avatar: "LM" },
];

const MESSAGES = [
  { id: 1, side: "left", text: "Good morning! I wanted to check on Tim's progress in English.", time: "09:00 AM" },
  { id: 2, side: "right", text: "Good morning! Tim is doing exceptionally well. He's showing great interest in creative writing.", time: "09:05 AM" },
  { id: 3, side: "left", text: "That's wonderful to hear. Are there any specific books you recommend for him?", time: "09:10 AM" },
  { id: 4, side: "right", text: "Absolutely. I'll send over a list of age-appropriate titles this afternoon.", time: "09:12 AM" },
  { id: 5, side: "right", text: "Please ensure Tim's homework is submitted by tomorrow.", time: "10:24 AM", isLatest: true },
];

export default function PortalMessages() {
  const [activeTeacher, setActiveTeacher] = useState(TEACHERS[0]);
  const [message, setMessage] = useState("");

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col gap-6">
      <FeatureHeader 
        title="Teacher Chat" 
        description="Connect directly with subject teachers and school staff. Secure, real-time communication regarding your child's progress."
        badge="Messaging"
        icon={<Users className="size-8 text-indigo-400" />}
        className="mb-0"
      />

      <div className="flex-1 flex gap-6 min-h-0">
         {/* Teachers List sidebar */}
         <Card className="w-80 border-slate-200/60 shadow-soft bg-white rounded-[32px] overflow-hidden flex flex-col shrink-0">
            <div className="p-6 border-b border-slate-100">
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input placeholder="Search teachers..." className="pl-9 h-10 bg-slate-50 border-slate-200 rounded-xl font-medium text-xs" />
               </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
               {TEACHERS.map(teacher => (
                  <button
                    key={teacher.id}
                    onClick={() => setActiveTeacher(teacher)}
                    className={cn(
                      "w-full p-4 rounded-2xl flex gap-3 transition-all duration-300 text-left group",
                      activeTeacher.id === teacher.id 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100/50" 
                        : "hover:bg-slate-50"
                    )}
                  >
                     <div className="relative">
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm",
                          activeTeacher.id === teacher.id ? "bg-white/10 text-white" : "bg-indigo-50 text-indigo-600"
                        )}>
                           {teacher.avatar}
                        </div>
                        {teacher.status === "online" && (
                          <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                        )}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                           <h5 className="text-[13px] font-medium truncate">{teacher.name}</h5>
                           <span className={cn(
                             "text-[9px] font-bold uppercase",
                             activeTeacher.id === teacher.id ? "text-white/40" : "text-slate-400"
                           )}>{teacher.time}</span>
                        </div>
                        <p className={cn(
                          "text-[10px] font-medium truncate mb-1",
                          activeTeacher.id === teacher.id ? "text-white/60" : "text-slate-400"
                        )}>{teacher.role} • {teacher.subject}</p>
                        <p className={cn(
                          "text-[11px] truncate leading-tight",
                          activeTeacher.id === teacher.id ? "text-white/80" : "text-slate-500"
                        )}>{teacher.lastMsg}</p>
                     </div>
                     {teacher.unread > 0 && activeTeacher.id !== teacher.id && (
                       <div className="h-4 w-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center mt-1">
                          {teacher.unread}
                       </div>
                     )}
                  </button>
               ))}
            </div>
         </Card>

         {/* Chat Interface */}
         <Card className="flex-1 border-slate-200/60 shadow-soft bg-white rounded-[32px] overflow-hidden flex flex-col">
            {/* Chat Header */}
            <div className="px-8 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                     {activeTeacher.avatar}
                  </div>
                  <div>
                     <h4 className="text-[15px] font-medium text-slate-900 leading-tight">{activeTeacher.name}</h4>
                     <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Online & Responsive</span>
                     </div>
                  </div>
               </div>
               <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-slate-50">
                    <Phone size={18} />
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-slate-50">
                    <Video size={18} />
                  </Button>
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 text-slate-400 hover:bg-slate-100">
                    <MoreHorizontal size={18} />
                  </Button>
               </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/20">
               <div className="text-center mb-8">
                  <Badge variant="outline" className="bg-white border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-1 rounded-full">
                     Conversation started June 05, 2024
                  </Badge>
               </div>

               <AnimatePresence>
                  {MESSAGES.map(msg => (
                     <motion.div
                       key={msg.id}
                       initial={{ opacity: 0, x: msg.side === 'left' ? -20 : 20 }}
                       animate={{ opacity: 1, x: 0 }}
                       className={cn(
                         "flex flex-col max-w-[80%]",
                         msg.side === 'right' ? "ml-auto items-end" : "items-start"
                       )}
                     >
                        <div className={cn(
                          "px-5 py-3.5 rounded-3xl text-[14px] font-medium leading-relaxed shadow-sm",
                          msg.side === 'right' 
                            ? "bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-tr-none shadow-md shadow-indigo-100" 
                            : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                        )}>
                           {msg.text}
                        </div>
                        <div className="flex items-center gap-2 mt-2 px-1">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{msg.time}</span>
                           {msg.side === 'right' && <CheckCheck size={12} className="text-indigo-500" />}
                        </div>
                     </motion.div>
                  ))}
               </AnimatePresence>
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-slate-100">
               <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-[28px] p-2 pl-6">
                  <Input 
                    placeholder="Type your message..." 
                    className="border-0 bg-transparent focus-visible:ring-0 px-0 h-10 text-[14px] font-medium placeholder:text-slate-400"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="flex items-center gap-1 group">
                     <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-white transition-all">
                        <Smile size={20} />
                     </Button>
                     <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-white transition-all">
                        <Paperclip size={20} />
                     </Button>
                     <Button className={cn(
                       "h-10 px-6 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all",
                       message.trim() ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-slate-200 text-slate-400"
                     )}>
                        <Send size={16} className="mr-2" /> Send
                     </Button>
                  </div>
               </div>
               
               <div className="flex items-center gap-2 mt-3 px-2">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                     End-to-end encrypted communication
                  </p>
               </div>
            </div>
         </Card>
      </div>
    </div>
  );
}
