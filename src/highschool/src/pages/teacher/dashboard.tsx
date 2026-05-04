
import { PageHeader } from "@/components/layout";
import { useAuth } from "@/context/AuthContext";
import { teachersSeed, studentsSeed } from "../../data/mockData";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkline } from "@/components/ui/charts";
import { Separator } from "@/components/ui/separator";

// lucide
import { 
  Users, BookOpen, CheckCircle2, Clock, 
  CalendarDays, MapPin, ChevronRight, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Stat Card ────────────────────────────────────────────────────────────────

function TeacherStatCard({
  label, value, subText, icon: Icon, color, sparkData
}: {
  label: string; value: string | number; subText: string; color: string;
  icon: any; sparkData: number[];
}) {
  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardContent className="p-3.5 sm:p-5">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className={cn("h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl flex items-center justify-center border", color)}>
            <Icon size={14} className="sm:size-[18px]" />
          </div>
          <div className="w-12 sm:w-16">
            <Sparkline data={sparkData} />
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none">{value}</p>
        <p className="text-[11px] sm:text-[13px] font-medium text-slate-500 mt-2">{label}</p>
        <p className="text-[9px] sm:text-[10px] text-slate-400 mt-1 font-medium italic leading-tight">{subText}</p>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const { user } = useAuth();
  const teacher = teachersSeed[0]; // mock logged-in teacher
  const myStudents = studentsSeed.filter((s) => teacher.classes.includes(s.klass));
  const avgPerf = Math.round(myStudents.reduce((t, s) => t + s.performance, 0) / (myStudents.length || 1));
  const avgAtt = Math.round(myStudents.reduce((t, s) => t + s.attendance, 0) / (myStudents.length || 1));

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Welcome, ${user?.name?.split(" ")[1] ?? "Teacher"} 👋`} 
        subtitle="Here's a snapshot of your classes and performance today" 
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <TeacherStatCard 
          label="Assigned Forms" value={teacher.classes.length} subText={teacher.classes.join(", ")}
          icon={BookOpen} color="bg-indigo-50 text-indigo-600 border-indigo-100" sparkData={[2, 2, 3, 3, 3]} />
        <TeacherStatCard 
          label="Total Students" value={myStudents.length} subText="High school candidates"
          icon={Users} color="bg-emerald-50 text-emerald-600 border-emerald-100" sparkData={[30, 32, 35, 34, 36]} />
        <TeacherStatCard 
          label="Class Average" value={`${avgPerf}%`} subText="Mock exam readiness"
          icon={Zap} color="bg-purple-50 text-purple-600 border-purple-100" sparkData={[72, 74, 73, 76, 74]} />
        <TeacherStatCard 
          label="Avg Attendance" value={`${avgAtt}%`} subText="Weekly secondary avg"
          icon={CheckCircle2} color="bg-amber-50 text-amber-600 border-amber-100" sparkData={[90, 92, 91, 94, 93]} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's lessons */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between px-6 py-5 border-b border-slate-50">
            <div>
              <CardTitle className="text-base font-semibold">Today's Schedule</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {new Date().toLocaleDateString("en-KE", { weekday: "long", month: "long", day: "numeric" })}
              </CardDescription>
            </div>
            <CalendarDays size={18} className="text-slate-400" />
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {[
              { time: "08:00 AM", class: "Form 4 West", subject: "Physics", room: "Lab 1", status: "Completed" },
              { time: "10:00 AM", class: "Form 3 North", subject: "Mathematics", room: "Rm 204", status: "In Progress" },
              { time: "02:00 PM", class: "Form 4 East", subject: "Chemistry", room: "Lab 2", status: "Upcoming" },
            ].map((x, i) => (
              <div key={i} className="group relative flex items-center justify-between rounded-2xl border border-slate-100 p-4 hover:bg-slate-50 hover:border-indigo-100 transition-all cursor-default">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-14 flex flex-col items-center justify-center rounded-xl bg-slate-50 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 border border-slate-100 group-hover:border-indigo-100 transition-all shrink-0">
                    <Clock size={14} className="mb-1" />
                    <span className="text-[10px] font-bold tracking-tight">{x.time.split(" ")[0]}</span>
                    <span className="text-[8px] uppercase font-bold">{x.time.split(" ")[1]}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-900">{x.class} — {x.subject}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <MapPin size={10} /> {x.room}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className={cn(
                  "text-[10px] font-bold h-6 px-2.5 rounded-full border-0",
                  x.status === "Completed" ? "bg-emerald-50 text-emerald-700" :
                  x.status === "In Progress" ? "bg-indigo-50 text-indigo-700 animate-pulse" :
                  "bg-slate-100 text-slate-500"
                )}>
                  {x.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-sm border-slate-200/80 overflow-hidden">
          <CardHeader className="px-6 py-5 border-b border-slate-50">
            <CardTitle className="text-base font-semibold">Instant Actions</CardTitle>
            <CardDescription className="text-xs">Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex flex-col gap-2.5">
            {[
              { label: "Enter Exam Marks", icon: "📝", desc: "Form students work" },
              { label: "Take Attendance", icon: "✅", desc: "Mark today's presence" },
              { label: "Performance Reports", icon: "📊", desc: "Download analytics" },
              { label: "Message Parents", icon: "💬", desc: "Send SMS or Email" },
            ].map((a, i) => (
              <button key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-white hover:bg-indigo-50 hover:border-indigo-100 transition-all text-left shadow-sm group">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{a.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-900">{a.label}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{a.desc}</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-400 transition-transgrade group-hover:translate-x-0.5" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
