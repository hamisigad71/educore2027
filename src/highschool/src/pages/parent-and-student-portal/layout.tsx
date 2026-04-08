import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { HSPortalSidebar, Topbar, BottomNav, hsPortalBottomNav } from "@/components/layout";
import { useAuth } from "@/context/AuthContext";

export default function ParentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Topbar 
        onMenu={() => setSidebarOpen(true)} 
        portalLabel="Parent / Student Portal" 
        userImg={user?.photo} 
        userName={user?.name} 
      />
      <div className="flex flex-1 overflow-hidden">
        <HSPortalSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        />
        <main className="flex-1 min-w-0 overflow-y-auto p-4 lg:p-6 pb-24 lg:pb-6">
          <Outlet />
        </main>
      </div>
      <BottomNav items={hsPortalBottomNav} />
    </div>
  );
}
