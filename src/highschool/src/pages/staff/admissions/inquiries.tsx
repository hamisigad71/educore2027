import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, MailOpen, PhoneIncoming, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const mockInquiries = [
  { id: "INQ-901", parent: "Mrs. Odhiambo", contact: "0712 XXX 456", child: "Brian Odhiambo", interest: "Form 1 Admissions", channel: "Phone", status: "Follow-up", date: "Oct 26, 10:45 AM" },
  { id: "INQ-902", parent: "Mr. Kimani", contact: "kimani@gmail.com", child: "Jane Kimani", interest: "Fees Structure", channel: "Email", status: "Resolved", date: "Oct 25, 02:15 PM" },
  { id: "INQ-903", parent: "Sarah Juma", contact: "Walk-in", child: "Peter Juma", interest: "School Tour", channel: "In-Person", status: "Pending", date: "Oct 26, 09:00 AM" },
];

export default function AdmissionsInquiries() {
  const [q, setQ] = useState("");

  const filtered = mockInquiries.filter(req => 
    req.parent.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="CRM & Parent Inquiries" 
        subtitle="Log and track prospective parent communications and general school inquiries." 
        actions={
          <div className="flex gap-2">
            <Button className="h-9 gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold">
              <Plus size={14}/> Log Inquiry
            </Button>
          </div>
        }
      />
      
      <Card className="shadow-sm border-slate-200/80">
        <CardHeader className="p-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 pt-5 pb-4">
             <div>
              <CardTitle className="text-base font-bold text-slate-900 leading-none">Communication Log</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder="Search by parent name..." 
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="pl-9 h-9 w-[260px] text-xs bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20"
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
                <TableHead className="pl-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Parent / Contact</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Subject</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Channel</TableHead>
                <TableHead className="py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</TableHead>
                <TableHead className="pr-6 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="pl-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">{item.parent}</span>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5">{item.contact}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-700">{item.interest}</span>
                      <span className="text-[10px] text-slate-400">Child: {item.child}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      {item.channel === "Phone" && <PhoneIncoming size={12} className="text-slate-400"/>}
                      {item.channel === "Email" && <MailOpen size={12} className="text-slate-400"/>}
                      {item.channel === "In-Person" && <MessageSquare size={12} className="text-slate-400"/>}
                      {item.channel}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold border-0 px-2 py-0.5",
                        item.status === "Resolved" ? "bg-emerald-50 text-emerald-700" :
                        item.status === "Follow-up" ? "bg-amber-50 text-amber-700" :
                        "bg-rose-50 text-rose-700"
                      )}>
                        {item.status}
                      </Badge>
                  </TableCell>
                  <TableCell className="pr-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="h-8 gap-2 bg-white border border-slate-200 text-xs text-slate-600 font-bold hover:text-indigo-600 hover:border-indigo-200 shadow-sm">
                      Respond
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
