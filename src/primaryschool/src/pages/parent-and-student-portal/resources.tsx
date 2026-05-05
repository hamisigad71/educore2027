import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FeatureHeader } from "@/components/portal/FeatureHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Search, BookOpen, FileText, Video, 
  ChevronRight, Bookmark, GraduationCap,
  Library, Clock, PlayCircle, Star
} from "lucide-react";

const RESOURCES = [
  { id: 1, title: "English Grammar: Tenses & Structures", type: "notes", subject: "English", size: "2.4 MB", date: "2 days ago", rating: 4.8 },
  { id: 2, title: "Mathematics: Algebra Basics Part 1", type: "video", subject: "Mathematics", duration: "12:45", date: "1 week ago", rating: 4.9 },
  { id: 3, title: "End of Term 1 Science Past Paper", type: "paper", subject: "Science", year: "2024", date: "3 weeks ago", rating: 4.7 },
  { id: 4, title: "Social Studies: Modern History Summary", type: "notes", subject: "Social Studies", size: "1.8 MB", date: "4 days ago", rating: 4.5 },
  { id: 5, title: "Introduction to Calculus (Advanced Path)", type: "video", subject: "Mathematics", duration: "18:20", date: "1 month ago", rating: 4.8 },
  { id: 6, title: "Kiswahili: Mashairi na Insha", type: "notes", subject: "Kiswahili", size: "3.1 MB", date: "5 days ago", rating: 4.6 },
];

export default function PortalResources() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = RESOURCES.filter(item => {
    if (activeTab !== "all" && item.type !== activeTab) return false;
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      <FeatureHeader 
        title="Learning Hub" 
        description="A premium digital library designed to empower your learning journey with class notes, past papers, and instructional videos."
        badge="Digital Library"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-medium h-10 px-6 rounded-2xl backdrop-blur-md">
              <Bookmark className="size-4 mr-2" /> Bookmarks
            </Button>
          </div>
        }
      />

      {/* Stats / Quick Info */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Resources", value: "248+", icon: Library, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "New this week", value: "12", icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Hours of Video", value: "45h", icon: PlayCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Enrolled in", value: "8 Subjects", icon: GraduationCap, color: "text-violet-600", bg: "bg-violet-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-slate-200/60 shadow-soft bg-white/50 backdrop-blur-sm rounded-3xl group overflow-hidden">
             <CardContent className="p-5 flex items-center gap-4">
                <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center shrink-0", stat.bg)}>
                  <stat.icon className={cn("size-5", stat.color)} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                  <p className="text-xl font-medium text-slate-900 tracking-tight leading-none">{stat.value}</p>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white border border-slate-200/60 p-4 rounded-[32px] shadow-soft">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Items", icon: BookOpen },
            { id: "notes", label: "Class Notes", icon: FileText },
            { id: "paper", label: "Past Papers", icon: Library },
            { id: "video", label: "Video Lessons", icon: Video },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300",
                activeTab === tab.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100/50" 
                  : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <Input 
            placeholder="Search resources..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-11 bg-slate-50/50 border-slate-200 rounded-2xl font-medium focus:ring-2 focus:ring-slate-900/10 transition-all text-sm"
          />
        </div>
      </div>

      {/* Resource Grid */}
      <motion.div 
        layout 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="border-slate-200/60 shadow-soft bg-white group hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-500 rounded-[32px] overflow-hidden">
                <CardContent className="p-0">
                  {/* Thumbnail / Header */}
                  <div className={cn(
                    "h-32 flex items-center justify-center relative bg-gradient-to-br transition-all duration-500",
                    item.type === "video" ? "from-indigo-600 to-indigo-700" : 
                    item.type === "notes" ? "from-slate-800 to-slate-900" : 
                    "from-emerald-600 to-emerald-700"
                  )}>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl group-hover:scale-110 transition-transform duration-500">
                      {item.type === "video" ? <PlayCircle className="text-white size-10" /> : 
                       item.type === "notes" ? <FileText className="text-white size-10" /> : 
                       <BookOpen className="text-white size-10" />}
                    </div>
                    
                    {/* Floating subject badge */}
                    <Badge className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white border-0 text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-xl">
                      {item.subject}
                    </Badge>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-1.5">
                          <Star className="size-3 text-amber-400 fill-amber-400" />
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.rating}</span>
                       </div>
                       <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Clock className="size-3" /> {item.date}
                       </span>
                    </div>
                    
                    <h3 className="text-[15px] font-medium text-slate-900 leading-tight mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="text-[11px] font-medium text-slate-500">
                        {item.type === "video" ? item.duration : item.size || item.year}
                      </div>
                      <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 font-medium group/btn">
                         {item.type === "video" ? "Watch Now" : "Download"}
                         <ChevronRight className="size-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="py-20 text-center bg-white border border-slate-200/60 rounded-[32px]">
           <Library className="size-16 text-slate-200 mx-auto mb-6" />
           <h3 className="text-xl font-medium text-slate-800 mb-2">No results found</h3>
           <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium">
             Try adjusting your search or filters to find what you're looking for.
           </p>
        </div>
      )}
    </div>
  );
}
