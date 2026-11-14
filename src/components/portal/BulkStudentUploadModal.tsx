import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileSpreadsheet, Upload, Download, CheckCircle2, AlertTriangle, X, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface ParsedStudentRow {
  admission: string;
  name: string;
  klass: string;
  parent: string;
  phone: string;
  upi?: string;
  gender?: string;
  termFee?: number;
  paidAmount?: number;
  balance?: number;
  isValid: boolean;
  error?: string;
}

interface BulkStudentUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess: (students: ParsedStudentRow[]) => void;
  isHighSchool?: boolean;
}

export function BulkStudentUploadModal({
  open,
  onOpenChange,
  onImportSuccess,
  isHighSchool = false,
}: BulkStudentUploadModalProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<ParsedStudentRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // 1. Download official standardized Excel/CSV starter template
  const handleDownloadTemplate = () => {
    const headers = [
      "Admission_No",
      "Full_Name",
      "Class_Grade",
      "Guardian_Name",
      "Guardian_Phone",
      "Term_Fee_Billed",
      "Fee_Paid",
      "UPI_Number",
      "Gender"
    ];
    const sampleRows = isHighSchool
      ? [
          ["ADM/2026/001", "Brian Kibet", "Form 1 East", "Moses Kibet", "+254712345678", "45000", "30000", "UPI881290", "Male"],
          ["ADM/2026/002", "Stacy Chebet", "Form 2 North", "Grace Chebet", "+254722998877", "45000", "45000", "UPI881291", "Female"],
          ["ADM/2026/003", "David Mwangi", "Form 3 West", "Peter Mwangi", "+254733112233", "48000", "20000", "UPI881292", "Male"],
        ]
      : [
          ["ADM/2026/101", "Amani Kamau", "Grade 1 - Red", "Mary Kamau", "+254700000001", "25000", "15000", "UPI771234", "Male"],
          ["ADM/2026/102", "Brian Mutua", "Grade 1 - Red", "Samuel Mutua", "+254700000002", "25000", "25000", "UPI771235", "Male"],
          ["ADM/2026/103", "Cynthia Kimani", "Grade 1 - Red", "John Kimani", "+254700000003", "25000", "10000", "UPI771236", "Female"],
        ];

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...sampleRows.map(r => r.join(","))].join("\n");
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encoded;
    link.download = `EduCore_Student_Import_Template_${isHighSchool ? "HighSchool" : "Primary"}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Template Downloaded",
      description: "Fill in the template or paste your school's roster into it.",
    });
  };

  // 2. Parse uploaded CSV text with instant invariant validation
  const processCsvText = (text: string) => {
    setIsProcessing(true);
    try {
      const lines = text
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l.length > 0);

      if (lines.length < 2) {
        toast({
          title: "File Empty or Malformed",
          description: "Please ensure the CSV includes headers and at least one student row.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }

      const parsed: ParsedStudentRow[] = [];
      const headerLine = lines[0].toLowerCase();
      const headers = headerLine.split(",").map(h => h.replace(/^["']|["']$/g, "").trim());

      // Smart Column Index Detection: supports any column arrangement from schools
      const nameIdx = headers.findIndex(h => /name|student/i.test(h) && !/guardian|parent/i.test(h));
      const admIdx = headers.findIndex(h => /adm|admission|reg|number/i.test(h));
      const classIdx = headers.findIndex(h => /class|grade|stream/i.test(h));
      const parentIdx = headers.findIndex(h => /guardian|parent|contact_name/i.test(h) && !/phone|contact$/i.test(h));
      const phoneIdx = headers.findIndex(h => /phone|contact|mobile|tel/i.test(h));
      const feeBilledIdx = headers.findIndex(h => /billed|term_fee|total_fee|expected/i.test(h));
      const feePaidIdx = headers.findIndex(h => /paid|amount_paid|receipt/i.test(h));
      const balanceIdx = headers.findIndex(h => /balance|arrears|owing/i.test(h));
      const upiIdx = headers.findIndex(h => /upi|nemis/i.test(h));
      const genderIdx = headers.findIndex(h => /gender|sex/i.test(h));

      const dataRows = lines.slice(1);

      for (let i = 0; i < dataRows.length; i++) {
        // Handle standard comma separation (accounting for quotes)
        const cols = dataRows[i].split(",").map(c => c.replace(/^["']|["']$/g, "").trim());
        
        const name = (nameIdx !== -1 ? cols[nameIdx] : cols[0]) || "";
        const admission = (admIdx !== -1 ? cols[admIdx] : cols[1]) || `ADM/2026/${String(i + 1).padStart(3, "0")}`;
        const klass = (classIdx !== -1 ? cols[classIdx] : cols[2]) || (isHighSchool ? "Form 1 East" : "Grade 1A");
        const parent = (parentIdx !== -1 ? cols[parentIdx] : "Parent/Guardian") || "Parent/Guardian";
        const rawPhone = (phoneIdx !== -1 ? cols[phoneIdx] : cols[3]) || "+254700000000";
        const upi = (upiIdx !== -1 ? cols[upiIdx] : "") || "";
        const gender = (genderIdx !== -1 ? cols[genderIdx] : "Unspecified") || "Unspecified";

        // Financial Ledger Calculation
        const defaultBilled = isHighSchool ? 45000 : 25000;
        const termFee = feeBilledIdx !== -1 && !isNaN(Number(cols[feeBilledIdx])) ? Number(cols[feeBilledIdx]) : defaultBilled;
        const paidAmount = feePaidIdx !== -1 && !isNaN(Number(cols[feePaidIdx])) ? Number(cols[feePaidIdx]) : 0;
        
        // Exact Ledger Balance: if explicit balance given use it, otherwise (billed - paid)
        let balance = balanceIdx !== -1 && !isNaN(Number(cols[balanceIdx])) 
          ? Number(cols[balanceIdx]) 
          : Math.max(0, termFee - paidAmount);

        // Phone Normalizer & Invariant Check
        let isValid = true;
        let error = "";

        if (!name || name.length < 2) {
          isValid = false;
          error = "Student name missing";
        }

        // Format clean phone
        let phone = rawPhone;
        const cleanDigits = rawPhone.replace(/\D/g, "");
        if (cleanDigits.length >= 9) {
          if (cleanDigits.startsWith("0")) {
            phone = `+254 ${cleanDigits.slice(1, 4)} ${cleanDigits.slice(4, 7)} ${cleanDigits.slice(7)}`;
          } else if (cleanDigits.startsWith("254")) {
            phone = `+254 ${cleanDigits.slice(3, 6)} ${cleanDigits.slice(6, 9)} ${cleanDigits.slice(9)}`;
          }
        }

        parsed.push({
          admission,
          name,
          klass,
          parent,
          phone,
          upi,
          gender,
          termFee,
          paidAmount,
          balance,
          isValid,
          error,
        });
      }

      setRows(parsed);
      toast({
        title: "File Parsed Successfully",
        description: `Found ${parsed.length} student records (${parsed.filter(r => r.isValid).length} ready to import).`,
      });
    } catch (err: any) {
      toast({
        title: "Error Parsing File",
        description: err?.message || "Failed to parse the file format.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = evt => {
        const text = evt.target?.result as string;
        processCsvText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = evt => {
        const text = evt.target?.result as string;
        processCsvText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleConfirmImport = () => {
    const validRows = rows.filter(r => r.isValid);
    if (validRows.length === 0) {
      toast({
        title: "No Valid Records",
        description: "Please fix invalid rows before confirming the import.",
        variant: "destructive",
      });
      return;
    }

    onImportSuccess(validRows);
    onOpenChange(false);
    setRows([]);
    setFileName("");

    toast({
      title: "Bulk Enrollment Complete",
      description: `Successfully added ${validRows.length} learners to the active school roster.`,
    });
  };

  const validCount = rows.filter(r => r.isValid).length;
  const invalidCount = rows.length - validCount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 rounded-3xl overflow-hidden border-slate-200/80 shadow-[0_25px_60px_-15px_rgba(10,37,64,0.25)]">
        <DialogHeader className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#0A2540] text-white flex items-center justify-center shadow-md">
                <FileSpreadsheet size={20} />
              </div>
              <div>
                <DialogTitle className="text-lg font-black tracking-tight text-slate-900">
                  Bulk Import Students via Excel / CSV
                </DialogTitle>
                <p className="text-xs text-slate-500 font-medium">
                  Enroll an entire class or whole school roster in seconds with automated validation
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="text-xs font-bold gap-1.5 border-slate-200 text-[#0A2540] hover:bg-slate-100 rounded-xl"
            >
              <Download size={14} />
              Get Template
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Dropzone Area */}
          {rows.length === 0 ? (
            <div
              onDragOver={e => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-emerald-500 bg-emerald-50/30 scale-[0.99]"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, text/csv, application/vnd.ms-excel"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-[#0A2540] flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Upload size={24} />
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Drop your school roster file here, or <span className="text-[#0A2540] underline">browse</span>
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Supports CSV exported from Excel, Google Sheets, or Ministry NEMIS
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Parse Summary Bar */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#0A2540] font-bold shadow-sm">
                    <FileSpreadsheet size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{fileName}</p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {rows.length} total rows parsed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-[11px] gap-1">
                    <CheckCircle2 size={12} />
                    {validCount} Ready
                  </Badge>
                  {invalidCount > 0 && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 font-bold text-[11px] gap-1">
                      <AlertTriangle size={12} />
                      {invalidCount} Needs Fix
                    </Badge>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setRows([]);
                      setFileName("");
                    }}
                    className="h-8 text-xs text-slate-500 hover:text-slate-900"
                  >
                    Clear
                  </Button>
                </div>
              </div>

              {/* Data Preview Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-[300px] overflow-y-auto shadow-inner bg-white">
                <Table>
                  <TableHeader className="bg-slate-50 sticky top-0 z-10">
                    <TableRow className="border-b border-slate-200">
                      <TableHead className="text-[10px] uppercase font-bold text-slate-500">Admission</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-slate-500">Name</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-slate-500">Class</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-slate-500">Guardian</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-slate-500">Phone</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-slate-500">Billed / Paid</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-slate-500">Balance</TableHead>
                      <TableHead className="text-[10px] uppercase font-bold text-slate-500 text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-100 text-xs">
                    {rows.map((r, idx) => (
                      <TableRow key={idx} className={r.isValid ? "hover:bg-slate-50/70" : "bg-red-50/40"}>
                        <TableCell className="font-mono font-bold text-slate-800 py-2.5">
                          {r.admission}
                        </TableCell>
                        <TableCell className="font-bold text-slate-900 py-2.5">
                          {r.name}
                        </TableCell>
                        <TableCell className="text-slate-600 py-2.5">
                          {r.klass}
                        </TableCell>
                        <TableCell className="text-slate-600 py-2.5">
                          {r.parent}
                        </TableCell>
                        <TableCell className="font-mono text-slate-600 py-2.5">
                          {r.phone}
                        </TableCell>
                        <TableCell className="py-2.5 font-medium text-slate-600 text-[11px]">
                          KES {Number(r.paidAmount || 0).toLocaleString()} / {Number(r.termFee || 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="py-2.5 font-bold font-mono">
                          <span className={Number(r.balance || 0) > 0 ? "text-amber-700" : "text-emerald-700"}>
                            KES {Number(r.balance || 0).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right py-2.5">
                          {r.isValid ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                              <CheckCircle2 size={13} /> Valid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600" title={r.error}>
                              <AlertTriangle size={13} /> {r.error}
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 px-6 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            {validCount > 0 ? `${validCount} learners will be enrolled immediately.` : "Upload a file to begin."}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={validCount === 0 || isProcessing}
              onClick={handleConfirmImport}
              className="bg-[#0A2540] hover:bg-[#0A2540]/90 text-white font-bold rounded-xl shadow-md gap-1.5"
            >
              {isProcessing && <Loader2 size={14} className="animate-spin" />}
              Confirm & Enroll {validCount > 0 && `(${validCount})`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
