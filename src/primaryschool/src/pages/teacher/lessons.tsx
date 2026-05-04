import React from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar, 
  Clock, 
  BookOpen, 
  ChevronRight,
  FileText,
  PlayCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const LessonPlannerPage = () => {
  const currentLessons = [
    { title: "Photosynthesis Deep Dive", subject: "Science", class: "Grade 6A", date: "Today", time: "10:30 AM", status: "Active" },
    { title: "Algebraic Expressions", subject: "Math", class: "Grade 7B", date: "Tomorrow", time: "08:15 AM", status: "Published" },
    { title: "The French Revolution", subject: "History", class: "Grade 8C", date: "May 15", time: "01:45 PM", status: "Draft" },
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Lesson Planner</h1>
          <p className="text-slate-500 font-medium">Design and organize your curriculum with ease.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl border-slate-200">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100">
            <Plus className="h-4 w-4 mr-2" />
            New Lesson Plan
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-50/50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Total Plans</p>
                <p className="text-2xl font-bold text-slate-900">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-emerald-50/50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <PlayCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Active Units</p>
                <p className="text-2xl font-bold text-slate-900">6</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-gradient-to-br from-amber-50/50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Pending Review</p>
                <p className="text-2xl font-bold text-slate-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Plans List */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Upcoming Lessons</h2>
            <Button variant="link" className="text-indigo-600 font-semibold p-0 h-auto">View All Plans</Button>
          </div>
          
          <div className="space-y-4">
            {currentLessons.map((lesson, idx) => (
              <Card key={idx} className="group hover:shadow-md transition-all duration-300 border-slate-100 items-center overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-stretch">
                    <div className={cn(
                      "w-1.5",
                      lesson.status === "Active" ? "bg-emerald-500" : 
                      lesson.status === "Published" ? "bg-indigo-500" : "bg-slate-300"
                    )} />
                    <div className="flex-1 p-5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{lesson.subject}</span>
                            <Separator orientation="vertical" className="h-3" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">{lesson.class}</span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{lesson.title}</h3>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex flex-col items-end text-right">
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Calendar className="h-3.5 w-3.5" />
                              <span className="text-xs font-semibold">{lesson.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400 mt-0.5">
                              <Clock className="h-3.5 w-3.5" />
                              <span className="text-[11px] font-medium">{lesson.time}</span>
                            </div>
                          </div>
                          <Badge variant={lesson.status === "Active" ? "success" : "default"} className="rounded-lg h-7 px-3">
                            {lesson.status}
                          </Badge>
                          <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 text-slate-300 hover:text-slate-600 transition-colors">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar / Quick Tips */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Pro Tip</CardTitle>
              <CardDescription className="text-slate-400">Improve your planning flow</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-slate-300">
                You can now link your resources directly to lesson steps. Students will see them in their portal as soon as the lesson starts.
              </p>
              <Button className="w-full mt-6 bg-white text-slate-900 hover:bg-slate-200 rounded-xl font-bold text-xs h-10 transition-colors">
                Learn More
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">Shared "Photosynthesis Labs" with 6A</p>
                    <p className="text-[10px] text-slate-400 font-medium">2 hours ago</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Simple utility for class joining
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default LessonPlannerPage;
