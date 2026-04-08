import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { studentsSeed, feesSeed, currency } from "../../data/mockData";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

import {
  CreditCard, Download, History,
  ArrowUpRight, AlertCircle, CheckCircle2,
  Calendar, TrendingUp, Wallet, Receipt,
  FileText, Info, Smartphone, Building2,
  ShieldCheck, Clock, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const TERM_BREAKDOWN = [
  { label: "Tuition Fee",    amount: 20000, icon: FileText,   color: "text-indigo-600",  bg: "bg-indigo-50 border-indigo-100" },
  { label: "Laboratory Fee", amount: 5000,  icon: Info,       color: "text-amber-600",   bg: "bg-amber-50 border-amber-100"   },
  { label: "Activity Fee",   amount: 2500,  icon: Calendar,   color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
];

const PAYMENT_METHODS = [
  { value: "mpesa",    label: "M-Pesa",       icon: Smartphone,  color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" },
  { value: "bank",     label: "Bank Transfer", icon: Building2,   color: "text-indigo-600",  bg: "bg-indigo-50 border-indigo-100"   },
  { value: "card",     label: "Debit Card",    icon: CreditCard,  color: "text-slate-600",   bg: "bg-slate-50 border-slate-200"     },
];

export default function PortalFees() {
  const student = studentsSeed[0];
  const fees = feesSeed.filter((f) => f.studentId === student.id);
  const { toast } = useToast();

  const paidTotal   = fees.reduce((s, f) => s + f.amount, 0);
  const totalDue    = paidTotal + student.balance;
  const paidPercent = totalDue === 0 ? 100 : Math.round((paidTotal / totalDue) * 100);
  const isCleared   = student.balance <= 0;

  const [payOpen, setPayOpen]       = useState(false);
  const [payAmount, setPayAmount]   = useState("");
  const [payMethod, setPayMethod]   = useState("mpesa");
  const [payRef, setPayRef]         = useState("");
  const [detailFee, setDetailFee]   = useState<(typeof fees)[0] | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePay = () => {
    if (!payAmount || isNaN(Number(payAmount)) || Number(payAmount) <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a valid payment amount.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setPayOpen(false);
      setPayAmount(""); setPayRef("");
      toast({ title: "Payment initiated", description: `KES ${Number(payAmount).toLocaleString()} via ${payMethod.toUpperCase()} — awaiting confirmation.` });
    }, 1400);
  };

  const downloadReceipt = (fee: typeof fees[0]) => {
    toast({ title: "Receipt downloaded", description: `Receipt for ${currency(fee.amount)} on ${fee.date}.` });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fee Management"
        subtitle="Manage your payments, download receipts and view balance"
        actions={
          <Button
            onClick={() => setPayOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm gap-1.5 font-semibold text-xs h-9"
          >
            <CreditCard size={13} /> Make Payment
          </Button>
        }
      />

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: "Balance Due",   value: isCleared ? "Cleared" : currency(student.balance), icon: Wallet,       bg: isCleared ? "bg-emerald-50" : "bg-rose-50",   color: isCleared ? "text-emerald-600" : "text-rose-600" },
          { label: "Total Paid",    value: currency(paidTotal),                                 icon: CheckCircle2, bg: "bg-emerald-50", color: "text-emerald-600" },
          { label: "Transactions",  value: fees.length,                                         icon: Receipt,      bg: "bg-indigo-50",  color: "text-indigo-600"  },
          { label: "Payment Rate",  value: `${paidPercent}%`,                                   icon: TrendingUp,   bg: "bg-amber-50",   color: "text-amber-600"   },
        ].map(kpi => (
          <Card key={kpi.label} className="shadow-sm border-slate-200/80 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <CardContent className="p-3.5 sm:p-5 flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
              <div className={cn("h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm", kpi.bg)}>
                <kpi.icon size={16} className={cn("sm:w-[18px] sm:h-[18px]", kpi.color)} />
              </div>
              <div className="min-w-0 w-full">
                <p className="text-lg sm:text-xl font-bold text-slate-900 leading-tight truncate">{kpi.value}</p>
                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate mt-0.5">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Balance summary + Term breakdown */}
        <div className="space-y-4">
          {/* Balance card */}
          <Card className="shadow-sm border-slate-200/80 bg-white overflow-hidden relative">
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 60%)" }}
            />
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
                    {isCleared ? "Account Status" : "Balance Due"}
                  </p>
                  <h3 className="text-3xl font-bold tracking-tight text-slate-900">
                    {isCleared ? "Cleared" : currency(student.balance)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">Term 2 · 2025</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <CreditCard size={20} className="text-indigo-600" />
                </div>
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-slate-500">Paid so far</span>
                  <span className="text-emerald-600">{paidPercent}%</span>
                </div>
                <Progress value={paidPercent} className="h-2 bg-slate-100 [&>div]:bg-emerald-500 shadow-inner" />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>{currency(paidTotal)} paid</span>
                  <span>{currency(totalDue)} total</span>
                </div>
              </div>

              <div className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold border shadow-sm",
                isCleared
                  ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                  : "bg-amber-50 border-amber-100 text-amber-700"
              )}>
                {isCleared
                  ? <><ShieldCheck size={13} className="text-emerald-500" /> Account fully settled</>
                  : <><AlertCircle size={13} className="text-amber-500" /> Balance pending settlement</>
                }
              </div>
            </CardContent>
          </Card>

          {/* Term breakdown */}
          <Card className="shadow-sm border-slate-200/80">
            <CardHeader className="px-5 py-4 border-b border-slate-100">
              <CardTitle className="text-xs font-semibold text-slate-700">Term 2 Fee Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {TERM_BREAKDOWN.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-8 w-8 rounded-lg border flex items-center justify-center shrink-0", item.bg)}>
                      <item.icon size={13} className={item.color} />
                    </div>
                    <span className="text-xs font-medium text-slate-700">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    KES {item.amount.toLocaleString()}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Total</span>
                <span className="text-sm font-bold text-indigo-700 font-mono">
                  KES {TERM_BREAKDOWN.reduce((s, i) => s + i.amount, 0).toLocaleString()}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed pt-1">
                Contact the accounts office for billing discrepancies.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right: Transaction history */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200/80">
          <CardHeader className="px-6 py-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Payment History</CardTitle>
              <CardDescription className="text-xs mt-0.5">Click a row to view receipt details</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-[11px] font-semibold border-slate-200 gap-1.5 text-slate-600">
              <History size={12} /> Full Statement
            </Button>
          </CardHeader>
          <ScrollArea className="h-[420px]">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-slate-100">
                  {["Description", "Amount", "Method", "Date", "Receipt"].map(h => (
                    <TableHead
                      key={h}
                      className={cn(
                        "py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400",
                        h === "Description" ? "pl-6" : "",
                        h === "Receipt" ? "pr-6 text-right" : "",
                        h === "Method" || h === "Date" ? "text-center" : ""
                      )}
                    >
                      {h}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((f, i) => {
                  const method = PAYMENT_METHODS.find(m => m.label === f.method) ?? PAYMENT_METHODS[0];
                  return (
                    <TableRow
                      key={i}
                      onClick={() => setDetailFee(f)}
                      className="hover:bg-slate-50/60 border-b border-slate-50 last:border-0 cursor-pointer transition-colors group"
                    >
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                            <ArrowUpRight size={13} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
                              Fee Installment
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">Ref: TXN-{(1000 + i).toString()}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-sm font-bold text-slate-900 font-mono">{currency(f.amount)}</span>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-semibold px-2 py-0 border rounded-full",
                            f.method === "M-Pesa"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : "bg-slate-50 text-slate-600 border-slate-200"
                          )}
                        >
                          {f.method}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-center">
                        <span className="text-[11px] text-slate-500 font-medium font-mono">{f.date}</span>
                      </TableCell>
                      <TableCell className="pr-6 py-4 text-right">
                        <Button
                          variant="ghost" size="sm"
                          onClick={e => { e.stopPropagation(); downloadReceipt(f); }}
                          className="h-7 text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-2.5 gap-1"
                        >
                          <Download size={11} /> Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      </div>

      {/* Make Payment Dialog */}
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Make a Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            {/* Balance reminder */}
            {!isCleared && (
              <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 flex items-center gap-3">
                <AlertCircle size={15} className="text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700 font-medium">
                  Outstanding balance: <span className="font-bold">{currency(student.balance)}</span>
                </p>
              </div>
            )}

            {/* Method selector */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-600">Payment Method</Label>
              <div className="grid grid-cols-3 gap-2">
                {PAYMENT_METHODS.map(m => (
                  <button
                    key={m.value}
                    onClick={() => setPayMethod(m.value)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all",
                      payMethod === m.value
                        ? "border-indigo-400 bg-indigo-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                  >
                    <div className={cn("h-8 w-8 rounded-lg border flex items-center justify-center", m.bg)}>
                      <m.icon size={15} className={m.color} />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600 leading-tight">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Amount (KES) <span className="text-rose-500">*</span></Label>
              <Input
                type="number"
                value={payAmount}
                onChange={e => setPayAmount(e.target.value)}
                placeholder="e.g. 10000"
                className="text-sm font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-600">Reference / Transaction ID</Label>
              <Input
                value={payRef}
                onChange={e => setPayRef(e.target.value)}
                placeholder="Optional — e.g. M-Pesa code"
                className="text-sm font-mono"
              />
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 flex items-start gap-2">
              <ShieldCheck size={13} className="text-emerald-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Payments are processed securely. A receipt will be emailed to your registered address upon confirmation.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="text-xs">Cancel</Button>
            </DialogClose>
            <Button
              size="sm"
              onClick={handlePay}
              disabled={submitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold gap-1.5"
            >
              {submitting
                ? <><Clock size={12} className="animate-spin" /> Processing…</>
                : <><CreditCard size={12} /> Confirm Payment</>
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transaction Detail Dialog */}
      <Dialog open={!!detailFee} onOpenChange={() => setDetailFee(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Transaction Receipt</DialogTitle>
          </DialogHeader>
          {detailFee && (() => {
            const method = PAYMENT_METHODS.find(m => m.label === detailFee.method) ?? PAYMENT_METHODS[0];
            const idx = fees.indexOf(detailFee);
            return (
              <div className="space-y-4 py-1">
                <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-emerald-600" />
                  <div>
                    <p className="text-sm font-bold text-emerald-900">{currency(detailFee.amount)}</p>
                    <p className="text-xs text-emerald-700/70">Payment Confirmed</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Date",      value: detailFee.date },
                    { label: "Method",    value: detailFee.method },
                    { label: "Reference", value: `TXN-${(1000 + idx).toString()}` },
                    { label: "Term",      value: "Term 2 · 2025" },
                  ].map(item => (
                    <div key={item.label} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{item.label}</p>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5 font-mono">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => { downloadReceipt(detailFee); setDetailFee(null); }}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold gap-1.5"
                  >
                    <Download size={12} /> Download Receipt
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline" size="sm" className="text-xs font-semibold">Close</Button>
                  </DialogClose>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  );
}