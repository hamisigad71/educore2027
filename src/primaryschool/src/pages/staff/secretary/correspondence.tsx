import React from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Mail, Send, Inbox, Archive, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const letters = [
  { title: "Fee Balance Reminder – Term 2", recipient: "All Parents", date: "2025-04-04", type: "Finance", status: "Sent" },
  { title: "School Closure Notice – 18 Apr", recipient: "All Stakeholders", date: "2025-04-06", type: "Notice", status: "Sent" },
  { title: "Grade 4 Field Trip Permission", recipient: "Grade 4 Parents", date: "2025-04-07", type: "Activity", status: "Draft" },
  { title: "End of Term Report Distribution", recipient: "All Parents", date: "2025-04-09", type: "Academic", status: "Pending" },
];

export default function SecretaryCorrespondence() {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Correspondence"
        subtitle="Manage all outgoing and incoming official school communications."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" className="h-9 text-xs border-slate-200 font-bold gap-2">
              <Inbox size={14} /> Inbox
            </Button>
            <Button className="h-9 text-xs bg-indigo-600 hover:bg-indigo-700 font-bold gap-2">
              <Plus size={14} /> Compose Letter
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Letters Sent", val: "47", icon: Send, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Drafts", val: "3", icon: Archive, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Pending Dispatch", val: "5", icon: Mail, color: "text-rose-600", bg: "bg-rose-50" },
          { label: "This Month", val: "12", icon: Send, color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((s) => (
          <Card key={s.label} className="shadow-sm border-slate-200/80">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", s.bg)}>
                  <s.icon size={15} className={s.color} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
              </div>
              <p className="text-2xl font-bold text-slate-900">{s.val}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="px-6 pt-5 pb-4">
            <CardTitle className="text-base font-bold text-slate-900 leading-none">Recent Communications</CardTitle>
          </div>
          <Separator className="bg-slate-50" />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-slate-50">
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Subject</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Recipients</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Type</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Date</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {letters.map((r) => (
                <TableRow key={r.title} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4 text-xs font-bold text-slate-900 group-hover:text-indigo-700">{r.title}</TableCell>
                  <TableCell className="py-4 text-xs text-slate-500">{r.recipient}</TableCell>
                  <TableCell className="py-4 text-xs text-slate-500">{r.type}</TableCell>
                  <TableCell className="py-4 text-xs font-mono text-slate-400">{r.date}</TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Badge className={cn("text-[9px] font-bold border-0",
                      r.status === "Sent" ? "bg-emerald-50 text-emerald-700" :
                      r.status === "Draft" ? "bg-slate-100 text-slate-600" :
                      "bg-amber-50 text-amber-700"
                    )}>{r.status}</Badge>
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
