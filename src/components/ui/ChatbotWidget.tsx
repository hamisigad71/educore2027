import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
  links?: { label: string; to: string }[];
  timestamp: Date;
};

type PortalContext = {
  role: string;
  school: "primary" | "highschool";
  department?: string;
  prefix: string;
};

// ─── Portal Detection ──────────────────────────────────────────────────────────

function detectPortal(pathname: string): PortalContext {
  const hs = pathname.startsWith("/highschool");
  const prefix = hs ? "/highschool" : "";

  if (pathname.includes("/admin"))                    return { role: "admin",   school: hs ? "highschool" : "primary", prefix: `${prefix}/admin` };
  if (pathname.includes("/teacher"))                  return { role: "teacher", school: hs ? "highschool" : "primary", prefix: `${prefix}/teacher` };
  if (pathname.includes("/parent-and-student-portal"))return { role: "parent",  school: hs ? "highschool" : "primary", prefix: `${prefix}/parent-and-student-portal` };
  if (pathname.includes("/staff/bursar"))             return { role: "staff",   school: hs ? "highschool" : "primary", prefix: `${prefix}/staff`, department: "bursar" };
  if (pathname.includes("/staff/headteacher"))        return { role: "staff",   school: "primary", prefix: "/staff", department: "headteacher" };
  if (pathname.includes("/staff/secretary"))          return { role: "staff",   school: "primary", prefix: "/staff", department: "secretary" };
  if (pathname.includes("/staff/canteen"))            return { role: "staff",   school: "primary", prefix: "/staff", department: "canteen" };
  if (pathname.includes("/staff/admissions"))         return { role: "staff",   school: "highschool", prefix: "/highschool/staff", department: "admissions" };
  if (pathname.includes("/staff/inventory"))          return { role: "staff",   school: "highschool", prefix: "/highschool/staff", department: "inventory" };
  if (pathname.includes("/staff/library"))            return { role: "staff",   school: "highschool", prefix: "/highschool/staff", department: "library" };
  if (pathname.includes("/staff/sanatorium"))         return { role: "staff",   school: "highschool", prefix: "/highschool/staff", department: "sanatorium" };
  if (pathname.includes("/staff/boarding"))           return { role: "staff",   school: "highschool", prefix: "/highschool/staff", department: "boarding" };
  if (pathname.includes("/staff/operations"))         return { role: "staff",   school: "highschool", prefix: "/highschool/staff", department: "operations" };
  if (pathname.includes("/staff"))                    return { role: "staff",   school: hs ? "highschool" : "primary", prefix: `${prefix}/staff` };

  return { role: "guest", school: "primary", prefix: "" };
}

// ─── Knowledge Base ────────────────────────────────────────────────────────────

type KBEntry = {
  keywords: string[];
  response: string;
  links?: { label: string; to: string }[];
};

