import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout";
import { studentsSeed, feesSeed, marksSeed, currency } from "@/primaryschool/src/data/mockData";

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
  BookOpen, ClipboardList,
  AlertCircle, GraduationCap, Star,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, subText, icon: Icon,
  iconBg, iconColor, progress, progressColor, trend,
}: {
  label: string; value: string | number; subText: string;
  icon: React.ElementType; iconBg: string; iconColor: string;
  progress?: number; progressColor?: string;
  trend?: { val: string; up: boolean };
}) {
  return (
    <Card className="shadow-sm border-border bg-card group hover:border-primary/50 hover:shadow-md transition-all overflow-hidden relative">
      <CardContent className="p-3.5 sm:p-6 flex flex-col sm:block items-center text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-3 sm:mb-4 w-full gap-2 sm:gap-0">
          <div className={cn("h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl flex items-center justify-center border shrink-0", iconBg)}>
            <Icon size={14} className={cn("sm:w-[17px] sm:h-[17px]", iconColor)} />
          </div>
          {trend && (
            <span className={cn(
              "flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold rounded-full px-1.5 sm:px-2 py-0.5 border shrink-0",
              trend.up
                ? "text-emerald-600 bg-emerald-50 border-emerald-200 shadow-sm shadow-emerald-100/50"
                : "text-rose-600 bg-rose-50 border-rose-200"
            )}>
              {trend.up ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
              {trend.val}
            </span>
          )}
        </div>
        <div className="w-full">
          <p className="text-lg sm:text-2xl font-bold text-foreground tracking-tight leading-none group-hover:text-primary transition-colors">
            {value}
          </p>
          <p className="text-[11px] sm:text-[13px] text-muted-foreground mt-1.5 font-medium truncate">{label}</p>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground/70 mt-0.5 uppercase tracking-wider truncate opacity-70">{subText}</p>
        </div>
        {progress !== undefined && (
          <div className="mt-3 sm:mt-4 w-full">
            <Progress
              value={progress}
              className={cn("h-1.5 bg-slate-100", progressColor ?? "[&>div]:bg-indigo-500 shadow-inner")}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortalDashboard() {
  const navigate = useNavigate();
  const student = studentsSeed[0];
  const fees = feesSeed.filter((f) => f.studentId === student.id);
  const paid = fees.reduce((s, f) => s + f.amount, 0);
  const marks = marksSeed.filter((m) => m.studentId === student.id);
  const avgScore = marks.length
    ? Math.round(marks.reduce((t, m) => t + m.score, 0) / marks.length)
    : 0;
  const topSubject = [...marks].sort((a, b) => b.score - a.score)[0];
  const feesCleared = student.balance === 0;

  return (
    <div className="space-y-6">

      {/* ── Welcome Banner ──────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[24px] bg-card border border-border/60 p-6 sm:p-8 text-foreground shadow-sm">
        {/* Modern decorative patterns */}
        <div className="absolute top-0 right-0 h-full w-1/3 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234338ca' fill-opacity='1'%3E%3Cpath d='M0 0h20L0 20z'/%3E%3C/g%3E%3C/svg%3E\")" }}
        />
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-indigo-50/40 pointer-events-none blur-3xl" />
        <div className="absolute -bottom-16 right-1/4 w-48 h-48 rounded-full bg-violet-50/50 pointer-events-none blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
          {/* Avatar + high-end status ring */}
          <div className="relative shrink-0">
            <div className="p-1 px-1.5 rounded-full bg-white shadow-xl shadow-indigo-100/50 ring-1 ring-slate-100">
              <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-white">
                <AvatarImage src={student.photo} className="object-cover" />
                <AvatarFallback className="text-2xl font-bold text-indigo-700 bg-indigo-50">
                  {student.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute bottom-1 right-2 h-5 w-5 rounded-full bg-emerald-500 border-[3px] border-white shadow-lg flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          {/* Info context */}
          <div className="flex-1 text-center md:text-left pt-1">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="h-[1px] w-4 bg-indigo-200 hidden md:block" />
              <p className="text-indigo-600 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em]">
                Student Portal
              </p>
            </div>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-foreground tracking-tight leading-tight mb-4">
              Hello, <span className="text-primary">{student.name.split(" ")[0]}</span> 👋
            </h2>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <Badge variant="secondary" className="bg-slate-50 text-slate-500 border border-slate-100 h-6 px-3 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                {student.klass}
              </Badge>
              <Badge variant="secondary" className="bg-slate-50 text-slate-500 border border-slate-100 h-6 px-3 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                ID: {student.admission}
              </Badge>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 border h-6 px-3 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                Active Enrollment
              </Badge>
            </div>
          </div>

          {/* Performance Insight (Desktop Only) */}
          <div className="hidden lg:flex flex-col items-center justify-center gap-1.5 bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50 shrink-0 self-center">
            <CircularProgress value={avgScore} size={64} stroke={5} color="#4F46E5">
              <span className="text-sm font-bold text-slate-800">{avgScore}%</span>
            </CircularProgress>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Score Avg</p>
          </div>

          {/* Quick Connect (Desktop Only) */}
          <div className="hidden md:flex lg:flex-col gap-2 shrink-0 self-center">
            <Button size="sm"
              onClick={() => navigate("/parent-and-student-portal/results")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 text-[11px] font-bold h-9 gap-2 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
              View Results <ArrowUpRight size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        <StatCard
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
          subText={`Paid: ${currency(paid)}`}
          icon={CreditCard}
          iconBg="bg-slate-50 border-slate-100"
          iconColor={feesCleared ? "text-indigo-600" : "text-slate-600"}
          progress={Math.round((paid / (paid + student.balance)) * 100)}
          progressColor="[&>div]:bg-indigo-600"
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
                    <span className="text-[10px] font-semibold text-amber-700">Top: {topSubject.subject}</span>
                  </div>
                )}
                <Button variant="ghost" size="sm"
                  onClick={() => navigate("/parent-and-student-portal/results")}
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
                  <TableHead className="pl-6 text-[10px] font-semibold uppercase tracking-wider text-slate-400 py-3">Subject</TableHead>
                  <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 py-3">Score</TableHead>
                  <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 py-3">Grade</TableHead>
                  <TableHead className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 py-3">Progress</TableHead>
                  <TableHead className="pr-6 text-[10px] font-semibold uppercase tracking-wider text-slate-400 py-3 text-right">Status</TableHead>
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
                        <Badge variant="outline" className={cn("text-[11px] font-semibold border px-2", grade.cls)}>
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
                        <span className={cn("text-[11px] font-semibold", perf.color)}>
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
                    <p className="text-sm font-semibold text-slate-900">School Notices</p>
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
                        <p className="text-[11px] font-semibold text-slate-900 border-l-2 border-indigo-500 pl-2">Fee Balance Due</p>
                        <p className="text-[10px] text-slate-500 mt-1 leading-relaxed pl-2">
                          {currency(student.balance)} remaining.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Calendar size={12} className="text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[11px] font-semibold text-indigo-900">PTA General Meeting</p>
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
                  <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Quick Access</p>
                  <div className="h-1 w-8 bg-indigo-100 rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Results", icon: Trophy, color: "text-indigo-600", bg: "bg-indigo-50", border: "hover:border-indigo-200", shadow: "hover:shadow-indigo-50", href: "/parent-and-student-portal/results" },
                    { label: "Attendance", icon: ClipboardList, color: "text-emerald-600", bg: "bg-emerald-50", border: "hover:border-emerald-200", shadow: "hover:shadow-emerald-50", href: "/parent-and-student-portal/attendance" },
                    { label: "Fees", icon: CreditCard, color: "text-amber-600", bg: "bg-amber-50", border: "hover:border-amber-200", shadow: "hover:shadow-amber-50", href: "/parent-and-student-portal/fees" },
                    { label: "Profile", icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-50", border: "hover:border-purple-200", shadow: "hover:shadow-purple-50", href: "/parent-and-student-portal/profile" },
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
                        <span className="text-[13px] font-bold text-slate-800 group-hover:text-slate-900 block">{l.label}</span>
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
          <Card className="shadow-sm border-slate-200/80 overflow-hidden group">
            <CardHeader className="p-0">
               <div className="flex items-center justify-between px-5 pt-5 pb-4 bg-gradient-to-r from-amber-50 to-bg-card">
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">Partner Features</CardTitle>
                  <CardDescription className="text-xs text-amber-600 font-medium">Exclusive offers for EduCore parents</CardDescription>
                </div>
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Star size={14} className="fill-amber-600" />
                </div>
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="p-0 relative">
              <div className="w-full bg-slate-100 relative overflow-hidden border-b border-slate-100">
                <img 
                  src="/wap2.png" 
                  alt="Partner Promotion" 
                  className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <p className="text-white text-[10px] font-bold uppercase tracking-wider mb-1">New Partner Deal</p>
                  <p className="text-white/80 text-[9px] font-medium leading-tight">Click to explore exclusive savings on school supplies and more.</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50/50">
                <Button className="w-full h-9 bg-slate-900 hover:bg-black text-white text-[11px] font-bold rounded-xl gap-2 shadow-lg shadow-slate-200 transition-all active:scale-95">
                  Learn More <ArrowUpRight size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>





        </div>
      </div>
    </div>
  );
}

 
