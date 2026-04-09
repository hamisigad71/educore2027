import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts and Pages
import AdminLayout from "./pages/admin/layout";
import AdminDashboard from "./pages/admin/dashboard";
import AdminStudents from "./pages/admin/students";
import AdminTeachers from "./pages/admin/teachers";
import AdminClasses from "./pages/admin/classes";
import AdminFees from "./pages/admin/fees";
import AdminResults from "./pages/admin/results";
import AdminAttendance from "./pages/admin/attendance";
import AdminTimetable from "./pages/admin/timetable";
import AdminStaffManagement from "./pages/admin/staff";

import TeacherLayout from "./pages/teacher/layout";
import TeacherDashboard from "./pages/teacher/dashboard";
import TeacherClasses from "./pages/teacher/classes";
import TeacherStudents from "./pages/teacher/students";
import TeacherMarks from "./pages/teacher/marks";
import TeacherAttendance from "./pages/teacher/attendance";
import TeacherProfile from "./pages/teacher/profile";

import ParentLayout from "./pages/parent-and-student-portal/layout";
import PortalDashboard from "./pages/parent-and-student-portal/dashboard";
import PortalResults from "./pages/parent-and-student-portal/results";
import PortalFees from "./pages/parent-and-student-portal/fees";
import PortalAttendance from "./pages/parent-and-student-portal/attendance";
import PortalProfile from "./pages/parent-and-student-portal/profile";

import StaffLayout from "./pages/staff/layout";
import StaffDashboard from "./pages/staff/dashboard";
import StaffTasks from "./pages/staff/tasks";
import StaffAttendance from "./pages/staff/attendance";
import StaffNotices from "./pages/staff/notices";
import StaffProfile from "./pages/staff/profile";

// Specialized Staff Roles
import BursarPortal from "./pages/staff/bursar";
import AdmissionsPortal from "./pages/staff/admissions";
import InventoryPortal from "./pages/staff/inventory";
import LibraryPortal from "./pages/staff/library";
import SanatoriumPortal from "./pages/staff/sanatorium";
import BoardingPortal from "./pages/staff/boarding";
import OperationsPortal from "./pages/staff/operations";

function App() {
  return (
    <BrowserRouter basename="/highschool">
      <Routes>
        {/* Admin Portal */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="teachers" element={<AdminTeachers />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="fees" element={<AdminFees />} />
          <Route path="results" element={<AdminResults />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="timetable" element={<AdminTimetable />} />
          <Route path="staff" element={<AdminStaffManagement />} />
        </Route>

        {/* Teacher Portal */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="classes" element={<TeacherClasses />} />
          <Route path="students" element={<TeacherStudents />} />
          <Route path="marks" element={<TeacherMarks />} />
          <Route path="attendance" element={<TeacherAttendance />} />
          <Route path="profile" element={<TeacherProfile />} />
        </Route>

        {/* Parent/Student Portal */}
        <Route path="/parent-and-student-portal" element={<ParentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PortalDashboard />} />
          <Route path="results" element={<PortalResults />} />
          <Route path="fees" element={<PortalFees />} />
          <Route path="attendance" element={<PortalAttendance />} />
          <Route path="profile" element={<PortalProfile />} />
        </Route>

        {/* Staff Portal */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StaffDashboard />} />
          
          {/* Specialized Modules */}
          <Route path="bursar" element={<BursarPortal />} />
          <Route path="admissions" element={<AdmissionsPortal />} />
          <Route path="inventory" element={<InventoryPortal />} />
          <Route path="library" element={<LibraryPortal />} />
          <Route path="sanatorium" element={<SanatoriumPortal />} />
          <Route path="boarding" element={<BoardingPortal />} />
          <Route path="operations" element={<OperationsPortal />} />

          <Route path="tasks" element={<StaffTasks />} />
          <Route path="attendance" element={<StaffAttendance />} />
          <Route path="notices" element={<StaffNotices />} />
          <Route path="profile" element={<StaffProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