function getKnowledgeBase(ctx: PortalContext): KBEntry[] {
  const p = ctx.prefix;

  const common: KBEntry[] = [
    {
      keywords: ["hello", "hi", "hey", "help", "start", "what can you do"],
      response: "👋 Hi there! I'm **EduBot**, your platform navigator. Ask me anything like:\n- *\"Where do I check attendance?\"*\n- *\"How do I view results?\"*\n- *\"Navigate to dashboard\"*",
    },
    {
      keywords: ["profile", "account", "my info", "my details", "settings"],
      response: "Your profile page lets you view and update your personal details.",
      links: [{ label: "Go to Profile", to: `${p}/profile` }],
    },
    {
      keywords: ["dashboard", "home", "overview", "main page"],
      response: "Head to the Dashboard for a quick overview of everything.",
      links: [{ label: "Open Dashboard", to: `${p}/dashboard` }],
    },
    {
      keywords: ["logout", "log out", "sign out", "exit"],
      response: "To log out, click your profile avatar in the top bar and select **Sign Out**.",
    },
    {
      keywords: ["notice", "announcement", "board", "news"],
      response: "Check the Notice Board for school announcements and updates.",
      links: [{ label: "Notice Board", to: `${p}/notices` }],
    },
  ];

  const byRole: Record<string, KBEntry[]> = {
    admin: [
      {
        keywords: ["student", "students", "learner", "pupil", "enroll"],
        response: "Manage all student records — enrol, search, or view profiles.",
        links: [{ label: "Students", to: `${p}/students` }],
      },
      {
        keywords: ["teacher", "teachers", "staff list", "faculty"],
        response: "View and manage teacher records here.",
        links: [{ label: "Teachers", to: `${p}/teachers` }],
      },
      {
        keywords: ["class", "classes", "stream", "grade", "form"],
        response: "Organise classes, streams and class assignments.",
        links: [{ label: "Classes", to: `${p}/classes` }],
      },
      {
        keywords: ["fee", "fees", "payment", "balance", "invoice", "finance"],
        response: "Track fee balances, generate invoices and view payment history.",
        links: [{ label: "Fees & Finance", to: `${p}/fees` }],
      },
      {
        keywords: ["result", "results", "marks", "grade", "report card", "exam"],
        response: "View and publish academic results for all students.",
        links: [{ label: "Results", to: `${p}/results` }],
      },
      {
        keywords: ["attendance", "present", "absent", "register"],
        response: "Monitor school-wide daily attendance records.",
        links: [{ label: "Attendance", to: `${p}/attendance` }],
      },
      {
        keywords: ["timetable", "schedule", "time table", "period"],
        response: "View and set the school master timetable.",
        links: [{ label: "Timetable", to: `${p}/timetable` }],
      },
      {
        keywords: ["staff", "staff management", "manage staff", "hr"],
        response: "Manage non-teaching staff records and assignments.",
        links: [{ label: "Staff Management", to: `${p}/staff` }],
      },
    ],
    teacher: [
      {
        keywords: ["class", "classes", "my class", "stream", "grade"],
        response: "View all your assigned classes and their student lists.",
        links: [{ label: "My Classes", to: `${p}/classes` }],
      },
      {
        keywords: ["mark", "marks", "enter marks", "grade", "score", "result"],
        response: "Enter examination or assignment marks for your students here.",
        links: [{ label: "Enter Marks", to: `${p}/marks` }],
      },
      {
        keywords: ["attendance", "register", "present", "absent", "roll call"],
        response: "Take daily attendance for your classes.",
        links: [{ label: "Attendance", to: `${p}/attendance` }],
      },
      {
        keywords: ["lesson", "lesson plan", "scheme", "planner"],
        response: "Create and manage your lesson plans.",
        links: [{ label: "Lesson Planner", to: `${p}/lessons` }],
      },
      {
        keywords: ["timetable", "schedule", "periods", "time table"],
        response: "View your personal weekly teaching timetable.",
        links: [{ label: "My Timetable", to: `${p}/timetable` }],
      },
      {
        keywords: ["resource", "resources", "material", "document", "file"],
        response: "Access and upload teaching resources.",
        links: [{ label: "Resources", to: `${p}/resources` }],
      },
      {
        keywords: ["assignment", "assignments", "homework", "task"],
        response: "Create and manage assignments for your students.",
        links: [{ label: "Assignments", to: `${p}/assignments` }],
      },
      {
        keywords: ["student", "students", "my students", "learner"],
        response: "View the students in your classes.",
        links: [{ label: "My Students", to: `${p}/students` }],
      },
      {
        keywords: ["conduct", "behaviour", "behavior", "discipline", "incident"],
        response: "Log and review student behavioural incidents.",
        links: [{ label: "Behavioural Log", to: `${p}/conduct` }],
      },
      {
        keywords: ["welfare", "wellbeing", "health", "medical", "care"],
        response: "Record and track student welfare concerns.",
        links: [{ label: "Student Welfare", to: `${p}/welfare` }],
      },
      {
        keywords: ["analytic", "analytics", "performance", "report", "trend"],
        response: "See class performance trends and analytics.",
        links: [{ label: "Analytics", to: `${p}/analytics` }],
      },
      {
        keywords: ["leave", "request", "application", "absent", "off"],
        response: "Submit and track your leave and other staff requests.",
        links: [{ label: "Leaves & Requests", to: `${p}/requests` }],
      },
    ],
    parent: [
      {
        keywords: ["result", "results", "marks", "grade", "exam", "report", "report card"],
        response: "Check your child's academic results and report cards.",
        links: [{ label: "View Results", to: `${p}/results` }],
      },
      {
        keywords: ["fee", "fees", "payment", "pay", "balance", "invoice", "mpesa"],
        response: "View fee balances and make payments for your child.",
        links: [{ label: "Fees & Payments", to: `${p}/fees` }],
      },
      {
        keywords: ["attendance", "present", "absent", "days missed"],
        response: "Track your child's daily attendance record.",
        links: [{ label: "Attendance", to: `${p}/attendance` }],
      },
      {
        keywords: ["resource", "learning", "hub", "material", "notes"],
        response: "Access the Learning Hub for study materials and resources.",
        links: [{ label: "Learning Hub", to: `${p}/resources` }],
      },
      {
        keywords: ["termly report", "term report", "end of term", "report"],
        response: "Download official termly progress reports.",
        links: [{ label: "Termly Reports", to: `${p}/reports` }],
      },
      {
        keywords: ["calendar", "events", "term dates", "holidays"],
        response: "View the school calendar with all important dates and events.",
        links: [{ label: "School Calendar", to: `${p}/calendar` }],
      },
      {
        keywords: ["message", "chat", "teacher", "communicate", "contact"],
        response: "Send messages to your child's teachers directly.",
        links: [{ label: "Teacher Chat", to: `${p}/messages` }],
      },
      {
        keywords: ["transport", "bus", "route", "pickup", "drop"],
        response: "Track your child's school bus and transport route.",
        links: [{ label: "Transport Tracking", to: `${p}/transport` }],
      },
      {
        keywords: ["conduct", "behaviour", "discipline", "incident"],
        response: "View your child's conduct and disciplinary log.",
        links: [{ label: "Conduct Log", to: `${p}/conduct` }],
      },
      {
        keywords: ["meal", "meals", "food", "menu", "diet", "lunch"],
        response: "View the school meal planner and menu.",
        links: [{ label: "Meal Planner", to: `${p}/meals` }],
      },
      {
        keywords: ["activity", "activities", "sport", "club", "cocurricular", "co-curricular"],
        response: "Explore and manage co-curricular activities.",
        links: [{ label: "Co-curricular", to: `${p}/activities` }],
      },
      {
        keywords: ["document", "vault", "certificate", "letter", "file"],
        response: "Access important school documents in the Document Vault.",
        links: [{ label: "Document Vault", to: `${p}/vault` }],
      },
      {
        keywords: ["uniform", "store", "shop", "order", "buy"],
        response: "Browse and order school uniforms from the Uniform Store.",
        links: [{ label: "Uniform Store", to: `${p}/store` }],
      },
    ],
    staff: [
      {
        keywords: ["task", "tasks", "to do", "pending", "work"],
        response: "View your assigned tasks and pending action items.",
        links: [{ label: "My Tasks", to: `${p}/tasks` }],
      },
      {
        keywords: ["attendance", "clocking", "clock in", "clock out", "shift"],
        response: "Record your daily attendance and shift times.",
        links: [{ label: "Attendance", to: `${p}/attendance` }],
      },
      // Bursar
      {
        keywords: ["payroll", "salary", "pay slip", "wages"],
        response: "Manage staff payroll and salary slips.",
        links: ctx.department === "bursar" ? [{ label: "Payroll", to: `${p}/bursar/payroll` }] : undefined,
      },
      {
        keywords: ["expense", "expenses", "expenditure", "purchase"],
        response: "Track school expenditures and expenses.",
        links: ctx.department === "bursar" ? [{ label: "Expenses", to: `${p}/bursar/expenses` }] : undefined,
      },
      // Head Teacher
      {
        keywords: ["academic", "academics", "curriculum", "school performance"],
        response: "View academic performance and curriculum overview.",
        links: ctx.department === "headteacher" ? [{ label: "Academics", to: `${p}/headteacher/academics` }] : undefined,
      },
      // Library
      {
        keywords: ["book", "books", "catalog", "catalogue", "library"],
        response: "Search the library catalog and manage book checkouts.",
        links: ctx.department === "library" ? [{ label: "Library Catalog", to: `${p}/library/catalog` }] : undefined,
      },
      {
        keywords: ["fine", "fines", "fine", "overdue", "late return"],
        response: "Manage library fines for overdue books.",
        links: ctx.department === "library" ? [{ label: "Library Fines", to: `${p}/library/fines` }] : undefined,
      },
      // Inventory
      {
        keywords: ["asset", "assets", "equipment", "inventory", "lab"],
        response: "Track school assets and lab equipment.",
        links: ctx.department === "inventory" ? [{ label: "Assets", to: `${p}/inventory/assets` }] : undefined,
      },
      // Boarding
      {
        keywords: ["dormitory", "dorm", "boarding", "hostel", "bed", "room"],
        response: "Manage dormitory allocations and boarding welfare.",
        links: ctx.department === "boarding" ? [{ label: "Allocations", to: `${p}/boarding/allocations` }] : undefined,
      },
      {
        keywords: ["exeat", "exeats", "permission", "weekend", "leave"],
        response: "Process student exeat and weekend leave requests.",
        links: ctx.department === "boarding" ? [{ label: "Exeats", to: `${p}/boarding/exeats` }] : undefined,
      },
      // Operations
      {
        keywords: ["visitor", "visitors", "gate", "security", "guard"],
        response: "Manage school visitor logs and security.",
        links: ctx.department === "operations" ? [{ label: "Visitor Log", to: `${p}/operations/visitors` }] : undefined,
      },
      {
        keywords: ["transport", "bus", "route", "vehicle", "driver"],
        response: "Manage school transport routes and vehicles.",
        links: ctx.department === "operations" ? [{ label: "Transport", to: `${p}/operations/transport` }] : undefined,
      },
      {
        keywords: ["maintenance", "repair", "work order", "broken", "fix"],
        response: "Submit and track maintenance and repair work orders.",
        links: ctx.department === "operations" ? [{ label: "Work Orders", to: `${p}/operations/work-orders` }] : undefined,
      },
      // Admissions
      {
        keywords: ["admission", "admissions", "enroll", "intake", "form 1", "new student"],
        response: "Manage the student admissions pipeline.",
        links: ctx.department === "admissions" ? [{ label: "Admissions", to: `${p}/admissions` }] : undefined,
      },
      // Sanatorium
      {
        keywords: ["health", "clinic", "sick", "medical", "nurse", "medicine"],
        response: "Access the health clinic records and medical supplies.",
        links: ctx.department === "sanatorium" ? [{ label: "Health Records", to: `${p}/sanatorium/records` }] : undefined,
      },
    ],
  };

  return [...common, ...(byRole[ctx.role] ?? [])];
}

