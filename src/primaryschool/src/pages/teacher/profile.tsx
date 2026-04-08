import React from "react";
import { PageHeader } from "@/components/layout";
import { teachersSeed } from "@/primaryschool/src/data/mockData";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// lucide
import { 
  User, Mail, Phone, MapPin, 
  Calendar, Briefcase, GraduationCap, 
  Settings, LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TeacherProfile() {
  const teacher = teachersSeed[0];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Teacher Profile" 
        subtitle="Manage your personal information and preferences" 
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Basic Info */}
        <Card className="lg:col-span-1 shadow-sm border-slate-200/80 overflow-hidden">
          <div className="h-24 bg-indigo-600" />
          <CardContent className="px-6 pb-6 -mt-12">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 border-4 border-white shadow-xl bg-white">
                <AvatarImage src={teacher.photo} alt={teacher.name} className="object-cover" />
                <AvatarFallback className="text-xl font-bold bg-indigo-50 text-indigo-700">
                  {teacher.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="mt-4 text-xl font-bold text-slate-900">{teacher.name}</h3>
              <p className="text-sm font-semibold text-indigo-600">{teacher.subject} Specialist</p>
              
              <div className="mt-6 w-full space-y-3">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 gap-2 font-bold shadow-sm">
                  <Settings size={14} /> Update Profile
                </Button>
                <Button variant="outline" className="w-full border-slate-200 text-slate-600 gap-2 font-bold group hover:border-rose-200 hover:text-rose-600">
                  <LogOut size={14} className="group-hover:text-rose-500" /> Log Out
                </Button>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
               {[
                 { icon: Mail, label: "Email Address", val: teacher.email },
                 { icon: Phone, label: "Phone Number", val: "+254 700 000 000" },
                 { icon: MapPin, label: "Staff Office", val: "Science Wing, Rm 12" },
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                     <item.icon size={14} />
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                     <p className="text-xs font-semibold text-slate-700">{item.val}</p>
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
                <CardTitle className="text-base font-semibold">Professional Information</CardTitle>
                <CardDescription className="text-xs">Your academic background and work history</CardDescription>
             </CardHeader>
             <CardContent className="p-6">
               <div className="grid gap-6 sm:grid-cols-2">
                 {[
                   { icon: GraduationCap, title: "Highest Qualification", desc: "Masters in Education (Mathematics)" },
                   { icon: Briefcase, title: "Experience", desc: "8 Years in Education" },
                   { icon: Calendar, title: "Joined ShuleHub", desc: "January 2021" },
                   { icon: User, title: "Employee ID", desc: "STF/2021/042" },
                 ].map((item, i) => (
                   <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                     <div className="flex items-center gap-2.5 mb-2">
                        <item.icon size={14} className="text-indigo-500" />
                        <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                     </div>
                     <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>

           <Card className="shadow-sm border-slate-200/80">
              <CardHeader className="px-6 py-5 border-b border-slate-50">
                <CardTitle className="text-base font-semibold">Security & Access</CardTitle>
                <CardDescription className="text-xs">Maintain your account security</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-amber-100 bg-amber-50/50">
                   <div className="space-y-1">
                     <p className="text-xs font-bold text-amber-900">Change Password</p>
                     <p className="text-[11px] text-amber-800/70 font-medium">Reset your secret key regularly for better safety</p>
                   </div>
                   <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-bold h-8 text-[11px] px-4 shadow-sm border-0">
                     Begin Reset
                   </Button>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
