import React from "react";
import { PageHeader } from "@/components/layout";
import {
  studentsSeed, teachersSeed, feesSeed, classesSeed, currency,
} from "@/data/mockData";

// shadcn/ui
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sparkline, BarChart } from "@/components/ui/charts";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

// lucide
import {
  Users, Wallet, GraduationCap, Calendar, 
  TrendingUp, ArrowUpRight, ArrowDownRight, Zap,
  Search, MoreHorizontal, CheckCircle2, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── helpers ─────────────────────────────────────────────────────────────────

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

// ─── Stat Card ────────────────────────────────────────────────────────────────

function DashboardStatCard({
  label, value, subText, color, icon: Icon, trend, trendDir
}: {
  label: string; value: string | number; subText: string; color: string;
  icon: any; trend?: string; trendDir?: 'up' | 'down';
}) {
  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardContent className="p-3.5 sm:p-5">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className={cn("h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl flex items-center justify-center border", color)}>
            <Icon size={14} className="sm:size-[18px]" />
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0 sm:py-0.5 rounded-full border",
              trendDir === 'up' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
            )}>
              {trendDir === 'up' ? <ArrowUpRight size={9} className="sm:size-[10px]" /> : <ArrowDownRight size={9} className="sm:size-[10px]" />}
              {trend}
            </div>
          )}
        </div>
        <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none">{value}</p>
        <p className="text-[11px] sm:text-[13px] font-medium text-slate-500 mt-2">{label}</p>
        <div className="mt-2 sm:mt-4 overflow-hidden -mx-2 h-8">
          <Sparkline data={[12, 14, 13, 16, 18, 17, 20, 22, 21, 24]} className={trendDir === 'down' ? "text-rose-500" : "text-indigo-500"} />
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const totalStudents = studentsSeed.length;
  const totalTeachers = teachersSeed.length;
  const feesCollected = feesSeed.reduce((s, f) => s + f.amount, 0);
  const attendanceRate = Math.round(
    studentsSeed.reduce((s, x) => s + x.attendance, 0) / studentsSeed.length
  );

  const feeTrend = [23, 28, 31, 29, 35, 42, 39, 46, 51, 49, 55, 62];
  const topClasses = classesSeed
    .map((c) => ({ ...c, avg: 68 + ((c.students * 7) % 20) }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Admin Overview" 
        subtitle="Bright Futures Academy — Term 2, 2025" 
        actions={
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-600 text-[10px] h-6 px-2.5 font-bold uppercase tracking-widest border-0">Live Updates</Badge>
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <DashboardStatCard label="Total Enrollment" value={totalStudents} subText="+12 this term" 
          icon={Users} color="bg-indigo-50 text-indigo-600 border-indigo-100" trend="4.2%" trendDir="up" />
        <DashboardStatCard label="Fees Collected" value={currency(feesCollected)} subText="92% of target" 
          icon={Wallet} color="bg-emerald-50 text-emerald-600 border-emerald-100" trend="12.5%" trendDir="up" />
        <DashboardStatCard label="Active Faculty" value={totalTeachers} subText="4 departments" 
          icon={GraduationCap} color="bg-purple-50 text-purple-600 border-purple-100" trend="0.0%" trendDir="up" />
        <DashboardStatCard label="Daily Attendance" value={`${attendanceRate}%`} subText="Avg. this week" 
          icon={Calendar} color="bg-amber-50 text-amber-600 border-amber-100" trend="1.8%" trendDir="down" />
      </div>

      {/* Main Row */}
      <div className="grid gap-4 xl:grid-cols-3">
        {/* Fee Collection Chart */}
        <Card className="xl:col-span-2 shadow-sm border-slate-200/80">
          <CardHeader className="flex flex-row items-center justify-between px-6 py-5 border-b border-slate-50">
            <div>
              <CardTitle className="text-base font-semibold">Fee Collection Trend</CardTitle>
              <CardDescription className="text-xs mt-0.5">Monthly revenue breakdown (KES × 10,000)</CardDescription>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-full">
              <TrendingUp size={10} /> +18.4%
            </div>
          </CardHeader>
          <CardContent className="pt-8 pb-4">
            <BarChart data={feeTrend} labels={["J","F","M","A","M","J","J","A","S","O","N","D"]} />
          </CardContent>
        </Card>

        {/* Top Classes */}
        <Card className="shadow-sm border-slate-200/80">
          <CardHeader className="px-6 py-5 border-b border-slate-50">
            <CardTitle className="text-base font-semibold">Top Performing Classes</CardTitle>
            <CardDescription className="text-xs mt-0.5">Average academic score this term</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {topClasses.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[13px]">
                      {c.name.split(" ")[1]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{c.name}</p>
                      <p className="text-[11px] text-slate-400 font-medium">{c.students} students</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[11px] font-bold border-emerald-100 text-emerald-700 bg-emerald-50">
                    {c.avg}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Payments */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200/80">
          <CardHeader className="px-6 py-5 border-b border-slate-50">
            <CardTitle className="text-base font-semibold">Recent Fee Payments</CardTitle>
            <CardDescription className="text-xs mt-0.5">Real-time transaction logs</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-slate-50">
                    <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Student</TableHead>
                    <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Amount</TableHead>
                    <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Method</TableHead>
                    <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Receipt</TableHead>
                    <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feesSeed.slice(0, 5).map((f) => {
                    const s = studentsSeed.find((x) => x.id === f.studentId)!;
                    return (
                      <TableRow key={f.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors">
                        <TableCell className="pl-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 shadow-sm">
                              <AvatarImage src={s.photo} alt={s.name} />
                              <AvatarFallback className="text-[10px] font-bold bg-indigo-50 text-indigo-700">
                                {initials(s.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 leading-tight">{s.name}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{s.klass}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5 font-bold text-slate-900 text-xs">
                          {currency(f.amount)}
                        </TableCell>
                        <TableCell className="py-3.5">
                          <Badge variant="outline" className={cn(
                            "text-[10px] font-semibold px-2 py-0",
                            f.method === "M-Pesa" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-600 border-slate-200"
                          )}>
                            {f.method}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3.5 text-xs font-mono text-slate-400 capitalize">
                          {f.receipt}
                        </TableCell>
                        <TableCell className="pr-6 py-3.5 text-right text-xs font-medium text-slate-500">
                          {f.date}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights Card */}
        <Card className="shadow-sm border-indigo-100 bg-indigo-50/40 overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
            <Zap size={120} className="text-indigo-600" />
          </div>
          <CardHeader className="px-6 pt-6 pb-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <Zap size={14} />
              </div>
              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200 text-[9px] font-bold uppercase tracking-wider">EduCore AI</Badge>
            </div>
            <CardTitle className="text-lg font-bold text-slate-900">Smart Insights</CardTitle>
            <CardDescription className="text-slate-500 text-xs text-medium">AI-driven academic predictions</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-4 space-y-4">
            <div className="p-3.5 rounded-xl bg-white border border-indigo-50 hover:border-indigo-100 hover:shadow-sm transition-all">
              <div className="flex items-center gap-2 mb-1.5 font-bold text-emerald-600 text-xs">
                <TrendingUp size={14} /> Grade 6A Improvement
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-bold">Math scores improved by 8.4% since the new teacher assignment. Keep it up!</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-indigo-50 hover:border-indigo-100 hover:shadow-sm transition-all">
              <div className="flex items-center gap-2 mb-1.5 font-bold text-amber-600 text-xs">
                <Clock size={14} /> Friday Attendance Alert
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-bold">Predicted 15% attendance dip this Friday due to holiday. Send reminders.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-indigo-50 hover:border-indigo-100 hover:shadow-sm transition-all">
              <div className="flex items-center gap-2 mb-1.5 font-bold text-indigo-600 text-xs">
                <Users size={14} /> Resource Allocation
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-bold">Grade 5A lab sessions are over-capacity. Consider split schedules.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
