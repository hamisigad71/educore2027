import React, { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  Target, 
  Filter,
  Download,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Layers,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// Mock comparative stream analytics (like Zeraki Analytics)
const FORM_COMPARISON_DATA: Record<string, {
  streams: {
    name: string;
    meanScore: number;
    meanGrade: string;
    points: number;
    deviation: number;
    studentsCount: number;
    topSubject: string;
    gradeDist: { A: number; B: number; C: number; D: number; E: number };
  }[];
  subjectBreakdown: {
    subject: string;
    red: number;
    blue: number;
    green: number;
    yellow: number;
    mean: number;
  }[];
}> = {
  "Form 1": {
    streams: [
      { name: "Form 1 Red", meanScore: 74.8, meanGrade: "B+", points: 9.8, deviation: +0.65, studentsCount: 45, topSubject: "Mathematics (82%)", gradeDist: { A: 12, B: 20, C: 10, D: 3, E: 0 } },
      { name: "Form 1 Blue", meanScore: 71.4, meanGrade: "B", points: 8.9, deviation: -0.22, studentsCount: 44, topSubject: "Biology (78%)", gradeDist: { A: 8, B: 22, C: 11, D: 3, E: 0 } },
      { name: "Form 1 Green", meanScore: 68.9, meanGrade: "B-", points: 8.2, deviation: +0.41, studentsCount: 46, topSubject: "Chemistry (73%)", gradeDist: { A: 6, B: 18, C: 18, D: 4, E: 0 } },
      { name: "Form 1 Yellow", meanScore: 65.2, meanGrade: "C+", points: 7.4, deviation: -0.15, studentsCount: 43, topSubject: "English (71%)", gradeDist: { A: 4, B: 15, C: 19, D: 5, E: 0 } },
    ],
    subjectBreakdown: [
      { subject: "Mathematics", red: 82, blue: 76, green: 71, yellow: 64, mean: 73.2 },
      { subject: "English", red: 75, blue: 72, green: 70, yellow: 71, mean: 72.0 },
      { subject: "Kiswahili", red: 78, blue: 74, green: 69, yellow: 66, mean: 71.8 },
      { subject: "Chemistry", red: 73, blue: 69, green: 73, yellow: 61, mean: 69.0 },
      { subject: "Physics", red: 71, blue: 68, green: 65, yellow: 62, mean: 66.5 },
      { subject: "Biology", red: 79, blue: 78, green: 72, yellow: 68, mean: 74.2 },
      { subject: "History", red: 81, blue: 75, green: 74, yellow: 72, mean: 75.5 },
    ]
  },
  "Form 2": {
    streams: [
      { name: "Form 2 Red", meanScore: 69.5, meanGrade: "B-", points: 8.4, deviation: +0.35, studentsCount: 42, topSubject: "Biology (76%)", gradeDist: { A: 7, B: 19, C: 13, D: 3, E: 0 } },
      { name: "Form 2 Blue", meanScore: 73.1, meanGrade: "B+", points: 9.2, deviation: +0.80, studentsCount: 45, topSubject: "Mathematics (80%)", gradeDist: { A: 11, B: 21, C: 11, D: 2, E: 0 } },
      { name: "Form 2 Green", meanScore: 67.4, meanGrade: "C+", points: 7.9, deviation: -0.10, studentsCount: 44, topSubject: "History (75%)", gradeDist: { A: 5, B: 16, C: 18, D: 5, E: 0 } },
      { name: "Form 2 Yellow", meanScore: 64.0, meanGrade: "C+", points: 7.1, deviation: -0.40, studentsCount: 43, topSubject: "Kiswahili (70%)", gradeDist: { A: 3, B: 14, C: 21, D: 5, E: 0 } },
    ],
    subjectBreakdown: [
      { subject: "Mathematics", red: 76, blue: 80, green: 68, yellow: 62, mean: 71.5 },
      { subject: "English", red: 71, blue: 74, green: 68, yellow: 65, mean: 69.5 },
      { subject: "Kiswahili", red: 73, blue: 75, green: 69, yellow: 70, mean: 71.8 },
      { subject: "Chemistry", red: 68, blue: 72, green: 66, yellow: 60, mean: 66.5 },
      { subject: "Physics", red: 66, blue: 70, green: 64, yellow: 59, mean: 64.8 },
      { subject: "Biology", red: 76, blue: 77, green: 71, yellow: 66, mean: 72.5 },
      { subject: "History", red: 74, blue: 76, green: 75, yellow: 68, mean: 73.2 },
    ]
  },
  "Form 3": {
    streams: [
      { name: "Form 3 Red", meanScore: 72.2, meanGrade: "B", points: 9.0, deviation: +0.45, studentsCount: 40, topSubject: "Chemistry (79%)", gradeDist: { A: 9, B: 18, C: 11, D: 2, E: 0 } },
      { name: "Form 3 Blue", meanScore: 70.8, meanGrade: "B-", points: 8.6, deviation: +0.15, studentsCount: 41, topSubject: "Mathematics (77%)", gradeDist: { A: 8, B: 17, C: 13, D: 3, E: 0 } },
      { name: "Form 3 Green", meanScore: 69.1, meanGrade: "B-", points: 8.3, deviation: -0.20, studentsCount: 42, topSubject: "Biology (74%)", gradeDist: { A: 6, B: 16, C: 16, D: 4, E: 0 } },
      { name: "Form 3 Yellow", meanScore: 66.5, meanGrade: "C+", points: 7.7, deviation: +0.05, studentsCount: 39, topSubject: "English (72%)", gradeDist: { A: 4, B: 15, C: 16, D: 4, E: 0 } },
    ],
    subjectBreakdown: [
      { subject: "Mathematics", red: 75, blue: 77, green: 70, yellow: 65, mean: 71.8 },
      { subject: "English", red: 74, blue: 71, green: 69, yellow: 72, mean: 71.5 },
      { subject: "Kiswahili", red: 76, blue: 72, green: 71, yellow: 67, mean: 71.5 },
      { subject: "Chemistry", red: 79, blue: 71, green: 69, yellow: 63, mean: 70.5 },
      { subject: "Physics", red: 70, blue: 68, green: 66, yellow: 64, mean: 67.0 },
      { subject: "Biology", red: 75, blue: 74, green: 74, yellow: 68, mean: 72.8 },
      { subject: "History", red: 77, blue: 73, green: 71, yellow: 70, mean: 72.8 },
    ]
  },
  "Form 4": {
    streams: [
      { name: "Form 4 Red", meanScore: 76.5, meanGrade: "B+", points: 10.1, deviation: +0.92, studentsCount: 38, topSubject: "Mathematics (84%)", gradeDist: { A: 14, B: 16, C: 7, D: 1, E: 0 } },
      { name: "Form 4 Blue", meanScore: 75.0, meanGrade: "B+", points: 9.8, deviation: +0.50, studentsCount: 39, topSubject: "Physics (81%)", gradeDist: { A: 12, B: 18, C: 8, D: 1, E: 0 } },
      { name: "Form 4 Green", meanScore: 71.2, meanGrade: "B", points: 8.8, deviation: -0.15, studentsCount: 37, topSubject: "Chemistry (76%)", gradeDist: { A: 7, B: 18, C: 10, D: 2, E: 0 } },
      { name: "Form 4 Yellow", meanScore: 68.0, meanGrade: "B-", points: 8.1, deviation: +0.20, studentsCount: 36, topSubject: "History (75%)", gradeDist: { A: 5, B: 15, C: 14, D: 2, E: 0 } },
    ],
    subjectBreakdown: [
      { subject: "Mathematics", red: 84, blue: 80, green: 74, yellow: 69, mean: 76.8 },
      { subject: "English", red: 78, blue: 76, green: 72, yellow: 70, mean: 74.0 },
      { subject: "Kiswahili", red: 79, blue: 77, green: 73, yellow: 71, mean: 75.0 },
      { subject: "Chemistry", red: 78, blue: 77, green: 76, yellow: 66, mean: 74.2 },
      { subject: "Physics", red: 80, blue: 81, green: 70, yellow: 67, mean: 74.5 },
      { subject: "Biology", red: 82, blue: 79, green: 75, yellow: 71, mean: 76.8 },
      { subject: "History", red: 81, blue: 78, green: 75, yellow: 75, mean: 77.2 },
    ]
  }
};

export default function AnalyticsPage() {
  const [selectedForm, setSelectedForm] = useState<string>("Form 1");
  const [selectedTerm, setSelectedTerm] = useState<string>("Term 1 - 2026");

  const currentData = FORM_COMPARISON_DATA[selectedForm] || FORM_COMPARISON_DATA["Form 1"];
  const totalStudents = currentData.streams.reduce((acc, s) => acc + s.studentsCount, 0);
  const overallMean = (
    currentData.streams.reduce((acc, s) => acc + s.meanScore * s.studentsCount, 0) / totalStudents
  ).toFixed(1);

  // Best performing stream
  const topStream = [...currentData.streams].sort((a, b) => b.meanScore - a.meanScore)[0];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      {/* Top Header with Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Academic Analytics</h1>
            <Badge className="bg-indigo-600 text-white rounded-md text-[11px] font-bold px-2 py-0.5">
              Stream Performance Comparison
            </Badge>
          </div>
          <p className="text-slate-500 font-medium text-sm">
            Cross-stream performance diagnostics, ranking, and curriculum variance.
          </p>
        </div>

        {/* Form & Term Selectors */}
        <div className="flex items-center gap-3">
          <Select value={selectedForm} onValueChange={setSelectedForm}>
            <SelectTrigger className="w-36 h-11 rounded-xl bg-white border-slate-200 font-bold text-sm shadow-sm">
              <SelectValue placeholder="Select Form" />
            </SelectTrigger>
            <SelectContent>
              {["Form 1", "Form 2", "Form 3", "Form 4"].map((f) => (
                <SelectItem key={f} value={f} className="font-semibold">{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTerm} onValueChange={setSelectedTerm}>
            <SelectTrigger className="w-44 h-11 rounded-xl bg-white border-slate-200 font-bold text-sm shadow-sm">
              <SelectValue placeholder="Select Term" />
            </SelectTrigger>
            <SelectContent>
              {["Term 1 - 2026", "Term 2 - 2026", "Term 3 - 2025"].map((t) => (
                <SelectItem key={t} value={t} className="font-semibold">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            variant="outline" 
            onClick={() => window.print()}
            className="h-11 rounded-xl border-slate-200 bg-white shadow-sm font-bold text-xs"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Form Mean Score</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-slate-900">{overallMean}%</p>
                  <span className="text-xs font-bold text-emerald-600 flex items-center">
                    <ArrowUpRight size={14} /> +0.48
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Across all 4 streams</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BarChart3 size={22} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Leading Stream</p>
                <p className="text-2xl font-black text-slate-900">{topStream.name}</p>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">
                  Mean: {topStream.meanScore}% ({topStream.meanGrade})
                </p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Award size={22} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Enrolled</p>
                <p className="text-3xl font-black text-slate-900">{totalStudents}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Full cohort assessed</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users size={22} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Top Subject Cohort</p>
                <p className="text-xl font-black text-slate-900">Mathematics</p>
                <p className="text-[11px] text-indigo-600 font-bold mt-1">Form Average: 73.2%</p>
              </div>
              <div className="h-11 w-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <Target size={22} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stream Comparison Leaderboard (Zeraki Format) */}
      <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Layers className="text-indigo-600" size={18} />
                {selectedForm} Stream Leaderboard & Grade Distribution
              </CardTitle>
              <CardDescription className="text-xs font-medium text-slate-500">
                Ranked by Mean Points according to KCSE 12-point grading scale
              </CardDescription>
            </div>
            <Badge variant="outline" className="w-fit text-slate-600 bg-white font-bold text-[11px]">
              {selectedTerm}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 text-slate-400 font-bold text-[10px] uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-6">Rank & Stream</th>
                  <th className="py-3.5 px-4 text-center">Enrolled</th>
                  <th className="py-3.5 px-4 text-center">Mean Score</th>
                  <th className="py-3.5 px-4 text-center">Mean Grade</th>
                  <th className="py-3.5 px-4 text-center">Points (12.0)</th>
                  <th className="py-3.5 px-4 text-center">Deviation</th>
                  <th className="py-3.5 px-6">Grade Curve (A-E)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {currentData.streams.map((stream, idx) => (
                  <tr key={stream.name} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center text-xs font-black",
                          idx === 0 ? "bg-amber-100 text-amber-700" :
                          idx === 1 ? "bg-slate-200 text-slate-700" :
                          idx === 2 ? "bg-amber-50 text-amber-800" : "bg-slate-100 text-slate-500"
                        )}>
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">{stream.name}</p>
                          <p className="text-[11px] text-slate-400 font-normal">Top: {stream.topSubject}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-700">{stream.studentsCount}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="font-mono font-bold text-slate-900 text-base">{stream.meanScore}%</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge className={cn(
                        "rounded-lg font-black text-xs px-2.5 py-0.5",
                        stream.meanGrade.startsWith("A") ? "bg-emerald-600 text-white" :
                        stream.meanGrade.startsWith("B") ? "bg-indigo-600 text-white" :
                        stream.meanGrade.startsWith("C") ? "bg-amber-600 text-white" : "bg-slate-600 text-white"
                      )}>
                        {stream.meanGrade}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-slate-800">{stream.points}</td>
                    <td className="py-4 px-4 text-center">
                      <span className={cn(
                        "inline-flex items-center text-xs font-bold font-mono",
                        stream.deviation >= 0 ? "text-emerald-600" : "text-rose-500"
                      )}>
                        {stream.deviation >= 0 ? (
                          <ArrowUpRight size={14} className="mr-0.5" />
                        ) : (
                          <ArrowDownRight size={14} className="mr-0.5" />
                        )}
                        {stream.deviation >= 0 ? `+${stream.deviation}` : stream.deviation}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold">
                        <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                          {stream.gradeDist.A} A
                        </span>
                        <span className="text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                          {stream.gradeDist.B} B
                        </span>
                        <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                          {stream.gradeDist.C} C
                        </span>
                        <span className="text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                          {stream.gradeDist.D} D
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Subject-by-Subject Stream Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Subject Variance Across Streams</CardTitle>
                <CardDescription className="text-xs">Compare how each stream performed per subject</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Red
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Blue
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Green
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Yellow
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-5">
              {currentData.subjectBreakdown.map((s) => (
                <div key={s.subject} className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{s.subject}</span>
                    <span className="font-mono text-slate-500 font-bold">Coh. Mean: {s.mean}%</span>
                  </div>
                  {/* Multi-Stream Bar Comparison */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: `${s.red}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono font-semibold">Red: {s.red}%</p>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${s.blue}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono font-semibold">Blue: {s.blue}%</p>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.green}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono font-semibold">Green: {s.green}%</p>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: `${s.yellow}%` }} />
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono font-semibold">Yellow: {s.yellow}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actionable Pedagogical Insights */}
        <Card className="border border-slate-200/80 shadow-sm rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="text-amber-500" size={17} />
              Academic Diagnosis
            </CardTitle>
            <CardDescription className="text-xs">Identified gaps & interventions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-1">
            <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-100 space-y-1.5">
              <p className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-indigo-600" />
                Mathematics Excellence
              </p>
              <p className="text-[11px] text-indigo-800 leading-relaxed">
                <strong>{topStream.name}</strong> outperformed other streams in Math by +8.4%. Consider standardizing their revision assignments across the cohort.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-100 space-y-1.5">
              <p className="text-xs font-bold text-rose-950 flex items-center gap-1.5">
                <AlertCircle size={14} className="text-rose-600" />
                Sciences Intervention Needed
              </p>
              <p className="text-[11px] text-rose-800 leading-relaxed">
                Chemistry in Form 1 Yellow (61%) is trailing the mean by -8.0%. Recommend additional practical lab sessions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-slate-700" />
                Mean Score Projection
              </p>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Current trajectory projects a <strong>B (8.8 points)</strong> cohort average for final examinations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
