
import { PageHeader } from "@/components/layout";
import { teachersSeed } from "@/primaryschool/src/data/mockData";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// lucide
import { 
  Users, MapPin, Clock, BookOpen, 
  ChevronRight, ArrowRight, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TeacherClasses() {
  const teacher = teachersSeed[0];
  const classData = [
    { name: "Grade 5A", students: 38, avg: 74, room: "Rm 101", time: "Mon/Wed/Fri 8:00 AM" },
    { name: "Grade 6B", students: 36, avg: 71, room: "Rm 104", time: "Tue/Thu 10:00 AM" },
  ].filter((c) => teacher.classes.includes(c.name));

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Classes" 
        subtitle={`Managing ${teacher.classes.length} assigned learning groups`} 
      />

      <div className="grid gap-6 md:grid-cols-2">
        {classData.map((c, i) => (
          <Card key={i} className="shadow-sm border-slate-200/80 hover:border-indigo-200 transition-all group overflow-hidden">
            <CardContent className="p-0">
               <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">{c.name}</h3>
                    <p className="text-sm text-slate-500 mt-1 font-medium">{teacher.subject} • {c.students} Students</p>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 px-2.5 py-0.5 text-[11px] font-bold">
                    {c.avg}% Class Avg
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all">
                      <MapPin size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Location</p>
                      <p className="text-xs font-semibold text-slate-700">{c.room}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                     <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all">
                      <Clock size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Schedule</p>
                      <p className="text-xs font-semibold text-slate-700">{c.time.split(" ").slice(0, 1).join("")}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-2.5">
                  <Button variant="outline" size="sm" className="flex-1 h-9 text-xs border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 gap-1.5 font-bold">
                     View Roster
                  </Button>
                  <Button size="sm" className="flex-1 h-9 bg-indigo-600 hover:bg-indigo-700 shadow-sm text-xs gap-1.5 font-bold px-0">
                    Take Attendance <ArrowRight size={12} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
