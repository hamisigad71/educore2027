import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Filter, BookOpen, BookCopy, BookMarked } from "lucide-react";
import { cn } from "@/lib/utils";

const mockCatalog = [
  { id: "LIB-9011", title: "Things Fall Apart", author: "Chinua Achebe", category: "Fiction", isbn: "978-0385474542", stock: 12, available: 4, status: "Available" },
  { id: "LIB-9012", title: "Advanced Certificate Chemistry", author: "Holderness & Lambert", category: "Science", isbn: "978-0435671044", stock: 35, available: 32, status: "Available" },
  { id: "LIB-9013", title: "River and the Source", author: "Margaret Ogola", category: "Set Book", isbn: "978-9966882059", stock: 150, available: 0, status: "Out of Stock" },
  { id: "LIB-9014", title: "New General Mathematics 1", author: "J.B. Channon", category: "Mathematics", isbn: "978-0582588147", stock: 45, available: 5, status: "Low Stock" },
];

export default function LibraryCatalog() {
  const [q, setQ] = useState("");

  const filtered = mockCatalog.filter(req => 
    req.title.toLowerCase().includes(q.toLowerCase()) ||
    req.author.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Library Catalog" 
        subtitle="Manage the school book repository, curriculum materials, and literature." 
        actions={
          <div className="flex gap-2">
             <Button variant="outline" className="h-9 gap-2 text-xs font-bold text-slate-700">
              <Filter size={14}/> Categories
            </Button>
            <Button className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold">
              <Plus size={14}/> Add Book
            </Button>
          </div>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
         {[
           { title: "Total Collection", val: "14,520", icon: BookMarked, color: "text-slate-500" },
           { title: "Books Available", val: "11,834", icon: BookOpen, color: "text-indigo-500" },
           { title: "On Loan", val: "2,686", icon: BookCopy, color: "text-amber-500" }
         ].map((stat, i) => (
            <Card key={i} className="shadow-sm border-slate-200/80">
               <CardContent className="p-5 flex items-center justify-between">
                  <div>
                     <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                     <p className="text-2xl font-bold text-slate-900 mt-1">{stat.val}</p>
                  </div>
                  <div className={cn("h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center", stat.color)}>
                     <stat.icon size={18} />
                  </div>
               </CardContent>
            </Card>
         ))}
      </div>
      
      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-5 pb-4">
             <div>
              <CardTitle className="text-base font-bold text-slate-900 leading-none">Resource Directory</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search title, author, ISBN..." 
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-9 h-9 w-[280px] text-xs bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>
          <Separator className="bg-slate-50" />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-50">
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Book Details</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Category & ISBN</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">Availability</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4 max-w-[250px]">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 truncate">{item.title}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 whitespace-nowrap">{item.author}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-medium text-slate-700">{item.category}</span>
                      <span className="text-[10px] text-slate-400 tracking-wider mt-0.5">{item.isbn}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold text-slate-800">{item.available}<span className="text-[10px] text-slate-400 font-normal"> / {item.stock}</span></span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border-0 px-2 py-0.5",
                        item.status === "Available" ? "bg-emerald-50 text-emerald-700" :
                        item.status === "Low Stock" ? "bg-amber-50 text-amber-700" :
                        "bg-rose-50 text-rose-700"
                      )}>
                        {item.status}
                      </Badge>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 gap-2 bg-white border border-slate-200 text-[10px] text-slate-600 font-bold hover:text-indigo-600 hover:border-indigo-200 shadow-sm">
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
