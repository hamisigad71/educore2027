import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { teachersSeed } from "@/primaryschool/src/data/mockData";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, Calendar, Clock, Activity, Heart, BookOpen, CheckCircle2 } from "lucide-react";

export default function AdminTeacherProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const teacher = teachersSeed.find((t) => t.id === id);

  if (!teacher) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <p className="text-sm font-medium text-slate-700">Teacher not found.</p>
        <Button variant="outline" onClick={() => navigate("/admin/teachers")}>
          <ArrowLeft size={14} className="mr-2" /> Back to Teachers
        </Button>
      </div>
    );
  }

  const initials = teacher.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-2">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/teachers")} className="h-8 px-2 text-slate-500 hover:text-slate-700">
          <ArrowLeft size={16} className="mr-1" />
          Back
        </Button>
      </div>

      {/* Profile Header Card */}
      <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 shrink-0">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-white shadow-md">
            <AvatarImage src={teacher.photo} alt={teacher.name} className="object-cover" />
            <AvatarFallback className="bg-indigo-100 text-indigo-700 text-2xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="relative z-10 flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{teacher.name}</h1>
            <p className="text-sm text-slate-500 mt-1 flex items-center justify-center md:justify-start gap-2">
              <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-700 font-medium">Teaching Staff</Badge>
              <span className="text-slate-300">•</span>
              <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full text-xs">
                {teacher.subject}
              </span>
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 pt-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail size={16} className="text-slate-400" />
              {teacher.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone size={16} className="text-slate-400" />
              <span className="font-mono">{teacher.phone}</span>
            </div>
          </div>
          
          <div className="pt-2">
             <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mr-2">Assigned Classes:</span>
                {teacher.classes.map(c => (
                  <Badge key={c} variant="outline" className="text-xs px-2.5 py-0.5 border-slate-200 bg-slate-50 text-slate-700">
                    {c}
                  </Badge>
                ))}
             </div>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 justify-center">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 shadow-sm w-full md:w-auto">
              Message Teacher
            </Button>
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 w-full md:w-auto">
              Edit Profile
            </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3 bg-slate-100/80 p-1 mb-6 rounded-lg">
          <TabsTrigger value="overview" className="rounded-md text-sm font-medium data-[state=active]:shadow-sm">Overview</TabsTrigger>
          <TabsTrigger value="activities" className="rounded-md text-sm font-medium data-[state=active]:shadow-sm">Activities</TabsTrigger>
          <TabsTrigger value="health" className="rounded-md text-sm font-medium data-[state=active]:shadow-sm">Health Profile</TabsTrigger>
        </TabsList>
        
        {/* TAB: Overview */}
        <TabsContent value="overview" className="mt-0 outline-none">
          <div className="grid md:grid-cols-2 gap-6">
             <Card className="shadow-sm border-slate-200/80">
               <CardHeader className="pb-3 border-b border-slate-100">
                 <CardTitle className="text-sm font-semibold flex items-center gap-2">
                   <BookOpen size={16} className="text-indigo-500" />
                   Academic Responsibility
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-5 space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-100">
                     <span className="text-sm text-slate-500">Primary Subject</span>
                     <span className="text-sm font-medium text-slate-900">{teacher.subject}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-100">
                     <span className="text-sm text-slate-500">Total Classes</span>
                     <span className="text-sm font-medium text-slate-900">{teacher.classes.length}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-100">
                     <span className="text-sm text-slate-500">Weekly Lessons</span>
                     <span className="text-sm font-medium text-slate-900">{teacher.classes.length * 4} / 40 hrs</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-100">
                     <span className="text-sm text-slate-500">Department</span>
                     <span className="text-sm font-medium text-slate-900">Languages & Sciences</span>
                  </div>
               </CardContent>
             </Card>

             <Card className="shadow-sm border-slate-200/80">
               <CardHeader className="pb-3 border-b border-slate-100">
                 <CardTitle className="text-sm font-semibold flex items-center gap-2">
                   <Calendar size={16} className="text-emerald-500" />
                   Attendance & Stats
                 </CardTitle>
               </CardHeader>
               <CardContent className="p-5 space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-100">
                     <span className="text-sm text-slate-500">This Term's Attendance</span>
                     <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500 w-[98%]"></div>
                        </div>
                        <span className="text-sm font-medium text-slate-900">98%</span>
                     </div>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-100">
                     <span className="text-sm text-slate-500">Days Present</span>
                     <span className="text-sm font-medium text-slate-900">45 / 46</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-100">
                     <span className="text-sm text-slate-500">Leaves Taken</span>
                     <span className="text-sm font-medium text-slate-900">1 (Sick Leave)</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dashed border-slate-100">
                     <span className="text-sm text-slate-500">Join Date</span>
                     <span className="text-sm font-medium text-slate-900">Jan 12, 2022</span>
                  </div>
               </CardContent>
             </Card>
          </div>
        </TabsContent>
        
        {/* TAB: Activities */}
        <TabsContent value="activities" className="mt-0 outline-none">
          <Card className="shadow-sm border-slate-200/80">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Activity size={16} className="text-amber-500" />
                Recent System Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                
                {[
                  { time: "Today, 8:15 AM", title: "Marked Attendance", desc: `Marked attendance for ${teacher.classes[0] || 'Grade 5A'} - 38 Present, 2 Absent.` },
                  { time: "Today, 11:30 AM", title: "Uploaded Marks", desc: `Uploaded Term 2 Midterm scores for ${teacher.subject}.` },
                  { time: "Yesterday, 3:00 PM", title: "Sent Notice", desc: "Sent a reminder to parents regarding the upcoming parents-teachers meeting." },
                  { time: "Monday, 9:00 AM", title: "Logged In", desc: "System login from school network." }
                ].map((act, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-[.is-active]:bg-indigo-500 group-[.is-active]:text-white group-[.is-active]:border-indigo-100 absolute left-[-26px] md:static">
                      <CheckCircle2 size={12} />
                    </div>
                    
                    <div className="w-[calc(100%-1rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm transition-all hover:border-indigo-100 hover:shadow-md">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-semibold text-sm text-slate-800">{act.title}</div>
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                           <Clock size={12} />
                           {act.time}
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 leading-relaxed">
                        {act.desc}
                      </div>
                    </div>
                  </div>
                ))}
                
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* TAB: Health Profile */}
        <TabsContent value="health" className="mt-0 outline-none">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="shadow-sm border-slate-200/80">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Heart size={16} className="text-rose-500" />
                    Medical History & Wellness
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-5">
                   <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                         <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Blood Group</h4>
                         <p className="text-lg font-semibold text-slate-900">O Positive (O+)</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-100">
                         <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Allergies</h4>
                         <div className="flex flex-wrap gap-1.5 mt-1">
                            <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700 text-xs">Penicillin</Badge>
                            <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700 text-xs">Peanuts</Badge>
                         </div>
                      </div>
                   </div>
                   
                   <div>
                     <h4 className="text-sm font-medium text-slate-900 mb-2">Ongoing Conditions & Notes</h4>
                     <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100 leading-relaxed">
                       Subject experiences occasional mild asthma, requires inhaler access during intense physical activities or dusty environments. No other major health conditions reported. Cleared for all standard school activities.
                     </p>
                   </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-slate-200/80 border-l-4 border-l-amber-400">
                <CardContent className="p-5 flex items-center justify-between">
                   <div>
                     <h4 className="text-sm font-semibold text-slate-900">Annual Medical Checkup</h4>
                     <p className="text-xs text-slate-500 mt-1">Last checkup was on 14th March 2025. Pending renewal soon.</p>
                   </div>
                   <Button variant="outline" size="sm" className="bg-white">Update Record</Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
               <Card className="shadow-sm border-slate-200/80">
                 <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                   <CardTitle className="text-sm font-semibold text-slate-800">Emergency Contact</CardTitle>
                 </CardHeader>
                 <CardContent className="p-5 space-y-4">
                    <div>
                       <p className="text-xs font-medium text-slate-500">Contact Name</p>
                       <p className="text-sm font-medium text-slate-900 mt-0.5">David {teacher.name.split(" ")[1]}</p>
                    </div>
                    <div>
                       <p className="text-xs font-medium text-slate-500">Relationship</p>
                       <p className="text-sm font-medium text-slate-900 mt-0.5">Spouse</p>
                    </div>
                    <div>
                       <p className="text-xs font-medium text-slate-500">Phone</p>
                       <p className="text-sm font-medium text-slate-900 mt-0.5 font-mono">+254 799 888 777</p>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                       <Button size="sm" variant="outline" className="w-full h-8 text-xs font-medium text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                         <Phone size={12} className="mr-2"/> Call Emergency
                       </Button>
                    </div>
                 </CardContent>
               </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
