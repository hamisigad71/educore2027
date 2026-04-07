import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout";
import { studentsSeed, classesSeed, currency, Student } from "@/data/mockData";

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
import { Progress } from "@/components/ui/progress";
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
  Users, CheckCircle2, AlertCircle, LayoutGrid,
  Search, Download, Plus, Pencil, Trash2, MoreHorizontal,
  Mail, Phone, ChevronRight, TrendingUp,
} from "lucide-react";

// ─── helpers ─────────────────────────────────────────────────────────────────

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

export default function AdminStudents() {
  const [students, setStudents] = useState<Student[]>(studentsSeed);
  const [q, setQ] = useState("");
  const [klassFilter, setKlassFilter] = useState("All");
  const [modal, setModal] = useState<{ open: boolean; data?: Student }>({ open: false });
  const { toast } = useToast();

  const classes = useMemo(
    () => Array.from(new Set(students.map((s) => s.klass))),
    [students]
  );

  const filtered = useMemo(
    () =>
      students.filter(
        (s) =>
          (klassFilter === "All" || s.klass === klassFilter) &&
          [s.name, s.admission].some((v) =>
            v.toLowerCase().includes(q.toLowerCase())
          )
      ),
    [students, q, klassFilter]
  );

  function handleSave() {
    if (modal.data) {
      toast({ title: "Student updated", description: "Changes saved successfully." });
    } else {
      const newS: Student = {
        id: `s${Date.now()}`,
        admission: `ADM/2025/${String(students.length + 1).padStart(3, "0")}`,
        name: "New Student",
        klass: "Grade 5A",
        parent: "Parent Name",
        phone: "+254700000000",
        balance: 0,
        attendance: 95,
        performance: 72,
        photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
      };
      setStudents((p) => [newS, ...p]);
      toast({ title: "Student enrolled", description: `${newS.name} successfully registered.` });
    }
    setModal({ open: false });
  }

  function handleDelete(s: Student) {
    setStudents((p) => p.filter((x) => x.id !== s.id));
    toast({ title: "Student removed", description: `${s.name} deleted from records.` });
  }

  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────────────────────── */}
      <PageHeader
        title="Student Management"
        subtitle={`${filtered.length} students enrolled · ${classes.length} active classes`}
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
              <Plus size={14} />Add Student
            </Button>
          </div>
        }
      />

      {/* ── Stats ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={filtered.length} trend="+4 this term"
          iconBg="bg-indigo-50 border-indigo-100" icon={<Users size={18} className="text-indigo-600" />} />
        <StatCard label="Fees Cleared" value={filtered.filter(s => s.balance === 0).length}
          iconBg="bg-emerald-50 border-emerald-100" icon={<CheckCircle2 size={18} className="text-emerald-600" />} />
        <StatCard label="Pending Fees" value={filtered.filter(s => s.balance > 0).length}
          iconBg="bg-amber-50 border-amber-100" icon={<AlertCircle size={18} className="text-amber-600" />} />
        <StatCard label="Active Classes" value={classes.length}
          iconBg="bg-purple-50 border-purple-100" icon={<LayoutGrid size={18} className="text-purple-600" />} />
      </div>

      {/* ── Table Card ───────────────────────────────────────────── */}
      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pt-5 pb-4">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">Student Directory</CardTitle>
              <CardDescription className="text-sm text-slate-500 mt-0.5">
                Manage enrollment, performance and fee records
              </CardDescription>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search name or ID…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-9 h-9 w-[220px] text-sm bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400"
                />
              </div>
              <Select value={klassFilter} onValueChange={setKlassFilter}>
                <SelectTrigger className="h-9 w-[140px] text-sm bg-slate-50 border-slate-200">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Classes</SelectItem>
                  {classes.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
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
              <p className="text-sm font-medium text-slate-700">No students found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-slate-100">
                    {["Student", "ID", "Class", "Parent Info", "Feel Status", "Attendance", ""].map((h, i) => (
                      <TableHead
                        key={i}
                        className={cn(
                          "text-[11px] font-semibold text-slate-400 uppercase tracking-wider py-3",
                          i === 0 && "pl-6",
                          i === 6 && "pr-6 text-right"
                        )}
                      >{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow key={s.id} className="hover:bg-slate-50/60 border-b border-slate-100/80 transition-colors">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 ring-2 ring-slate-100 shadow-sm">
                            <AvatarImage src={s.photo} alt={s.name} className="object-cover" />
                            <AvatarFallback className="bg-indigo-50 text-indigo-700 text-xs font-semibold">
                              {initials(s.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 leading-tight">{s.name}</p>
                            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Performance: {s.performance}%</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        <code className="text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                          {s.admission}
                        </code>
                      </TableCell>

                      <TableCell className="py-4">
                        <Badge variant="outline" className="text-[11px] font-medium border-indigo-100 text-indigo-700 bg-indigo-50">
                          {s.klass}
                        </Badge>
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-slate-700">{s.parent}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <Phone size={10} /> {s.phone}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="py-4">
                        {s.balance > 0 ? (
                          <Badge variant="outline" className="text-[11px] bg-rose-50 text-rose-700 border-rose-200">
                            {currency(s.balance)} Due
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[11px] bg-emerald-50 text-emerald-700 border-emerald-200">
                            Cleared
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="py-4">
                        <div className="w-24 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400 font-medium">{s.attendance}%</span>
                          </div>
                          <Progress value={s.attendance} className={cn("h-1 bg-slate-100", 
                            s.attendance >= 90 ? "[&>div]:bg-emerald-500" :
                            s.attendance >= 75 ? "[&>div]:bg-indigo-500" :
                            "[&>div]:bg-rose-500"
                          )} />
                        </div>
                      </TableCell>

                      <TableCell className="pr-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setModal({ open: true, data: s })}
                            className="h-8 px-2.5 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1">
                            <Pencil size={12} />Edit
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600">
                                <MoreHorizontal size={14} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 text-xs font-medium">
                              <DropdownMenuItem className="gap-2 cursor-pointer text-xs">
                                <TrendingUp size={12} />View Report Card
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 cursor-pointer text-xs">
                                <Mail size={12} />Message Parent
                              </DropdownMenuItem>
                              <Separator className="my-1" />
                              <DropdownMenuItem className="gap-2 cursor-pointer text-xs text-rose-600 focus:text-rose-600 focus:bg-rose-50"
                                onClick={() => handleDelete(s)}>
                                <Trash2 size={12} />Remove Student
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
        </CardContent>
      </Card>

      {/* ── Modal ────────────────────────────────────────────────── */}
      <Dialog open={modal.open} onOpenChange={(o) => setModal({ open: o })}>
        <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Users size={16} />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold">{modal.data ? "Edit Student" : "Enroll New Student"}</DialogTitle>
                <p className="text-xs text-slate-400 mt-0.5">Manage academic records and personal info</p>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Full Name *</Label>
                <Input defaultValue={modal.data?.name ?? ""} placeholder="Amani Otieno" className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Admission ID *</Label>
                <Input defaultValue={modal.data?.admission ?? ""} className="h-9 text-sm font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Class *</Label>
                <Select defaultValue={modal.data?.klass ?? "Grade 5A"}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {classes.map(k => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Parent/Guardian *</Label>
                <Input defaultValue={modal.data?.parent ?? ""} className="h-9 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Phone *</Label>
                <Input defaultValue={modal.data?.phone ?? "+254"} className="h-9 text-sm font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Fee Balance (KES)</Label>
                <Input type="number" defaultValue={modal.data?.balance ?? 0} className="h-9 text-sm" />
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 gap-2">
            <Button variant="outline" size="sm" onClick={() => setModal({ open: false })} className="border-slate-300">
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
              {modal.data ? "Save Changes" : "Enroll Student"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}