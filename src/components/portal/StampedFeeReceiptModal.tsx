import React, { useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Printer, Download, ShieldCheck, CheckCircle2, 
  Building2, QrCode, X, Landmark, Smartphone
} from "lucide-react";

export interface StampedFeeReceiptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiptData: {
    receiptNumber: string;
    studentName: string;
    admissionNumber: string;
    className: string;
    amountPaid: number;
    totalBalance: number;
    paymentMethod: string;
    transactionRef: string;
    date?: string;
    term?: string;
    year?: number;
    voteheadBreakdown?: { name: string; amount: number }[];
  };
}

export function StampedFeeReceiptModal({
  open,
  onOpenChange,
  receiptData,
}: StampedFeeReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const formattedAmount = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(receiptData.amountPaid);

  const formattedBalance = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(receiptData.totalBalance);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-[94vw] p-0 overflow-hidden bg-slate-100 border border-slate-200 rounded-3xl text-slate-900 max-h-[92vh] flex flex-col shadow-2xl">
        {/* Screen Controls Header */}
        <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-600">
              Official Stamped Fee Voucher
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePrint}
              className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md gap-1.5 px-4"
            >
              <Printer size={15} /> Print / Download PDF
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-9 w-9 text-slate-400 hover:text-slate-700 rounded-xl"
            >
              <X size={18} />
            </Button>
          </div>
        </div>

        {/* Printable Physical Receipt Paper */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 flex justify-center">
          <div 
            ref={receiptRef}
            className="w-full max-w-xl bg-white border border-slate-300 shadow-sm p-6 sm:p-8 rounded-2xl relative text-slate-900 font-sans print:border-none print:shadow-none print:m-0 print:p-0"
          >
            {/* Watermark Seal */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <Building2 className="w-96 h-96" />
            </div>

            {/* School Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 relative">
              <div className="flex justify-center mb-2">
                <div className="h-14 w-14 rounded-2xl bg-indigo-900 text-white flex items-center justify-center shadow-md">
                  <Building2 size={28} />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                EDUCORE ACADEMY & HIGH SCHOOL
              </h2>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
                Ministry of Education Registered · KNEC Code: 40102104
              </p>
              <p className="text-[10px] text-slate-400">
                P.O. Box 45000-00100 Nairobi, Kenya · Tel: +254 700 000 000 · bursar@educore.ac.ke
              </p>
              <div className="mt-3 inline-block px-4 py-1 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-full">
                OFFICIAL FEE RECEIPT
              </div>
            </div>

            {/* Receipt Meta & Details */}
            <div className="grid grid-cols-2 gap-4 my-5 text-xs">
              <div className="space-y-1">
                <p className="text-slate-500 text-[10px] uppercase font-bold">Student Name:</p>
                <p className="font-black text-slate-900 text-sm">{receiptData.studentName}</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold mt-2">Class / Stream:</p>
                <p className="font-bold text-slate-800">{receiptData.className}</p>
              </div>

              <div className="space-y-1 text-right">
                <p className="text-slate-500 text-[10px] uppercase font-bold">Receipt No:</p>
                <p className="font-mono font-bold text-indigo-700 text-sm">{receiptData.receiptNumber}</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold mt-2">Admission No:</p>
                <p className="font-mono font-bold text-slate-900">{receiptData.admissionNumber}</p>
                <p className="text-[10px] text-slate-400 mt-1">Date: {receiptData.date || new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Transaction Ledger Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden my-4">
              <table className="w-full text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 text-left">Description</th>
                    <th className="py-2.5 px-3 text-left">Reference</th>
                    <th className="py-2.5 px-3 text-right">Amount (KES)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">Term Tuition & Boarding Fees</p>
                      <p className="text-[10px] text-slate-400">{receiptData.term || "Term 2"} Academic Year {receiptData.year || 2026}</p>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-700">
                      {receiptData.transactionRef}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-slate-900 text-sm">
                      {formattedAmount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals & Outstanding Balance */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center my-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Payment Channel</p>
                <p className="text-xs font-bold text-slate-800 capitalize flex items-center gap-1.5 mt-0.5">
                  <Smartphone size={13} className="text-emerald-600" />
                  {receiptData.paymentMethod.toUpperCase()} Clearance
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400">Outstanding Balance</p>
                <p className="text-sm font-black text-rose-600 font-mono">{formattedBalance}</p>
              </div>
            </div>

            {/* Verification Stamp & Signature */}
            <div className="pt-6 border-t border-dashed border-slate-300 mt-6 flex justify-between items-end">
              {/* QR Verification Seal */}
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 p-1.5 bg-slate-50 border border-slate-300 rounded-xl flex items-center justify-center">
                  <QrCode size={48} className="text-slate-800" />
                </div>
                <div className="text-[9px] text-slate-500 font-medium">
                  <p className="font-bold text-slate-800 uppercase">Tamper-Proof Verify</p>
                  <p>Scan to verify ledger entry</p>
                  <p className="text-[8px] font-mono text-slate-400 mt-0.5">AUTH: SEC-2026-KE</p>
                </div>
              </div>

              {/* Official Bursar Rubber Stamp Graphic */}
              <div className="relative">
                <div className="border-2 border-rose-600 text-rose-600 rounded-xl p-2.5 px-4 text-center rotate-[-6deg] shadow-sm select-none">
                  <p className="text-[9px] font-black uppercase tracking-widest leading-none">EDUCORE ACADEMY</p>
                  <p className="text-xs font-black uppercase tracking-wider my-0.5">BURSAR'S OFFICE</p>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-emerald-700">★ VERIFIED & RECEIVED ★</p>
                  <p className="text-[8px] font-mono mt-0.5">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-slate-400 text-center mt-6 uppercase tracking-wider">
              This is an official computer-generated receipt issued by EduCore School Management.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default StampedFeeReceiptModal;

