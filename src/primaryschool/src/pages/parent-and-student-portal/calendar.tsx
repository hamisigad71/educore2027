import { motion } from "framer-motion";
import { FeatureHeader } from "@/components/portal/FeatureHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Calendar as CalendarIcon, Clock, MapPin, 
  ChevronLeft, ChevronRight, Plus,
  Users, Trophy, GraduationCap, Bell
} from "lucide-react";

const EVENTS = [
  { id: 1, title: "Parent Teacher Association Meeting", date: "2024-06-12", time: "09:00 AM", location: "Main Hall", category: "Meeting", color: "bg-indigo-600" },
  { id: 2, title: "Inter-School Swimming Gala", date: "2024-06-15", time: "10:30 AM", location: "Swimming Complex", category: "Sports", color: "bg-sky-600" },
  { id: 3, title: "Grade 4 Science Field Trip", date: "2024-06-20", time: "08:00 AM", location: "National Museum", category: "Academic", color: "bg-emerald-600" },
  { id: 4, title: "Term 2 Final Assessments Begin", date: "2024-07-01", time: "08:00 AM", location: "Various Classrooms", category: "Exam", color: "bg-rose-600" },
];

export default function PortalCalendar() {
  const currentMonth = "June 2024";

  // Simple grid for calendar (simulated)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const startDay = 5; // Friday

  return (
    <div className="space-y-8 pb-12">
      <FeatureHeader 
        title="School Calendar" 
        description="Stay synchronized with the school's pulse. Manage term dates, public holidays, sports events, and PTA meetings in one interactive view."
        badge="Events & Schedules"
        icon={<CalendarIcon className="size-8 text-indigo-400" />}
        actions={
          <Button className="bg-indigo-600 hover:bg-black text-white shadow-lg shadow-indigo-100 gap-2 font-medium h-11 px-8 rounded-2xl group transition-all">
            <Plus size={18} /> Add to Device
          </Button>
        }
      />

      <div className="grid gap-8 lg:grid-cols-3">
         {/* Calendar View Container */}
         <Card className="lg:col-span-2 border-slate-200/60 shadow-soft bg-white rounded-[32px] overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <h3 className="text-xl font-medium text-slate-900 tracking-tight">{currentMonth}</h3>
                  <div className="flex gap-1">
                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                        <ChevronLeft size={16} />
                     </Button>
                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                        <ChevronRight size={16} />
                     </Button>
                  </div>
               </div>
               <Badge className="bg-slate-50 text-slate-500 border-slate-200 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 h-auto rounded-xl">Today: June 05</Badge>
            </div>
            
            <CardContent className="p-8">
               {/* Calendar Grid Header */}
               <div className="grid grid-cols-7 gap-1 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                    <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest py-2">
                       {day}
                    </div>
                  ))}
               </div>
               
               {/* Calendar Days Grid */}
               <div className="grid grid-cols-7 gap-2">
                  {/* Empty slots for start day */}
                  {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square rounded-2xl bg-slate-50/30" />
                  ))}
                  
                  {daysInMonth.map(day => {
                    const dateStr = `2024-06-${day.toString().padStart(2, '0')}`;
                    const dayEvents = EVENTS.filter(e => e.date === dateStr);
                    const isToday = day === 5;
                    
                    return (
                      <div 
                        key={day} 
                        className={cn(
                          "aspect-square rounded-2xl border p-2 relative flex flex-col items-center justify-center transition-all duration-300 cursor-pointer group hover:border-indigo-200",
                          isToday ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-100" : "bg-white border-slate-100"
                        )}
                      >
                        <span className={cn(
                          "text-sm font-medium",
                          isToday ? "text-white" : "text-slate-600 group-hover:text-indigo-600"
                        )}>
                          {day}
                        </span>
                        
                        {/* Event Dot Indicators */}
                        {dayEvents.length > 0 && (
                          <div className="flex gap-0.5 mt-1">
                            {dayEvents.map(e => (
                              <div key={e.id} className={cn("size-1.5 rounded-full ring-1 ring-white", e.color)} />
                            ))}
                          </div>
                        )}

                        {/* Hover Overlay for specific events */}
                        {dayEvents.length > 0 && (
                          <div className="absolute inset-0 bg-indigo-600/90 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity flex items-center justify-center p-2 z-20">
                             <p className="text-[8px] font-bold text-white text-center leading-tight uppercase tracking-tighter">
                               {dayEvents[0].title}
                             </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
               </div>
            </CardContent>
         </Card>

         {/* Upcoming Events List */}
         <div className="space-y-6">
            <h4 className="text-[13px] font-bold text-slate-400 uppercase tracking-widest px-1">Upcoming Events</h4>
            <div className="space-y-4">
               {EVENTS.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="border-slate-200/60 shadow-soft bg-white hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 rounded-[32px] overflow-hidden group">
                       <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                             <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center text-white shrink-0", event.color)}>
                                {event.category === "Meeting" ? <Users size={18} /> : 
                                 event.category === "Sports" ? <Trophy size={18} /> : 
                                 event.category === "Academic" ? <GraduationCap size={18} /> : 
                                 <CalendarIcon size={18} />}
                             </div>
                             <div className="flex-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{event.category}</p>
                                <h5 className="text-[14px] font-medium text-slate-900 leading-tight truncate">{event.title}</h5>
                             </div>
                          </div>
                          
                          <div className="space-y-2.5">
                             <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                                <Clock size={12} className="text-slate-400" />
                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {event.time}
                             </div>
                             <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                                <MapPin size={12} className="text-slate-400" />
                                {event.location}
                             </div>
                          </div>
                          
                          <Button variant="ghost" className="w-full mt-4 h-9 rounded-xl text-indigo-600 hover:bg-indigo-50 font-bold text-[10px] uppercase tracking-widest">
                             View Details
                          </Button>
                       </CardContent>
                    </Card>
                  </motion.div>
               ))}
            </div>
            
            {/* Sync Notice */}
            <div className="p-6 rounded-[32px] border border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center text-center">
               <Bell className="size-8 text-slate-300 mb-4" />
               <p className="text-xs font-medium text-slate-500 leading-relaxed">
                  Want to stay updated? Synchronize the school calendar with your Google or Outlook account.
               </p>
               <Button variant="link" className="text-indigo-600 font-bold text-[11px] uppercase tracking-widest mt-2 p-0 h-auto">
                  Setup Sync <ChevronRight size={14} className="ml-1" />
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
}
