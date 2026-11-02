import React, { useRef } from "react";
import { 
  Dialog, DialogContent 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Printer, Download, Building2, CheckCircle2, 
  Calendar, Award, User, X
} from "lucide-react";

interface ReportCardSubject {
  subjectName: string;
  marks: number;
  grade: string;
  remarks: string;
  teacher?: string;
}

interface ReportCardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: {
    name: string;
    admissionNumber: string;
    className: string;
    term: string;
    year: string;
    rank?: string;
    totalStudents?: number;
    attendance?: string;
    kcpeMarks?: number | null;
  };
  subjects: ReportCardSubject[];
  principalRemarks?: string;
  classTeacherRemarks?: string;
  closingDate?: string;
  openingDate?: string;
}

export function ReportCardModal({
  open,
  onOpenChange,
  student,
  subjects,
  principalRemarks = "A very commendable academic performance. With sustained discipline in revision, an exemplary KCSE aggregate is assured.",
  classTeacherRemarks = "Attentive, disciplined, and proactive in classroom discussions. Consistently excels in STEM subjects.",
  closingDate = "05 April 2026",
  openingDate = "04 May 2026",
}: ReportCardModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const totalMarks = subjects.reduce((sum, s) => sum + s.marks, 0);
  const avg = subjects.length ? Math.round(totalMarks / subjects.length) : 0;

  const calculateMeanGrade = (score: number) => {
    if (score >= 80) return { grade: "A", points: 12 };
    if (score >= 75) return { grade: "A-", points: 11 };
    if (score >= 70) return { grade: "B+", points: 10 };
    if (score >= 65) return { grade: "B", points: 9 };
    if (score >= 60) return { grade: "B-", points: 8 };
    if (score >= 55) return { grade: "C+", points: 7 };
    if (score >= 50) return { grade: "C", points: 6 };
    return { grade: "D", points: 4 };
  };

  const meanData = calculateMeanGrade(avg);

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden bg-slate-100 border border-slate-200 rounded-3xl text-slate-900 max-h-[95vh] flex flex-col">
        {/* Modal Controls Header (Screen only, hidden on print) */}
        <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">Official Report Form Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handlePrint}
              className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md gap-1.5 px-4"
            >
              <Printer size={15} /> Print / Save as PDF
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

        {/* Printable Paper Document (A4 Styling) */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 flex justify-center bg-slate-200/60 print:p-0 print:bg-white print:overflow-visible">
          <div 
            ref={printRef}
            className="w-full max-w-[800px] bg-white p-8 sm:p-12 shadow-xl border border-slate-200 print:border-none print:shadow-none print:p-6 print:w-full space-y-6 text-slate-900 font-sans"
          >
            {/* School Crest & Header */}
            <div className="border-b-2 border-slate-900 pb-5 text-center relative">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="h-14 w-14 rounded-2xl bg-indigo-900 text-white flex items-center justify-center shadow-md">
                  <Building2 size={32} />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-slate-900 leading-none">
                    EduCore Academy
                  </h1>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                    Excellence · Integrity · Innovation
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                P.O. Box 40112 - 00100 Nairobi, Kenya · Tel: +254 700 000 000 · Email: info@educore.ac.ke
              </p>
              <div className="mt-4 py-1.5 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-md">
                Terminal Student Academic Progress Report
              </div>
            </div>

            {/* Student & Class Information Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student Name</p>
                <p className="font-extrabold text-slate-900 text-sm mt-0.5">{student.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Admission No.</p>
                <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">{student.admissionNumber}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Class & Stream</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{student.className}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Term / Session</p>
                <p className="font-bold text-indigo-700 text-sm mt-0.5">{student.term} ({student.year})</p>
              </div>
            </div>

            {/* Performance Summary Banner */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Marks</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">{totalMarks} <span className="text-xs text-slate-400 font-semibold">/ {subjects.length * 100}</span></p>
              </div>
              <div className="p-3 rounded-xl border border-indigo-200 bg-indigo-50/50">
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Mean Score & Grade</p>
                <p className="text-2xl font-black text-indigo-900 mt-0.5">{avg}% <span className="text-base font-extrabold text-indigo-600">({meanData.grade})</span></p>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 bg-white">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stream Position</p>
                <p className="text-2xl font-black text-slate-900 mt-0.5">{student.rank || "3"} <span className="text-xs text-slate-400 font-semibold">/ {student.totalStudents || 42}</span></p>
              </div>
            </div>

            {/* Academic Subjects Table */}
            <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-white text-[10px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">Subject</th>
                    <th className="py-2.5 px-3 text-center">Score (%)</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                    <th className="py-2.5 px-3 text-center">Points</th>
                    <th className="py-2.5 px-4">Teacher's Remarks</th>
                    <th className="py-2.5 px-3 text-right">Initials</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {subjects.map((sub, i) => {
                    const info = calculateMeanGrade(sub.marks);
                    return (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/70"}>
                        <td className="py-2.5 px-4 font-bold text-slate-900">{sub.subjectName}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">{sub.marks}%</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-900 border border-slate-300">
                            {sub.grade || info.grade}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold">{info.points}</td>
                        <td className="py-2.5 px-4 text-slate-600 italic">{sub.remarks || "Satisfactory understanding"}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-400">{sub.teacher || "TR"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Teacher Remarks & Principal Approval */}
            <div className="space-y-4 pt-2">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Class Teacher Remarks</p>
                <p className="text-slate-700 italic">"{classTeacherRemarks}"</p>
                <div className="flex justify-between items-center pt-2 text-[10px] text-slate-400 font-bold">
                  <span>Sign: ___________________</span>
                  <span>Date: {closingDate}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                <p className="font-bold text-slate-900 uppercase tracking-wider text-[10px]">Principal / Headteacher Remarks</p>
                <p className="text-slate-700 italic">"{principalRemarks}"</p>
                <div className="flex justify-between items-center pt-2 text-[10px] text-slate-400 font-bold">
                  <span>Official Seal: ___________________</span>
                  <span>Next Term Begins: <strong className="text-slate-900">{openingDate}</strong></span>
                </div>
              </div>
            </div>

            {/* Security Footer */}
            <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-[10px] text-slate-400 font-medium">
              <span>System-Generated Official Academic Transcript · EduCore 2027</span>
              <span>Doc Ref: EDU-{student.admissionNumber}-{Date.now().toString().slice(-6)}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReportCardModal;
