import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout";
import { useAuth } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Briefcase } from "lucide-react";

// ── Shared staff components (used by both Primary & High School portals) ─────
import {
  StaffStatCard,
  StaffTaskList,
  StaffNoticesCard,
  TimeTracker,
  StaffTask,
  StaffNotice,
} from "@/components/staff/StaffShared";

import { ClipboardList, CheckCircle2, Calendar, Bell } from "lucide-react";

// ─── Default task data for Primary School staff ───────────────────────────────

const DEFAULT_TASKS: StaffTask[] = [
  {
    id: 1,
    title: "Deep clean classrooms — Block A",
    done: true,
    priority: "High",
    location: "Block A",
    estimatedTime: "3 hrs",
    assignedBy: "Head Janitor",
    description: "Complete deep cleaning including windows, floors, and desks",
  },
  {
    id: 2,
    title: "Monthly fire safety equipment check",
    done: true,
    priority: "High",
    location: "All Buildings",
    estimatedTime: "1 hr",
    assignedBy: "Safety Officer",
  },
  {
    id: 3,
    title: "Repair broken desk in Grade 6B classroom",
    done: false,
    priority: "High",
    location: "Grade 6B",
    estimatedTime: "45 mins",
    assignedBy: "Admin",
    description: "Fix wobbly leg and tighten all screws",
  },
  {
    id: 4,
    title: "Repaint main school gate",
    done: false,
    priority: "Low",
    location: "Main Entrance",
    estimatedTime: "4 hrs",
    assignedBy: "Maintenance Head",
  },
  {
    id: 5,
    title: "Service air conditioning units",
    done: false,
    priority: "Medium",
    location: "Admin Block",
    estimatedTime: "2 hrs",
    assignedBy: "Facilities Manager",
  },
];

const DEFAULT_NOTICES: StaffNotice[] = [
  {
    title: "Staff appreciation lunch this Friday",
    date: "Today",
    type: "info",
    priority: "normal",
    description: "Join us at 1:00 PM in the staff room for appreciation lunch",
  },
  {
    title: "Emergency drill scheduled",
    date: "Tomorrow",
    type: "warning",
    priority: "high",
    description: "Fire safety drill at 10:00 AM — ensure all equipment is ready",
  },
  {
    title: "New equipment delivery expected",
    date: "This week",
    type: "info",
    priority: "low",
    description: "Cleaning supplies and maintenance tools arriving Wednesday",
  },
];

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function StaffDashboard() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [taskList, setTaskList] = useState<StaffTask[]>(DEFAULT_TASKS);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const greeting =
    currentTime.getHours() < 12 ? "Good Morning" : "Good Afternoon";

  const completed      = taskList.filter((t) => t.done).length;
  const completionRate = Math.round((completed / taskList.length) * 100);

  const toggleTask = (id: number) =>
    setTaskList((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <div className="space-y-8">
      <PageHeader
        variant="banner"
        title={`Hello, ${user?.name?.split(" ")[1] ?? "Staff"} 👋`}
        subtitle={greeting}
        actions={
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-white/20 text-white border-white/30 font-semibold backdrop-blur-sm">
              <Briefcase className="mr-1 h-3 w-3" />
              Operations Staff
            </Badge>
          </div>
        }
      />

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StaffStatCard
          label="Active Tasks"
          value={taskList.filter((t) => !t.done).length}
          subText="Pending work orders"
          icon={ClipboardList}
          color=""
          trend="stable"
          change="2 new today"
          interactive
        />
        <StaffStatCard
          label="Completion Rate"
          value={`${completionRate}%`}
          subText="This week's progress"
          icon={CheckCircle2}
          color=""
          trend="up"
          change="+5%"
        />
        <StaffStatCard
          label="Attendance"
          value="96.5%"
          subText="Monthly average"
          icon={Calendar}
          color=""
          trend="up"
          change="+2.1%"
        />
        <StaffStatCard
          label="Notifications"
          value={DEFAULT_NOTICES.length}
          subText="Unread updates"
          icon={Bell}
          color=""
          trend="stable"
          change="1 urgent"
          interactive
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Task List — 2/3 width */}
        <div className="lg:col-span-2">
          <StaffTaskList
            tasks={taskList}
            onToggle={toggleTask}
            onUpdate={(id) => console.log("Update task", id)}
            title="Work Queue"
            subtitle="Your assigned tasks and maintenance work orders"
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <TimeTracker />
          <StaffNoticesCard notices={DEFAULT_NOTICES} />
        </div>
      </div>
    </div>
  );
}