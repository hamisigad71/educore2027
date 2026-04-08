import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { visitorLogsSeed, transportSeed } from "../../../data/mockData";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// lucide
import { 
  Shield, Wrench, Bus, 
  Search, Plus, MapPin,
  Clock, LogIn, LogOut,
  AlertCircle, CheckCircle2, 
  MoreVertical, TrendingUp,
  HardHat, ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function OperationsPortal() {
  const [q, setQ] = useState("");

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Operations & Security" 
        subtitle="Manage school security, maintenance work orders, and transport logistics" 
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-700 bg-white shadow-sm font-bold text-xs gap-1.5 px-4">
              <ClipboardList size={14} /> Duty Roster
            </Button>
            <Button className="h-9 bg-indigo-600 hover:bg-indigo-700 shadow-sm text-xs font-bold gap-1.5 px-4">
              <Plus size={14} /> Log Entry
            </Button>
          </div>
        }
      />

      <Tabs defaultValue="security" className="w-full">
        <TabsList className="bg-slate-100/50 p-1 rounded-xl border border-slate-100 mb-6">
          <TabsTrigger value="security" className="text-xs font-bold px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-lg transition-all gap-2">
            <Shield size={14} /> Security & Visitors
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="text-xs font-bold px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-lg transition-all gap-2">
            <Wrench size={14} /> Maintenance Orders
          </TabsTrigger>
          <TabsTrigger value="transport" className="text-xs font-bold px-6 py-2.5 data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm rounded-lg transition-all gap-2">
            <Bus size={14} /> Transport & Logistics
          </TabsTrigger>
        </TabsList>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 shadow-sm border-slate-200/80">
              <CardHeader className="p-0">
                <div className="flex items-center justify-between px-6 pt-5 pb-4">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900 leading-none">Gate Visitor Log</CardTitle>
                    <CardDescription className="text-xs text-slate-500 mt-1">Real-time tracking of entries and exits at the main gate</CardDescription>
                  </div>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input placeholder="Search visitors..." className="pl-9 h-9 w-[200px] text-xs bg-slate-50 border-slate-200" />
                  </div>
                </div>
                <Separator className="bg-slate-50" />
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b border-slate-50">
                      <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Visitor Name</TableHead>
                      <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Purpose</TableHead>
                      <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Time In</TableHead>
                      <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">ID Number</TableHead>
                      <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visitorLogsSeed.map((v) => (
                      <TableRow key={v.id} className="group hover:bg-slate-50/50 transition-colors">
                        <TableCell className="pl-6 py-4">
                          <p className="text-xs font-bold text-slate-900 leading-tight">{v.name}</p>
                        </TableCell>
                        <TableCell className="py-4 text-xs text-slate-500 font-medium">{v.purpose}</TableCell>
                        <TableCell className="py-4">
                           <div className="flex items-center gap-1.5">
                              <LogIn size={12} className="text-emerald-500" />
                              <span className="text-xs font-mono text-slate-600 font-bold">{v.timeIn}</span>
                           </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <code className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{v.idNumber}</code>
                        </TableCell>
                        <TableCell className="pr-6 py-4 text-right">
                          {v.timeOut ? (
                            <Badge variant="outline" className="bg-slate-50 text-slate-400 border-0 font-bold text-[9px]">EXITED {v.timeOut}</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-0 font-bold text-[9px] animate-pulse">ON CAMPUS</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="shadow-sm border-slate-200/80">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Shield size={16} className="text-indigo-600" /> Security Checkpoints
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   {[
                     { area: "Main Gate", status: "Secure", time: "5 mins ago" },
                     { area: "Hostel Zone", status: "Patrolled", time: "15 mins ago" },
                     { area: "Admin Block", status: "Locked", time: "6:00 PM" },
                   ].map((area, i) => (
                     <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-50">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{area.area}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5"><Clock size={10} /> {area.time}</p>
                        </div>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-0 font-bold text-[9px] h-5 px-2">
                          {area.status}
                        </Badge>
                     </div>
                   ))}
                </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200/80 bg-slate-900 text-white p-5 overflow-hidden group">
                 <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-2">
                       <AlertCircle size={16} className="text-amber-400" />
                       <h4 className="text-sm font-bold">Patrol Alert</h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">External perimeter check scheduled for 10:00 PM. All security staff report to Section B.</p>
                    <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold h-9 text-[11px] rounded-xl transition-all">
                       Acknowledge Alert
                    </Button>
                 </div>
                 <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-indigo-500/10 blur-2xl text-indigo-500" />
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="space-y-6">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-center lg:text-left">
              <Card className="lg:col-span-2 shadow-sm border-slate-200/80">
                <CardHeader className="px-6 pt-5 pb-4">
                   <div className="flex items-center justify-between">
                     <div>
                        <CardTitle className="text-base font-bold text-slate-900 leading-none">Work Order Queue</CardTitle>
                        <CardDescription className="text-xs text-slate-500 mt-1">Pending repairs and facility maintenance requests</CardDescription>
                     </div>
                     <Button className="h-9 bg-slate-900 text-white font-bold text-[11px] px-5 rounded-xl gap-2">
                        <Plus size={14} /> New Request
                     </Button>
                   </div>
                </CardHeader>
                <CardContent className="space-y-4 px-6 pb-6">
                   {[
                     { task: "Fix leaking tap in Girls Dorm 2", priority: "Normal", department: "Hostels", status: "Ongoing" },
                     { task: "Repair Chemistry Lab socket", priority: "High", department: "Science", status: "Pending" },
                     { task: "Trim main football pitch grass", priority: "Low", department: "Sports", status: "Scheduled" },
                   ].map((task, i) => (
                     <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-50 hover:border-indigo-100 bg-slate-50/50 hover:bg-white transition-all group">
                        <div className="flex items-start gap-4 mb-3 sm:mb-0">
                           <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 group-hover:border-indigo-100">
                             <Wrench size={18} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{task.task}</p>
                              <div className="flex items-center gap-3 mt-1">
                                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.department}</span>
                                 <Separator orientation="vertical" className="h-3 bg-slate-200" />
                                 <div className="flex items-center gap-1">
                                    <div className={cn("h-1.5 w-1.5 rounded-full", task.priority === "High" ? "bg-rose-500" : "bg-slate-300")} />
                                    <span className="text-[10px] font-bold text-slate-500">{task.priority} Priority</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 text-[11px] font-bold border-slate-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all px-4 rounded-lg">
                           {task.status}
                        </Button>
                     </div>
                   ))}
                </CardContent>
              </Card>

              <div className="space-y-6">
                 <Card className="shadow-sm border-slate-200/80">
                   <CardHeader>
                      <CardTitle className="text-sm font-bold text-slate-900 border-l-2 border-amber-500 pl-3">Maintenance Stats</CardTitle>
                   </CardHeader>
                   <CardContent className="space-y-4">
                      <div className="flex justify-between items-end mb-1">
                         <span className="text-xs font-bold text-slate-700">Monthly Completion</span>
                         <span className="text-xl font-bold text-slate-900">82%</span>
                      </div>
                      <Progress value={82} className="h-2 bg-slate-100 [&>div]:bg-amber-500 rounded-full" />
                      <div className="grid grid-cols-2 gap-3 pt-2">
                         <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-lg font-bold text-slate-900">12</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Open Tasks</p>
                         </div>
                         <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-lg font-bold text-slate-900">54</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Resolved</p>
                         </div>
                      </div>
                   </CardContent>
                 </Card>
              </div>
           </div>
        </TabsContent>

        {/* Transport Tab */}
        <TabsContent value="transport" className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {transportSeed.map((route) => (
               <Card key={route.id} className="shadow-sm border-slate-200/80 hover:border-indigo-200 transition-colors group">
                 <CardContent className="p-6">
                   <div className="flex items-center justify-between mb-4">
                     <div className="h-10 w-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
                       <Bus size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                     </div>
                     <Badge variant="outline" className={cn(
                       "text-[9px] font-bold border-0 px-2.5 py-0.5",
                       route.status === "En Route" ? "bg-indigo-50 text-indigo-700 animate-pulse" : "bg-emerald-50 text-emerald-700"
                     )}>
                       {route.status.toUpperCase()}
                     </Badge>
                   </div>
                   <h5 className="text-base font-bold text-slate-900 leading-tight">{route.routeName}</h5>
                   <div className="mt-4 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 border-b border-slate-50 pb-2">
                         <span className="flex items-center gap-1.5"><HardHat size={12} className="text-slate-300" /> Driver</span>
                         <span className="text-slate-900 font-bold">{route.driver}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                         <span className="flex items-center gap-1.5"><MapPin size={12} className="text-slate-300" /> Students Assigned</span>
                         <span className="text-slate-900 font-bold">{route.students} Seats</span>
                      </div>
                   </div>
                   <Button variant="ghost" className="w-full mt-6 text-[11px] font-bold text-indigo-600 hover:bg-indigo-50 h-8 gap-1.5 rounded-lg border border-transparent hover:border-indigo-100">
                      View Live Map <TrendingUp size={14} />
                   </Button>
                 </CardContent>
               </Card>
             ))}
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
