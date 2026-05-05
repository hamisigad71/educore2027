import { FeatureHeader } from "@/components/portal/FeatureHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Trophy, Music, Palette, Code, 
  MapPin, Calendar,
  Star, ChevronRight, Plus, Sparkles,
  Search, Filter, Users
} from "lucide-react";

const ACTIVITIES = [
  { id: 1, name: "Robotics & AI Club", category: "Technology", schedule: "Tuesdays, 4:00 PM", location: "Innovation Hub", members: 24, status: "Joined", coach: "Mr. Felix Otieno", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60" },
  { id: 2, name: "School Symphony Orchestra", category: "Music", schedule: "Wednesdays, 3:30 PM", location: "Music Hall", members: 38, status: "Joined", coach: "Ms. Isabella Rossi", image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=60" },
  { id: 3, name: "Varsity Football Team", category: "Sports", schedule: "Mon & Fri, 4:15 PM", location: "Main Field", members: 22, status: "Recommended", coach: "Coach Hassan", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&auto=format&fit=crop&q=60" },
  { id: 4, name: "Digital Arts & Design", category: "Art", schedule: "Thursdays, 4:00 PM", location: "Art Studio", members: 16, status: "Open", coach: "Mrs. Elena Vance", image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800&auto=format&fit=crop&q=60" },
];

export default function PortalActivities() {
  return (
    <div className="space-y-8 pb-12">
      <FeatureHeader 
        title="Co-curricular Activities" 
        description="Explore clubs, sports teams, and artistic societies. A vibrant space to discover talents beyond the classroom."
        badge="Engagement & Talent"
        icon={<Trophy className="size-8 text-indigo-400" />}
        actions={
          <Button className="bg-indigo-600 hover:bg-black text-white shadow-lg shadow-indigo-100 gap-2 font-medium h-11 px-8 rounded-2xl group transition-all">
            <Plus size={18} /> Join New Club
          </Button>
        }
      />

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
         {[
           { label: "Sports", icon: Trophy, count: 12, color: "text-amber-500", bg: "bg-amber-50" },
           { label: "Music", icon: Music, count: 8, color: "text-indigo-600", bg: "bg-indigo-50" },
           { label: "Tech", icon: Code, count: 6, color: "text-emerald-600", bg: "bg-emerald-50" },
           { label: "Arts", icon: Palette, count: 10, color: "text-rose-600", bg: "bg-rose-50" },
           { label: "Drama", icon: Users, count: 4, color: "text-violet-600", bg: "bg-violet-50" },
         ].map((cat) => (
           <Card key={cat.label} className="border-slate-200/60 shadow-soft bg-white/50 backdrop-blur-sm rounded-[24px] group hover:bg-white hover:shadow-xl transition-all duration-300">
              <CardContent className="p-5 text-center">
                 <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110", cat.bg)}>
                    <cat.icon className={cn("size-6", cat.color)} />
                 </div>
                 <p className="text-[14px] font-medium text-slate-900 leading-none mb-1">{cat.label}</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cat.count} Clubs</p>
              </CardContent>
           </Card>
         ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
         {/* My Activities List */}
         <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between px-1">
               <h4 className="text-[13px] font-bold text-slate-400 uppercase tracking-widest">Ongoing Activities</h4>
               <div className="flex items-center gap-4">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-slate-400" />
                     <input type="text" placeholder="Search..." className="bg-white border border-slate-200 rounded-xl pl-8 pr-4 py-1.5 text-[11px] font-medium w-48 outline-none focus:border-indigo-300" />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400">
                     <Filter size={14} />
                  </Button>
               </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
               {ACTIVITIES.map((act) => (
                  <Card key={act.id} className="border-slate-200/60 shadow-soft bg-white rounded-[32px] overflow-hidden group hover:shadow-xl transition-all duration-500">
                     <CardContent className="p-0">
                        <div className="h-44 w-full relative overflow-hidden">
                           <img src={act.image} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt={act.name} />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                           <Badge className={cn(
                             "absolute top-4 right-4 border-0 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-xl shadow-lg",
                             act.status === "Joined" ? "bg-emerald-500 text-white" : 
                             act.status === "Recommended" ? "bg-indigo-600 text-white" : "bg-white/20 backdrop-blur-md text-white"
                           )}>
                              {act.status}
                           </Badge>
                           <div className="absolute bottom-4 left-6 right-6">
                              <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em] mb-1">{act.category}</p>
                              <h5 className="text-lg font-medium text-white tracking-tight leading-tight">{act.name}</h5>
                           </div>
                        </div>
                        
                        <div className="p-6 space-y-4">
                           <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center gap-2">
                                 <Calendar className="size-3.5 text-slate-400" />
                                 <span className="text-[11px] font-medium text-slate-500">{act.schedule}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                 <MapPin className="size-3.5 text-slate-400" />
                                 <span className="text-[11px] font-medium text-slate-500">{act.location}</span>
                              </div>
                           </div>
                           
                           <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                              <div className="flex items-center gap-2">
                                 <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">JC</div>
                                 <span className="text-[10px] font-medium text-slate-400">Led by {act.coach.split(' ')[1]}</span>
                              </div>
                              <Button variant="ghost" className="h-8 px-4 rounded-xl text-indigo-600 hover:bg-indigo-50 font-bold text-[10px] uppercase tracking-widest group/btn">
                                 Details <ChevronRight size={14} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                              </Button>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>

         {/* Achievements / Highlights */}
         <div className="w-full lg:w-80 space-y-6">
            <Card className="border-indigo-100 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-[32px] overflow-hidden p-8 shadow-2xl shadow-indigo-200/40">
               <Sparkles className="size-8 text-indigo-200 mb-6" />
               <h4 className="text-xl font-medium tracking-tight mb-4">Achievements</h4>
               <div className="space-y-6">
                  {[
                    { title: "Young Scientist", year: "2024", icon: Star },
                    { title: "Music Talent Honored", year: "2023", icon: Trophy },
                  ].map((ach, i) => (
                    <div key={i} className="flex gap-4">
                       <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                          <ach.icon size={18} className="text-indigo-200" />
                       </div>
                       <div>
                          <p className="text-[13px] font-medium text-white mb-0.5">{ach.title}</p>
                          <p className="text-[10px] font-bold text-indigo-100/40 uppercase tracking-widest leading-none">{ach.year}</p>
                       </div>
                    </div>
                  ))}
               </div>
               <Button className="w-full mt-10 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest h-10 rounded-xl backdrop-blur-md">
                  View All Awards
               </Button>
            </Card>

            <div className="p-8 rounded-[32px] border border-dashed border-slate-300 bg-slate-50/50 flex flex-col items-center text-center">
               <Users className="size-10 text-slate-200 mb-4" />
               <h5 className="text-[14px] font-medium text-slate-800 mb-2">Connect with Peers</h5>
               <p className="text-[12px] text-slate-500 font-medium leading-relaxed mb-6">
                  Join a community of like-minded students and share your passions.
               </p>
               <Button variant="outline" className="border-slate-300 text-slate-600 font-bold text-[10px] uppercase tracking-widest rounded-xl px-6 h-10">
                  Find a Buddy
               </Button>
            </div>
         </div>
      </div>
    </div>
  );
}
