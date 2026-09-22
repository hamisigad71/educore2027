import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout";
import { studentsSeed, feesSeed, marksSeed, currency } from "@/primaryschool/src/data/mockData";
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
  AlertCircle, GraduationCap, Star,
  ArrowUpRight, Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { PaymentFlow } from "./components/PaymentFlow";

// ─── helpers ─────────────────────────────────────────────────────────────────

function gradeLabel(score: number) {
  if (score >= 80) return { label: "A", cls: "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/10" };
  if (score >= 70) return { label: "B", cls: "bg-secondary text-secondary-foreground border-border" };
  if (score >= 60) return { label: "C", cls: "bg-muted text-muted-foreground border-border/50" };
  return { label: "D", cls: "bg-destructive/10 text-destructive border-destructive/20" };
}

function performanceLabel(score: number) {
  if (score >= 80) return { text: "Elite", color: "text-primary" };
  if (score >= 70) return { text: "Good", color: "text-secondary-foreground" };
  if (score >= 60) return { text: "Average", color: "text-muted-foreground" };
  return { text: "Support Needed", color: "text-destructive" };
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

// ─── Sparkline ────────────────────────────────────────────────────────────────
function Sparkline({ color = "#818cf8" }: { color?: string }) {
  return (
    <div className="absolute inset-x-0 bottom-0 h-12 overflow-hidden pointer-events-none opacity-40">
      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          d="M0 35 Q 10 30, 20 32 T 40 25 T 60 28 T 80 20 T 100 22 L 100 40 L 0 40 Z"
          fill={`url(#gradient-${color.replace("#", "")})`}
          stroke={color}
          strokeWidth="1.5"
        />
        <defs>
          <linearGradient id={`gradient-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

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
            )}>
              {isDark ? `TODAY'S ${label.split(" ")[0]}` : label}
            </p>
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110",
              isDark ? "bg-white/10 text-white" : iconBg + " " + iconColor
            )}>
              <Icon size={isDark ? 14 : 18} />
            </div>
          </div>

          {/* Value Section */}
          <div className="mt-4 mb-8">
            <p className={cn(
              "text-2xl sm:text-3xl font-medium tracking-tight",
              isDark ? "text-white" : "text-slate-900"
            )}>
              {value}
            </p>
          </div>

          {/* Bottom row / Sparkline area */}
          <div className="flex items-end justify-between relative">
            {trend && (
              <span className={cn(
                "flex items-center gap-1.5 text-[10px] font-medium rounded-full px-2.5 py-1 transition-all",
                trend.up
                  ? (isDark ? "text-emerald-400 bg-emerald-500/20" : "text-emerald-600 bg-emerald-50")
                  : (isDark ? "text-rose-400 bg-rose-500/20" : "text-rose-600 bg-rose-50")
              )}>
                {trend.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {trend.val}
                <span className="opacity-50 font-normal ml-0.5">vs yesterday</span>
              </span>
            )}
            
            {!isDark && progress !== undefined && (
              <p className="text-[10px] text-slate-400 font-medium italic opacity-70 mb-1">{subText}</p>
            )}
          </div>

          {isDark && <Sparkline color="#a2a9ff" />}
          
          {!isDark && progress !== undefined && (
            <div className="mt-3 w-full">
              <Progress
                value={progress}
                className={cn("h-1.5 bg-slate-50 [&>div]:bg-indigo-600 shadow-none", progressColor)}
              />
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
  name: "Amani Otieno",
  admission: "ADM/2026/042",
  klass: "Grade 5 Blue",
  balance: 8500,
  attendance: 92,
  photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeZ-Wgcii4q-7z1rQuFYsU7nwL5bqyrNO0ut_-kyw1KslCT6lca_nqh-8f&s=10",
};

const DEMO_MARKS = [
  { subject: "Mathematics",    score: 88, grade: "A" },
  { subject: "English",        score: 76, grade: "B+" },
  { subject: "Science",        score: 91, grade: "A+" },
  { subject: "Social Studies", score: 72, grade: "B" },
  { subject: "Kiswahili",     score: 80, grade: "A-" },
];

const DEMO_FEES = { totalPaid: 16500, balance: 8500 };
const DEMO_ATTENDANCE = { rate: 92 };

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
        className="relative overflow-hidden rounded-[40px] bg-white/70 backdrop-blur-3xl border-2 border-slate-200 sm:border sm:border-white/50 p-6 sm:p-10 text-foreground shadow-[0_20px_50px_rgba(0,0,0,0.04),0_0_1px_rgba(255,255,255,1)_inset]"
      >
        {/* Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        {/* Drifting Orbs */}
        <motion.div
          className="absolute rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none"
          style={{ width: 400, height: 400, top: "-10%", right: "-10%" }}
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full bg-violet-500/5 blur-[80px] pointer-events-none"
          style={{ width: 300, height: 300, bottom: "-10%", left: "10%" }}
          animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-2">
          {/* Left Column: Avatar + Welcome text + Badges */}
          <div className="lg:col-span-8 flex flex-col sm:flex-row items-start text-left gap-6">
            {/* Centered Avatar + status ring */}
            <div className="relative shrink-0">
              <div className="p-1 rounded-full bg-white shadow-2xl shadow-indigo-150 ring-1 ring-slate-100">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-[6px] border-white shadow-inner">
                  <AvatarImage src={student.photo} className="object-cover" />
                  <AvatarFallback className="text-3xl font-medium text-indigo-650 bg-indigo-50/50">
                    {student.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute bottom-1 right-1.5 h-6 w-6 rounded-full bg-emerald-500 border-[4px] border-white shadow-lg flex items-center justify-center">
                <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            {/* Info */}
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
                Welcome back to your school portal! Explore your subjects, live academic dashboard grades, attendance tracking, and latest school announcements below.
              </p>
              
              <div className="flex flex-wrap items-center justify-start gap-2 pt-2">
                <Badge variant="secondary" className="bg-white hover:bg-white text-slate-600 border border-slate-100 h-8 px-4 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-colors">
                  <BookOpen size={11} className="text-indigo-500" />
                  {student.klass}
                </Badge>
                <Badge variant="secondary" className="bg-white hover:bg-white text-slate-600 border border-slate-100 h-8 px-4 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-colors">
                  <GraduationCap size={11} className="text-indigo-500" />
                  ID: {student.admission}
                </Badge>
                <Badge className="bg-[#00c07f] hover:bg-[#00c07f] text-white border-none h-8 px-4 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md shadow-emerald-100 flex items-center gap-1.5 transition-all">
                  <CheckCircle2 size={11} className="text-white" />
                  Active Enrollment
                </Badge>
              </div>
            </div>
          </div>

          {/* Right Column: Term Progress Widget */}
          <div className="lg:col-span-4 w-full">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-5 rounded-3xl shadow-[0_10px_35px_-5px_rgba(0,0,0,0.03)] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-650 border border-indigo-100 shadow-sm">
                    <Calendar size={14} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Session Info</h4>
                    <p className="text-[10px] text-slate-400 font-medium">Term 2 Progress</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                  Week 8/12
                </span>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                  <span>Term Completion</span>
                  <span className="text-slate-700">65%</span>
                </div>
                <Progress value={65} className="h-1.5 bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-indigo-500 [&>div]:to-indigo-650" />
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-slate-200/40">
                <div className="flex items-center gap-1.5">
                  <Clock size={12} className="text-slate-400" />
                  <span className="text-[10px] text-slate-500 font-medium">Daily Schedule Status:</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-650 bg-emerald-50 px-2 py-0.5 rounded-md">On Track</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Stats Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          variant="darkBlue"
          label="Attendance Rate" value={`${student.attendance}%`} subText="Present this term"
          icon={Calendar} iconBg="bg-slate-50 border-slate-100" iconColor="text-indigo-600"
          progress={student.attendance} progressColor="[&>div]:bg-indigo-600"
          trend={{ val: "+2%", up: true }}
        />
        <StatCard
          label="Average Score" value={`${avgScore}%`} subText="All subjects · Term 2"
          icon={Trophy} iconBg="bg-slate-50 border-slate-100" iconColor="text-indigo-600"
          progress={avgScore} progressColor="[&>div]:bg-indigo-600"
          trend={{ val: avgScore >= 70 ? "+5%" : "-3%", up: avgScore >= 70 }}
        />
        <StatCard
          label="Learning Group" value={student.klass} subText="Current active class"
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

        {/* Academic Results Table (Glass3D) */}
        <Card className="lg:col-span-2 shadow-2xl border-slate-100 bg-white/80 backdrop-blur-xl overflow-hidden group relative">
          {/* Grain Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          <CardHeader className="p-0 relative z-10">
            <div className="flex items-center justify-between px-6 pt-6 pb-5">
              <div>
                <CardTitle className="text-lg font-medium text-slate-900 tracking-tight">Academic Performance</CardTitle>
                <CardDescription className="text-xs text-indigo-600 font-medium uppercase tracking-widest mt-1">Term 2 · Live Insights</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {topSubject && (
                  <div className="hidden sm:flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-1.5 shadow-sm">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-medium text-indigo-700 tracking-tight whitespace-nowrap">Elite: {topSubject.subject}</span>
                  </div>
                )}
                <Button variant="ghost" size="sm"
                  onClick={() => navigate("/parent-and-student-portal/results")}
                  className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 h-9 gap-1.5 border border-transparent hover:border-indigo-100 rounded-xl transition-all">
                  Full Analytics <ChevronRight size={13} />
                </Button>
              </div>
            </div>
            <Separator className="bg-slate-100" />
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-100">
                  <TableHead className="pl-6 text-[10px] font-medium uppercase tracking-wider text-slate-400 py-3">Subject</TableHead>
                  <TableHead className="text-[10px] font-medium uppercase tracking-wider text-slate-400 py-3">Score</TableHead>
                  <TableHead className="text-[10px] font-medium uppercase tracking-wider text-slate-400 py-3">Grade</TableHead>
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
                <span className="text-sm font-medium text-indigo-600">{avgScore}%</span>
              </div>
            </div>

            <Separator />

            {/* Relocated Sections (Glass3D Harmonized) */}
            <div className="grid md:grid-cols-2 gap-0 border-t border-slate-100">
              {/* School Notices Section (Glass3D) */}
              <div className="p-6 border-r border-slate-100 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <p className="text-[13px] font-medium text-slate-900 tracking-tight">School Notices</p>
                      <p className="text-[10px] text-indigo-600 font-medium uppercase tracking-widest mt-0.5">Live Updates</p>
                    </div>
                    <div className="relative h-8 w-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                      <Bell size={14} className="text-indigo-600" />
                      <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-indigo-500 border-2 border-white shadow-sm animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {student.balance > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-3 p-3.5 rounded-2xl bg-rose-50/50 border border-rose-100 shadow-sm"
                      >
                        <AlertCircle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-[11px] font-medium text-rose-900 uppercase tracking-tight">Finance Alert</p>
                          <p className="text-[10px] text-rose-700 mt-1 leading-relaxed">
                            Outstanding balance: {currency(student.balance)}
                          </p>
                          <Button 
                            onClick={() => setPayOpen(true)}
                            variant="link" 
                            className="p-0 h-auto text-[10px] font-medium text-rose-600 uppercase tracking-wider mt-2 hover:no-underline hover:text-rose-700"
                          >
                            Pay Balance →
                          </Button>
                        </div>
                      </motion.div>
                    )}
                    <div className="flex gap-3 p-3.5 rounded-2xl bg-white border border-slate-100 shadow-sm group/item hover:border-indigo-200 transition-colors">
                      <Calendar size={14} className="text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[11px] font-medium text-slate-900 uppercase tracking-tight">PTA General Meeting</p>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                          Sat · 09:00 AM · Main Hall
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm"
                      className="w-full text-[11px] font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 gap-2 h-9 rounded-xl transition-all">
                      Archive <ChevronRight size={13} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Access Section (Glass3D) */}
              <div className="p-6 bg-slate-50/30 relative">
                <div className="flex items-center justify-between mb-6 px-1">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">Environment</p>
                  <div className="h-1 w-6 bg-indigo-200 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-3.5">
                  {[
                    { label: "Results", icon: Trophy, color: "text-indigo-600", bg: "bg-white", border: "hover:border-indigo-200", shadow: "hover:shadow-indigo-100", href: "/parent-and-student-portal/results" },
                    { label: "Attendance", icon: ClipboardList, color: "text-emerald-600", bg: "bg-white", border: "hover:border-emerald-200", shadow: "hover:shadow-emerald-100", href: "/parent-and-student-portal/attendance" },
                    { label: "Fees", icon: CreditCard, color: "text-amber-600", bg: "bg-white", border: "hover:border-amber-200", shadow: "hover:shadow-amber-100", href: "/parent-and-student-portal/fees" },
                    { label: "Profile", icon: GraduationCap, color: "text-purple-600", bg: "bg-white", border: "hover:border-purple-200", shadow: "hover:shadow-purple-100", href: "/parent-and-student-portal/profile" },
                  ].map((l, i) => (
                    <motion.button 
                      key={l.href}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 25 } }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => navigate(l.href)}
                      className={cn(
                        "flex flex-col items-center gap-3 w-full p-4 rounded-[22px] transition-all duration-300",
                        "border border-slate-100 shadow-sm group text-center",
                        l.bg, l.border, l.shadow
                      )}
                    >
                      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm", l.bg)}>
                        <l.icon size={17} className={l.color} />
                      </div>
                      <span className="text-[12px] font-medium text-slate-900 tracking-tight block">{l.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


        {/* Right column */}
        <div className="space-y-5">

          {/* Marketing Card (Glass3D) */}
          <Card className="shadow-2xl border-slate-100 bg-white/80 backdrop-blur-xl overflow-hidden group relative">
            {/* Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            
            <CardHeader className="p-0 relative z-10">
               <div className="flex items-center justify-between px-5 pt-6 pb-5 bg-gradient-to-r from-indigo-50 to-transparent">
                <div>
                  <CardTitle className="text-[15px] font-medium text-slate-900 tracking-tight">Partner Features</CardTitle>
                  <CardDescription className="text-[10px] text-indigo-600 font-medium uppercase tracking-widest mt-0.5">Exclusive Marketplace</CardDescription>
                </div>
                <div className="h-9 w-9 rounded-xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                  <Star size={16} className="fill-indigo-600" />
                </div>
              </div>
              <Separator className="bg-slate-100" />
            </CardHeader>
            <CardContent className="p-0 relative">
              <div className="w-full bg-slate-100 relative overflow-hidden border-b border-slate-100">
                <img 
                  src="/wapp1.png" 
                  alt="Partner Promotion" 
                  className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white text-[10px] font-medium uppercase tracking-wider mb-1">New Partner Deal</p>
                  <p className="text-white/80 text-[9px] font-medium leading-tight">Click to explore exclusive savings on school supplies and more.</p>
                </div>
              </div>
              <div className="p-5 bg-gradient-to-b from-transparent to-slate-50/50">
                <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-medium uppercase tracking-wider rounded-[18px] gap-2 shadow-xl shadow-indigo-100 transition-all active:scale-95">
                  Explore Hub <ArrowUpRight size={16} />
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
