import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, Component } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Loader from "@/components/ui/loader";
import ChatbotWidget from "@/components/ui/ChatbotWidget";

// ─── Top-level Error Boundary ─────────────────────────────────────────────────
// Prevents a blank white page if any component throws an uncaught error.
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, message: error?.message || "Unknown error" };
  }
  componentDidCatch(error: Error, info: any) {
    console.error("[EduCore] Uncaught error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "Inter, sans-serif", padding: "2rem", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 24, maxWidth: 400 }}>
            EduCore encountered an unexpected error. Please refresh the page to try again.
          </p>
          <code style={{ fontSize: 11, color: "#ef4444", background: "#fef2f2", padding: "8px 16px", borderRadius: 8, maxWidth: 500, wordBreak: "break-word" }}>
            {this.state.message}
          </code>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 24, padding: "12px 28px", background: "#4f46e5", color: "white", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}


// Pages
import Home from "@/pages/home";
import Login from "@/pages/login";
import OnboardingVideo from "@/pages/onboarding-video";

// Admin
import AdminLayout from "@/primaryschool/src/pages/admin/layout";
import AdminDashboard from "@/primaryschool/src/pages/admin/dashboard";
import AdminStudents from "@/primaryschool/src/pages/admin/students";
import AdminTeachers from "@/primaryschool/src/pages/admin/teachers";
import AdminTeacherProfile from "@/primaryschool/src/pages/admin/teacher-profile";
import AdminClasses from "@/primaryschool/src/pages/admin/classes";
import AdminFees from "@/primaryschool/src/pages/admin/fees";
import AdminResults from "@/primaryschool/src/pages/admin/results";
import AdminAttendance from "@/primaryschool/src/pages/admin/attendance";
import AdminTimetable from "@/primaryschool/src/pages/admin/timetable";
import AdminStaffManagement from "@/primaryschool/src/pages/admin/staff";

// Teacher
import TeacherLayout from "@/primaryschool/src/pages/teacher/layout";
import TeacherDashboard from "@/primaryschool/src/pages/teacher/dashboard";
import TeacherClasses from "@/primaryschool/src/pages/teacher/classes";
import TeacherStudents from "@/primaryschool/src/pages/teacher/students";
import TeacherMarks from "@/primaryschool/src/pages/teacher/marks";
import TeacherUploadMarks from "@/primaryschool/src/pages/teacher/upload-marks";
import TeacherAttendance from "@/primaryschool/src/pages/teacher/attendance";
import TeacherProfile from "@/primaryschool/src/pages/teacher/profile";
import TeacherLessons from "@/primaryschool/src/pages/teacher/lessons";
import TeacherTimetable from "@/primaryschool/src/pages/teacher/timetable";
import TeacherResources from "@/primaryschool/src/pages/teacher/resources";
import TeacherAssignments from "@/primaryschool/src/pages/teacher/assignments";
import TeacherConduct from "@/primaryschool/src/pages/teacher/conduct";
import TeacherWelfare from "@/primaryschool/src/pages/teacher/welfare";
import TeacherAnalytics from "@/primaryschool/src/pages/teacher/analytics";
import TeacherRequests from "@/primaryschool/src/pages/teacher/requests";

// Parent/Student Portal
import ParentLayout from "@/primaryschool/src/pages/parent-and-student-portal/layout";
import PortalDashboard from "@/primaryschool/src/pages/parent-and-student-portal/dashboard";
import PortalResults from "@/primaryschool/src/pages/parent-and-student-portal/results";
import PortalFees from "@/primaryschool/src/pages/parent-and-student-portal/fees";
import PortalAttendance from "@/primaryschool/src/pages/parent-and-student-portal/attendance";
import PortalProfile from "@/primaryschool/src/pages/parent-and-student-portal/profile";
import PortalResources from "@/primaryschool/src/pages/parent-and-student-portal/resources";
import PortalReports from "@/primaryschool/src/pages/parent-and-student-portal/reports";
import PortalNotices from "@/primaryschool/src/pages/parent-and-student-portal/notices";
import PortalCalendar from "@/primaryschool/src/pages/parent-and-student-portal/calendar";
import PortalMessages from "@/primaryschool/src/pages/parent-and-student-portal/messages";
import { PortalPlaceholder } from "@/components/portal/PortalPlaceholder";
import PortalTransport from "./primaryschool/src/pages/parent-and-student-portal/transport";
import PortalConduct from "./primaryschool/src/pages/parent-and-student-portal/conduct";
import PortalMeals from "./primaryschool/src/pages/parent-and-student-portal/meals";
import PortalActivities from "./primaryschool/src/pages/parent-and-student-portal/activities";
import PortalVault from "./primaryschool/src/pages/parent-and-student-portal/vault";
import PortalStore from "./primaryschool/src/pages/parent-and-student-portal/store";

// Staff
import StaffLayout from "@/primaryschool/src/pages/staff/layout";
import StaffDashboard from "@/primaryschool/src/pages/staff/dashboard";
import StaffTasks from "@/primaryschool/src/pages/staff/tasks";
import StaffAttendance from "@/primaryschool/src/pages/staff/attendance";
import StaffNotices from "@/primaryschool/src/pages/staff/notices";
import StaffProfile from "@/primaryschool/src/pages/staff/profile";

// Primary — Head Teacher
import PSHeadTeacherPortal from "@/primaryschool/src/pages/staff/headteacher/dashboard";
import PSHeadTeacherAcademics from "@/primaryschool/src/pages/staff/headteacher/academics";
import PSHeadTeacherReports from "@/primaryschool/src/pages/staff/headteacher/reports";

// Primary — Bursar
import PSBursarPortal from "@/primaryschool/src/pages/staff/bursar/dashboard";
import PSBursarPayroll from "@/primaryschool/src/pages/staff/bursar/payroll";
import PSBursarExpenses from "@/primaryschool/src/pages/staff/bursar/expenses";

// Primary — Secretary
import PSSecretaryPortal from "@/primaryschool/src/pages/staff/secretary/dashboard";
import PSSecretaryCorrespondence from "@/primaryschool/src/pages/staff/secretary/correspondence";
import PSSecretaryRecords from "@/primaryschool/src/pages/staff/secretary/records";

// Primary — Canteen
import PSCanteenPortal from "@/primaryschool/src/pages/staff/canteen/dashboard";
import PSCanteenInventory from "@/primaryschool/src/pages/staff/canteen/inventory";

// High School Admin
import HSAdminLayout from "@/highschool/src/pages/admin/layout";
import HSAdminDashboard from "@/highschool/src/pages/admin/dashboard";
import HSAdminStudents from "@/highschool/src/pages/admin/students";
import HSAdminTeachers from "@/highschool/src/pages/admin/teachers";
import HSAdminClasses from "@/highschool/src/pages/admin/classes";
import HSAdminFees from "@/highschool/src/pages/admin/fees";
import HSAdminResults from "@/highschool/src/pages/admin/results";
import HSAdminAttendance from "@/highschool/src/pages/admin/attendance";
import HSAdminTimetable from "@/highschool/src/pages/admin/timetable";
import HSAdminStaffManagement from "@/highschool/src/pages/admin/staff";

// High School Teacher
import HSTeacherLayout from "@/highschool/src/pages/teacher/layout";
import HSTeacherDashboard from "@/highschool/src/pages/teacher/dashboard";
import HSTeacherClasses from "@/highschool/src/pages/teacher/classes";
import HSTeacherStudents from "@/highschool/src/pages/teacher/students";
import HSTeacherMarks from "@/highschool/src/pages/teacher/marks";
import HSTeacherUploadMarks from "@/highschool/src/pages/teacher/upload-marks";
import HSTeacherAttendance from "@/highschool/src/pages/teacher/attendance";
import HSTeacherProfile from "@/highschool/src/pages/teacher/profile";
import HSTeacherLessons from "@/highschool/src/pages/teacher/lessons";
import HSTeacherTimetable from "@/highschool/src/pages/teacher/timetable";
import HSTeacherResources from "@/highschool/src/pages/teacher/resources";
import HSTeacherAssignments from "@/highschool/src/pages/teacher/assignments";
import HSTeacherConduct from "@/highschool/src/pages/teacher/conduct";
import HSTeacherWelfare from "@/highschool/src/pages/teacher/welfare";
import HSTeacherAnalytics from "@/highschool/src/pages/teacher/analytics";
import HSTeacherRequests from "@/highschool/src/pages/teacher/requests";

// High School Parent/Student Portal
import HSParentLayout from "@/highschool/src/pages/parent-and-student-portal/layout";
import HSPortalDashboard from "@/highschool/src/pages/parent-and-student-portal/dashboard";
import HSPortalResults from "@/highschool/src/pages/parent-and-student-portal/results";
import HSPortalFees from "@/highschool/src/pages/parent-and-student-portal/fees";
import HSPortalAttendance from "@/highschool/src/pages/parent-and-student-portal/attendance";
import HSPortalProfile from "@/highschool/src/pages/parent-and-student-portal/profile";

// High School Staff
import HSStaffLayout from "@/highschool/src/pages/staff/layout";
import HSStaffDashboard from "@/highschool/src/pages/staff/dashboard";
import HSStaffTasks from "@/highschool/src/pages/staff/tasks";
import HSStaffAttendance from "@/highschool/src/pages/staff/attendance";
import HSStaffNotices from "@/highschool/src/pages/staff/notices";
import HSStaffProfile from "@/highschool/src/pages/staff/profile";

// High School Specialized Staff
import HSBursarDashboard from "@/highschool/src/pages/staff/bursar/dashboard";
import HSBursarFees from "@/highschool/src/pages/staff/bursar/fees";
import HSBursarPayroll from "@/highschool/src/pages/staff/bursar/payroll";
import HSBursarExpenses from "@/highschool/src/pages/staff/bursar/expenses";

import HSAdmissionsPortal from "@/highschool/src/pages/staff/admissions/dashboard";
import AdmissionsInquiries from "@/highschool/src/pages/staff/admissions/inquiries";
import AdmissionsEnrollment from "@/highschool/src/pages/staff/admissions/enrollment";
import AdmissionsTransfers from "@/highschool/src/pages/staff/admissions/transfers";

import HSInventoryPortal from "@/highschool/src/pages/staff/inventory/dashboard";
import InventoryAssets from "@/highschool/src/pages/staff/inventory/assets";
import InventoryRequests from "@/highschool/src/pages/staff/inventory/requests";
import InventoryMaintenance from "@/highschool/src/pages/staff/inventory/maintenance";

import HSLibraryPortal from "@/highschool/src/pages/staff/library/dashboard";
import LibraryCatalog from "@/highschool/src/pages/staff/library/catalog";
import LibraryCirculation from "@/highschool/src/pages/staff/library/circulation";
import LibraryFines from "@/highschool/src/pages/staff/library/fines";

import HSSanatoriumPortal from "@/highschool/src/pages/staff/sanatorium/dashboard";
import SanatoriumRecords from "@/highschool/src/pages/staff/sanatorium/records";
import SanatoriumVisits from "@/highschool/src/pages/staff/sanatorium/visits";
import SanatoriumSupplies from "@/highschool/src/pages/staff/sanatorium/supplies";

import HSBoardingPortal from "@/highschool/src/pages/staff/boarding/dashboard";
import BoardingAllocations from "@/highschool/src/pages/staff/boarding/allocations";
import BoardingIncidents from "@/highschool/src/pages/staff/boarding/incidents";
import BoardingExeats from "@/highschool/src/pages/staff/boarding/exeats";

import HSOperationsPortal from "@/highschool/src/pages/staff/operations/dashboard";
import OperationsVisitors from "@/highschool/src/pages/staff/operations/visitors";
import OperationsTransport from "@/highschool/src/pages/staff/operations/transport";
import OperationsWorkOrders from "@/highschool/src/pages/staff/operations/work-orders";

// Route guard
function RequireAuth({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role && user.role !== role && user.role !== "admin") return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, portal, department, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      {/* High School Admin Portal */}
      <Route path="/highschool/admin" element={<RequireAuth role="admin"><HSAdminLayout /></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<HSAdminDashboard />} />
        <Route path="students" element={<HSAdminStudents />} />
        <Route path="teachers" element={<HSAdminTeachers />} />
        <Route path="classes" element={<HSAdminClasses />} />
        <Route path="fees" element={<HSAdminFees />} />
        <Route path="results" element={<HSAdminResults />} />
        <Route path="attendance" element={<HSAdminAttendance />} />
        <Route path="timetable" element={<HSAdminTimetable />} />
        <Route path="staff" element={<HSAdminStaffManagement />} />
      </Route>

      {/* High School Teacher Portal */}
      <Route path="/highschool/teacher" element={<RequireAuth role="teacher"><HSTeacherLayout /></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<HSTeacherDashboard />} />
        <Route path="classes" element={<HSTeacherClasses />} />
        <Route path="students" element={<HSTeacherStudents />} />
        <Route path="marks" element={<HSTeacherMarks />} />
        <Route path="upload-marks" element={<HSTeacherUploadMarks />} />
        <Route path="attendance" element={<HSTeacherAttendance />} />
        <Route path="profile" element={<HSTeacherProfile />} />
        <Route path="lessons" element={<HSTeacherLessons />} />
        <Route path="timetable" element={<HSTeacherTimetable />} />
        <Route path="resources" element={<HSTeacherResources />} />
        <Route path="assignments" element={<HSTeacherAssignments />} />
        <Route path="conduct" element={<HSTeacherConduct />} />
        <Route path="welfare" element={<HSTeacherWelfare />} />
        <Route path="analytics" element={<HSTeacherAnalytics />} />
        <Route path="requests" element={<HSTeacherRequests />} />
      </Route>

      {/* High School Parent/Student Portal */}
      <Route path="/highschool/parent-and-student-portal" element={<RequireAuth role="parent"><HSParentLayout /></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<HSPortalDashboard />} />
        <Route path="results" element={<HSPortalResults />} />
        <Route path="fees" element={<HSPortalFees />} />
        <Route path="attendance" element={<HSPortalAttendance />} />
        <Route path="profile" element={<HSPortalProfile />} />
        {/* New Pages */}
        <Route path="resources" element={<PortalPlaceholder title="Learning Hub" />} />
        <Route path="reports" element={<PortalPlaceholder title="Termly Reports" />} />
        <Route path="calendar" element={<PortalPlaceholder title="School Calendar" />} />
        <Route path="notices" element={<PortalPlaceholder title="Notice Board" />} />
        <Route path="messages" element={<PortalPlaceholder title="Teacher Chat" />} />
        <Route path="transport" element={<PortalPlaceholder title="Transport Tracking" />} />
        <Route path="conduct" element={<PortalPlaceholder title="Conduct Log" />} />
        <Route path="meals" element={<PortalPlaceholder title="Meal Planner" />} />
        <Route path="activities" element={<PortalPlaceholder title="Co-curricular" />} />
        <Route path="vault" element={<PortalPlaceholder title="Document Vault" />} />
        <Route path="store" element={<PortalPlaceholder title="Uniform Store" />} />
      </Route>

      <Route path="/highschool/staff" element={<RequireAuth role="staff"><HSStaffLayout /></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<HSStaffDashboard />} />
        
        {/* Specialized Modules */}
        <Route path="bursar">
          <Route index element={<HSBursarDashboard />} />
          <Route path="fees" element={<HSBursarFees />} />
          <Route path="payroll" element={<HSBursarPayroll />} />
          <Route path="expenses" element={<HSBursarExpenses />} />
        </Route>
        
        <Route path="admissions">
          <Route index element={<HSAdmissionsPortal />} />
          <Route path="inquiries" element={<AdmissionsInquiries />} />
          <Route path="enrollment" element={<AdmissionsEnrollment />} />
          <Route path="transfers" element={<AdmissionsTransfers />} />
        </Route>
        <Route path="inventory">
          <Route index element={<HSInventoryPortal />} />
          <Route path="assets" element={<InventoryAssets />} />
          <Route path="requests" element={<InventoryRequests />} />
          <Route path="maintenance" element={<InventoryMaintenance />} />
        </Route>
        <Route path="library">
          <Route index element={<HSLibraryPortal />} />
          <Route path="catalog" element={<LibraryCatalog />} />
          <Route path="circulation" element={<LibraryCirculation />} />
          <Route path="fines" element={<LibraryFines />} />
        </Route>
        <Route path="sanatorium">
          <Route index element={<HSSanatoriumPortal />} />
          <Route path="records" element={<SanatoriumRecords />} />
          <Route path="visits" element={<SanatoriumVisits />} />
          <Route path="supplies" element={<SanatoriumSupplies />} />
        </Route>
        <Route path="boarding">
          <Route index element={<HSBoardingPortal />} />
          <Route path="allocations" element={<BoardingAllocations />} />
          <Route path="incidents" element={<BoardingIncidents />} />
          <Route path="exeats" element={<BoardingExeats />} />
        </Route>
        <Route path="operations">
          <Route index element={<HSOperationsPortal />} />
          <Route path="visitors" element={<OperationsVisitors />} />
          <Route path="transport" element={<OperationsTransport />} />
          <Route path="work-orders" element={<OperationsWorkOrders />} />
        </Route>

        <Route path="tasks" element={<HSStaffTasks />} />
        <Route path="attendance" element={<HSStaffAttendance />} />
        <Route path="notices" element={<HSStaffNotices />} />
        <Route path="profile" element={<HSStaffProfile />} />
      </Route>

      {/* Onboarding Video (shown after account creation) */}
      <Route path="/onboarding" element={<OnboardingVideo />} />

      {/* Login */}
      <Route path="/login" element={user ? (
        portal === "highschool"
          ? <Navigate to={`/highschool/${user.role === "admin" ? "admin" : user.role === "teacher" ? "teacher" : user.role === "parent" ? "parent-and-student-portal" : "staff"}/${user.role === "staff" && department ? department : "dashboard"}`} replace />
          : <Navigate to={`/${user.role === "admin" ? "admin" : user.role === "teacher" ? "teacher" : user.role === "parent" ? "parent-and-student-portal" : "staff"}/${user.role === "staff" && department ? department : "dashboard"}`} replace />
      ) : <Login />} />

      {/* Admin Portal */}
      <Route path="/admin" element={<RequireAuth role="admin"><AdminLayout /></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="teachers" element={<AdminTeachers />} />
        <Route path="teachers/:id" element={<AdminTeacherProfile />} />
        <Route path="classes" element={<AdminClasses />} />
        <Route path="fees" element={<AdminFees />} />
        <Route path="results" element={<AdminResults />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="timetable" element={<AdminTimetable />} />
        <Route path="staff" element={<AdminStaffManagement />} />
      </Route>

      {/* Teacher Portal */}
      <Route path="/teacher" element={<RequireAuth role="teacher"><TeacherLayout /></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="classes" element={<TeacherClasses />} />
        <Route path="students" element={<TeacherStudents />} />
        <Route path="marks" element={<TeacherMarks />} />
        <Route path="upload-marks" element={<TeacherUploadMarks />} />
        <Route path="attendance" element={<TeacherAttendance />} />
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="lessons" element={<TeacherLessons />} />
        <Route path="timetable" element={<TeacherTimetable />} />
        <Route path="resources" element={<TeacherResources />} />
        <Route path="assignments" element={<TeacherAssignments />} />
        <Route path="conduct" element={<TeacherConduct />} />
        <Route path="welfare" element={<TeacherWelfare />} />
        <Route path="analytics" element={<TeacherAnalytics />} />
        <Route path="requests" element={<TeacherRequests />} />
      </Route>

      {/* Parent/Student Portal */}
      <Route path="/parent-and-student-portal" element={<RequireAuth role="parent"><ParentLayout /></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PortalDashboard />} />
        <Route path="results" element={<PortalResults />} />
        <Route path="fees" element={<PortalFees />} />
        <Route path="attendance" element={<PortalAttendance />} />
        <Route path="profile" element={<PortalProfile />} />
        {/* New Pages */}
        <Route path="resources" element={<PortalResources />} />
        <Route path="reports" element={<PortalReports />} />
        <Route path="calendar" element={<PortalCalendar />} />
        <Route path="notices" element={<PortalNotices />} />
        <Route path="messages" element={<PortalMessages />} />
        <Route path="transport" element={<PortalTransport />} />
        <Route path="conduct" element={<PortalConduct />} />
        <Route path="meals" element={<PortalMeals />} />
        <Route path="activities" element={<PortalActivities />} />
        <Route path="vault" element={<PortalVault />} />
        <Route path="store" element={<PortalStore />} />
      </Route>

      {/* Staff Portal */}
      <Route path="/staff" element={<RequireAuth role="staff"><StaffLayout /></RequireAuth>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="tasks" element={<StaffTasks />} />
        <Route path="attendance" element={<StaffAttendance />} />
        <Route path="notices" element={<StaffNotices />} />
        <Route path="profile" element={<StaffProfile />} />

        {/* Head Teacher */}
        <Route path="headteacher">
          <Route index element={<PSHeadTeacherPortal />} />
          <Route path="academics" element={<PSHeadTeacherAcademics />} />
          <Route path="reports" element={<PSHeadTeacherReports />} />
        </Route>

        {/* Bursar */}
        <Route path="bursar">
          <Route index element={<PSBursarPortal />} />
          <Route path="payroll" element={<PSBursarPayroll />} />
          <Route path="expenses" element={<PSBursarExpenses />} />
        </Route>

        {/* Secretary */}
        <Route path="secretary">
          <Route index element={<PSSecretaryPortal />} />
          <Route path="correspondence" element={<PSSecretaryCorrespondence />} />
          <Route path="records" element={<PSSecretaryRecords />} />
        </Route>

        {/* Canteen */}
        <Route path="canteen">
          <Route index element={<PSCanteenPortal />} />
          <Route path="inventory" element={<PSCanteenInventory />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="/" element={user ? (
        portal === "highschool"
          ? <Navigate to={`/highschool/${user.role === "admin" ? "admin" : user.role === "teacher" ? "teacher" : user.role === "parent" ? "parent-and-student-portal" : "staff"}/${user.role === "staff" && department ? department : "dashboard"}`} replace />
          : <Navigate to={`/${user.role === "admin" ? "admin" : user.role === "teacher" ? "teacher" : user.role === "parent" ? "parent-and-student-portal" : "staff"}/dashboard`} replace />
      ) : <Home />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}


/**
 * Global Navigation Loader
 * Triggers on every route change to give a "premium" transition feel.
 */
function NavigationLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    // Trigger on route change — Standard transition should be snappier
    if (location.pathname !== prevPathRef.current) {
      const fromLogin = prevPathRef.current === "/login" || prevPathRef.current === "/";
      const toLogin = location.pathname === "/login";
      
      prevPathRef.current = location.pathname;

      if (fromLogin || toLogin) {
        return;
      }

      // Standard Portal Navigation
      const duration = 5000; // 5-second transition

      setLoading(true);
      setProgress(0);

      const interval = 20;
      const increment = 100 / (duration / interval);

      const timer = setInterval(() => {
        setProgress(p => Math.min(100, p + increment));
      }, interval);

      const navTimer = setTimeout(() => {
        setLoading(false);
        clearInterval(timer);
      }, duration);

      return () => {
        clearInterval(timer);
        clearTimeout(navTimer);
        setLoading(false);
      };
    }
  }, [location.pathname]);

  // Initial app boot
  useEffect(() => {
    setLoading(true);
    setProgress(0);
    const duration = 1800; // Snappy premium splash
    const interval = 30;
    const increment = 100 / (duration / interval);
    const timer = setInterval(() => setProgress(p => Math.min(100, p + increment)), interval);
    const bootTimer = setTimeout(() => {
      setLoading(false);
      clearInterval(timer);
    }, duration);
    return () => {
      clearInterval(timer);
      clearTimeout(bootTimer);
    };
  }, []);

  if (!loading) return null;

  return (
    <Loader 
      fullScreen 
      variant="progress"
      text="Updating Workspace" 
      subText="Fetching fresh data for your session..."
      size="lg"
      progress={progress}
      steps={["Syncing", "Verifying", "Optimizing", "Ready"]}
    />
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <div style={{ fontFamily: "Inter, system-ui, -apple-system, Roboto, sans-serif" }}>
            <style>{`
              * { -webkit-font-smoothing: antialiased; box-sizing: border-box; }
              :root { color-scheme: light; }
            `}</style>
            <NavigationLoader />
            <AppRoutes />
            <ChatbotWidget />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}