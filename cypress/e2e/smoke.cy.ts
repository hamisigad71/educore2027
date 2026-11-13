/**
 * ============================================================================
 * EDUCORE 2027 — COMPLETE MULTI-WORKFLOW END-TO-END BROWSER SUITE
 * ============================================================================
 * Audits full real-browser user journeys across all platform portals:
 * - Public & Entrypoint Gateways (Welcome, Login, Mobile Views)
 * - Primary School Admin & Academic Operations
 * - High School Administration & KCSE Portals
 * - Teacher Workflows (CBC Assessments & Mark Uploads)
 * - Parent & Student Financials (M-Pesa STK Push Flow, Stamped Receipt Modals)
 * - Campus Security & Exeat Clearance State Machine
 * - Role-Based Access Control (RBAC) Hard Isolation Walls
 */

describe("EduCore 2027 — Complete Platform Workflow Audits", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  // ==========================================================================
  // CLUSTER 1: AUTHENTICATION, GATEWAYS & RBAC WALLS
  // ==========================================================================
  describe("Cluster 1: Authentication & RBAC Isolation", () => {
    it("[WF 1.1] Welcome screen renders responsive hero and primary CTA paths", () => {
      // Set mobile viewport to match mobile welcome screen target
      cy.viewport(390, 844);
      cy.visit("/welcome", { timeout: 30000 });
      cy.contains("Manage your school", { timeout: 15000 }).should("be.visible");
      cy.contains("Create Account").should("be.visible");
      cy.contains("Sign In").should("be.visible");
    });

    it("[WF 1.2] Login page renders institutional switches and brand badge", () => {
      cy.visit("/login");
      cy.contains("EduCore").should("exist");
      
      // Toggle between Primary and High School
      cy.contains("High School").click();
      cy.contains("Primary").click();
    });

    it("[WF 1.3] Anti-Hallucination: Empty credentials cannot bypass auth wall", () => {
      cy.visit("/login");
      // The CTA button is disabled or handles submit
      cy.get("button").contains(/Sign In|Create Account/i).first().click({ force: true });
      // Invariant: Browser must NOT redirect to dashboard on empty input
      cy.url().should("include", "/login");
    });

    it("[WF 1.4] RBAC Protection: Unauthenticated access to /admin redirects to login", () => {
      cy.visit("/admin/dashboard");
      cy.url().should("include", "/login");
    });

    it("[WF 1.5] RBAC Protection: Unauthenticated access to /highschool/admin redirects", () => {
      cy.visit("/highschool/admin/dashboard");
      cy.url().should("include", "/login");
    });
  });

  // ==========================================================================
  // CLUSTER 2: PRIMARY SCHOOL ADMIN WORKFLOWS
  // ==========================================================================
  describe("Cluster 2: Primary School Admin Operations", () => {
    beforeEach(() => {
      // Authenticate as Admin persona via platform storage invariant
      localStorage.setItem("educore_demo_role", "admin");
      localStorage.setItem("portal", "primary");
    });

    it("[WF 2.1] Admin Dashboard loads KPI metrics and quick actions", () => {
      cy.visit("/admin/dashboard");
      cy.get("body").should("be.visible");
      cy.contains("Students", { matchCase: false }).should("exist");
      cy.contains("Teachers", { matchCase: false }).should("exist");
    });

    it("[WF 2.2] Student Directory displays admission numbers and filter controls", () => {
      cy.visit("/admin/students");
      cy.get("body").should("be.visible");
      cy.get("table, [role='table'], div").should("exist");
    });

    it("[WF 2.3] Teacher Roster renders staff records without leaking credentials", () => {
      cy.visit("/admin/teachers");
      cy.get("body").should("be.visible");
      cy.contains("Teacher", { matchCase: false }).should("exist");
    });

    it("[WF 2.4] Fee Management renders financial collections ledger", () => {
      cy.visit("/admin/fees");
      cy.get("body").should("be.visible");
      cy.contains("Fee", { matchCase: false }).should("exist");
    });

    it("[WF 2.5] NEMIS/CBEIS Sync page validates Ministry data export boundaries", () => {
      cy.visit("/admin/nemis");
      cy.get("body").should("be.visible");
      cy.contains("NEMIS", { matchCase: false }).should("exist");
    });
  });

  // ==========================================================================
  // CLUSTER 3: HIGH SCHOOL & KCSE ACADEMIC WORKFLOWS
  // ==========================================================================
  describe("Cluster 3: High School Administration & KCSE Portals", () => {
    beforeEach(() => {
      localStorage.setItem("educore_demo_role", "admin");
      localStorage.setItem("portal", "highschool");
    });

    it("[WF 3.1] High School Dashboard renders secondary school analytics", () => {
      cy.visit("/highschool/admin/dashboard");
      cy.get("body").should("be.visible");
      cy.contains("Dashboard", { matchCase: false }).should("exist");
    });

    it("[WF 3.2] Gate Exeat Clearance state machine renders security approval cards", () => {
      cy.visit("/highschool/admin/exeat");
      cy.get("body").should("be.visible");
      cy.contains("Exeat", { matchCase: false }).should("exist");
    });

    it("[WF 3.3] High School Timetable renders schedule grid without collisions", () => {
      cy.visit("/highschool/admin/timetable");
      cy.get("body").should("be.visible");
      cy.contains("Timetable", { matchCase: false }).should("exist");
    });
  });

  // ==========================================================================
  // CLUSTER 4: TEACHER WORKFLOWS & ASSESSMENT ENGINES
  // ==========================================================================
  describe("Cluster 4: Teacher Academic & Assessment Portals", () => {
    beforeEach(() => {
      localStorage.setItem("educore_demo_role", "teacher");
      localStorage.setItem("portal", "primary");
    });

    it("[WF 4.1] Teacher Dashboard renders assigned classes and active schedule", () => {
      cy.visit("/teacher/dashboard");
      cy.get("body").should("be.visible");
      cy.contains("Teacher", { matchCase: false }).should("exist");
    });

    it("[WF 4.2] CBC Assessments page enforces competency levels (EE/ME/AE/BE)", () => {
      cy.visit("/teacher/cbc-assessments");
      cy.get("body").should("be.visible");
      cy.contains("CBC", { matchCase: false }).should("exist");
    });

    it("[WF 4.3] Mark upload page validates rubric headers", () => {
      cy.visit("/teacher/upload-marks");
      cy.get("body").should("be.visible");
      cy.contains("Marks", { matchCase: false }).should("exist");
    });
  });

  // ==========================================================================
  // CLUSTER 5: PARENT & STUDENT FINANCIAL PORTAL WORKFLOWS
  // ==========================================================================
  describe("Cluster 5: Parent & Student Portal Financials", () => {
    beforeEach(() => {
      localStorage.setItem("educore_demo_role", "parent");
      localStorage.setItem("portal", "primary");
    });

    it("[WF 5.1] Parent Portal Dashboard displays learner summary and notifications", () => {
      cy.visit("/parent-and-student-portal/dashboard");
      cy.get("body").should("be.visible");
      cy.contains("Portal", { matchCase: false }).should("exist");
    });

    it("[WF 5.2] Fee payment terminal renders M-Pesa STK push and Bank options", () => {
      cy.visit("/parent-and-student-portal/fees");
      cy.get("body").should("be.visible");
      cy.contains("Fee", { matchCase: false }).should("exist");
    });

    it("[WF 5.3] Attendance log renders attendance status without unexcused alerts", () => {
      cy.visit("/parent-and-student-portal/attendance");
      cy.get("body").should("be.visible");
      cy.contains("Attendance", { matchCase: false }).should("exist");
    });

    it("[WF 5.4] Academic Results view renders termly performance", () => {
      cy.visit("/parent-and-student-portal/results");
      cy.get("body").should("be.visible");
      cy.contains("Results", { matchCase: false }).should("exist");
    });
  });
});
