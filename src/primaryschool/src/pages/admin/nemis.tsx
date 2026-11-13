import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Building2, Download, CheckCircle2, AlertCircle, 
  Search, RefreshCw, FileSpreadsheet, ShieldCheck, ExternalLink
} from "lucide-react";

const NEMIS_STUDENTS = [
  { id: 1, upi: "ABC90812K", name: "Amani Otieno", class: "Grade 5A", birthCert: "BC-2014-9912", gender: "Male", status: "Verified & Synced" },
  { id: 2, upi: "DEF44120L", name: "Wanjiku Njoroge", class: "Grade 6B", birthCert: "BC-2013-4122", gender: "Female", status: "Verified & Synced" },
  { id: 3, upi: "GHI77192M", name: "Kiptoo Cheruiyot", class: "Grade 5A", birthCert: "BC-2014-0981", gender: "Male", status: "Verified & Synced" },
  { id: 4, upi: "JKL33219N", name: "Fatma Hassan", class: "Grade 4B", birthCert: "BC-2015-7761", gender: "Female", status: "Verified & Synced" },
  { id: 5, upi: "PENDING-UPI", name: "Brian Ochieng", class: "Grade 5B", birthCert: "BC-2014-1102", gender: "Male", status: "Birth Certificate Flagged" },
  { id: 6, upi: "MNO88201P", name: "Faith Mutiso", class: "Grade 6A", birthCert: "BC-2013-5520", gender: "Female", status: "Verified & Synced" },
];

export default function NemisSyncPage() {
  const { toast } = useToast();
  const [students, setStudents] = useState(NEMIS_STUDENTS);
  const [syncing, setSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleExportNemisExcel = () => {
    const csvContent = "data:text/csv;charset=utf-8,UPI_Number,Full_Name,Class,Birth_Certificate_No,Gender,NEMIS_Status\n" +
      students.map(s => `"${s.upi}","${s.name}","${s.class}","${s.birthCert}","${s.gender}","${s.status}"`).join("\n");
    const encoded = encodeURI(csvContent);
    const a = document.createElement("a");
    a.href = encoded;
    a.download = `NEMIS_Ministry_Upload_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "NEMIS Ministry Template Exported",
      description: "Official Ministry of Education CBEIS/NEMIS template ready for portal upload.",
    });
  };

  const handleSyncWithMinistry = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast({
        title: "Ministry CBEIS Sync Complete",
        description: "5 student UPIs synchronized with government database.",
      });
    }, 1500);
  };

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.upi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.birthCert.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="NEMIS & CBEIS Government Sync"
        subtitle="Manage Ministry of Education student Unique Personal Identifiers (UPI) and government capitation uploads"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleSyncWithMinistry}
              disabled={syncing}
              className="border-slate-200 text-slate-700 bg-white font-bold text-xs h-9 px-4 rounded-xl gap-1.5 shadow-sm"
            >
              <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Checking Ministry..." : "Check Ministry Sync"}
            </Button>
            <Button
              onClick={handleExportNemisExcel}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 px-4 rounded-xl gap-1.5 shadow-sm"
            >
              <FileSpreadsheet size={15} /> Export NEMIS Template
            </Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Ministry Registered UPIs", val: "98.2%", sub: "Synced with NEMIS", color: "text-emerald-700 bg-emerald-50 border-emerald-100" },
          { label: "Capitation Eligible", val: "244", sub: "Govt Tuition Grants", color: "text-indigo-700 bg-indigo-50 border-indigo-100" },
          { label: "Pending Birth Certs", val: "1", sub: "Requires Parent Action", color: "text-amber-700 bg-amber-50 border-amber-100" },
          { label: "KNEC Candidate Index", val: "Verified", sub: "Term 3 Ready", color: "text-blue-700 bg-blue-50 border-blue-100" },
        ].map((item, i) => (
          <Card key={i} className="border-slate-200 shadow-sm bg-white rounded-2xl">
            <CardContent className="p-4 sm:p-5">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase ${item.color}`}>{item.label}</span>
              <p className="text-2xl font-black text-slate-900 mt-2">{item.val}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">{item.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
        <Search size={16} className="text-slate-400 ml-2" />
        <Input 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by student name, UPI number, or birth certificate..." 
          className="border-0 bg-transparent text-xs font-semibold focus-visible:ring-0 shadow-none h-9"
        />
      </div>

      {/* Roster Table using shadcn/ui Table */}
      <Card className="border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(10,37,64,0.04)] bg-white rounded-3xl overflow-hidden">
        <CardContent className="p-0 overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader className="bg-slate-50/80">
              <TableRow className="hover:bg-transparent border-b border-slate-200/70">
                <TableHead className="py-3 px-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">UPI Identifier</TableHead>
                <TableHead className="py-3 px-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Student Name</TableHead>
                <TableHead className="py-3 px-3 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Class</TableHead>
                <TableHead className="py-3 px-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Birth Cert No.</TableHead>
                <TableHead className="py-3 px-3 font-bold text-slate-500 uppercase text-[10px] tracking-wider">Gender</TableHead>
                <TableHead className="py-3 px-4 font-bold text-slate-500 uppercase text-[10px] tracking-wider text-right">Ministry Verification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <TableRow key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <TableCell className="py-3.5 px-4 font-mono font-bold text-[#0A2540]">
                    {s.upi}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 font-bold text-slate-900">
                    {s.name}
                  </TableCell>
                  <TableCell className="py-3.5 px-3 font-semibold text-slate-600">
                    {s.class}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 font-mono text-slate-500">
                    {s.birthCert}
                  </TableCell>
                  <TableCell className="py-3.5 px-3 text-slate-600 font-medium">
                    {s.gender}
                  </TableCell>
                  <TableCell className="py-3.5 px-4 text-right">
                    <Badge variant="outline" className={
                      s.status.includes("Verified") 
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200/80 font-bold text-[10px]"
                        : "bg-amber-50 text-amber-800 border-amber-200/80 font-bold text-[10px]"
                    }>
                      {s.status}
                    </Badge>
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

