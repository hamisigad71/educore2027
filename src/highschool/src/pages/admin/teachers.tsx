import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout";
import { teachersSeed, Teacher } from "../../data/mockData";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// lucide
import {
  Users, BookOpen, LayoutGrid, GraduationCap, TrendingUp,
  Search, Download, Plus, Pencil, Trash2, MoreHorizontal,
  Mail, Phone, ChevronRight,
} from "lucide-react";

// ─── helpers ─────────────────────────────────────────────────────────────────

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics:         "bg-indigo-50 text-indigo-700 border-indigo-200",
  English:             "bg-emerald-50 text-emerald-700 border-emerald-200",
  Kiswahili:           "bg-rose-50 text-rose-700 border-rose-200",
  Physics:             "bg-blue-50 text-blue-700 border-blue-200",
  Chemistry:           "bg-purple-50 text-purple-700 border-purple-200",
  Biology:             "bg-emerald-50 text-emerald-700 border-emerald-200",
  History:             "bg-amber-50 text-amber-700 border-amber-200",
  Geography:           "bg-slate-50 text-slate-700 border-slate-200",
  "Business Studies":  "bg-indigo-50 text-indigo-700 border-indigo-200",
  Agriculture:         "bg-orange-50 text-orange-700 border-orange-200",
};

