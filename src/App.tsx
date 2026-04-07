import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Pages
import Login from "@/pages/login";

// Admin
import AdminLayout from "@/pages/admin/layout";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminStudents from "@/pages/admin/students";
import AdminTeachers from "@/pages/admin/teachers";
import AdminClasses from "@/pages/admin/classes";
import AdminFees from "@/pages/admin/fees";
import AdminResults from "@/pages/admin/results";
import AdminAttendance from "@/pages/admin/attendance";
import AdminTimetable from "@/pages/admin/timetable";
import AdminSettings from "@/pages/admin/settings";

// Teacher
import TeacherLayout from "@/pages/teacher/layout";
import TeacherDashboard from "@/pages/teacher/dashboard";
import TeacherClasses from "@/pages/teacher/classes";
import TeacherStudents from "@/pages/teacher/students";
import TeacherMarks from "@/pages/teacher/marks";
import TeacherAttendance from "@/pages/teacher/attendance";
import TeacherProfile from "@/pages/teacher/profile";

// Parent/Student Portal
import ParentLayout from "@/pages/parent-and-student-portal/layout";
import PortalDashboard from "@/pages/parent-and-student-portal/dashboard";
import PortalResults from "@/pages/parent-and-student-portal/results";
import PortalFees from "@/pages/parent-and-student-portal/fees";
import PortalAttendance from "@/pages/parent-and-student-portal/attendance";
import PortalProfile from "@/pages/parent-and-student-portal/profile";

// Staff
import StaffLayout from "@/pages/staff/layout";
import StaffDashboard from "@/pages/staff/dashboard";
import StaffTasks from "@/pages/staff/tasks";
import StaffAttendance from "@/pages/staff/attendance";
import StaffNotices from "@/pages/staff/notices";
import StaffProfile from "@/pages/staff/profile";

// Route guard
function RequireAuth({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role && user.role !== role && user.role !== "admin") return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Login */}
      <Route path="/login" element={user ? <Navigate to={`/${user.role === "admin" ? "admin" : user.role === "teacher" ? "teacher" : user.role === "parent" ? "parent-and-student-portal" : "staff"}/dashboard`} replace /> : <Login />} />

      {/* Admin Portal */}
      <Route path="/admin" element={<RequireAuth role="admin"><AdminLayout /></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="classes" element={<AdminClasses />} />
        <Route path="fees" element={<AdminFees />} />
        <Route path="results" element={<AdminResults />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="timetable" element={<AdminTimetable />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Teacher Portal */}
      <Route path="/teacher" element={<RequireAuth role="teacher"><TeacherLayout /></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="classes" element={<TeacherClasses />} />
        <Route path="students" element={<TeacherStudents />} />
        <Route path="marks" element={<TeacherMarks />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="profile" element={<TeacherProfile />} />
      </Route>

      {/* Parent/Student Portal */}
      <Route path="/parent-and-student-portal" element={<RequireAuth role="parent"><ParentLayout /></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PortalDashboard />} />
        <Route path="results" element={<PortalResults />} />
        <Route path="fees" element={<PortalFees />} />
        <Route path="attendance" element={<PortalAttendance />} />
        <Route path="profile" element={<PortalProfile />} />
      </Route>

      {/* Staff Portal */}
      <Route path="/staff" element={<RequireAuth role="staff"><StaffLayout /></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="tasks" element={<StaffTasks />} />
        <Route path="attendance" element={<StaffAttendance />} />
        <Route path="notices" element={<StaffNotices />} />
        <Route path="profile" element={<StaffProfile />} />
      </Route>

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ fontFamily: "Inter, system-ui, -apple-system, Roboto, sans-serif" }}>
          <style>{`
            * { -webkit-font-smoothing: antialiased; box-sizing: border-box; }
            :root { color-scheme: light; }
          `}</style>
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}