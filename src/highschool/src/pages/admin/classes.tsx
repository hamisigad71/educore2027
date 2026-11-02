import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import {
  classesSeed, teachersSeed, Student, studentsSeed,
} from "../../data/mockData";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

// lucide
import { Users, GraduationCap, ArrowRight, UserPlus, CheckCircle2 } from "lucide-react";

export default function AdminClasses() {
  const { toast } = useToast();
  const [classes, setClasses] = useState(classesSeed);
  const [selectedClassRoster, setSelectedClassRoster] = useState<any | null>(null);
  const [assignModalClass, setAssignModalClass] = useState<any | null>(null);
  const [createClassModalOpen, setCreateClassModalOpen] = useState(false);

  // New Class Form State
  const [newClassName, setNewClassName] = useState("");
  const [newClassTeacher, setNewClassTeacher] = useState("");

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const newClass = {
      id: `c-${Date.now()}`,
      name: newClassName,
      teacherId: newClassTeacher || teachersSeed[0].id,
      students: 0,
    };

    setClasses(prev => [newClass, ...prev]);
    setCreateClassModalOpen(false);
    setNewClassName("");
    setNewClassTeacher("");

    toast({
      title: "Class Created Successfully",
      description: `${newClassName} has been registered to the secondary school database.`,
    });
  };

  const handleAssignTeacher = (classId: string, teacherId: string) => {
    setClasses(prev => prev.map(c => c.id === classId ? { ...c, teacherId } : c));
    setAssignModalClass(null);
    toast({
      title: "Teacher Reassigned",
      description: "Class teacher allocation updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Class Management" 
        subtitle="Manage academic classes and teacher assignments" 
        actions={
          <Button 
            onClick={() => setCreateClassModalOpen(true)}
            size="sm" 
            className="bg-indigo-600 hover:bg-indigo-700 shadow-sm gap-1.5 font-bold"
          >
            <UserPlus size={14} />Create New Class
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {classes.map((c) => {
          const t = teachersSeed.find((x) => x.id === c.teacherId);
          return (
            <Card key={c.id} className="shadow-sm border-slate-200/80 hover:border-indigo-200 transition-colors group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border-indigo-100 mb-2">
                      Form {c.name.split(" ")[1] || c.name}
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedClassRoster(c)}
                      className="flex-1 h-8 text-xs border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold"
                    >
                      View Roster
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setAssignModalClass(c)}
                      className="flex-1 h-8 text-xs text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 gap-1 font-semibold"
                    >
                      Assign <ArrowRight size={12} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* View Roster Modal */}
      <Dialog open={!!selectedClassRoster} onOpenChange={(open) => !open && setSelectedClassRoster(null)}>
        <DialogContent className="max-w-xl w-[94vw] bg-white rounded-3xl p-6 border border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900">
              {selectedClassRoster?.name} Student Roster
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Enrolled students list and contact records for {selectedClassRoster?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100 mt-4 border border-slate-100 rounded-2xl">
            {studentsSeed.filter(s => s.klass === selectedClassRoster?.name).length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                No students currently assigned to this stream.
              </div>
            ) : (
              studentsSeed.filter(s => s.klass === selectedClassRoster?.name).map((s) => (
                <div key={s.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={s.photo} />
                      <AvatarFallback className="text-[10px] font-bold">{s.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{s.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">ADM: {s.admission}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border-emerald-100">
                    Active
                  </Badge>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Assign Teacher Modal */}
      <Dialog open={!!assignModalClass} onOpenChange={(open) => !open && setAssignModalClass(null)}>
        <DialogContent className="max-w-md w-[94vw] bg-white rounded-3xl p-6 border border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900">
              Assign Teacher to {assignModalClass?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Select a certified teacher to lead this stream and handle classroom register duties.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 mt-4 max-h-[50vh] overflow-y-auto">
            {teachersSeed.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleAssignTeacher(assignModalClass.id, t.id)}
                className="w-full p-3 rounded-2xl border border-slate-200/80 hover:border-indigo-500 hover:bg-indigo-50/50 flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    {t.photo && <AvatarImage src={t.photo} />}
                    <AvatarFallback className="text-xs font-bold">{t.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{t.name}</p>
                    <p className="text-[11px] text-slate-400">{t.subject}</p>
                  </div>
                </div>
                {assignModalClass?.teacherId === t.id && (
                  <CheckCircle2 size={16} className="text-indigo-600" />
                )}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Class Modal */}
      <Dialog open={createClassModalOpen} onOpenChange={setCreateClassModalOpen}>
        <DialogContent className="max-w-md w-[94vw] bg-white rounded-3xl p-6 border border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900">
              Create Academic Stream
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Add a new class or stream to the secondary school roster.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateClass} className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-slate-500">Class Name & Stream</Label>
              <Input 
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="e.g. Form 2 East or Form 4 Purple"
                className="h-10 text-xs rounded-xl"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold uppercase text-slate-500">Assigned Teacher</Label>
              <Select value={newClassTeacher} onValueChange={setNewClassTeacher}>
                <SelectTrigger className="h-10 text-xs rounded-xl">
                  <SelectValue placeholder="Choose lead teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachersSeed.map((t) => (
                    <SelectItem key={t.id} value={t.id} className="text-xs font-medium">
                      {t.name} ({t.subject})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setCreateClassModalOpen(false)} className="rounded-xl text-xs font-bold">
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white">
                Save Class
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
