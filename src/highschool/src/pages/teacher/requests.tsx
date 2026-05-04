import React from "react";
import { 
  Archive, 
  Plus, 
  Search, 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle,
  MoreVertical,
  ChevronRight,
  Package,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const RequestsPage = () => {
  const requests = [
    { type: "Leave Request", category: "Sick Leave", date: "May 4, 2025", status: "Approved", detail: "Medical appointment", icon: Calendar, color: "text-emerald-600 bg-emerald-50", borderColor: "border-emerald-100" },
    { type: "Requisition", category: "Stationery", date: "May 2, 2025", status: "Pending", detail: "A4 Papers, Markers", icon: Package, color: "text-amber-600 bg-amber-50", borderColor: "border-amber-100" },
    { type: "Infrastructure", category: "Classroom Maintenance", date: "Apr 28, 2025", status: "Rejected", detail: "Window fix in 6A", icon: Archive, color: "text-rose-600 bg-rose-50", borderColor: "border-rose-100" },
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Leaves & Requisitions</h1>
          <p className="text-slate-500 font-medium">Manage your personal requests and classroom material needs.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100">
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white overflow-hidden group">
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                 <Clock size={24} />
               </div>
               <div>
                  <p className="text-3xl font-black text-slate-900 leading-none">2</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Pending Approval</p>
               </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-none shadow-sm bg-white overflow-hidden group">
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                 <CheckCircle2 size={24} />
               </div>
               <div>
                  <p className="text-3xl font-black text-slate-900 leading-none">14</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Approved (Term)</p>
               </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white overflow-hidden group">
          <CardContent className="pt-6 relative">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                 <Package size={24} />
               </div>
               <div>
                  <p className="text-3xl font-black text-slate-900 leading-none">5</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">Active Requisitions</p>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-lg font-bold text-slate-900">Request History</h2>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="rounded-full text-[10px] font-bold text-slate-400 border-slate-200">ALL RECORDS</Badge>
          </div>
        </div>

        <div className="space-y-3">
          {requests.map((req, i) => (
            <Card key={i} className={cn("border bg-white shadow-none group transition-all hover:bg-slate-50/30", req.borderColor)}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", req.color)}>
                      <req.icon size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{req.type}</span>
                        <Separator orientation="vertical" className="h-3 bg-slate-200" />
                        <span className="text-xs font-semibold text-slate-500">{req.category}</span>
                      </div>
                      <p className="text-xs font-medium text-slate-400 mt-0.5">{req.detail}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                     <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Date Raised</p>
                        <p className="text-sm font-bold text-slate-700">{req.date}</p>
                     </div>
                     <div className="min-w-[100px] text-right">
                        <Badge variant={
                          req.status === "Approved" ? "success" : 
                          req.status === "Rejected" ? "danger" : "default"
                        } className="rounded-lg h-7 px-3 text-[10px] uppercase font-black tracking-widest border-none">
                          {req.status}
                        </Badge>
                     </div>
                     <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-slate-600">
                        <MoreVertical size={16} />
                     </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default RequestsPage;
