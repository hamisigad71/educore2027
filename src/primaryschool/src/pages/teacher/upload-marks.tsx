import React, { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/layout";
import { getTeacherProfile, getTeacherStudents, TeacherProfile, StudentItem } from "@/lib/api";
import { saveCbcAssessments, CbcAssessmentItem } from "@/lib/schoolFeatures";
import { parsePdfMarks, ParsedMarksResult } from "@/lib/pdfMarksParser";
import { 
  downloadClassBroadsheetTemplate, 
  parseAcademicCsv, 
  BroadsheetStudentRow 
} from "@/lib/academicBroadsheet";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { 
  Upload, FileText, CheckCircle2, AlertTriangle, 
  Loader2, Download, Sparkles, RefreshCw, Award
} from "lucide-react";
import { cn } from "@/lib/utils";

type MatchStatus = "matched" | "unmatched";

interface MatchedStudent extends BroadsheetStudentRow {
  dbId?: string;
  status: MatchStatus;
}

export default function PrimaryTeacherUploadMarks() {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [klass, setKlass] = useState<string>("");
  const [exam, setExam] = useState("Term 3 CBC Summative Assessment");
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [activeHeaders, setActiveHeaders] = useState<string[]>([]);
  const [matchedStudents, setMatchedStudents] = useState<MatchedStudent[]>([]);
  const [fileName, setFileName] = useState<string>("");
  
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

  const matchParsedStudents = (parsedList: BroadsheetStudentRow[]): MatchedStudent[] => {
    return parsedList.map(parsed => {
      // 1. Admission match
      const parsedAdm = parsed.admissionNumber.toLowerCase().replace(/[^a-z0-9]/g, "");
      let match = myStudents.find(s => 
        s.admission_number && s.admission_number.toLowerCase().replace(/[^a-z0-9]/g, "") === parsedAdm
      );

      // 2. Exact Name match
      if (!match) {
        const parsedName = parsed.studentName.toLowerCase().replace(/['"\.]/g, "");
        match = myStudents.find(s => s.name.toLowerCase().replace(/['"\.]/g, "") === parsedName);
      }

      // 3. Fuzzy Name match
      if (!match) {
        const parsedWords = parsed.studentName.toLowerCase().split(/\s+/).filter(Boolean);
        match = myStudents.find(s => {
          const dbName = s.name.toLowerCase();
          return parsedWords.every(w => dbName.includes(w));
        });
      }

      return {
        ...parsed,
        dbId: match?.id,
        status: match ? ("matched" as const) : ("unmatched" as const)
      };
    });
  };

  const processFile = async (file: File) => {
    setIsParsing(true);
    setFileName(file.name);
    try {
      const isCsv = file.name.endsWith(".csv") || file.type.includes("csv") || file.type.includes("excel");
      
      if (isCsv) {
        const text = await file.text();
        const parsed = await parseAcademicCsv(text, false); // false = CBC Primary
        setActiveHeaders(parsed.headers);
        const matched = matchParsedStudents(parsed.students);
        setMatchedStudents(matched);
        toast({
          title: "CBC Broadsheet Processed",
          description: `Extracted ${parsed.students.length} students across ${parsed.headers.length} learning areas.`
        });
      } else if (file.type === "application/pdf") {
        const result: ParsedMarksResult = await parsePdfMarks(file);
        setActiveHeaders(result.headers);
        
        const converted: BroadsheetStudentRow[] = result.students.map((s, idx) => ({
          admissionNumber: `ADM-${idx + 1}`,
          studentName: s.studentName,
          className: klass,
          subjects: s.subjects
        }));

        const matched = matchParsedStudents(converted);
        setMatchedStudents(matched);
        toast({ title: "PDF Parsed Successfully", description: `Found ${result.students.length} student records.` });
      } else {
        toast({ title: "Unsupported File", description: "Please upload a CSV or PDF file.", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Parsing Failed", description: err.message || "Could not read file.", variant: "destructive" });
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const clearUpload = () => {
    setMatchedStudents([]);
    setActiveHeaders([]);
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownloadTemplateClick = () => {
    const classRoster = myStudents.map(s => ({
      admission_number: s.admission_number,
      name: s.name
    }));
    downloadClassBroadsheetTemplate(klass || "Grade 4 East", exam, classRoster, false);
    toast({
      title: "CBC Template Downloaded",
      description: `Broadsheet for ${klass} pre-filled with ${classRoster.length} students.`
    });
  };

  const handlePublishCbcMarks = async () => {
    const validMatches = matchedStudents.filter(m => m.status === "matched" && m.dbId);
    if (validMatches.length === 0) {
      toast({
        title: "No Matched Students",
        description: "Cannot publish marks. Please ensure student names/admission numbers match the class roster.",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      // Build CBC Assessment items
      const cbcPayload: CbcAssessmentItem[] = [];

      validMatches.forEach(m => {
        Object.entries(m.subjects).forEach(([learningArea, levelVal]) => {
          const levelStr = String(levelVal).toUpperCase();
          const cleanLevel = (["EE", "ME", "AE", "BE"].includes(levelStr) 
            ? levelStr 
            : "ME") as "EE" | "ME" | "AE" | "BE";

          cbcPayload.push({
            studentId: m.dbId!,
            studentName: m.studentName,
            admissionNumber: m.admissionNumber,
            learningArea,
            strand: "Core Competency",
            subStrand: "Summative Evaluation",
            level: cleanLevel,
            comment: `Demonstrated competency level: ${cleanLevel}`
          });
        });
      });

      const res = await saveCbcAssessments(cbcPayload);
      
      if (res.success) {
        toast({
          title: "🎉 CBC Assessments Published!",
          description: `Successfully published rubrics for ${validMatches.length} students (${res.count} competency ratings) to parent portals.`
        });
        clearUpload();
      } else {
        toast({
          title: "Notice",
          description: "Assessments stored in local fallback cache.",
          variant: "default"
        });
      }
    } catch (err: any) {
      toast({ title: "Publish Failed", description: err.message || "Error saving rubrics.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded || !profile) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="animate-spin text-sky-500" size={32} />
      </div>
    );
  }

  const matchedCount = matchedStudents.filter(m => m.status === "matched").length;

  return (
    <>
      <PageHeader
        title="Upload CBC Marks"
        subtitle="Primary School Competency-Based Assessment"
        badge={{ label: "CBC Rubric Engine", variant: "success" }}
      />

      {/* Class Selector & Exam Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            Select Class / Grade
          </label>
          <div className="flex flex-wrap gap-2">
            {profile.classes.map(c => (
              <button
                key={c}
                onClick={() => {
                  setKlass(c);
                  clearUpload();
                }}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border active:scale-[0.98]",
                  klass === c
                    ? "bg-[#0A2540] border-[#0A2540] text-white shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
            CBC Assessment Evaluation
          </label>
          <Input 
            value={exam} 
            onChange={(e) => setExam(e.target.value)} 
            className="h-10 border-slate-200 font-semibold text-sm"
          />
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-100 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">CBC Class Broadsheet</p>
            <p className="text-xs text-slate-600 mt-0.5">
              Download pre-filled template with EE, ME, AE, BE rubrics for your {myStudents.length} students.
            </p>
          </div>
          <Button 
            onClick={handleDownloadTemplateClick}
            variant="outline"
            className="mt-2 h-9 bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50 text-xs font-bold flex items-center gap-1.5 active:scale-[0.98]"
          >
            <Download size={14} /> Download {klass} CBC Template
          </Button>
        </div>
      </div>

      {/* Upload Zone or Data Table */}
      {matchedStudents.length === 0 ? (
        <label
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-3xl cursor-pointer transition-all min-h-[35vh] bg-white",
            isDragging ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 hover:border-emerald-400 hover:bg-slate-50/50",
            isParsing && "opacity-50 pointer-events-none"
          )}
        >
          <input 
            type="file" 
            className="hidden" 
            accept=".csv,.pdf,text/csv,application/pdf" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
          {isParsing ? (
            <>
              <Loader2 className="animate-spin text-emerald-600 mb-4" size={44} />
              <p className="text-base font-bold text-slate-800">Processing CBC Broadsheet...</p>
              <p className="text-xs text-slate-500 mt-1">Validating competency rubrics (EE/ME/AE/BE) and mapping students</p>
            </>
          ) : (
            <>
              <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-emerald-100">
                <Award size={28} className="text-emerald-600" />
              </div>
              <p className="text-lg font-bold text-[#0A2540] mb-1">
                Upload CBC Assessment Broadsheet (CSV or PDF)
              </p>
              <p className="text-xs text-slate-500 font-medium max-w-md text-center">
                Drag and drop your filled CBC rubric file. The system validates competency levels (EE - Exceeding, ME - Meeting, AE - Approaching, BE - Below) and updates parent report cards immediately.
              </p>
              
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors">
                <Upload size={14} /> Browse from Computer
              </div>
            </>
          )}
        </label>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
             <div>
               <div className="flex items-center gap-2">
                 <CheckCircle2 className="text-emerald-500" size={18} />
                 <h3 className="text-base font-bold text-slate-900">
                   CBC Assessment Preview ({fileName})
                 </h3>
               </div>
               <p className="text-xs text-slate-500 mt-0.5">
                 Matched <span className="font-bold text-emerald-600">{matchedCount}</span> of {matchedStudents.length} learners to {klass}.
               </p>
             </div>
             
             <div className="flex items-center gap-2 w-full sm:w-auto">
               <Button 
                 variant="outline" 
                 size="sm"
                 onClick={clearUpload} 
                 disabled={isSaving}
                 className="text-xs font-semibold"
               >
                 <RefreshCw size={13} className="mr-1.5" /> Replace File
               </Button>
               
               <Button 
                 size="sm"
                 onClick={handlePublishCbcMarks} 
                 disabled={isSaving || matchedCount === 0} 
                 className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm active:scale-[0.98]"
               >
                 {isSaving ? (
                   <>
                     <Loader2 className="animate-spin mr-1.5" size={14} /> Publishing...
                   </>
                 ) : (
                   <>
                     <Sparkles className="mr-1.5" size={14} /> Publish to Parent Portals ({matchedCount})
                   </>
                 )}
               </Button>
             </div>
          </div>

          <Card className="rounded-2xl border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto max-h-[55vh]">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f8fafc] text-slate-500 text-[10px] uppercase tracking-wider font-bold sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Adm No.</th>
                    <th className="px-4 py-3">Learner Name</th>
                    {activeHeaders.map(h => (
                      <th key={h} className="px-3 py-3 text-center">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {matchedStudents.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-2.5">
                        {m.status === "matched" ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
                            <CheckCircle2 size={11} /> Matched
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-md text-[10px] font-bold" title="Learner not in enrolled database">
                            <AlertTriangle size={11} /> Unlinked
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-slate-600 font-semibold">
                        {m.admissionNumber}
                      </td>
                      <td className="px-4 py-2.5 font-bold text-slate-900">
                        {m.studentName}
                      </td>
                      {activeHeaders.map(h => {
                        const val = String(m.subjects[h] || "-").toUpperCase();
                        return (
                          <td key={h} className="px-3 py-2.5 text-center">
                            {["EE", "ME", "AE", "BE"].includes(val) ? (
                              <Badge variant="outline" className={cn(
                                "text-[10px] font-bold px-1.5 py-0.5",
                                val === "EE" ? "bg-emerald-50 text-emerald-700 border-emerald-300" :
                                val === "ME" ? "bg-sky-50 text-sky-700 border-sky-300" :
                                val === "AE" ? "bg-amber-50 text-amber-700 border-amber-300" :
                                "bg-rose-50 text-rose-700 border-rose-300"
                              )}>
                                {val}
                              </Badge>
                            ) : (
                              <span className="text-slate-500 font-medium">{val}</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
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
