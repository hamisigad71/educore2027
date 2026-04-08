import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { studentsSeed } from "../../../data/mockData";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// lucide
import { 
  UserPlus, FileCheck, ArrowUpRight, 
  Search, Filter, ChevronRight, 
  Users, UserCheck, ShieldCheck, 
  ClipboardList, HardDrive, Clock, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

export default function AdmissionsPortal() {
  const [q, setQ] = useState("");
  
  const intakeStats = [
    { label: "New Admissions", value: 142, total: 200, icon: UserPlus, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Verified Files", value: 128, total: 142, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Transfers In", value: 12, total: 15, icon: ArrowUpRight, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Pending Photos", value: 8, total: 142, icon: Users, color: "text-slate-400", bg: "bg-slate-50" },
  ];

  const pendingApplications = [
    { id: "app-001", name: "Brian Kemboi", score: 384, date: "2025-05-18", status: "Verified", color: "bg-emerald-50 text-emerald-700" },
    { id: "app-002", name: "Mercy Wanjiku", score: 402, date: "2025-05-19", status: "Pending Interview", color: "bg-amber-50 text-amber-700" },
    { id: "app-003", name: "Ian Kiprotich", score: 356, date: "2025-05-20", status: "Document Issue", color: "bg-rose-50 text-rose-700" },
    { id: "app-004", name: "Stacy Moraa", score: 391, date: "2025-05-21", status: "Verified", color: "bg-emerald-50 text-emerald-700" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Admissions & Registrar" 
        subtitle="Manage new student intake, student archives, and registration pipeline" 
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-700 bg-white shadow-sm font-bold text-xs gap-1.5 px-4 shadow-sm">
              <HardDrive size={14} /> View Archives
            </Button>
            <Button className="h-9 bg-indigo-600 hover:bg-indigo-700 shadow-sm text-xs font-bold gap-1.5 px-4 shadow-sm">
              <UserPlus size={14} /> New Registration
            </Button>
          </div>
        }
      />

      {/* Intake Progress Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {intakeStats.map((stat) => (
          <Card key={stat.label} className="shadow-sm border-slate-200/80">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center border", stat.bg)}>
                  <stat.icon size={16} className={stat.color} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  {Math.round((stat.value / stat.total) * 100)}%
                </p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900 leading-none tracking-tight">{stat.value}</p>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-1.5 font-medium">{stat.label}</p>
              </div>
              <div className="mt-4 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all duration-700", stat.color.replace("text-", "bg-"))} 
                  style={{ width: `${(stat.value / stat.total) * 100}%` }} 
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="intake" className="w-full">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
          <TabsList className="bg-slate-100/50 p-1 rounded-xl border border-slate-100">
            <TabsTrigger value="intake" className="text-xs font-bold px-5 py-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-lg transition-all">
              Admission Pipeline
            </TabsTrigger>
            <TabsTrigger value="roster" className="text-xs font-bold px-5 py-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-lg transition-all">
              Current Roster
            </TabsTrigger>
            <TabsTrigger value="requests" className="text-xs font-bold px-5 py-2 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-lg transition-all">
              Transfer Requests
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder="Search candidates..." 
                className="pl-9 h-9 w-[240px] text-xs bg-white border-slate-200 focus-visible:ring-indigo-500/20"
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-400 hover:text-slate-600">
              <Filter size={14} />
            </Button>
          </div>
        </div>

        <TabsContent value="intake" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Application Table */}
            <Card className="xl:col-span-2 shadow-sm border-slate-200/80">
              <CardHeader className="px-6 py-4 border-b border-slate-50">
                 <div className="flex items-center justify-between">
                   <CardTitle className="text-base font-bold text-slate-900 leading-none">Form 1 Intake (2025)</CardTitle>
                   <Badge className="bg-indigo-50 text-indigo-700 border-0 font-bold text-[10px]">OPEN PHASE</Badge>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-slate-50">
                      <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Candidate Name</TableHead>
                      <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">KCPE Score</TableHead>
                      <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">App Date</TableHead>
                      <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">File Status</TableHead>
                      <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApplications.map((app) => (
                      <TableRow key={app.id} className="group hover:bg-slate-50/50 transition-colors">
                        <TableCell className="pl-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center text-[10px] font-bold border border-indigo-100">
                              {initials(app.name)}
                            </div>
                            <p className="text-xs font-bold text-slate-900">{app.name}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 font-mono text-xs font-bold text-slate-600">{app.score}/500</TableCell>
                        <TableCell className="py-4 text-xs text-slate-500 font-medium">{app.date}</TableCell>
                        <TableCell className="py-4">
                           <Badge variant="outline" className={cn("text-[9px] font-bold border-0 px-2 py-0", app.color)}>
                             {app.status}
                           </Badge>
                        </TableCell>
                        <TableCell className="pr-6 py-4 text-right">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50">
                            <ChevronRight size={14} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="p-4 bg-slate-50/30 text-center border-t border-slate-50">
                  <Button variant="ghost" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 hover:bg-transparent h-6 gap-1">
                    Load More Applications <ChevronRight size={12} className="rotate-90" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sidebar Tools */}
            <div className="space-y-6">
              <Card className="shadow-sm border-slate-200/80">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-900 border-l-2 border-indigo-500 pl-3">Intake Checklist</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Original Birth Certificate", done: true },
                    { label: "KCPE Result Slip", done: true },
                    { label: "Leaving Certificate", done: false },
                    { label: "School Fees Dept Clear", done: true },
                    { label: "Health Declaration Form", done: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                      <span className={cn("text-xs font-medium", item.done ? "text-slate-900" : "text-slate-400")}>{item.label}</span>
                      {item.done ? (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-slate-200 group-hover:border-indigo-400" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200/80 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                    <UserCheck size={16} className="text-indigo-400" /> Registration Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 relative z-10">
                   <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[11px] font-bold">Assign House Groups</p>
                        <Clock size={12} className="text-amber-400" />
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">45 new students need house and dormitory assignment before Friday.</p>
                   </div>
                   <div className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[11px] font-bold">Official Photo Day</p>
                        <FileCheck size={12} className="text-emerald-400" />
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">Schedule photographer for Form 1 official ID portal capture.</p>
                   </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="roster">
           <Card className="shadow-sm border-slate-200/80 py-20 text-center flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <Users size={32} className="text-slate-200" />
              </div>
              <p className="text-sm font-bold text-slate-900">Student Roster Management</p>
              <p className="text-xs text-slate-400 mt-1">Full access to 1,200+ active student records and archives.</p>
              <Button className="mt-6 bg-indigo-600 h-9 font-bold px-8 shadow-md hover:shadow-indigo-100">Initialize Sync</Button>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