const subjectColor = (s: string) =>
  SUBJECT_COLORS[s] ?? "bg-slate-50 text-slate-700 border-slate-200";

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, icon, iconBg, trend,
}: {
  label: string; value: string | number;
  icon: React.ReactNode; iconBg: string; trend?: string;
}) {
  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center border", iconBg)}>
            {icon}
          </div>
          {trend && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5">
              <TrendingUp size={9} />{trend}
            </span>
          )}
        </div>
        <p className="text-[26px] font-semibold text-slate-900 tracking-tight leading-none">{value}</p>
        <p className="text-sm text-slate-500 mt-1.5">{label}</p>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>(teachersSeed);
  const [q, setQ] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [modal, setModal] = useState<{ open: boolean; data?: Teacher }>({ open: false });
  const { toast } = useToast();

  const subjects = useMemo(
    () => Array.from(new Set(teachers.map((t) => t.subject))),
    [teachers]
  );

  const filtered = useMemo(
    () =>
      teachers.filter(
        (t) =>
          (subjectFilter === "All" || t.subject === subjectFilter) &&
          [t.name, t.email, t.subject].some((v) =>
            v.toLowerCase().includes(q.toLowerCase())
          )
      ),
    [teachers, q, subjectFilter]
  );

  const totalClasses = Array.from(new Set(teachers.flatMap((t) => t.classes))).length;
  const avgClasses =
    teachers.length > 0
      ? (teachers.reduce((s, t) => s + t.classes.length, 0) / teachers.length).toFixed(1)
      : 0;

  function handleSave() {
    if (modal.data) {
      toast({ title: "Teacher updated", description: "Changes saved to the system." });
    } else {
      const t: Teacher = {
        id: `t${Date.now()}`,
        name: "New Teacher",
        subject: "Mathematics",
        email: "new.teacher@educore.ke",
        phone: "+254700000000",
        classes: ["Form 4 Red"],
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
      };
      setTeachers((p) => [t, ...p]);
      toast({ title: "Teacher added", description: `${t.name} has joined the staff.` });
    }
    setModal({ open: false });
  }

  function handleDelete(t: Teacher) {
    setTeachers((p) => p.filter((x) => x.id !== t.id));
    toast({ title: "Teacher removed", description: `${t.name} removed from staff.` });
  }

  return (
    <div className="space-y-6">

      {/* ── Header ───────────────────────────────────────────────── */}
      <PageHeader
        title="Teaching Staff"
        subtitle={`${filtered.length} teachers · ${subjects.length} subjects`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-50 gap-1.5">
              <Download size={14} />Export
            </Button>
            <Button
              size="sm"
              onClick={() => setModal({ open: true })}
              className="bg-indigo-600 hover:bg-indigo-700 shadow-sm gap-1.5"
            >
              <Plus size={14} />Add Teacher
            </Button>
          </div>
        }
      />

      {/* ── Stats ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Teachers"        value={filtered.length} trend="+2 this term"
          iconBg="bg-indigo-50 border-indigo-100"   icon={<Users        size={18} className="text-indigo-600" />} />
        <StatCard label="Subjects Taught"        value={subjects.length}
          iconBg="bg-emerald-50 border-emerald-100" icon={<BookOpen     size={18} className="text-emerald-600" />} />
        <StatCard label="Active Classes"         value={totalClasses}
          iconBg="bg-amber-50 border-amber-100"     icon={<LayoutGrid   size={18} className="text-amber-600"  />} />
        <StatCard label="Avg Classes / Teacher"  value={avgClasses}
          iconBg="bg-purple-50 border-purple-100"   icon={<GraduationCap size={18} className="text-purple-600"/>} />
      </div>

      {/* ── Table Card ───────────────────────────────────────────── */}
      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pt-5 pb-4">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">Staff Directory</CardTitle>
              <CardDescription className="text-sm text-slate-500 mt-0.5">
                Records, contacts and class assignments
              </CardDescription>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search name, subject, email…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-9 h-9 w-[260px] text-sm bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400"
                />
              </div>
              <Select value={subjectFilter} onValueChange={(v) => setSubjectFilter(v ?? "All")}>
                <SelectTrigger className="h-9 w-[155px] text-sm bg-slate-50 border-slate-200">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Subjects</SelectItem>
                  {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator />
        </CardHeader>

        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Users size={24} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-700">No teachers found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your search or subject filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-slate-100">
                    {["Teacher", "Subject", "Contact", "Classes", "Load", ""].map((h, i) => (
                      <TableHead
                        key={i}
                        className={cn(
                          "text-[11px] font-semibold text-slate-400 uppercase tracking-wider py-3",
                          i === 0 && "pl-6",
                          i === 5 && "pr-6 text-right"
                        )}
                      >{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((t) => (
                    <TableRow key={t.id} className="hover:bg-slate-50/60 border-b border-slate-100/80 transition-colors">

                      {/* Teacher */}
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-slate-100 shadow-sm">
                            <AvatarImage src={t.photo} alt={t.name} className="object-cover" />
                            <AvatarFallback className="bg-indigo-50 text-indigo-700 text-xs font-semibold">
                              {initials(t.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 leading-tight">{t.name}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">Teaching Staff</p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Subject */}
                      <TableCell className="py-4">
                        <Badge variant="outline" className={cn("text-[11px] font-medium border", subjectColor(t.subject))}>
                          {t.subject}
                        </Badge>
                      </TableCell>

                      {/* Contact */}
                      <TableCell className="py-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <Mail size={11} className="text-slate-300 flex-shrink-0" />
                            <span className="text-xs text-slate-600 truncate max-w-[180px]">{t.email}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Phone size={11} className="text-slate-300 flex-shrink-0" />
                            <span className="text-xs text-slate-400 font-mono">{t.phone}</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Classes */}
                      <TableCell className="py-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {t.classes.slice(0, 3).map((c) => (
                            <Badge key={c} variant="outline"
                              className="text-[10px] px-2 py-0 h-5 border-indigo-200 text-indigo-700 bg-indigo-50 font-medium">
                              {c}
                            </Badge>
                          ))}
                          {t.classes.length > 3 && (
                            <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 border-slate-200 text-slate-500 bg-slate-50">
                              +{t.classes.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>

                      {/* Load dot */}
                      <TableCell className="py-4">
                        <span className={cn(
                          "inline-flex items-center justify-center h-7 w-7 rounded-full text-[11px] font-semibold",
                          t.classes.length >= 4 ? "bg-rose-50 text-rose-600"
                          : t.classes.length >= 2 ? "bg-amber-50 text-amber-600"
                          : "bg-emerald-50 text-emerald-600"
                        )}>
                          {t.classes.length}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="pr-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm"
                            onClick={() => setModal({ open: true, data: t })}
                            className="h-8 px-2.5 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1">
                            <Pencil size={12} />Edit
                          </Button>
                          <DropdownMenu>
                          <DropdownMenuTrigger>
                              <Button variant="ghost" size="sm"
                                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                                <MoreHorizontal size={14} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 text-xs">
                              <DropdownMenuItem className="gap-2 cursor-pointer text-xs">
                                <Mail size={12} />Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 cursor-pointer text-xs">
                                <ChevronRight size={12} />View Profile
                              </DropdownMenuItem>
                              <Separator className="my-1" />
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer text-xs text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                                onClick={() => handleDelete(t)}
                              >
                                <Trash2 size={12} />Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/40">
              <p className="text-xs text-slate-400">
                Showing <span className="font-medium text-slate-600">{filtered.length}</span> of{" "}
                <span className="font-medium text-slate-600">{teachers.length}</span> teachers
              </p>
              <Badge variant="outline" className="text-[10px] text-slate-400 border-slate-200">
                Last updated: today
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Add / Edit Modal ──────────────────────────────────────── */}
      <Dialog open={modal.open} onOpenChange={(o) => setModal({ open: o })}>
        <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <GraduationCap size={16} className="text-indigo-600" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-slate-900">
                  {modal.data ? "Edit Teacher Record" : "Add New Teacher"}
                </DialogTitle>
                <p className="text-xs text-slate-400 mt-0.5">
                  {modal.data ? "Update staff information and assignments" : "Fill in details to register a staff member"}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-600">Full Name <span className="text-rose-400">*</span></Label>
                <Input defaultValue={modal.data?.name ?? ""} placeholder="e.g., Dr. Sarah Mwangi"
                  className="h-9 text-sm border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-600">Subject <span className="text-rose-400">*</span></Label>
                <Select defaultValue={modal.data?.subject ?? "Mathematics"}>
                  <SelectTrigger className="h-9 text-sm border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-600">Email <span className="text-rose-400">*</span></Label>
                <Input type="email" defaultValue={modal.data?.email ?? ""} placeholder="teacher@educore.ke"
                  className="h-9 text-sm border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-600">Phone <span className="text-rose-400">*</span></Label>
                <Input defaultValue={modal.data?.phone ?? "+254"} placeholder="+254700000000"
                  className="h-9 text-sm font-mono border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400" />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-xs font-medium text-slate-600">Class Assignments</Label>
                <Input placeholder="Form 4 Red, Form 3 Blue" defaultValue={modal.data?.classes.join(", ") ?? ""}
                  className="h-9 text-sm border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400" />
                <p className="text-[11px] text-slate-400">Separate multiple classes with commas</p>
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-xs font-medium text-slate-600">Profile Photo URL</Label>
                <Input defaultValue={modal.data?.photo ?? ""} placeholder="https://…"
                  className="h-9 text-sm border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400" />
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 gap-2">
            <Button variant="outline" size="sm" onClick={() => setModal({ open: false })} className="border-slate-300 text-slate-700">
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
              {modal.data ? "Save Changes" : "Add Teacher"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}