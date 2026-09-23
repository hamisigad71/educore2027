/**
 * Shared Staff Components
 * Used by both Primary School (/primaryschool) and High School (/highschool) staff portals.
 * Any UI logic common to all staff roles lives here to avoid duplication.
 */
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp, Timer, PlayCircle, PauseCircle,
  CheckCircle2, MapPin, Clock, Users, Settings,
  Bell, AlertTriangle, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Stat Card ───────────────────────────────────────────────────────────────

export interface StaffStatCardProps {
  label: string;
  value: string | number;
  subText: string;
  color: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "stable";
  change?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export function StaffStatCard({
  label, value, subText, icon: Icon, color, trend, change, interactive = false, onClick,
}: StaffStatCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-primary to-indigo-700 text-white transition-all duration-300",
        interactive && "cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
      )}
      onClick={onClick}
    >
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
            <Icon size={20} className="text-white" />
          </div>
          {trend && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border border-white/20 bg-white/10 backdrop-blur-sm text-white">
              <TrendingUp size={12} className={trend === "down" ? "rotate-180" : ""} />
              {change}
            </div>
          )}
        </div>
        <p className="text-2xl font-bold tracking-tight leading-none mb-2 text-white">{value}</p>
        <p className="text-[12px] font-bold text-white/90 mb-1 uppercase tracking-wider">{label}</p>
        <p className="text-[10px] text-white/50 font-medium italic truncate">{subText}</p>
      </CardContent>
    </Card>
  );
}

// ─── Time Tracker ────────────────────────────────────────────────────────────

export function TimeTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTracking) {
      interval = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const formatTime = (seconds: number) => {
    const hrs  = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return [hrs, mins, secs].map((v) => String(v).padStart(2, "0")).join(":");
  };

  return (
    <Card className="shadow-lg border-slate-200/80">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Timer className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Work Timer</h3>
          </div>
          <div className="text-3xl font-mono font-bold text-foreground tracking-wider">
            {formatTime(elapsed)}
          </div>
          <Button
            onClick={() => setIsTracking(!isTracking)}
            className={cn(
              "w-full h-12 font-semibold transition-all duration-200",
              isTracking
                ? "bg-rose-500 hover:bg-rose-600 text-white"
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
            )}
          >
            {isTracking ? (
              <><PauseCircle className="mr-2 h-5 w-5" />Stop Working</>
            ) : (
              <><PlayCircle className="mr-2 h-5 w-5" />Start Working</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Task Card ───────────────────────────────────────────────────────────────

export interface StaffTask {
  id: number;
  title: string;
  done: boolean;
  priority: "High" | "Medium" | "Low";
  location?: string;
  estimatedTime?: string;
  assignedBy?: string;
  description?: string;
}

export function TaskCard({
  task, onToggle, onUpdate,
}: {
  task: StaffTask;
  onToggle: () => void;
  onUpdate: () => void;
}) {
  const priorityColor: Record<string, string> = {
    High:   "bg-rose-50 text-rose-700 border-rose-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Low:    "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <div className={cn(
      "group relative p-5 rounded-xl border transition-all duration-200 bg-white shadow-sm hover:shadow-md",
      task.done ? "opacity-70 bg-slate-50" : "hover:border-indigo-200"
    )}>
      <div className="flex items-start gap-4">
        <button
          onClick={onToggle}
          className={cn(
            "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-0.5 flex-shrink-0",
            task.done
              ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
              : "border-slate-300 hover:border-indigo-400 bg-white"
          )}
        >
          {task.done && <CheckCircle2 size={14} />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h4 className={cn("font-semibold text-sm leading-tight transition-all", task.done ? "text-slate-500 line-through" : "text-slate-900")}>
              {task.title}
            </h4>
            <Badge className={`text-xs font-semibold border ${priorityColor[task.priority] ?? priorityColor.Low}`}>
              {task.priority}
            </Badge>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500">
            {task.location    && <span className="flex items-center gap-1"><MapPin  size={12} />{task.location}</span>}
            {task.estimatedTime && <span className="flex items-center gap-1"><Clock  size={12} />{task.estimatedTime}</span>}
            {task.assignedBy  && <span className="flex items-center gap-1"><Users  size={12} />{task.assignedBy}</span>}
          </div>
          {task.description && <p className="text-xs text-slate-600 mt-2 leading-relaxed">{task.description}</p>}
        </div>
      </div>

      {!task.done && (
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant="outline" onClick={onUpdate} className="h-8 text-xs border-slate-200 hover:border-indigo-300 hover:bg-indigo-50">
            <Settings size={12} className="mr-1" />Update
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Task List with Progress ──────────────────────────────────────────────────

export function StaffTaskList({ tasks, onToggle, onUpdate, title = "Work Queue", subtitle = "Your assigned tasks and maintenance work orders" }: {
  tasks: StaffTask[];
  onToggle: (id: number) => void;
  onUpdate: (id: number) => void;
  title?: string;
  subtitle?: string;
}) {
  const completed      = tasks.filter((t) => t.done).length;
  const completionRate = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <Card className="shadow-lg border-slate-200/80">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/60 p-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 shadow-sm">+ New Task</Button>
        </div>
        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-slate-700">Daily Progress</span>
            <span className="font-bold text-slate-900">{completed}/{tasks.length} tasks</span>
          </div>
          <Progress value={completionRate} className="h-3 bg-slate-100" />
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onToggle={() => onToggle(task.id)} onUpdate={() => onUpdate(task.id)} />
        ))}
      </CardContent>
    </Card>
  );
}

// ─── Staff Notice Card ────────────────────────────────────────────────────────

export interface StaffNotice {
  title: string;
  date: string;
  type: "info" | "warning";
  priority: "normal" | "high" | "low";
  description?: string;
}

export function StaffNoticesCard({ notices }: { notices: StaffNotice[] }) {
  return (
    <Card className="shadow-lg border-slate-200/80">
      <CardHeader className="p-5 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-900">Staff Updates</CardTitle>
          <Badge className="bg-rose-50 text-rose-700 border-rose-200 font-semibold">
            {notices.filter((n) => n.priority === "high").length} urgent
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {notices.map((notice, i) => (
          <div key={i} className={cn(
            "p-4 rounded-xl border transition-all duration-200 hover:shadow-sm",
            notice.type === "warning" ? "bg-amber-50 border-amber-200" : "bg-blue-50 border-blue-200"
          )}>
            <div className="flex items-start gap-3">
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                notice.type === "warning" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
              )}>
                {notice.type === "warning" ? <AlertTriangle size={16} /> : <Bell size={16} />}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-sm text-slate-900 leading-tight mb-1">{notice.title}</h4>
                {notice.description && <p className="text-xs text-slate-600 leading-relaxed mb-2">{notice.description}</p>}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">{notice.date}</span>
                  {notice.priority === "high" && (
                    <Badge className="bg-rose-100 text-rose-700 border-rose-200 text-xs">Urgent</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <Button variant="ghost" className="w-full text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
          View All Updates <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