// ─── Brain ─────────────────────────────────────────────────────────────────────

function getResponse(input: string, ctx: PortalContext): { text: string; links?: { label: string; to: string }[] } {
  const lower = input.toLowerCase().trim();
  const kb = getKnowledgeBase(ctx);

  for (const entry of kb) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return { text: entry.response, links: entry.links };
    }
  }

  return {
    text: `🤔 I'm not sure about that. Try asking:\n- *"Where do I check fees?"*\n- *"How do I take attendance?"*\n- *"Go to dashboard"*\n\nOr use the quick actions below!`,
  };
}

// ─── Quick Actions per role ────────────────────────────────────────────────────

function getQuickActions(ctx: PortalContext): string[] {
  const byRole: Record<string, string[]> = {
    admin:   ["Show me students", "How do I check fees?", "Where is the timetable?", "Manage teachers"],
    teacher: ["Where do I enter marks?", "Take attendance", "View my timetable", "My students"],
    parent:  ["Check my child's results", "How do I pay fees?", "View attendance", "School calendar"],
    staff:   ["View my tasks", "Notice board", "My attendance", "Go to dashboard"],
    guest:   ["Help", "What can you do?"],
  };
  return byRole[ctx.role] ?? byRole.guest;
}

// ─── Message renderer ──────────────────────────────────────────────────────────

