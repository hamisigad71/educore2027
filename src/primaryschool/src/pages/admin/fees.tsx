import React, { useMemo, useState, useEffect } from "react";
import { PageHeader } from "@/components/layout";
import { getStudentsList, getRecentTransactions, recordFeePayment, StudentItem, RecentTransactionItem } from "@/lib/api";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// lucide
import {
  TrendingUp, AlertCircle, CreditCard, Search,
  Plus, Download, Smartphone, Banknote, Building2,
  Clock, CheckCircle2, ChevronRight, Send, Loader2
} from "lucide-react";

// ─── helpers ─────────────────────────────────────────────────────────────────

const currency = (val: number) =>
  new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES" }).format(val);

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function MethodBadge({ method }: { method: string }) {
  const normalizedMethod = method?.toLowerCase().includes("mpesa") ? "M-Pesa" : 
                           method?.toLowerCase().includes("cash") ? "Cash" : 
                           method?.toLowerCase().includes("bank") ? "Bank" : "Cash";

  const map: Record<string, { icon: React.ReactNode; cls: string }> = {
    "M-Pesa": {
      icon: <Smartphone size={10} />,
      cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    Cash: {
      icon: <Banknote size={10} />,
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
    Bank: {
      icon: <Building2 size={10} />,
      cls: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
  };
  const cfg = map[normalizedMethod] ?? { icon: <CreditCard size={10} />, cls: "bg-slate-50 text-slate-600 border-slate-200" };
  return (
    <Badge variant="outline" className={cn("text-[11px] font-medium border gap-1 px-2 py-0.5", cfg.cls)}>
      {cfg.icon}{normalizedMethod}
    </Badge>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon, iconBg, valueClass,
}: {
  label: string; value: string; sub?: string;
  icon: React.ReactNode; iconBg: string; valueClass?: string;
}) {
  return (
    <Card className="shadow-sm border-slate-200/80">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center border", iconBg)}>
            {icon}
          </div>
          {sub && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 rounded-full px-2 py-0.5">
              {sub}
            </span>
          )}
        </div>
        <p className={cn("text-[26px] font-semibold tracking-tight leading-none", valueClass ?? "text-slate-900")}>
          {value}
        </p>
        <p className="text-sm text-slate-500 mt-1.5">{label}</p>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminFees() {
  const [fees, setFees] = useState<RecentTransactionItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [modal, setModal] = useState(false);
  
  // Payment form states
  const [selStudentId, setSelStudentId] = useState<string>("");
  const [payAmount, setPayAmount] = useState<string>("10000");
  const [payMethod, setPayMethod] = useState<string>("M-Pesa");
  const [payReceipt, setPayReceipt] = useState<string>("");

  const [q, setQ] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");
  const { toast } = useToast();

  const loadData = async () => {
    try {
      const [stds, txns] = await Promise.all([
        getStudentsList(),
        getRecentTransactions()
      ]);
      setStudents(stds);
      setFees(txns);
      if (stds.length > 0 && !selStudentId) {
        setSelStudentId(stds[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    return fees.filter((f) => {
      const s = students.find((x) => x.admission_number === f.admissionNumber);
      const sName = s?.name || f.studentName || "";
      const matchQ =
        sName.toLowerCase().includes(q.toLowerCase()) ||
        f.reference.toLowerCase().includes(q.toLowerCase());
      
      const fMeth = f.paymentMethod?.toLowerCase().includes("mpesa") ? "M-Pesa" : 
                    f.paymentMethod?.toLowerCase().includes("cash") ? "Cash" : 
                    f.paymentMethod?.toLowerCase().includes("bank") ? "Bank" : "Cash";

      const matchMethod = methodFilter === "All" || fMeth === methodFilter;
      return matchQ && matchMethod;
    });
  }, [fees, q, methodFilter, students]);

  const balances = useMemo(() => {
    return students
      .filter((s) => s.balance > 0)
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 7);
  }, [students]);

  const totalCollected = fees.reduce((s, f) => s + (f.amount || 0), 0);
  const totalOutstanding = students.reduce((s, x) => s + (x.balance ?? 0), 0);
  const collectionRate = totalCollected + totalOutstanding > 0 ? Math.round(
    (totalCollected / (totalCollected + totalOutstanding)) * 100
  ) : 0;

  const methods = ["M-Pesa", "Cash", "Bank"];

  async function handleRecord() {
    setIsSaving(true);
    try {
      const amt = Number(payAmount);
      if (isNaN(amt) || amt <= 0) throw new Error("Invalid amount");

      await recordFeePayment({
        studentId: selStudentId,
        amount: amt,
        paymentMethod: payMethod,
        referenceNumber: payReceipt || undefined,
        mpesaReceipt: payMethod.includes("mpesa") || payMethod === "M-Pesa" ? payReceipt : undefined
      });
      
      toast({ title: "Payment recorded", description: `${currency(amt)} via ${payMethod}` });
      setModal(false);
      setPayReceipt("");
      await loadData();
    } catch (err) {
      toast({ title: "Failed to record payment", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6">

      {/* ── Header ───────────────────────────────────────────────── */}
      <PageHeader
        title="Fees Management"
        subtitle="Track payments, balances and collection rates"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-50 gap-1.5">
              <Download size={14} />Export
            </Button>
            <Button
              size="sm"
              disabled={!isLoaded}
              onClick={() => setModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 shadow-sm gap-1.5"
            >
              <Plus size={14} />Record Payment
            </Button>
          </div>
        }
      />

      {/* ── Stats ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Collected (YTD)"
          value={currency(totalCollected)}
          sub="This year"
          valueClass="text-emerald-600"
          iconBg="bg-emerald-50 border-emerald-100"
          icon={<TrendingUp size={18} className="text-emerald-600" />}
        />
        <StatCard
          label="Outstanding Balance"
          value={`${students.filter((s) => s.balance > 0).length} students`}
          sub="Pending"
          valueClass="text-amber-600"
          iconBg="bg-amber-50 border-amber-100"
          icon={<AlertCircle size={18} className="text-amber-600" />}
        />
        <StatCard
          label="Total Transactions"
          value={String(fees.length)}
          sub={`${filtered.length} shown`}
          iconBg="bg-indigo-50 border-indigo-100"
          icon={<CreditCard size={18} className="text-indigo-600" />}
        />
        <Card className="shadow-sm border-slate-200/80">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="h-11 w-11 rounded-xl flex items-center justify-center border bg-purple-50 border-purple-100">
                <CheckCircle2 size={18} className="text-purple-600" />
              </div>
              <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 border border-purple-100 rounded-full px-2 py-0.5">
                Collection rate
              </span>
            </div>
            <p className="text-[26px] font-semibold tracking-tight leading-none text-purple-600">
              {collectionRate}%
            </p>
            <p className="text-sm text-slate-500 mt-1.5 mb-3">Fee Collection Rate</p>
            <Progress value={collectionRate} className="h-1.5 bg-purple-100 [&>div]:bg-purple-500" />
          </CardContent>
        </Card>
      </div>

      {/* ── Main Grid ────────────────────────────────────────────── */}
      <div className="grid gap-5 xl:grid-cols-3">

        {/* Transactions table */}
        <Card className="xl:col-span-2 shadow-sm border-slate-200/80">
          <CardHeader className="p-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pt-5 pb-4">
              <div>
                <CardTitle className="text-base font-semibold text-slate-900">Fee Transactions</CardTitle>
                <CardDescription className="text-sm text-slate-500 mt-0.5">
                  {filtered.length} records · sorted by date
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Student or receipt…"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="pl-9 h-9 w-[200px] text-sm bg-slate-50 border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400"
                  />
                </div>
                <Select value={methodFilter} onValueChange={setMethodFilter}>
                  <SelectTrigger className="h-9 w-[120px] text-sm bg-slate-50 border-slate-200">
                    <SelectValue placeholder="All Methods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Methods</SelectItem>
                    {methods.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
          </CardHeader>

          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-slate-100">
                    {["Date", "Student", "Class", "Amount", "Method", "Receipt"].map((h, i) => (
                      <TableHead key={i}
                        className={cn("text-[11px] font-semibold text-slate-400 uppercase tracking-wider py-3",
                          i === 0 && "pl-6"
                        )}
                      >{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!isLoaded && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-slate-400">Loading...</TableCell>
                    </TableRow>
                  )}
                  {filtered.slice(0, 15).map((f) => {
                    const s = students.find((x) => x.admission_number === f.admissionNumber);
                    const dateStr = new Date(f.paidAt).toISOString().split("T")[0];
                    return (
                      <TableRow key={f.id} className="hover:bg-slate-50/60 border-b border-slate-100/80 transition-colors">
                        <TableCell className="pl-6 py-3.5">
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock size={11} className="text-slate-300" />
                            {dateStr}
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8 ring-1 ring-slate-100">
                              <AvatarFallback className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold">
                                {getInitials(s?.name || f.studentName || "?")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-slate-900">{s?.name || f.studentName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <span className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5">
                            {s?.className || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <span className="text-sm font-semibold text-slate-900">{currency(f.amount)}</span>
                        </TableCell>
                        <TableCell className="py-3.5">
                          <MethodBadge method={f.paymentMethod} />
                        </TableCell>
                        <TableCell className="py-3.5">
                          <code className="text-[11px] font-mono text-slate-400 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5">
                            {f.reference || f.mpesaReceipt || "-"}
                          </code>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {filtered.length === 0 && isLoaded && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <CreditCard size={20} className="text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-700">No transactions found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your search filters</p>
              </div>
            )}

            {filtered.length > 0 && (
              <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/40">
                <p className="text-xs text-slate-400">
                  Showing <span className="font-medium text-slate-600">{Math.min(15, filtered.length)}</span> of{" "}
                  <span className="font-medium text-slate-600">{filtered.length}</span> records
                </p>
                <Button variant="ghost" size="sm" className="text-xs text-indigo-600 hover:text-indigo-700 h-7 gap-1">
                  View all <ChevronRight size={12} />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Outstanding balances */}
        <Card className="shadow-sm border-slate-200/80">
          <CardHeader className="p-0">
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900">Outstanding Balances</CardTitle>
                  <CardDescription className="text-sm text-slate-500 mt-0.5">
                    {balances.length} students with pending fees
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-600 border-amber-200 font-semibold">
                  {students.filter((s) => s.balance > 0).length} pending
                </Badge>
              </div>
            </div>
            <Separator />
          </CardHeader>

          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {balances.length === 0 && isLoaded && (
                <div className="px-5 py-4 text-center text-sm text-slate-400">No pending balances</div>
              )}
              {balances.map((s, i) => {
                const pct = Math.min(100, Math.round((s.balance / (s.totalBilled || 50000)) * 100));
                return (
                  <div key={s.id} className="px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          <Avatar className="h-8 w-8 ring-1 ring-slate-100">
                            <AvatarFallback className="text-[10px] bg-rose-50 text-rose-700 font-semibold">
                              {getInitials(s.name)}
                            </AvatarFallback>
                          </Avatar>
                          {i === 0 && (
                            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-rose-500 border-2 border-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800 leading-tight">{s.name}</p>
                          <p className="text-[10px] text-slate-400">{s.className}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "text-xs font-semibold",
                        s.balance > 30000 ? "text-rose-600" : "text-amber-600"
                      )}>
                        {currency(s.balance)}
                      </span>
                    </div>
                    <Progress
                      value={pct}
                      className={cn("h-1 bg-slate-100",
                        s.balance > 30000
                          ? "[&>div]:bg-rose-400"
                          : "[&>div]:bg-amber-400"
                      )}
                    />
                  </div>
                );
              })}
            </div>

            {balances.length > 0 && (
              <div className="px-5 py-4 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-9 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5"
                >
                  <Send size={12} />Send SMS Reminders to All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Record Payment Modal ──────────────────────────────────── */}
      <Dialog open={modal} onOpenChange={setModal}>
        <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <CreditCard size={15} className="text-emerald-600" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-slate-900">Record Fee Payment</DialogTitle>
                <p className="text-xs text-slate-400 mt-0.5">Enter payment details to update the student's account</p>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">Student <span className="text-rose-400">*</span></Label>
              <Select value={selStudentId} onValueChange={setSelStudentId}>
                <SelectTrigger className="h-9 text-sm border-slate-200">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} — {s.className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-600">Amount (KES) <span className="text-rose-400">*</span></Label>
                <Input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="h-9 text-sm border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-600">Payment Method <span className="text-rose-400">*</span></Label>
                <Select value={payMethod} onValueChange={setPayMethod}>
                  <SelectTrigger className="h-9 text-sm border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M-Pesa">M-Pesa</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-600">Receipt / Reference</Label>
                <Input
                  placeholder="e.g., RCP-2025123"
                  value={payReceipt}
                  onChange={(e) => setPayReceipt(e.target.value)}
                  className="h-9 text-sm font-mono border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-slate-600">Payment Date</Label>
                <Input
                  type="date"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  className="h-9 text-sm border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">Notes (optional)</Label>
              <Input
                placeholder="e.g., Partial payment for Term 2 fees"
                className="h-9 text-sm border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400"
              />
            </div>

            {/* Quick summary */}
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3.5 flex items-center gap-3">
              <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
              <p className="text-xs text-emerald-700">
                This payment will be recorded and the student's balance updated immediately.
              </p>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 gap-2">
            <Button variant="outline" size="sm" disabled={isSaving} onClick={() => setModal(false)} className="border-slate-300 text-slate-700">
              Cancel
            </Button>
            <Button size="sm" onClick={handleRecord} disabled={isSaving || !selStudentId} className="bg-emerald-600 hover:bg-emerald-700 shadow-sm gap-1.5">
              {isSaving ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
              Save Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}