
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getTeacherProfile, getTeacherStudents, TeacherProfile, StudentItem } from "@/lib/api";

import { teachersSeed, studentsSeed } from "@/primaryschool/src/data/mockData";
import { PageHeader } from "@/components/layout";
import { PostsFeed } from "@/components/posts/PostsFeed";


// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/ui/charts";

// lucide
import { 
  Users, BookOpen, CheckCircle2, Clock, 
  CalendarDays, MapPin, ChevronRight, Zap,
  MessageSquare, Star, ArrowUpRight, ListChecks,
  AlertCircle, TrendingUp
} from "lucide-react";
import { BarChart } from "@/components/ui/charts";
import { cn } from "@/lib/utils";

// ─── Stat Card (Vibrant Update) ───────────────────────────────

function TeacherStatCard({
  label, value, subText, icon: Icon, color, sparkData
}: {
  label: string; value: string | number; subText: string; color: string;
  icon: any; sparkData: number[];
}) {
  return (
    <Card className="shadow-sm border-border/50">
      <CardContent className="p-3.5 sm:p-5">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className={cn("h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl flex items-center justify-center border", color)}>
            <Icon size={14} className="sm:size-[18px]" />
          </div>
          <div className="w-12 sm:w-16">
            <Sparkline data={sparkData} />
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-none">{value}</p>
        <p className="text-[11px] sm:text-[13px] font-medium text-muted-foreground mt-2">{label}</p>
        <p className="text-[9px] sm:text-[10px] text-muted-foreground/60 mt-1 font-medium italic leading-tight">{subText}</p>
      </CardContent>
    </Card>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NOTICES = [
  { id: "1", title: "Term 3 Planning Meeting", time: "2:00 PM Today", dept: "Math Department", type: "urgent" },
  { id: "2", title: "New Grading Guidelines", time: "Yesterday", dept: "Academic Office", type: "info" },
];

const ASSESSMENTS = [
  { id: "1", title: "CAT 2 — Grade 5A", date: "May 12", days: "4 days left", status: "Ready" },
  { id: "2", title: "Final Marks Entry", date: "May 18", days: "10 days left", status: "Upcoming" },
];

const TASKS = [
  { id: "1", title: "Finalize Grade 6B lesson plan", done: false },
  { id: "2", title: "Review student leave requests", done: true },
  { id: "3", title: "Submit departmental report", done: false },
];

// [REMOVED ATTENDANCE_HEATMAP AS IT IS REPLACED BY IMAGE]

// ─── Sub-Components ───────────────────────────────────────────────────────────

// [REMOVED AttendanceGrid AS IT IS REPLACED BY IMAGE]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [teacherProfile, setTeacherProfile] = useState<TeacherProfile | null>(null);
  const [myStudents, setMyStudents] = useState<StudentItem[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const profile = await getTeacherProfile();
        if (profile) {
          setTeacherProfile(profile);
          const students = await getTeacherStudents(profile.classes);
          setMyStudents(students);
        }
      } catch (e) {
        console.error('Dashboard load error:', e);
      }
    }
    load();
  }, []);

  const teacher = teacherProfile ? teacherProfile : teachersSeed[0];
  const students = myStudents.length > 0 ? myStudents : studentsSeed.filter((s) => teachersSeed[0].classes.includes(s.klass));
  const avgPerf = students.length > 0 ? Math.round(students.reduce((t: any, s: any) => t + (s.performance || 75), 0) / students.length) : 0;
  const avgAtt = students.length > 0 ? Math.round(students.reduce((t: any, s: any) => t + (s.attendance_rate || s.attendance || 90), 0) / students.length) : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        variant="banner"
        title={`Hello, ${user?.name?.split(" ")[1] ?? "Teacher"} 👋`} 
        subtitle={getGreeting()} 
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <TeacherStatCard 
          label="Assigned Classes" value={teacher.classes?.length ?? 0} subText={teacher.classes?.join(", ")}
          icon={BookOpen} color="bg-primary/10 text-primary border-primary/20" sparkData={[2, 2, 3, 3, 3]} />
        <TeacherStatCard 
          label="Total Students" value={students.length} subText="Across all levels"
          icon={Users} color="bg-chart-1/10 text-chart-1 border-chart-1/20" sparkData={[30, 32, 35, 34, 36]} />
        <TeacherStatCard 
          label="Class Average" value={`${avgPerf}%`} subText="Term performance"
          icon={Zap} color="bg-chart-3/20 text-indigo-600 border-chart-3/30" sparkData={[72, 74, 73, 76, 74]} />
        <TeacherStatCard 
          label="Avg Attendance" value={`${avgAtt}%`} subText="Weekly attendance"
          icon={CheckCircle2} color="bg-chart-2/10 text-chart-2 border-chart-2/20" sparkData={[90, 92, 91, 94, 93]} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Row 1, Col 1-2: Performance Trend */}
        <Card className="lg:col-span-2 shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between px-6 py-5 border-b border-secondary/50">
            <div>
              <CardTitle className="text-base font-semibold">Student Performance Trend</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Class averages over the current term</CardDescription>
            </div>
            <TrendingUp size={18} className="text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-6">
            <BarChart 
              data={[78, 82, 75, 88, 92, 85]} 
              labels={["Jan", "Feb", "Mar", "Apr", "May", "Jun"]} 
            />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-sm border-border/50 overflow-hidden h-fit">
          <CardHeader className="px-6 py-5 border-b border-secondary/50">
            <CardTitle className="text-base font-semibold">Instant Actions</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex flex-col gap-3">
            {[
              { label: "Enter Exam Marks", icon: BookOpen, desc: "Grade students work", color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "Take Attendance", icon: ListChecks, desc: "Mark today's presence", color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Performance Reports", icon: TrendingUp, desc: "Download analytics", color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Message Parents", icon: MessageSquare, desc: "Send SMS or Email", color: "text-purple-600", bg: "bg-purple-50" },
            ].map((a, i) => (
              <button key={i} className="flex items-center justify-between p-3 rounded-[20px] border border-secondary/50 bg-card hover:bg-secondary/30 hover:border-primary/20 hover:shadow-sm transition-all text-left group">
                <div className="flex items-center gap-4">
                  <div className={cn("h-11 w-11 rounded-[14px] flex items-center justify-center shrink-0 border border-transparent group-hover:border-white transition-all shadow-sm", a.bg)}>
                    <a.icon size={20} className={a.color} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-foreground group-hover:text-primary transition-colors leading-tight">{a.label}</p>
                    <p className="text-[10px] text-muted-foreground font-medium mt-1">{a.desc}</p>
                  </div>
                </div>
                <div className="h-8 w-8 rounded-full flex items-center justify-center group-hover:bg-card shadow-transparent group-hover:shadow-soft transition-all">
                  <ChevronRight size={14} className="text-muted-foreground/40 group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Row 2, Col 1-2: Today's lessons */}
        <Card className="lg:col-span-2 shadow-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between px-6 py-5 border-b border-secondary/50">
            <div>
              <CardTitle className="text-base font-semibold">Today's Schedule</CardTitle>
              <CardDescription className="text-xs mt-0.5 text-muted-foreground">
                {new Date().toLocaleDateString("en-KE", { weekday: "long", month: "long", day: "numeric" })}
              </CardDescription>
            </div>
            <CalendarDays size={18} className="text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {[
              { time: "08:00 AM", class: "Grade 5A", subject: "Mathematics", room: "Rm 101", status: "Completed" },
              { time: "10:00 AM", class: "Grade 6B", subject: "Mathematics", room: "Rm 104", status: "In Progress" },
              { time: "02:00 PM", class: "Grade 5A", subject: "Revision", room: "Rm 101", status: "Upcoming" },
            ].map((x, i) => (
              <div key={i} className="group relative flex items-center justify-between rounded-2xl border border-secondary bg-card hover:bg-primary/5 hover:border-primary/20 transition-all cursor-default p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-14 flex flex-col items-center justify-center rounded-xl bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary border border-border/30 group-hover:border-primary/20 transition-all shrink-0">
                    <Clock size={14} className="mb-1" />
                    <span className="text-[10px] font-bold tracking-tight">{x.time.split(" ")[0]}</span>
                    <span className="text-[8px] uppercase font-bold">{x.time.split(" ")[1]}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{x.class} — {x.subject}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                      <MapPin size={10} /> {x.room}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className={cn(
                  "text-[10px] font-bold h-6 px-2.5 rounded-full border-0",
                  x.status === "Completed" ? "bg-chart-1/10 text-chart-1" :
                  x.status === "In Progress" ? "bg-primary/10 text-primary animate-pulse" :
                  "bg-secondary text-muted-foreground"
                )}>
                  {x.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Attendance Heatmap */}
        <Card className="shadow-sm border-border/50">
          <CardHeader className="px-6 py-5 border-b border-secondary/50">
            <CardTitle className="text-base font-semibold">EduCore Features</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Discover what's new in the portal</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6">
              <img 
                src="/wwap.png" 
                alt="Attendance Heatmap" 
                className="w-full object-contain rounded-xl"
              />
              <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100 mt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-orange-600 tracking-wider">Critical Day</p>
                    <p className="text-sm font-bold text-orange-700 mt-0.5">Thursday (45%)</p>
                  </div>
                  <AlertCircle className="text-orange-500" size={18} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Row 3: Notices, Assessments, Tasks */}
        <Card className="shadow-sm border-border/50">
          <CardHeader className="px-6 py-5 border-b border-secondary/50">
            <CardTitle className="text-base font-semibold">Department Notices</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">From Math & Science</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {NOTICES.map((n) => (
              <div key={n.id} className="p-3 rounded-xl border border-secondary bg-card hover:border-primary/20 transition-colors">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-sm font-bold text-foreground leading-tight">{n.title}</p>
                  {n.type === "urgent" && <Badge className="bg-destructive text-destructive-foreground border-0 text-[8px] h-4 px-1.5">Urgent</Badge>}
                </div>
                <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground">
                   <span className="font-semibold">{n.dept}</span>
                   <span>{n.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader className="px-6 py-5 border-b border-secondary/50">
            <CardTitle className="text-base font-semibold">Upcoming Assessments</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Next 14 days</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {ASSESSMENTS.map((a) => (
              <div key={a.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                     <Star size={14} className="fill-primary" />
                   </div>
                   <div>
                     <p className="text-xs font-bold text-foreground">{a.title}</p>
                     <p className="text-[10px] text-muted-foreground font-medium">{a.days}</p>
                   </div>
                </div>
                <span className="text-[11px] font-bold text-primary">{a.date}</span>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-[11px] h-8 text-muted-foreground hover:text-primary">
              View Calendar <ArrowUpRight size={12} className="ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50">
          <CardHeader className="px-6 py-5 border-b border-secondary/50">
            <CardTitle className="text-base font-semibold">Administrative Tasks</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Weekly chores</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            {TASKS.map((t) => (
              <div key={t.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/20 transition-colors group">
                <div className={cn(
                  "h-5 w-5 rounded border flex items-center justify-center transition-colors",
                  t.done ? "bg-chart-1 border-chart-1 text-white" : "border-border bg-card group-hover:border-primary"
                )}>
                  {t.done && <CheckCircle2 size={12} />}
                </div>
                <span className={cn(
                  "text-xs font-medium",
                  t.done ? "text-muted-foreground line-through" : "text-foreground"
                )}>{t.title}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ─── Posts Feed ───────────────────────────────────────────────────────── */}
      <div className="pt-4 mt-6 border-t border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-indigo-500" />
          School Feed
        </h2>
        <PostsFeed className="max-w-2xl mx-auto" />
      </div>
    </div>
  );
}
