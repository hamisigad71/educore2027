import React from "react";
import { useNavigate } from "react-router-dom";
// components
import { PageHeader } from "@/components/layout";
import PaymentFlow from "./components/PaymentFlow";
import { studentsSeed, feesSeed, marksSeed, currency } from "../../data/mockData";
import { getParentChildren, getStudentFees, getStudentExamResults, getStudentAttendance } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

// lucide
import {
  Trophy, Calendar, CreditCard, Layers,
  Bell, ChevronRight, TrendingUp, TrendingDown,
  BookOpen, ClipboardList, CheckCircle2,
  AlertCircle, Info, GraduationCap, Star,
  ArrowUpRight, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// ─── helpers ─────────────────────────────────────────────────────────────────

function gradeLabel(score: number) {
  if (score >= 80) return { label: "A", cls: "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100" };
  if (score >= 70) return { label: "B", cls: "bg-slate-100 text-slate-700 border-slate-200" };
  if (score >= 60) return { label: "C", cls: "bg-slate-50 text-slate-500 border-slate-100" };
  return { label: "D", cls: "bg-rose-50 text-rose-600 border-rose-100" };
}

function performanceLabel(score: number) {
  if (score >= 80) return { text: "Elite", color: "text-indigo-600" };
  if (score >= 70) return { text: "Good", color: "text-slate-600" };
  if (score >= 60) return { text: "Average", color: "text-slate-500" };
  return { text: "Support Needed", color: "text-rose-500" };
}

// ─── Circular Progress ───────────────────────────────────────────────────────

function CircularProgress({
  value, size = 72, stroke = 5, color = "#4F46E5", children,
}: {
  value: number; size?: number; stroke?: number;
  color?: string; children?: React.ReactNode;
}) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, subText, icon: Icon,
  iconBg = "bg-white", iconColor = "text-foreground",
  progress, progressColor, trend,
  variant = "light",
  onClick,
}: {
  label: string; value: string | number; subText?: string; icon: any;
  iconBg?: string; iconColor?: string;
  progress?: number; progressColor?: string;
  trend?: { val: string; up: boolean };
  variant?: "light" | "darkBlue";
  onClick?: () => void;
}) {
  const isDark = variant === "darkBlue";
  
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      onClick={onClick}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn("h-full", onClick && "cursor-pointer")}
    >
      <Card className={cn(
        "h-full relative overflow-hidden group transition-all duration-500 rounded-[28px]",
        isDark 
          ? "border-white/10 bg-indigo-700 shadow-[0_20px_50px_-12px_rgba(67,56,202,0.4)]"
          : "border-slate-100 bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)]"
      )}>
        {/* Grain Overlay (Dark Mode Only) */}
        {isDark && (
          <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        )}

        <CardContent className={cn("p-5 h-full flex flex-col relative z-10", isDark ? "text-white" : "text-slate-900")}>
          {/* Header row */}
          <div className="flex items-center justify-between mb-auto">
            <p className={cn(
              "text-[10px] sm:text-[11px] font-medium uppercase tracking-widest opacity-60",
              isDark ? "text-slate-300" : "text-slate-500"
            )}>{label}</p>
            <div className={cn(
              "h-9 w-9 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-110",
              isDark ? "bg-white/10 border-white/20" : cn("bg-slate-50 border-slate-100", iconBg)
            )}>
              <Icon size={16} className={isDark ? "text-white" : iconColor} />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-medium tracking-tight">{value}</h3>
              {trend && (
                <span className={cn(
                  "text-[10px] font-medium flex items-center gap-0.5",
                  trend.up ? "text-emerald-500" : "text-rose-500"
                )}>
                  {trend.up ? "↑" : "↓"}{trend.val}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-1">
              <p className={cn("text-[11px] font-medium opacity-70", isDark ? "text-slate-200" : "text-slate-500")}>
                {subText}
              </p>
              {progress !== undefined && (
                <span className="text-[10px] font-medium opacity-60">{progress}%</span>
              )}
            </div>
          </div>

          {progress !== undefined && (
            <div className="mt-4">
              <Progress 
                value={progress} 
                className={cn(
                  "h-1.5 rounded-full overflow-hidden bg-slate-100", 
                  isDark ? "[&>div]:bg-white shadow-inner" : progressColor
                )} 
              />
            </div>
          )}

          {/* Decorative Sparkline for Dark Variant */}
          {isDark && (
            <div className="absolute bottom-0 left-0 right-0 h-10 opacity-20 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                <path d="M0 35 Q 20 25, 40 30 T 80 10 T 100 20" fill="none" stroke="white" strokeWidth="2" />
              </svg>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Demo Data (used when no real Supabase account) ────────────────────────────

const DEMO_STUDENT = {
  id: "demo",
  name: "Brian Mwangi",
  admission: "HS/2026/019",
  klass: "Form 3 East",
  balance: 12000,
  attendance: 89,
  photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeZ-Wgcii4q-7z1rQuFYsU7nwL5bqyrNO0ut_-kyw1KslCT6lca_nqh-8f&s=10",
};

const DEMO_MARKS = [
  { subject: "Mathematics",  score: 84, grade: "A-" },
  { subject: "English",      score: 78, grade: "B+" },
  { subject: "Biology",      score: 90, grade: "A+" },
  { subject: "Chemistry",    score: 75, grade: "B" },
  { subject: "Physics",      score: 82, grade: "A-" },
  { subject: "History",      score: 70, grade: "B" },
];

const DEMO_FEES = { totalPaid: 28000, balance: 12000 };
const DEMO_ATTENDANCE = { rate: 89 };

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortalDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [payOpen, setPayOpen] = React.useState(false);
  const [childData, setChildData] = React.useState<any>(null);
  const [liveFees, setLiveFees] = React.useState<any>(null);
  const [liveMarks, setLiveMarks] = React.useState<any[]>([]);
  const [liveAttendance, setLiveAttendance] = React.useState<any>(null);

  // Detect demo session: demo users have no Supabase UUID (no user.id)
  const isDemo = !user?.id;

  React.useEffect(() => {
    if (isDemo) return; // skip API calls for demo sessions
    async function loadData() {
      try {
        const children = await getParentChildren();
        if (children && children.length > 0) {
          const mainChild = children[0];
          setChildData(mainChild);
          const [fData, mData, aData] = await Promise.all([
            getStudentFees(mainChild.id),
            getStudentExamResults(mainChild.id),
            getStudentAttendance(mainChild.id)
          ]);
          setLiveFees(fData);
          setLiveMarks(mData);
          setLiveAttendance(aData);
        }
      } catch (err) {
        console.error("Parent portal dashboard fetch error:", err);
      }
    }
    loadData();
  }, [isDemo]);

  // Use demo data for demo sessions, live data for real users
  const student = isDemo ? DEMO_STUDENT : childData ? {
    id: childData.id,
    name: childData.name,
    admission: childData.admissionNumber,
    klass: childData.className || "Unassigned",
    balance: liveFees?.balance || 0,
    attendance: liveAttendance?.rate || 0,
    photo: user?.photo || "",
  } : {
    id: "new",
    name: user?.name || "Student",
    admission: "Pending Admission",
    klass: "Unassigned",
    balance: 0,
    attendance: 0,
    photo: user?.photo || "",
  };

  const rawMarks = isDemo ? DEMO_MARKS : childData ? liveMarks : [];
  const marks = isDemo ? DEMO_MARKS : rawMarks.map((m: any) => ({
    subject: m.subjectName || m.subject,
    score: m.marks ?? m.score,
    grade: m.grade
  }));

  const paid = isDemo ? DEMO_FEES.totalPaid : childData ? (liveFees?.totalPaid || 0) : 0;
  const avgScore = marks.length
    ? Math.round(marks.reduce((t: number, m: any) => t + (m.score || 0), 0) / marks.length)
    : 0;
  const topSubject = [...marks].sort((a: any, b: any) => b.score - a.score)[0];
  const feesCleared = student.balance === 0;

  return (
    <>
      <div className="space-y-6">

      {/* ── Welcome Banner (Glass3D) ──────────────────────────────────────────── */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-[40px] bg-white/70 backdrop-blur-3xl border-2 border-slate-200 sm:border sm:border-white/50 p-6 sm:p-10 text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.04),0_0_1px_rgba(255,255,255,1)_inset]"
      >
        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Drifting Orbs */}
        <motion.div 
          animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-indigo-200/20 pointer-events-none blur-[100px]" 
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 right-1/4 w-96 h-96 rounded-full bg-violet-200/20 pointer-events-none blur-[120px]" 
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Avatar + Welcome text + Badges */}
          <div className="lg:col-span-8 flex flex-col sm:flex-row items-start text-left gap-6">
            {/* Avatar + Status */}
            <div className="relative shrink-0">
              <div className="p-1 px-[5px] rounded-full bg-white/90 backdrop-blur-xl shadow-xl shadow-indigo-100/50 ring-1 ring-black/5">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-4 border-white shadow-inner">
                  <AvatarImage src={student.photo} className="object-cover" />
                  <AvatarFallback className="text-3xl font-medium text-indigo-700 bg-indigo-50">
                    {student.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute -bottom-0.5 right-2 h-7 w-7 rounded-full bg-emerald-500 border-4 border-white shadow-lg flex items-center justify-center">
                <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            {/* Identity */}
            <div className="space-y-3">
              <div className="flex flex-col items-start gap-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Student Portal</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mt-1">
                  Hello, <span className="text-indigo-600 font-extrabold">{user?.name?.split(" ")[0] || student.name.split(" ")[0]}</span> 👋
                </h2>
              </div>
              <p className="text-sm text-slate-500 max-w-xl font-medium leading-relaxed">
                Welcome back to your dashboard. You are all set for today. Below is a summary of your academic achievements, attendance, and latest school announcements.
              </p>
              
              <div className="flex flex-wrap items-center justify-start gap-2 pt-2">
                <div className="bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-100 shadow-sm flex items-center gap-2 text-slate-600 hover:border-indigo-150 transition-colors">
                  <BookOpen size={12} className="text-indigo-500" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">{student.klass}</span>
                </div>
                <div className="bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-100 shadow-sm flex items-center gap-2 text-slate-600 hover:border-indigo-150 transition-colors">
                  <GraduationCap size={12} className="text-indigo-500" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">ID: {student.admission}</span>
                </div>
                <div className="bg-emerald-50/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-100/50 shadow-sm flex items-center gap-2 text-emerald-700 hover:border-emerald-200 transition-colors">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Active Enrollment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Term Progress Widget */}
          <div className="lg:col-span-4 w-full">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-5 rounded-3xl shadow-[0_10px_35px_-5px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                    <Calendar size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Session Info</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Term 2 Progress</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-indigo-650 bg-indigo-50/80 px-2 py-0.5 rounded-md border border-indigo-100">
                  Week 8/12
                </span>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                  <span>Term Completion</span>
                  <span className="text-slate-700">65%</span>
                </div>
                <Progress value={65} className="h-1.5 bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-indigo-600" />
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-200/40">
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-slate-400" />
                  <span className="text-[10px] text-slate-500 font-medium">Daily Schedule Status:</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">On Track</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Stats Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          label="Attendance Rate" 
          value={`${student.attendance}%`} 
          subText="Current Session"
          icon={Calendar} 
          variant="darkBlue"
          progress={student.attendance}
          trend={{ val: "+2%", up: true }}
        />
        <StatCard
          label="Average Score" value={`${avgScore}%`} subText="All subjects · Term 2"
          icon={Trophy} iconBg="bg-slate-50 border-slate-100" iconColor="text-indigo-600"
          progress={avgScore} progressColor="[&>div]:bg-indigo-600"
          trend={{ val: avgScore >= 70 ? "+5%" : "-3%", up: avgScore >= 70 }}
        />
        <StatCard
          label="Learning Group" value={student.klass} subText="Current secondary level"
          icon={Layers} iconBg="bg-slate-50 border-slate-100" iconColor="text-indigo-600"
        />
        <StatCard
          label="Fees Status"
          value={feesCleared ? "Cleared" : currency(student.balance)}
          subText={feesCleared ? "No balance" : "Pay Now"}
          icon={CreditCard}
          iconBg="bg-slate-50 border-slate-100"
          iconColor={feesCleared ? "text-indigo-600" : "text-slate-600"}
          progress={Math.round((paid / (paid + student.balance)) * 100)}
          progressColor="[&>div]:bg-indigo-600"
          onClick={!feesCleared ? () => setPayOpen(true) : undefined}
        />
      </div>

      {/* ── Main Grid ───────────────────────────────────────────────── */}
      <div className="grid gap-5 lg:grid-cols-3">

        {/* Academic Results Table */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200/80">
          <CardHeader className="p-0">
            <div className="flex items-center justify-between px-6 pt-5 pb-4">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900">Academic Performance</CardTitle>
                <CardDescription className="text-sm text-slate-500 mt-0.5">Term 2 · Unit Assessments</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {topSubject && (
                  <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
                    <Star size={11} className="text-amber-500" />
                    <span className="text-[10px] font-medium text-amber-700">Top: {topSubject.subject}</span>
                  </div>
                )}
                <Button variant="ghost" size="sm"
                  onClick={() => navigate("/highschool/parent-and-student-portal/results")}
                  className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-8 gap-1">
                  View all <ChevronRight size={12} />
                </Button>
              </div>
            </div>
            <Separator />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-100">
                  <TableHead className="pl-6 text-[10px] font-medium uppercase tracking-wider text-slate-400 py-3">Subject</TableHead>
                  <TableHead className="text-[10px] font-medium uppercase tracking-wider text-slate-400 py-3">Score</TableHead>
                  <TableHead className="text-[10px] font-medium uppercase tracking-wider text-slate-400 py-3">Form</TableHead>
                  <TableHead className="text-[10px] font-medium uppercase tracking-wider text-slate-400 py-3">Progress</TableHead>
                  <TableHead className="pr-6 text-[10px] font-medium uppercase tracking-wider text-slate-400 py-3 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marks.map((m, i) => {
                  const grade = gradeLabel(m.score);
                  const perf = performanceLabel(m.score);
                  return (
                    <TableRow key={i} className="hover:bg-slate-50/60 border-b border-slate-100/80 transition-colors group">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            <BookOpen size={13} className="text-slate-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800 tracking-tight">{m.subject}</p>
                            <p className="text-[10px] text-slate-400">Internal Assessment</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-sm font-medium text-slate-900">{m.score}</span>
                        <span className="text-xs text-slate-400">/100</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className={cn("text-[11px] font-medium border px-2", grade.cls)}>
                          {grade.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 w-[120px]">
                        <div className="space-y-1">
                          <Progress value={m.score}
                            className={cn("h-1.5 bg-slate-100",
                              m.score >= 80 ? "[&>div]:bg-indigo-600"
                              : "[&>div]:bg-indigo-500/60"
                            )}
                          />
                          <p className="text-[10px] text-slate-400">{m.score}%</p>
                        </div>
                      </TableCell>
                      <TableCell className="pr-6 py-4 text-right">
                        <span className={cn("text-[11px] font-medium", perf.color)}>
                          {perf.text}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Summary row */}
            <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50/60 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <GraduationCap size={13} className="text-slate-400" />
                  <span className="text-xs text-slate-500">{marks.length} subjects</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-emerald-500" />
                  <span className="text-xs text-slate-500">Class avg: 68%</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-medium">Overall avg:</span>
                <span className="text-sm font-semibold text-indigo-600">{avgScore}%</span>
              </div>
            </div>

            <Separator />

            {/* Relocated Sections */}
            <div className="grid md:grid-cols-2 gap-0 border-t border-slate-100">
              {/* School Notices Section */}
              <div className="p-5 border-r border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">School Notices</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Latest announcements</p>
                  </div>
                  <div className="relative">
                    <Bell size={14} className="text-slate-400" />
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-rose-500 border-2 border-white" />
                  </div>
                </div>
                <div className="space-y-3">
                  {student.balance > 0 && (
                    <div className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <AlertCircle size={12} className="text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-medium text-slate-900 border-l-2 border-indigo-500 pl-2">Fee Balance Due</p>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed pl-2 mb-2">
                          {currency(student.balance)} remaining.
                        </p>
                        <Button 
                          onClick={() => setPayOpen(true)}
                          variant="link" 
                          className="h-auto p-0 text-indigo-600 text-[10px] font-medium uppercase tracking-wider pl-2"
                        >
                          Pay Balance →
                        </Button>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Calendar size={12} className="text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-medium text-indigo-900">PTA General Meeting</p>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                        Saturday, 9:00 AM · Main Hall
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm"
                    className="w-full text-[10px] text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1 h-7">
                    All Notices <ChevronRight size={10} />
                  </Button>
                </div>
              </div>

              {/* Quick Access Section */}
              <div className="p-6 bg-white">
                <div className="flex items-center justify-between mb-5 px-1">
                  <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-slate-400">Quick Access</p>
                  <div className="h-1 w-8 bg-indigo-100 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Results", icon: Trophy, color: "text-indigo-600", bg: "bg-indigo-50", border: "hover:border-indigo-200", shadow: "hover:shadow-indigo-50", href: "/highschool/parent-and-student-portal/results" },
                    { label: "Attendance", icon: ClipboardList, color: "text-emerald-600", bg: "bg-emerald-50", border: "hover:border-emerald-200", shadow: "hover:shadow-emerald-50", href: "/highschool/parent-and-student-portal/attendance" },
                    { label: "Fees", icon: CreditCard, color: "text-amber-600", bg: "bg-amber-50", border: "hover:border-amber-200", shadow: "hover:shadow-amber-50", href: "/highschool/parent-and-student-portal/fees" },
                    { label: "Profile", icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-50", border: "hover:border-purple-200", shadow: "hover:shadow-purple-50", href: "/highschool/parent-and-student-portal/profile" },
                  ].map((l) => (
                    <button key={l.href}
                      onClick={() => navigate(l.href)}
                      className={cn(
                        "flex flex-col items-start gap-3 w-full p-4 rounded-2xl transition-all duration-300",
                        "border border-slate-100 bg-white group text-left",
                        "hover:shadow-lg hover:-translate-y-1",
                        l.border, l.shadow
                      )}
                    >
                      <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110", l.bg)}>
                        <l.icon size={16} className={l.color} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[13px] font-medium text-slate-800 group-hover:text-slate-900 block">{l.label}</span>
                        <span className="text-[9px] text-slate-400 font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          View details <ChevronRight size={8} />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-5">

          {/* Marketing Card */}
                  {/* Second Marketing Card (wapp1.png) */}
          <Card className="shadow-sm border-slate-200/80 overflow-hidden group">
            <CardHeader className="p-0">
               <div className="flex items-center justify-between px-5 pt-5 pb-4 bg-gradient-to-r from-indigo-50 to-bg-card">
                <div>
                  <CardTitle className="text-base font-medium text-slate-900">Scholarship Hub</CardTitle>
                  <CardDescription className="text-xs text-indigo-600 font-medium">Apply for upcoming 2027 grants</CardDescription>
                </div>
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <GraduationCap size={14} className="fill-indigo-600" />
                </div>
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="p-0 relative">
              <div className="w-full bg-slate-100 relative overflow-hidden border-b border-slate-100">
                <img 
                  src="/wapp1.png" 
                  alt="Scholarship Opportunities" 
                  className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white text-[10px] font-medium uppercase tracking-wider mb-1">Grant Applications Open</p>
                  <p className="text-white/80 text-[9px] font-medium leading-tight">Secure your child's future with our exclusive partner scholarship programs.</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50/50">
                <Button className="w-full h-9 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-medium rounded-xl gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95">
                  Explore Grants <ArrowUpRight size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    
    <PaymentFlow 
      open={payOpen} 
      onOpenChange={setPayOpen} 
      studentName={student.name} 
    />
    </>
  );
}

// tiny helper icon component to avoid import issues
function BarChartIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="18" y="3" width="4" height="18"/><rect x="10" y="8" width="4" height="13"/><rect x="2" y="13" width="4" height="8"/></svg>;
} 
