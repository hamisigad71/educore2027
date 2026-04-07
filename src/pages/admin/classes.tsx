import React from "react";
import { PageHeader } from "@/components/layout";
import {
  classesSeed, teachersSeed, classGrade, Student, studentsSeed,
} from "@/data/mockData";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// lucide
import { Users, GraduationCap, ArrowRight, UserPlus } from "lucide-react";

export default function AdminClasses() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Class Management" 
        subtitle="Manage academic classes and teacher assignments" 
        actions={
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 shadow-sm gap-1.5">
            <UserPlus size={14} />Create New Class
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {classesSeed.map((c) => {
          const t = teachersSeed.find((x) => x.id === c.teacherId);
          return (
            <Card key={c.id} className="shadow-sm border-slate-200/80 hover:border-indigo-200 transition-colors group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border-indigo-100 mb-2">
                      Grade {classGrade(c.name)}
                    </Badge>
                    <CardTitle className="text-lg font-semibold text-slate-900 leading-none">{c.name}</CardTitle>
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-2">
                      <Users size={14} className="text-slate-400" />
                      <span>{c.students} students enrolled</span>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                    <GraduationCap size={20} />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Class Teacher</p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 ring-2 ring-slate-50">
                        {t?.photo && <AvatarImage src={t.photo} alt={t.name} className="object-cover" />}
                        <AvatarFallback className="text-[10px] font-bold bg-slate-100 text-slate-600">
                          {t?.name ? t.name.split(" ").map(n => n[0]).join("") : "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-slate-900 leading-tight">{t?.name ?? "Unassigned"}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{t?.subject ?? "Needs Assignment"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 h-8 text-xs border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                      View Roster
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 gap-1">
                      Assign <ArrowRight size={12} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
