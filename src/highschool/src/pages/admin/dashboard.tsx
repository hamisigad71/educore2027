import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout";
import {
  getDashboardStats,
  getRecentTransactions,
  DashboardStats,
  RecentTransactionItem,
} from "@/lib/api";
import { currency } from "../../data/mockData";
import { PostsFeed, CreatePostWidget } from "@/components/posts/PostsFeed";

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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [transactions, setTransactions] = useState<RecentTransactionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [st, tx] = await Promise.all([
          getDashboardStats(),
          getRecentTransactions(),
        ]);
        setStats(st);
        setTransactions(tx);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalStudents = stats?.totalStudents ?? 5;
  const totalTeachers = stats?.totalTeachers ?? 3;
  const feesCollected = stats?.totalFeePaid ?? 76500;
  const attendanceRate = stats?.attendanceRate ?? 96.5;

  const feeTrend = [23, 28, 31, 29, 35, 42, 39, 46, 51, 49, 55, 62];
  const topClasses = [
    { id: "1", name: "Form 3 West", students: 3, avg: 84 },
    { id: "2", name: "Form 2 North", students: 1, avg: 79 },
    { id: "3", name: "Form 1 East", students: 1, avg: 76 },
    { id: "4", name: "Form 4 South", students: 0, avg: 72 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Admin Overview" 
        subtitle="Bright Futures Secondary School — Term 2, 2025" 
        actions={
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-600 text-[10px] h-6 px-2.5 font-bold uppercase tracking-widest border-0">Live Updates</Badge>
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <DashboardStatCard label="Total Enrollment" value={totalStudents} subText="+18 this year" 
          icon={Users} color="bg-indigo-50 text-indigo-600 border-indigo-100" trend="5.1%" trendDir="up" />
        <DashboardStatCard label="Fees Collected" value={currency(feesCollected)} subText="88% of target" 
          icon={Wallet} color="bg-emerald-50 text-emerald-600 border-emerald-100" trend="10.2%" trendDir="up" />
        <DashboardStatCard label="Academic Staff" value={totalTeachers} subText="6 departments" 
          icon={GraduationCap} color="bg-purple-50 text-purple-600 border-purple-100" trend="0.0%" trendDir="up" />
        <DashboardStatCard label="Daily Attendance" value={`${attendanceRate}%`} subText="Avg. this week" 
          icon={Calendar} color="bg-amber-50 text-amber-600 border-amber-100" trend="0.5%" trendDir="down" />
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
              <TrendingUp size={10} /> +15.2%
            </div>
          </CardHeader>
          <CardContent className="pt-8 pb-4">
            <BarChart data={feeTrend} labels={["J","F","M","A","M","J","J","A","S","O","N","D"]} />
          </CardContent>
        </Card>

        {/* Top Forms */}
        <Card className="shadow-sm border-slate-200/80">
          <CardHeader className="px-6 py-5 border-b border-slate-50">
            <CardTitle className="text-base font-semibold">Top Pergradeing Forms</CardTitle>
            <CardDescription className="text-xs mt-0.5">Average academic score this term</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {topClasses.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-[13px]">
                      {c.name.split(" ")[1]}{c.name.split(" ")[2][0]}
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
            <CardDescription className="text-xs mt-0.5">Real-time secondary school fee logs</CardDescription>
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
                  {transactions.length > 0 ? (
                    transactions.slice(0, 5).map((f) => (
                      <TableRow key={f.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors">
                        <TableCell className="pl-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 shadow-sm">
                              <AvatarFallback className="text-[10px] font-bold bg-indigo-50 text-indigo-700">
                                {initials(f.studentName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold text-slate-900 leading-tight">{f.studentName}</p>
                              <p className="text-[10px] text-slate-400 mt-0.5">{f.admissionNumber}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5 font-bold text-slate-900 text-xs">
                          {currency(f.amount)}
                        </TableCell>
                        <TableCell className="py-3.5">
                          <Badge variant="outline" className={cn(
                            "text-[10px] font-semibold px-2 py-0 uppercase",
                            f.paymentMethod === "mpesa" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-50 text-slate-600 border-slate-200"
                          )}>
                            {f.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3.5 text-xs font-mono text-slate-400 uppercase">
                          {f.mpesaReceipt || f.reference || "N/A"}
                        </TableCell>
                        <TableCell className="pr-6 py-3.5 text-right text-xs font-medium text-slate-500">
                          {new Date(f.paidAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-xs text-slate-400">
                        No transactions recorded yet.
                      </TableCell>
                    </TableRow>
                  )}
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
            <CardTitle className="text-lg font-bold text-slate-900">High School Insights</CardTitle>
            <CardDescription className="text-slate-500 text-xs text-medium">AI-driven secondary academic predictions</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-4 space-y-4">
            <div className="p-3.5 rounded-xl bg-white border border-indigo-50 hover:border-indigo-100 hover:shadow-sm transition-all">
              <div className="flex items-center gap-2 mb-1.5 font-bold text-emerald-600 text-xs">
                <TrendingUp size={14} /> Form 4 West Performance
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-bold">Physics scores improved by 12.4% after the new lab sessions. Chemistry still needs focus.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-indigo-50 hover:border-indigo-100 hover:shadow-sm transition-all">
              <div className="flex items-center gap-2 mb-1.5 font-bold text-amber-600 text-xs">
                <Clock size={14} /> Mock Exam Readiness
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-bold">Predicted higher failure rate in Biology for Form 3. Schedule extra revision classes.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-indigo-50 hover:border-indigo-100 hover:shadow-sm transition-all">
              <div className="flex items-center gap-2 mb-1.5 font-bold text-indigo-600 text-xs">
                <Users size={14} /> Form 1 Boarding Capacity
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed font-bold">Hostel A is reaching capacity. Form 2 students should be moved to Wing B.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts and Updates Row */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-500" />
            School Feed
          </h2>
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <CreatePostWidget />
            <PostsFeed className="max-w-none w-full" />
          </div>
          <div className="hidden xl:block">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-sm sticky top-6">
              <h3 className="font-bold text-lg mb-2">School Announcements</h3>
              <p className="text-indigo-100 text-sm">Create updates here to broadcast them to all staff, teachers, and parents.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
