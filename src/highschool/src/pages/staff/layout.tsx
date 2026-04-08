import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { HSStaffSidebar, Topbar, BottomNav, getHSStaffBottomNav } from "@/components/layout";
import { useAuth } from "@/context/AuthContext";

export default function StaffLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, department } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      <Topbar 
        onMenu={() => setSidebarOpen(true)} 
        portalLabel="Staff / Workers Portal" 
        userImg={user?.photo} 
        userName={user?.name} 
      />
      <div className="flex flex-1 overflow-hidden">
        <HSStaffSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
          department={department}
        />
        <main className="flex-1 min-w-0 overflow-y-auto p-4 lg:p-6 pb-24 lg:pb-6">
          <Outlet />
        </main>
      </div>
      <BottomNav items={getHSStaffBottomNav(department)} />
    </div>
  );
}