function MessageBubble({ msg, onLinkClick }: { msg: Message; onLinkClick: (to: string) => void }) {
  const isBot = msg.role === "bot";

  // Parse basic markdown: **bold** and *italic*
  const formatText = (text: string) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
      return (
        <span key={i}>
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) return <strong key={j}>{part.slice(2, -2)}</strong>;
            if (part.startsWith("*") && part.endsWith("*")) return <em key={j}>{part.slice(1, -1)}</em>;
            if (part.startsWith("- ")) return <span key={j} className="block pl-3">• {part.slice(2)}</span>;
            return <span key={j}>{part}</span>;
          })}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className={cn("flex gap-2 mb-3", isBot ? "items-start" : "items-end flex-row-reverse")}>
      {isBot && (
        <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-indigo-200 mt-0.5">
          <span className="text-white text-[11px] font-black">E</span>
        </div>
      )}
      <div className={cn("max-w-[85%] space-y-2")}>
        <div
          className={cn(
            "px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed",
            isBot
              ? "bg-slate-800 text-slate-100 rounded-tl-sm"
              : "bg-indigo-600 text-white rounded-tr-sm ml-auto"
          )}
        >
          {formatText(msg.text)}
        </div>
        {msg.links && msg.links.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pl-1">
            {msg.links.map((link) => (
              <button
                key={link.to}
                onClick={() => onLinkClick(link.to)}
                className="text-[11px] font-semibold px-3 py-1 rounded-full bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all duration-150"
              >
                {link.label} →
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Typing Indicator ──────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="h-7 w-7 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
        <span className="text-white text-[11px] font-black">E</span>
      </div>
      <div className="bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────

export default function ChatbotWidget() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ctx = detectPortal(location.pathname);

  // Initial greeting when widget first opens
  useEffect(() => {
    if (open && messages.length === 0) {
      const greeting: Message = {
        id: crypto.randomUUID(),
        role: "bot",
        text: `👋 Hi${user?.name ? `, ${user.name.split(" ")[0]}` : ""}! I'm **EduBot**, your platform assistant. I can help you navigate any section of this portal. What would you like to do?`,
        timestamp: new Date(),
      };
      setMessages([greeting]);
    }
    if (open) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const resp = getResponse(text, ctx);
      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: "bot",
        text: resp.text,
        links: resp.links,
        timestamp: new Date(),
      };
      setTyping(false);
      setMessages((prev) => [...prev, botMsg]);
      if (!open) setHasUnread(true);
    }, 800 + Math.random() * 400);
  };

  const handleLinkClick = (to: string) => {
    navigate(to);
    setOpen(false);
  };

  // Don't render on auth/public pages
  if (!user || location.pathname === "/login" || location.pathname === "/" || location.pathname === "/home") {
    return null;
  }

  const quickActions = getQuickActions(ctx);

  return (
    <>
      {/* ── Chat Panel ──────────────────────────────────────────────────────── */}
      <div
        className={cn(
          "fixed bottom-24 right-5 z-[9998] w-[340px] flex flex-col",
          "bg-slate-900 rounded-3xl shadow-2xl shadow-slate-900/40 border border-slate-700/60",
          "transition-all duration-300 ease-out origin-bottom-right overflow-hidden",
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        )}
        style={{ maxHeight: "520px" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/60 bg-slate-800/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-white text-sm font-black">E</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-slate-800" />
            </div>
            <div>
              <p className="text-white text-[14px] font-bold leading-none">EduBot</p>
              <p className="text-slate-400 text-[11px] mt-0.5 font-medium">Navigation Assistant • Online</p>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-0 scrollbar-none" style={{ minHeight: "200px", maxHeight: "300px" }}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} onLinkClick={handleLinkClick} />
          ))}
          {typing && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-3 flex flex-wrap gap-1.5 shrink-0">
            {quickActions.map((action) => (
              <button
                key={action}
                onClick={() => sendMessage(action)}
                className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-slate-700/80 text-slate-300 border border-slate-600/50 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all duration-150"
              >
                {action}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-4 pb-4 pt-2 shrink-0 border-t border-slate-700/40">
          <div className="flex items-center gap-2 bg-slate-800 rounded-2xl px-4 py-2.5 border border-slate-700/60 focus-within:border-indigo-500/50 transition-colors">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent text-[13px] text-white placeholder-slate-500 outline-none"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center transition-all duration-150 shrink-0",
                input.trim()
                  ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/30"
                  : "bg-slate-700 text-slate-500 cursor-not-allowed"
              )}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── FAB ─────────────────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-5 right-5 z-[9999] h-14 w-14 rounded-full shadow-2xl",
          "flex items-center justify-center transition-all duration-300",
          "bg-gradient-to-br from-indigo-600 to-violet-700 hover:from-indigo-500 hover:to-violet-600",
          "shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-110",
          open && "rotate-12"
        )}
        aria-label="Open EduBot assistant"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="9" cy="10" r="1" fill="white" />
            <circle cx="12" cy="10" r="1" fill="white" />
            <circle cx="15" cy="10" r="1" fill="white" />
          </svg>
        )}

        {/* Unread dot */}
        {hasUnread && !open && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center">
            <span className="text-white text-[8px] font-black">1</span>
          </span>
        )}

        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-indigo-400/30 animate-ping" />
        )}
      </button>
    </>
  );
}
