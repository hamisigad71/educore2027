import React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout";
import { studentsSeed, feesSeed, marksSeed, currency } from "@/data/mockData";

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

// ─── helpers ─────────────────────────────────────────────────────────────────

function gradeLabel(score: number) {
  if (score >= 80) return { label: "A", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (score >= 70) return { label: "B", cls: "bg-indigo-50 text-indigo-700 border-indigo-200" };
  if (score >= 60) return { label: "C", cls: "bg-amber-50 text-amber-700 border-amber-200" };
  return { label: "D", cls: "bg-rose-50 text-rose-700 border-rose-200" };
}

function performanceLabel(score: number) {
  if (score >= 80) return { text: "Excellent", color: "text-emerald-600" };
  if (score >= 70) return { text: "Good", color: "text-indigo-600" };
  if (score >= 60) return { text: "Average", color: "text-amber-600" };
  return { text: "Needs Support", color: "text-rose-600" };
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
    <Card className="shadow-sm border-slate-200/80 bg-white group hover:border-indigo-200 hover:shadow-md transition-all overflow-hidden relative">
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
          <p className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight leading-none group-hover:text-indigo-700 transition-colors">
            {value}
          </p>
          <p className="text-[11px] sm:text-[13px] text-slate-600 mt-1.5 font-medium truncate">{label}</p>
          <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider truncate opacity-70">{subText}</p>
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
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-7 text-slate-900 shadow-sm">
        {/* Decorative orbs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-indigo-50 pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-40 h-40 rounded-full bg-violet-50/50 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-1/3 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='1'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")" }}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar + status */}
          <div className="relative shrink-0">
            <Avatar className="h-20 w-20 border-[3px] border-white shadow-xl ring-4 ring-indigo-50">
              <AvatarImage src={student.photo} className="object-cover" />
              <AvatarFallback className="text-xl font-bold text-indigo-700 bg-indigo-50">
                {student.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-indigo-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5">
              Student Portal · Dashboard
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight mb-3">
              Hello, {student.name.split(" ")[0]} 👋
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-0 py-1 px-2.5 text-[10px] font-bold uppercase tracking-widest">
                {student.klass}
              </Badge>
              <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-0 py-1 px-2.5 text-[10px] font-bold uppercase tracking-widest">
                ID: {student.admission}
              </Badge>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border py-1 px-2.5 text-[10px] font-bold uppercase tracking-widest">
                Active Enrollment
              </Badge>
            </div>
          </div>

          {/* Progress ring */}
          <div className="hidden xl:flex flex-col items-center gap-1 shrink-0">
            <CircularProgress value={avgScore} size={80} stroke={6} color="#4F46E5">
              <div className="text-center">
                <p className="text-lg font-bold text-indigo-600 leading-none">{avgScore}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Avg</p>
              </div>
            </CircularProgress>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Performance</p>
          </div>

          {/* Quick actions */}
          <div className="hidden lg:flex flex-col gap-2 shrink-0">
            <Button size="sm"
              onClick={() => navigate("/parent-and-student-portal/results")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm text-xs h-9 gap-1.5 px-5">
              <BarChartIcon /> View Results
            </Button>
            <Button size="sm"
              variant="outline"
              onClick={() => navigate("/parent-and-student-portal/fees")}
              className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 text-xs h-9 gap-1.5 px-5">
              <CreditCard size={12} /> Pay Fees
            </Button>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          label="Attendance Rate" value={`${student.attendance}%`} subText="Present this term"
          icon={Calendar} iconBg="bg-emerald-50 border-emerald-100" iconColor="text-emerald-600"
          progress={student.attendance} progressColor="[&>div]:bg-emerald-500"
          trend={{ val: "+2%", up: true }}
        />
        <StatCard
          label="Average Score" value={`${avgScore}%`} subText="All subjects · Term 2"
          icon={Trophy} iconBg="bg-indigo-50 border-indigo-100" iconColor="text-indigo-600"
          progress={avgScore} progressColor="[&>div]:bg-indigo-500"
          trend={{ val: avgScore >= 70 ? "+5%" : "-3%", up: avgScore >= 70 }}
        />
        <StatCard
          label="Learning Group" value={student.klass} subText="Current active class"
          icon={Layers} iconBg="bg-purple-50 border-purple-100" iconColor="text-purple-600"
        />
        <StatCard
          label="Fees Status"
          value={feesCleared ? "Cleared" : currency(student.balance)}
          subText={`Paid this term: ${currency(paid)}`}
          icon={CreditCard}
          iconBg={feesCleared ? "bg-emerald-50 border-emerald-100" : "bg-amber-50 border-amber-100"}
          iconColor={feesCleared ? "text-emerald-600" : "text-amber-600"}
          progress={Math.round((paid / (paid + student.balance)) * 100)}
          progressColor={feesCleared ? "[&>div]:bg-emerald-500" : "[&>div]:bg-amber-500"}
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
                              m.score >= 80 ? "[&>div]:bg-emerald-500"
                              : m.score >= 65 ? "[&>div]:bg-indigo-500"
                              : "[&>div]:bg-amber-500"
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
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-5">

          {/* School Notices */}
          <Card className="shadow-sm border-slate-200/80">
            <CardHeader className="p-0">
              <div className="flex items-center justify-between px-5 pt-5 pb-4">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900">School Notices</CardTitle>
                  <CardDescription className="text-sm text-slate-500 mt-0.5">Latest announcements</CardDescription>
                </div>
                <div className="relative">
                  <Bell size={16} className="text-slate-400" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-rose-500 border-2 border-white" />
                </div>
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {student.balance > 0 && (
                <div className="flex gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-100">
                  <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-900">Fee Balance Due</p>
                    <p className="text-[11px] text-amber-700/80 mt-0.5 leading-relaxed">
                      {currency(student.balance)} remaining. Clear before end of term.
                    </p>
                  </div>
                </div>
              )}
              <div className="flex gap-3 p-3.5 rounded-xl bg-indigo-50 border border-indigo-100">
                <Calendar size={14} className="text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-indigo-900">PTA General Meeting</p>
                  <p className="text-[11px] text-indigo-700/80 mt-0.5 leading-relaxed">
                    Saturday, 9:00 AM · Main Hall
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-emerald-900">Term 2 Finals</p>
                  <p className="text-[11px] text-emerald-700/80 mt-0.5 leading-relaxed">
                    Begins 15th October. Timetables posted.
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm"
                className="w-full text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1 mt-1 h-8">
                All Notices <ChevronRight size={12} />
              </Button>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="shadow-sm border-slate-200/80">
            <CardContent className="p-4 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 px-1 mb-3">Quick Access</p>
              {[
                { label: "My Results", icon: Trophy, color: "text-indigo-600", bg: "bg-indigo-50", href: "/parent-and-student-portal/results" },
                { label: "Attendance Record", icon: ClipboardList, color: "text-emerald-600", bg: "bg-emerald-50", href: "/parent-and-student-portal/attendance" },
                { label: "Fee Statement", icon: CreditCard, color: "text-amber-600", bg: "bg-amber-50", href: "/parent-and-student-portal/fees" },
                { label: "My Profile", icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-50", href: "/parent-and-student-portal/profile" },
              ].map((l) => (
                <button key={l.href}
                  onClick={() => navigate(l.href)}
                  className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-slate-50 transition-colors group text-left"
                >
                  <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", l.bg)}>
                    <l.icon size={14} className={l.color} />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 flex-1">{l.label}</span>
                  <ArrowUpRight size={13} className="text-slate-300 group-hover:text-slate-400" />
                </button>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

// tiny helper icon component to avoid import issues
function BarChartIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="18" y="3" width="4" height="18"/><rect x="10" y="8" width="4" height="13"/><rect x="2" y="13" width="4" height="8"/></svg>;
} 
