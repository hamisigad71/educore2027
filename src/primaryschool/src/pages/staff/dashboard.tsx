import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout";
import { useAuth } from "@/context/AuthContext";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// lucide
import { 
  CheckCircle2, Clock, Bell, Calendar, MapPin,
  Construction, ClipboardList, Zap, Wrench,
  AlertTriangle, ChevronRight, Plus, Timer,
  TrendingUp, Activity, Settings, Users,
  PlayCircle, PauseCircle, CheckSquare,
  AlertCircle, Briefcase, Coffee
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Enhanced Stat Card ──────────────────────────────────────────────────────

function StaffStatCard({
  label, value, subText, icon: Icon, color, trend, change, interactive = false, onClick
}: {
  label: string; 
  value: string | number; 
  subText: string; 
  color: string;
  icon: any; 
  trend?: "up" | "down" | "stable";
  change?: string;
  interactive?: boolean;
  onClick?: () => void;
}) {
  return (
    <Card 
      className={cn(
        "shadow-lg border-slate-200/80 transition-all duration-300",
        interactive && "cursor-pointer hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300"
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border shadow-sm", color)}>
            <Icon size={20} />
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
              trend === "up" ? "bg-emerald-50 text-emerald-700" :
              trend === "down" ? "bg-rose-50 text-rose-700" :
              "bg-slate-50 text-slate-700"
            )}>
              <TrendingUp size={12} className={trend === "down" ? "rotate-180" : ""} />
              {change}
            </div>
          )}
        </div>
        <p className="text-2xl font-bold text-slate-900 tracking-tight leading-none mb-1">{value}</p>
        <p className="text-sm font-semibold text-slate-700 mb-1">{label}</p>
        <p className="text-xs text-slate-500">{subText}</p>
      </CardContent>
    </Card>
  );
}

// ─── Time Tracking Widget ────────────────────────────────────────────────────

function TimeTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => setElapsed(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="shadow-lg border-slate-200/80">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Timer className="h-5 w-5 text-indigo-600" />
            <h3 className="font-semibold text-slate-900">Work Timer</h3>
          </div>
          <div className="text-3xl font-mono font-bold text-slate-900 tracking-wider">
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
              <>
                <PauseCircle className="mr-2 h-5 w-5" />
                Stop Working
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-5 w-5" />
                Start Working
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Enhanced Task Component ─────────────────────────────────────────────────

function TaskCard({ task, onToggle, onUpdate }: { 
  task: any; 
  onToggle: () => void; 
  onUpdate: () => void; 
}) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-rose-50 text-rose-700 border-rose-200";
      case "Medium": return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
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
            <h4 className={cn(
              "font-semibold text-sm leading-tight transition-all",
              task.done ? "text-slate-500 line-through" : "text-slate-900"
            )}>
              {task.title}
            </h4>
            <Badge className={`text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              {task.location || "Main Building"}
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              {task.estimatedTime || "2 hrs"}
            </div>
            <div className="flex items-center gap-1">
              <Users size={12} />
              {task.assignedBy || "Admin"}
            </div>
          </div>
          
          {task.description && (
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
      </div>
      
      {!task.done && (
        <div className="flex gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={onUpdate}
            className="h-8 text-xs border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
          >
            <Settings size={12} className="mr-1" />
            Update
          </Button>
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function StaffDashboard() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const tasks = [
    { 
      id: 1,
      title: "Deep clean classrooms — Block A", 
      done: true, 
      priority: "High",
      location: "Block A",
      estimatedTime: "3 hrs",
      assignedBy: "Head Janitor",
      description: "Complete deep cleaning including windows, floors, and desks"
    },
    { 
      id: 2,
      title: "Monthly fire safety equipment check", 
      done: true, 
      priority: "High",
      location: "All Buildings",
      estimatedTime: "1 hr",
      assignedBy: "Safety Officer"
    },
    { 
      id: 3,
      title: "Repair broken desk in Grade 6B classroom", 
      done: false, 
      priority: "High",
      location: "Grade 6B",
      estimatedTime: "45 mins",
      assignedBy: "Admin",
      description: "Fix wobbly leg and tighten all screws"
    },
    { 
      id: 4,
      title: "Repaint main school gate", 
      done: false, 
      priority: "Low",
      location: "Main Entrance",
      estimatedTime: "4 hrs",
      assignedBy: "Maintenance Head"
    },
    { 
      id: 5,
      title: "Service air conditioning units", 
      done: false, 
      priority: "Medium",
      location: "Admin Block",
      estimatedTime: "2 hrs",
      assignedBy: "Facilities Manager"
    },
  ];

  const [taskList, setTaskList] = useState(tasks);
  const completed = taskList.filter(t => t.done).length;
  const completionRate = Math.round((completed / taskList.length) * 100);

  const notices = [
    { 
      title: "Staff appreciation lunch this Friday", 
      date: "Today", 
      type: "info",
      priority: "normal",
      description: "Join us at 1:00 PM in the staff room for appreciation lunch"
    },
    { 
      title: "Emergency drill scheduled", 
      date: "Tomorrow", 
      type: "warning",
      priority: "high",
      description: "Fire safety drill at 10:00 AM - please ensure all equipment is ready"
    },
    { 
      title: "New equipment delivery expected", 
      date: "This week", 
      type: "info",
      priority: "low",
      description: "Cleaning supplies and maintenance tools arriving Wednesday"
    },
  ];

  const recentActivity = [
    { action: "Completed", item: "Classroom cleaning Block A", time: "2 hours ago", type: "completion" },
    { action: "Started", item: "Fire safety inspection", time: "3 hours ago", type: "start" },
    { action: "Updated", item: "Equipment inventory", time: "Yesterday", type: "update" },
    { action: "Reported", item: "Broken window in Grade 5", time: "2 days ago", type: "report" },
  ];

  const toggleTask = (id: number) => {
    setTaskList(prev => prev.map(t => 
      t.id === id ? { ...t, done: !t.done } : t
    ));
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Construction size={120} />
        </div>
        <div className="relative z-10 grid md:grid-cols-2 gap-6 items-center">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-white/30 shadow-xl bg-white/10">
              <AvatarImage src={user?.photo} className="object-cover" />
              <AvatarFallback className="text-xl font-bold text-amber-700 bg-white">
                {user?.name?.split(" ").map((n:any) => n[0]).slice(0,2).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-amber-100 text-sm font-medium mb-1">
                {getGreeting()}, it's {currentTime.toLocaleDateString('en-KE', { weekday: 'long' })} 👋
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{user?.name}</h2>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/20 text-white border-white/30 font-semibold">
                  <Briefcase className="mr-1 h-3 w-3" />
                  Operations Staff
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 font-semibold">
                  <Construction className="mr-1 h-3 w-3" />
                  Maintenance Team
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
              <p className="text-3xl font-bold text-white">{completionRate}%</p>
              <p className="text-amber-100 text-sm font-medium">Tasks Complete</p>
            </div>
            <div className="text-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
              <p className="text-3xl font-bold text-white">8.5</p>
              <p className="text-amber-100 text-sm font-medium">Hours Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StaffStatCard 
          label="Active Tasks" 
          value={`${taskList.filter(t => !t.done).length}`}
          subText="Pending work orders"
          icon={ClipboardList} 
          color="bg-indigo-50 text-indigo-600 border-indigo-200" 
          trend="stable"
          change="2 new today"
          interactive={true}
        />
        <StaffStatCard 
          label="Completion Rate" 
          value={`${completionRate}%`}
          subText="This week's progress"
          icon={CheckCircle2} 
          color="bg-emerald-50 text-emerald-600 border-emerald-200" 
          trend="up"
          change="+5%"
        />
        <StaffStatCard 
          label="Attendance" 
          value="96.5%"
          subText="Monthly average"
          icon={Calendar} 
          color="bg-blue-50 text-blue-600 border-blue-200" 
          trend="up"
          change="+2.1%"
        />
        <StaffStatCard 
          label="Notifications" 
          value={notices.length}
          subText="Unread updates"
          icon={Bell} 
          color="bg-amber-50 text-amber-600 border-amber-200" 
          trend="stable"
          change="1 urgent"
          interactive={true}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Enhanced Task Management */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg border-slate-200/80">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-900">Work Queue</CardTitle>
                  <CardDescription className="text-sm text-slate-600 mt-1">
                    Your assigned tasks and maintenance work orders
                  </CardDescription>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                  <Plus className="mr-2 h-4 w-4" />
                  New Task
                </Button>
              </div>
              
              {/* Progress Overview */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700">Daily Progress</span>
                  <span className="font-bold text-slate-900">{completed}/{taskList.length} tasks</span>
                </div>
                <Progress value={completionRate} className="h-3 bg-slate-100">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${completionRate}%` }}
                  />
                </Progress>
              </div>
            </CardHeader>
            
            <CardContent className="p-6 space-y-4">
              {taskList.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(task.id)}
                  onUpdate={() => console.log('Update task', task.id)}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Sidebar */}
        <div className="space-y-6">
          {/* Time Tracker */}
          <TimeTracker />

          {/* Enhanced Notices */}
          <Card className="shadow-lg border-slate-200/80">
            <CardHeader className="p-5 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-slate-900">Staff Updates</CardTitle>
                <Badge className="bg-rose-50 text-rose-700 border-rose-200 font-semibold">
                  {notices.filter(n => n.priority === 'high').length} urgent
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {notices.map((notice, i) => (
                <div key={i} className={cn(
                  "p-4 rounded-xl border transition-all duration-200 hover:shadow-sm",
                  notice.type === "warning" 
                    ? "bg-amber-50 border-amber-200" 
                    : "bg-blue-50 border-blue-200"
                )}>
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      notice.type === "warning" 
                        ? "bg-amber-100 text-amber-600" 
                        : "bg-blue-100 text-blue-600"
                    )}>
                      {notice.type === "warning" ? <AlertTriangle size={16} /> : <Bell size={16} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-sm text-slate-900 leading-tight mb-1">
                        {notice.title}
                      </h4>
                      {notice.description && (
                        <p className="text-xs text-slate-600 leading-relaxed mb-2">
                          {notice.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">{notice.date}</span>
                        {notice.priority === 'high' && (
                          <Badge className="bg-rose-100 text-rose-700 border-rose-200 text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="ghost" className="w-full text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                View All Updates
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-lg border-slate-200/80">
            <CardHeader className="p-5 border-b border-slate-100">
              <CardTitle className="text-lg font-bold text-slate-900">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className={cn(
                    "h-2 w-2 rounded-full flex-shrink-0",
                    activity.type === "completion" ? "bg-emerald-500" :
                    activity.type === "start" ? "bg-blue-500" :
                    activity.type === "update" ? "bg-amber-500" : "bg-rose-500"
                  )} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-900">
                      <span className="font-semibold">{activity.action}</span> {activity.item}
                    </p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}