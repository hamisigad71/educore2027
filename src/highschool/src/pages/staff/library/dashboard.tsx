import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { librarySeed, LibraryRecord } from "../../../data/mockData";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

// lucide
import { 
  Book, BookOpen, Search, 
  Filter, Plus, User,
  Calendar, Clock, AlertCircle,
  CheckCircle2, ChevronRight, Bookmark,
  ArrowUpRight, BarChart2, History
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function LibraryPortal() {
  const [q, setQ] = useState("");
  
  const stats = [
    { label: "Total Books", value: 4850, icon: Book, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Borrowed", value: 84, icon: BookOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Overdue", value: 12, icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
    { label: "Lost / Missing", value: 3, icon: Bookmark, color: "text-slate-400", bg: "bg-slate-50" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Library Management" 
        subtitle="Manage book catalog, circulation records, and student checkout history" 
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 border-slate-200 text-slate-700 bg-white shadow-sm font-bold text-xs gap-1.5 px-4 shadow-sm">
              <BarChart2 size={14} /> Catalog Report
            </Button>
            <Button className="h-9 bg-indigo-600 hover:bg-indigo-700 shadow-sm text-xs font-bold gap-1.5 px-4 shadow-sm">
              <Plus size={14} /> Add New Listing
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="shadow-sm border-slate-200/80 group hover:border-indigo-100 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center border", s.bg)}>
                  <s.icon size={15} className={s.color} />
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{s.label}</p>
              </div>
              <p className="text-2xl font-bold text-slate-900 leading-none tracking-tight">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Circulation Table */}
        <Card className="xl:col-span-2 shadow-sm border-slate-200/80">
          <CardHeader className="p-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-5 pb-4">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 leading-none">Active Circulation</CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-1">Currently borrowed books and their status</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                 <div className="relative">
                   <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                   <Input 
                     placeholder="Search books or students..." 
                     value={q}
                     onChange={(e) => setQ(e.target.value)}
                     className="pl-9 h-9 w-[220px] text-xs bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20"
                   />
                 </div>
                 <Button variant="outline" size="sm" className="h-9 border-slate-200">
                   <Filter size={14} className="text-slate-400" />
                 </Button>
              </div>
            </div>
            <Separator className="bg-slate-50" />
          </CardHeader>
          <CardContent className="p-0">
             <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-slate-50">
                    <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Book Title</TableHead>
                    <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Borrower</TableHead>
                    <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Due Date</TableHead>
                    <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                    <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {librarySeed.map((book) => (
                    <TableRow key={book.id} className="group hover:bg-slate-50/50 transition-colors">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-200 group-hover:bg-white group-hover:border-indigo-100 transition-all">
                            <Book size={14} className="text-slate-400 group-hover:text-indigo-600" />
                          </div>
                          <p className="text-xs font-bold text-slate-900 leading-tight group-hover:text-indigo-700 transition-colors">{book.bookTitle}</p>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                         <div className="flex items-center gap-2">
                           <User size={12} className="text-slate-300" />
                           <p className="text-xs text-slate-600 font-medium">{book.studentName}</p>
                         </div>
                      </TableCell>
                      <TableCell className="py-4">
                         <div className="flex items-center gap-2">
                           <Calendar size={12} className={cn(book.status === "Overdue" ? "text-rose-500" : "text-slate-300")} />
                           <p className={cn("text-xs font-bold", book.status === "Overdue" ? "text-rose-600" : "text-slate-500")}>{book.dueDate}</p>
                         </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className={cn(
                          "text-[9px] font-bold border-0 px-2 py-0",
                          book.status === "Returned" ? "bg-emerald-50 text-emerald-700" :
                          book.status === "Overdue" ? "bg-rose-50 text-rose-700" :
                          "bg-indigo-50 text-indigo-700"
                        )}>
                          {book.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 py-4 text-right">
                         <Button size="sm" variant="ghost" className="h-8 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 gap-1">
                           Manage <ChevronRight size={14} />
                         </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
             </Table>
             <div className="p-4 bg-slate-50/30 text-center border-t border-slate-50">
               <Button variant="ghost" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 hover:bg-transparent h-6 gap-1">
                 View Historical Circulation Ledger <ArrowUpRight size={12} />
               </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200/80">
            <CardHeader className="pb-3 px-6 pt-5">
               <CardTitle className="text-sm font-bold text-slate-900 border-l-2 border-indigo-500 pl-3 leading-none uppercase tracking-wider">Librarian Toolbox</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-6 pt-2 pb-6">
               {[
                 { label: "New Bulk Checkout", icon: User, color: "text-indigo-600", bg: "bg-indigo-50" },
                 { label: "Scan Book ISBN", icon: BarChart2, color: "text-emerald-600", bg: "bg-emerald-50" },
                 { label: "Inventory Audit", icon: ClipboardList, color: "text-amber-600", bg: "bg-amber-50" },
                 { label: "Fine Collection", icon: History, color: "text-rose-600", bg: "bg-rose-50" },
               ].map((tool) => (
                 <button key={tool.label} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group">
                   <div className="flex items-center gap-3">
                     <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", tool.bg)}>
                       <tool.icon size={14} className={tool.color} />
                     </div>
                     <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">{tool.label}</span>
                   </div>
                   <Plus size={14} className="text-slate-300 group-hover:text-indigo-400" />
                 </button>
               ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200/80 bg-slate-900 text-white p-5 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            <div className="flex flex-col items-center text-center space-y-3 relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                 <AlertCircle size={20} className="text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-bold">Unpaid Fine Alerts</p>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed px-4">There are 8 students with accrued library fines exceeding KES 200. These must be reported to the Bursar.</p>
              </div>
              <Button size="sm" className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold text-[11px] h-9 rounded-xl mt-2">
                Export Fine List
              </Button>
            </div>
            {/* Abstract patterns */}
            <div className="absolute -bottom-12 -right-12 w-32 h-32 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          </Card>
        </div>
      </div>
    </div>
  );
}

function ClipboardList({ size, className }: { size: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>;
}
