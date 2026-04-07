import React from "react";
import { PageHeader } from "@/components/layout";
import { useAuth } from "@/context/AuthContext";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// lucide
import { 
  User, Mail, Phone, MapPin, 
  Map, Calendar, Shield, Settings,
  LogOut, Pencil, Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function StaffProfile() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Profile" 
        subtitle="Manage your personal details and employment records" 
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Identity */}
        <Card className="lg:col-span-1 shadow-sm border-slate-200/80 overflow-hidden group">
           <div className="h-28 bg-gradient-to-r from-amber-500 to-amber-600" />
           <CardContent className="px-6 pb-8 -mt-12">
              <div className="flex flex-col items-center text-center relative z-10">
                <Avatar className="h-24 w-24 border-4 border-white shadow-xl bg-white ring-1 ring-slate-100">
                  <AvatarImage src={user?.photo} alt={user?.name} className="object-cover" />
                  <AvatarFallback className="text-xl font-bold bg-amber-50 text-amber-700">
                    {user?.name?.split(" ").map((n:any) => n[0]).slice(0,2).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-950 transition-colors">{user?.name}</h3>
                  <div className="flex items-center justify-center gap-2 mt-1.5">
                    <Badge className="bg-amber-50 text-amber-600 border-0 text-[10px] uppercase font-bold tracking-widest px-2.5">Operations</Badge>
                    <Badge variant="outline" className="text-[10px] font-bold border-slate-200 text-slate-400">STF-0042</Badge>
                  </div>
                </div>

                <div className="mt-8 w-full space-y-2.5">
                   <Button className="w-full bg-amber-600 hover:bg-amber-700 gap-2 font-bold shadow-sm h-10 text-xs text-white border-0">
                     <Pencil size={14} /> Request Detail Change
                   </Button>
                   <Button variant="outline" className="w-full border-slate-200 text-slate-500 gap-2 font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 h-10 text-xs transition-all">
                     <LogOut size={14} /> Log Out From Portal
                   </Button>
                </div>
              </div>

              <Separator className="my-8" />

              <div className="space-y-4">
                 {[
                   { icon: Mail, label: "Work Email", val: user?.email ?? "operations@school.com" },
                   { icon: Phone, label: "Official Contact", val: "+254 700 000 000" },
                   { icon: MapPin, label: "Assigned Division", val: "Facility Management" },
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                       <item.icon size={13} />
                     </div>
                     <div className="text-left overflow-hidden">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                       <p className="text-[11px] font-semibold text-slate-700 truncate">{item.val}</p>
                     </div>
                   </div>
                 ))}
              </div>
           </CardContent>
        </Card>

        {/* Professional Details */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="shadow-sm border-slate-200/80">
              <CardHeader className="px-6 py-5 border-b border-slate-50">
                <CardTitle className="text-base font-semibold">Contractual Information</CardTitle>
                <CardDescription className="text-xs">Your professional records and job status</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                 <div className="grid gap-6 sm:grid-cols-2">
                    {[
                      { icon: Briefcase, title: "Job Role", val: "Facilities & Operations Specialist" },
                      { icon: Calendar, title: "Joining Date", val: "October 12th, 2022" },
                      { icon: Shield, title: "Shift Schedule", val: "Morning Shift (7 AM - 5 PM)" },
                      { icon: Map, title: "Operations Zone", val: "A & B Blocks, Central Hall" },
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                           <item.icon size={14} className="text-amber-500" />
                           <h4 className="text-[11px] font-bold text-slate-900 uppercase tracking-tight">{item.title}</h4>
                        </div>
                        <p className="text-xs text-slate-500 font-bold">{item.val}</p>
                      </div>
                    ))}
                 </div>
              </CardContent>
           </Card>

           <Card className="shadow-sm border-slate-200/80">
              <CardHeader className="px-6 py-5 border-b border-slate-50">
                <CardTitle className="text-base font-semibold">Portal Configuration</CardTitle>
                <CardDescription className="text-xs">Security settings and personal preferences</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border border-amber-100 bg-amber-50/30">
                    <div className="flex items-start gap-4">
                       <div className="h-10 w-10 rounded-full bg-amber-600 flex items-center justify-center text-white shrink-0">
                          <Settings size={20} />
                       </div>
                       <div className="space-y-1">
                          <p className="text-sm font-bold text-amber-950 leading-none">Password & Safety</p>
                          <p className="text-[11px] text-amber-700/70 font-medium">Reset your portal credentials and configure biometric login</p>
                       </div>
                    </div>
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700 h-9 font-bold px-6 text-xs shadow-sm border-0 text-white">
                       Security Check
                    </Button>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
