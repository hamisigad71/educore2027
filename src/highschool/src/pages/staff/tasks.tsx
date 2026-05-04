import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

import {
  ClipboardList, CheckCircle2, Plus, Search,
  Clock, MoreVertical, ChevronRight, Star,
  Trash2, Edit3, Flag, TrendingUp, Circle,
  AlertCircle, Layers, CalendarDays, Timer
} from "lucide-react";
import { cn } from "@/lib/utils";

type Priority = "High" | "Medium" | "Low";
type Tab = "all" | "pending" | "done";

interface Task {
  id: number;
  title: string;
  done: boolean;
  priority: Priority;
  time: string;
  category: string;
  starred: boolean;
}

const INITIAL_TASKS: Task[] = [
  { id: 1, title: "Sweep classrooms — Block A", done: true, priority: "High", time: "07:30 AM", category: "Cleaning", starred: false },
  { id: 2, title: "Check fire extinguishers", done: true, priority: "Medium", time: "08:15 AM", category: "Safety", starred: true },
  { id: 3, title: "Fix broken desk in Form 6B", done: false, priority: "High", time: "09:00 AM", category: "Maintenance", starred: true },
  { id: 4, title: "Repaint school gate", done: false, priority: "Low", time: "Pending", category: "Maintenance", starred: false },
  { id: 5, title: "Clean admin toilets", done: false, priority: "Medium", time: "10:30 AM", category: "Cleaning", starred: false },
  { id: 6, title: "Replace corridor light bulbs", done: false, priority: "High", time: "11:00 AM", category: "Electrical", starred: false },
];

const PRIORITY_CONFIG: Record<Priority, { label: string; className: string; dotColor: string }> = {
  High:   { label: "High",   className: "bg-rose-50 text-rose-700 border border-rose-100",     dotColor: "bg-rose-500" },
  Medium: { label: "Medium", className: "bg-amber-50 text-amber-700 border border-amber-100", dotColor: "bg-amber-500" },
  Low:    { label: "Low",    className: "bg-slate-100 text-slate-500 border border-slate-200", dotColor: "bg-slate-400" },
};

