import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FeatureHeader } from "@/components/portal/FeatureHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Search, BookOpen, FileText, Video,
  Bookmark, GraduationCap, Library,
  PlayCircle, Star, Download, Clock,
  Sparkles, TrendingUp, ChevronRight
} from "lucide-react";

const RESOURCES = [
  { id: 1, title: "English Grammar: Tenses & Structures",   type: "notes", subject: "English",       size: "2.4 MB", date: "2 days ago",   rating: 4.8, downloads: 312 },
  { id: 2, title: "Mathematics: Algebra Basics Part 1",     type: "video", subject: "Mathematics",   duration: "12:45", date: "1 week ago", rating: 4.9, downloads: 489 },
  { id: 3, title: "End of Term 1 Science Past Paper",       type: "paper", subject: "Science",       year: "2024",   date: "3 weeks ago",  rating: 4.7, downloads: 621 },
  { id: 4, title: "Social Studies: Modern History Summary", type: "notes", subject: "Social Studies",size: "1.8 MB", date: "4 days ago",   rating: 4.5, downloads: 198 },
  { id: 5, title: "Introduction to Calculus (Advanced)",    type: "video", subject: "Mathematics",   duration: "18:20", date: "1 month ago",rating: 4.8, downloads: 274 },
  { id: 6, title: "Kiswahili: Mashairi na Insha",           type: "notes", subject: "Kiswahili",     size: "3.1 MB", date: "5 days ago",   rating: 4.6, downloads: 143 },
];

const TYPE_META = {
  notes: { label: "Class Notes", icon: FileText,   action: "Download",  gradient: "from-[#0A2540] to-[#0e3058]" },
  video: { label: "Video",       icon: PlayCircle, action: "Watch Now", gradient: "from-[#0A2540] to-[#082035]" },
  paper: { label: "Past Paper",  icon: BookOpen,   action: "Download",  gradient: "from-[#082035] to-[#0A2540]" },
};

export default function PortalResources() {
  const [activeTab, setActiveTab]     = useState("all");
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
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-medium h-10 px-6 rounded-2xl backdrop-blur-md">
            <Bookmark className="size-4 mr-2" /> Bookmarks
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Resources", value: "248+",      icon: Library,       accent: "bg-primary/10 text-primary"              },
          { label: "New This Week",   value: "12",         icon: Sparkles,      accent: "bg-chart-2/20 text-amber-600"            },
          { label: "Hours of Video",  value: "45h",        icon: PlayCircle,    accent: "bg-chart-1/10 text-chart-1"              },
          { label: "Subjects",        value: "8",          icon: GraduationCap, accent: "bg-primary/10 text-primary"              },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 shadow-soft hover:shadow-md transition-shadow">
            <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center shrink-0", s.accent)}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
              <p className="text-xl font-black text-foreground tracking-tight leading-none mt-0.5">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-card border border-border p-3 rounded-2xl shadow-soft">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all",   label: "All Items",     icon: BookOpen  },
            { id: "notes", label: "Class Notes",   icon: FileText  },
            { id: "paper", label: "Past Papers",   icon: Library   },
            { id: "video", label: "Video Lessons", icon: Video     },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-10 rounded-xl text-sm font-medium"
          />
        </div>
      </div>

      {/* Cards */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => {
            const meta = TYPE_META[item.type as keyof typeof TYPE_META];
            const Icon = meta.icon;

            return (
              <motion.div
                layout key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="group bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col">

                  {/* Thumbnail */}
                  <div className={cn("relative h-36 flex items-center justify-center overflow-hidden bg-gradient-to-br", meta.gradient)}>
                    {/* Decorative geometry */}
                    <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/5" />
                    <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/5" />
                    <div className="absolute top-4 left-6 h-6 w-6 rounded-full bg-white/8" />

                    {/* Accent stripe — chart-1 green */}
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-chart-1/60" />

                    {/* Center icon */}
                    <div className="relative z-10 h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Icon size={28} className="text-white" />
                    </div>

                    {/* Type pill — top left */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/30 backdrop-blur-md rounded-lg px-2.5 py-1">
                      <Icon size={10} className="text-white" />
                      <span className="text-white text-[10px] font-bold uppercase tracking-wider">{meta.label}</span>
                    </div>

                    {/* Subject badge — top right */}
                    <div className="absolute top-3 right-3 bg-chart-1/80 backdrop-blur-md rounded-lg px-2.5 py-1">
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">{item.subject}</span>
                    </div>

                    {/* Rating — bottom left */}
                    <div className="absolute bottom-4 left-3 flex items-center gap-1 bg-black/30 backdrop-blur-md rounded-lg px-2 py-1">
                      <Star size={9} className="text-chart-2 fill-chart-2" />
                      <span className="text-white text-[10px] font-bold">{item.rating}</span>
                    </div>

                    {/* Date — bottom right */}
                    <div className="absolute bottom-4 right-3 flex items-center gap-1 text-white/60">
                      <Clock size={9} />
                      <span className="text-[10px] font-medium">{item.date}</span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-4 gap-3">
                    <h3 className="text-[14px] font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                      {/* Meta pill */}
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-secondary text-secondary-foreground">
                          {item.type === "video" ? item.duration : (item as any).size ?? (item as any).year}
                        </span>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <TrendingUp size={11} />
                          <span className="text-[10px] font-medium">{item.downloads}</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <button className="flex items-center gap-1 text-[12px] font-bold text-primary group/btn">
                        {item.type === "video" ? <PlayCircle size={13} /> : <Download size={13} />}
                        <span className="group-hover/btn:underline">{meta.action}</span>
                        <ChevronRight size={11} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="py-24 text-center bg-card border border-border rounded-2xl">
          <Library className="size-14 text-muted-foreground/30 mx-auto mb-5" />
          <h3 className="text-lg font-bold text-foreground mb-1">No results found</h3>
          <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}
