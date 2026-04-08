import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar, Topbar, BottomNav, adminBottomNav } from "@/components/layout";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Topbar
        onMenu={() => setSidebarOpen(true)}
        portalLabel="Admin Portal"
        userImg="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200"
        userName="Admin"
      />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        />
        <main className="flex-1 min-w-0 overflow-y-auto p-4 lg:p-6 pb-24 lg:pb-6">
          <Outlet />
        </main>
      </div>
      <BottomNav items={adminBottomNav} />
    </div>
  );
}