export default function StaffTasks() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("Medium");
  const [newTime, setNewTime] = useState("");
  const [newCategory, setNewCategory] = useState("General");

  const doneCount = tasks.filter(t => t.done).length;
  const progress = Math.round((doneCount / tasks.length) * 100);
  const highCount = tasks.filter(t => t.priority === "High" && !t.done).length;
  const starredCount = tasks.filter(t => t.starred).length;

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      const matchesQuery = t.title.toLowerCase().includes(query.toLowerCase());
      const matchesTab =
        tab === "all" ? true :
        tab === "pending" ? !t.done :
        t.done;
      return matchesQuery && matchesTab;
    });
  }, [tasks, query, tab]);

  const toggle = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
    const task = tasks.find(t => t.id === id);
    if (task && !task.done) {
      toast({ title: "Task completed", description: `"${task.title}" marked as done.` });
    }
  };

  const toggleStar = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, starred: !t.starred } : t));
  };

  const deleteTask = (id: number) => {
    const task = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    toast({ title: "Task removed", description: `"${task?.title}" has been deleted.`, variant: "destructive" });
  };

  const openNew = () => {
    setEditTask(null);
    setNewTitle(""); setNewPriority("Medium"); setNewTime(""); setNewCategory("General");
    setDialogOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditTask(task);
    setNewTitle(task.title); setNewPriority(task.priority);
    setNewTime(task.time); setNewCategory(task.category);
    setDialogOpen(true);
  };

  const saveTask = () => {
    if (!newTitle.trim()) return;
    if (editTask) {
      setTasks(prev => prev.map(t => t.id === editTask.id
        ? { ...t, title: newTitle, priority: newPriority, time: newTime || "Pending", category: newCategory }
        : t
      ));
      toast({ title: "Task updated" });
    } else {
      const next: Task = {
        id: Date.now(), title: newTitle, done: false,
        priority: newPriority, time: newTime || "Pending",
        category: newCategory, starred: false,
      };
      setTasks(prev => [...prev, next]);
      toast({ title: "Task created", description: `"${newTitle}" added to your list.` });
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Tasks"
        subtitle="Manage your daily work orders and maintenance requests"
        actions={
          <Button
            onClick={openNew}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm gap-1.5 text-xs h-9 font-semibold"
          >
            <Plus size={14} /> New Task
          </Button>
        }
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Tasks", value: tasks.length, icon: Layers, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Completed", value: doneCount, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "High Priority", value: highCount, icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "Starred", value: starredCount, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
        ].map((kpi) => (
          <Card key={kpi.label} className="shadow-sm border-slate-200/80">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", kpi.bg)}>
                <kpi.icon size={18} className={kpi.color} />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{kpi.label}</p>
                <p className="text-2xl font-bold text-slate-900 leading-tight">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Progress card */}
        <Card className="shadow-sm border-slate-200/80 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 60%)" }} />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Daily Progress</p>
                <h3 className="text-4xl font-bold tracking-tight">{progress}%</h3>
                <p className="text-xs text-slate-500 mt-1">{doneCount} of {tasks.length} tasks done</p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                <TrendingUp size={20} className="text-indigo-400" />
              </div>
            </div>

            <Progress value={progress} className="h-2 bg-white/10 mb-4 [&>div]:bg-indigo-500" />

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
              {(["High", "Medium", "Low"] as Priority[]).map(p => {
                const count = tasks.filter(t => t.priority === p && !t.done).length;
                return (
                  <div key={p} className="text-center">
                    <div className={cn(
                      "text-lg font-bold",
                      p === "High" ? "text-rose-400" : p === "Medium" ? "text-amber-400" : "text-slate-400"
                    )}>{count}</div>
                    <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">{p}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Task list */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200/80">
          <CardHeader className="px-6 py-4 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-sm font-semibold text-slate-900">Operations List</CardTitle>
                <CardDescription className="text-xs mt-0.5">Click a task to mark complete</CardDescription>
              </div>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="h-8 pl-8 pr-3 text-xs w-44 border-slate-200 bg-slate-50"
                />
              </div>
            </div>
            <Tabs value={tab} onValueChange={v => setTab(v as Tab)} className="mt-3">
              <TabsList className="h-8 bg-slate-100 p-0.5 rounded-lg">
                <TabsTrigger value="all" className="text-[11px] font-semibold h-7 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">All</TabsTrigger>
                <TabsTrigger value="pending" className="text-[11px] font-semibold h-7 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">Pending</TabsTrigger>
                <TabsTrigger value="done" className="text-[11px] font-semibold h-7 px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">Done</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <ScrollArea className="h-[340px]">
            <CardContent className="p-4 space-y-2">
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <ClipboardList size={32} className="mb-2 opacity-30" />
                  <p className="text-xs font-medium">No tasks found</p>
                </div>
              )}
              {filtered.map(t => (
                <div
                  key={t.id}
                  className={cn(
                    "group flex items-center justify-between px-4 py-3 rounded-xl border transition-all",
                    t.done
                      ? "bg-slate-50 border-slate-100 opacity-60"
                      : "bg-white border-slate-100 hover:border-indigo-200 hover:shadow-sm cursor-pointer"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0" onClick={() => toggle(t.id)}>
                    <button className={cn(
                      "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                      t.done ? "bg-emerald-500 border-emerald-500" : "border-slate-300 hover:border-indigo-400"
                    )}>
                      {t.done && <CheckCircle2 size={11} className="text-white" />}
                    </button>
                    <div className="min-w-0">
                      <p className={cn("text-sm font-medium truncate", t.done ? "line-through text-slate-400" : "text-slate-800")}>
                        {t.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock size={10} /> {t.time}
                        </span>
                        <span className="text-[10px] text-slate-300">·</span>
                        <span className="text-[10px] text-slate-400">{t.category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={cn("text-[10px] font-semibold px-2 py-0 border rounded-full", PRIORITY_CONFIG[t.priority].className)}>
                      {t.priority}
                    </Badge>

                    <button onClick={() => toggleStar(t.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Star size={13} className={t.starred ? "fill-amber-400 text-amber-400" : "text-slate-300"} />
                    </button>

                    <DropdownMenu>
                    <DropdownMenuTrigger>
                        <button className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 opacity-0 group-hover:opacity-100 transition-all">
                          <MoreVertical size={13} />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 text-xs">
                        <DropdownMenuItem onClick={() => openEdit(t)} className="gap-2">
                          <Edit3 size={12} /> Edit task
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStar(t.id)} className="gap-2">
                          <Star size={12} /> {t.starred ? "Unstar" : "Star"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => deleteTask(t.id)} className="gap-2 text-rose-600">
                          <Trash2 size={12} /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>
      </div>

      {/* Performance banner */}
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-xl bg-white border border-emerald-100 shadow-sm flex items-center justify-center">
            <CheckCircle2 size={20} className="text-emerald-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-emerald-900">Excellent Performance</h4>
            <p className="text-xs text-emerald-700/70 mt-0.5 font-medium">
              You've completed {progress}% of today's tasks. Keep it up!
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="text-xs font-semibold border-emerald-200 text-emerald-700 bg-white hover:bg-emerald-50 gap-1.5 shrink-0">
          View Task History <ChevronRight size={13} />
        </Button>
      </div>

      {/* New / Edit Task Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {editTask ? "Edit Task" : "New Task"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Task Title</Label>
              <Input
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Describe the task..."
                className="text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">Priority</Label>
                <Select value={newPriority} onValueChange={v => setNewPriority(v as Priority)}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High" className="text-xs">High</SelectItem>
                    <SelectItem value="Medium" className="text-xs">Medium</SelectItem>
                    <SelectItem value="Low" className="text-xs">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-600">Category</Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["General","Cleaning","Maintenance","Safety","Electrical"].map(c => (
                      <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Scheduled Time</Label>
              <Input
                value={newTime}
                onChange={e => setNewTime(e.target.value)}
                placeholder="e.g. 09:00 AM"
                className="text-sm"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose render={<Button variant="outline" size="sm" className="text-xs" />}>Cancel</DialogClose>
            <Button size="sm" onClick={saveTask} className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs gap-1.5">
              {editTask ? <><Edit3 size={12}/> Save Changes</> : <><Plus size={12}/> Create Task</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}