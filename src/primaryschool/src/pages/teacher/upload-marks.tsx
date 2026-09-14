import React, { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/layout";
import { getTeacherProfile, getTeacherStudents, bulkRecordExamResults, TeacherProfile, StudentItem } from "@/lib/api";
import { parsePdfMarks, ParsedMarksResult, ParsedStudentRow } from "@/lib/pdfMarksParser";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

import { Upload, FileText, CheckCircle2, AlertTriangle, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type MatchStatus = "matched" | "unmatched" | "skipped";

interface MatchedStudent extends ParsedStudentRow {
  dbId?: string;
  status: MatchStatus;
}

export default function TeacherUploadMarks() {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [klass, setKlass] = useState<string>("");
  const [exam, setExam] = useState("Term 3 End of Term Exam");
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [parsedResult, setParsedResult] = useState<ParsedMarksResult | null>(null);
  const [matchedStudents, setMatchedStudents] = useState<MatchedStudent[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const p = await getTeacherProfile();
        if (p) {
          setProfile(p);
          if (p.classes.length > 0) {
            setKlass(p.classes[0]);
            const stds = await getTeacherStudents(p.classes);
            setStudents(stds);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoaded(true);
      }
    }
    loadData();
  }, []);

  const myStudents = students.filter((s) => s.className === klass);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Invalid file type", description: "Please upload a PDF document.", variant: "destructive" });
      return;
    }
    
    processFile(file);
  };

  const processFile = async (file: File) => {
    setIsParsing(true);
    setParsedResult(null);
    try {
      const result = await parsePdfMarks(file);
      setParsedResult(result);
      
      // Attempt to match names
      const matched = result.students.map(parsed => {
        // Simple case-insensitive exact matching or contained string
        const parsedName = parsed.studentName.toLowerCase().replace(/['"\.]/g, "");
        let match = myStudents.find(s => s.name.toLowerCase().replace(/['"\.]/g, "") === parsedName);
        
        // If no exact match, try fuzzy (one contains the other)
        if (!match) {
           match = myStudents.find(s => {
             const dbName = s.name.toLowerCase().replace(/['"\.]/g, "");
             // Check if dbName starts with parsedName or vice versa (e.g. "Amani Otieno" matches "Amani")
             // Splitting into words for a rudimentary match
             const parsedWords = parsedName.split(" ").filter(Boolean);
             return parsedWords.every(w => dbName.includes(w));
           });
        }

        return {
          ...parsed,
          dbId: match?.id,
          status: match ? "matched" as const : "unmatched" as const
        };
      });

      setMatchedStudents(matched);
      
      if (result.warnings.length > 0) {
        toast({ title: "Parsing Warnings", description: `Parsed with ${result.warnings.length} warnings. Please review carefully.`, variant: "default" });
      } else {
        toast({ title: "PDF Parsed Successfully", description: `Found ${result.students.length} student records.` });
      }

    } catch (err: any) {
      toast({ title: "Failed to parse PDF", description: err.message, variant: "destructive" });
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      processFile(file);
    } else {
      toast({ title: "Invalid File", description: "Please drop a PDF file.", variant: "destructive" });
    }
  };

  const clearUpload = () => {
    setParsedResult(null);
    setMatchedStudents([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    const validMatches = matchedStudents.filter(m => m.status === "matched" && m.dbId);
    if (validMatches.length === 0) {
      toast({ title: "No matched records", description: "Ensure students are matched before saving.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const payload = validMatches.map(m => ({
        id: m.dbId!,
        name: m.studentName,
        subjects: m.subjects
      }));

      const res = await bulkRecordExamResults(exam, payload);
      
      if (res.success) {
        toast({ title: "Marks Saved", description: `Successfully recorded marks for ${validMatches.length} students.` });
        clearUpload();
      } else {
        toast({ title: "Partial Success", description: `Saved some, but encountered ${res.errors.length} errors.`, variant: "destructive" });
        console.error(res.errors);
      }
    } catch (err) {
      toast({ title: "Save Failed", description: "An error occurred while saving.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded || !profile) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Upload Marks (PDF)"
        subtitle="Teaching & Assessment"
        badge={{ label: profile.subject, variant: "warning" }}
      />

      {/* Configuration row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Select Class</label>
          <div className="flex gap-2">
            {profile.classes.map(c => (
              <button
                key={c}
                onClick={() => setKlass(c)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
                  klass === c
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Exam / Assessment</label>
          <Input 
            value={exam} 
            onChange={(e) => setExam(e.target.value)} 
            className="h-10 border-slate-200 font-semibold"
          />
        </div>
      </div>

      {!parsedResult ? (
        <label
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl cursor-pointer transition-all min-h-[40vh]",
            isDragging ? "border-indigo-500 bg-indigo-50/50" : "border-slate-300 bg-white hover:bg-slate-50",
            isParsing && "opacity-50 pointer-events-none"
          )}
        >
          <input type="file" className="hidden" accept=".pdf" ref={fileInputRef} onChange={handleFileChange} />
          {isParsing ? (
            <>
              <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
              <p className="text-lg font-bold text-slate-800">Cranking the gears (AI OCR)...</p>
              <p className="text-sm text-slate-500 mt-1">Reading PDF table</p>
            </>
          ) : (
            <>
              <div className="h-20 w-20 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-100">
                <FileText size={32} className="text-indigo-600" />
              </div>
              <p className="text-xl font-bold text-slate-800 mb-2">Drag & drop your PDF marks sheet here</p>
              <p className="text-sm text-slate-500 font-medium max-w-sm text-center">
                System will auto-extract tables with student names and marks.
              </p>
              
              <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-4 py-2 rounded-full">
                <Upload size={14} /> or click to browse files
              </div>
            </>
          )}
        </label>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
             <div>
               <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                 <CheckCircle2 className="text-emerald-500" size={20} /> Preview & Confirm
               </h3>
               <p className="text-sm text-slate-500">
                 Found {parsedResult.students.length} students across {parsedResult.headers.length} subjects.
               </p>
             </div>
             <div className="flex gap-3">
               <Button variant="outline" onClick={clearUpload} disabled={isSaving}>Discard & Upload Again</Button>
               <Button onClick={handleSave} disabled={isSaving || matchedStudents.filter(m => m.status === "matched").length === 0} className="bg-emerald-600 hover:bg-emerald-700">
                 {isSaving ? <Loader2 className="animate-spin mr-2" size={16} /> : <CheckCircle2 className="mr-2" size={16} />}
                 Save {matchedStudents.filter(m => m.status === "matched").length} Records to DB
               </Button>
             </div>
          </div>

          {parsedResult.warnings.length > 0 && (
             <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
               <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2 mb-2">
                 <AlertTriangle size={16} /> Parsing Warnings
               </h4>
               <ul className="list-disc list-inside text-xs text-amber-700 space-y-1">
                 {parsedResult.warnings.map((w, idx) => <li key={idx}>{w}</li>)}
               </ul>
             </div>
          )}

          <Card className="rounded-3xl border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-[#f8fafc] text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-6 py-4">Database Match</th>
                    <th className="px-6 py-4">Parsed Student Name</th>
                    {parsedResult.headers.map(h => (
                      <th key={h} className="px-6 py-4 text-center">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {matchedStudents.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        {m.status === "matched" ? (
                           <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-md text-xs font-semibold">
                             <CheckCircle2 size={12} /> Matched
                           </div>
                        ) : (
                           <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 px-2 py-1 rounded-md text-xs font-semibold cursor-help" title="Could not find student in this class with this name. Will be skipped.">
                             <AlertTriangle size={12} /> Unmatched (Skipping)
                           </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                         <p className="font-bold text-slate-900">{m.studentName}</p>
                      </td>
                      {parsedResult.headers.map(h => (
                        <td key={h} className="px-6 py-4 text-center font-medium text-slate-700">
                           {m.subjects[h] !== undefined ? m.subjects[h] : "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {matchedStudents.length === 0 && (
                    <tr>
                      <td colSpan={parsedResult.headers.length + 2} className="px-6 py-8 text-center text-slate-500">
                        No valid rows pulled from PDF.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
      
      <Toaster />
    </>
  );
}
