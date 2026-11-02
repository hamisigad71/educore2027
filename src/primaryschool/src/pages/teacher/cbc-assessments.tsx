import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { saveCbcAssessments, CbcAssessmentItem } from "@/lib/schoolFeatures";
import { 
  Sparkles, Save, CheckCircle2, Award, 
  BookOpen, Star, Filter, Users, FileCheck 
} from "lucide-react";
import { cn } from "@/lib/utils";

const CBC_LEARNING_AREAS = [
  "Mathematics Activities",
  "English Language Activities",
  "Kiswahili Language Activities",
  "Science & Technology",
  "Social Studies & Citizenship",
  "Agriculture & Nutrition",
  "Creative Arts & Sports",
];

const CBC_STRANDS: Record<string, { strand: string; subStrand: string }[]> = {
  "Mathematics Activities": [
    { strand: "Numbers", subStrand: "Fractions and Decimals" },
    { strand: "Measurement", subStrand: "Mass and Volume" },
    { strand: "Geometry", subStrand: "Lines and Angles" },
  ],
  "Science & Technology": [
    { strand: "Living Things", subStrand: "Human Digestive System" },
    { strand: "Matter", subStrand: "Solids, Liquids, and Gases" },
    { strand: "Forces & Energy", subStrand: "Simple Machines & Work" },
  ],
  "English Language Activities": [
    { strand: "Listening & Speaking", subStrand: "Pronunciation & Intonation" },
    { strand: "Reading", subStrand: "Comprehension & Vocabulary" },
    { strand: "Writing", subStrand: "Narrative Composition" },
  ],
};

const STUDENTS_MOCK = [
  { id: "s1", admission: "ADM-2024-001", name: "Amani Otieno", level: "EE" as const },
  { id: "s2", admission: "ADM-2024-002", name: "Wanjiku Njoroge", level: "ME" as const },
  { id: "s3", admission: "ADM-2024-003", name: "Kiptoo Cheruiyot", level: "ME" as const },
  { id: "s4", admission: "ADM-2024-004", name: "Fatma Hassan", level: "EE" as const },
  { id: "s5", admission: "ADM-2024-005", name: "Brian Ochieng", level: "AE" as const },
  { id: "s6", admission: "ADM-2024-006", name: "Faith Mutiso", level: "ME" as const },
  { id: "s7", admission: "ADM-2024-007", name: "Samuel Mwangi", level: "BE" as const },
  { id: "s8", admission: "ADM-2024-008", name: "Aisha Mohammed", level: "EE" as const },
];

export default function CbcAssessmentPage() {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState("Grade 5A");
  const [selectedArea, setSelectedArea] = useState("Mathematics Activities");
  const [selectedStrandIndex, setSelectedStrandIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<string, "EE" | "ME" | "AE" | "BE">>({
    s1: "EE", s2: "ME", s3: "ME", s4: "EE", s5: "AE", s6: "ME", s7: "BE", s8: "EE"
  });
  const [saving, setSaving] = useState(false);

  const activeStrandPair = CBC_STRANDS[selectedArea] 
    ? CBC_STRANDS[selectedArea][selectedStrandIndex] || CBC_STRANDS[selectedArea][0]
    : { strand: "Core Competency", subStrand: "Concept Exploration" };

  const handleLevelChange = (studentId: string, level: "EE" | "ME" | "AE" | "BE") => {
    setRatings(prev => ({ ...prev, [studentId]: level }));
  };

  const handleSaveToSupabase = async () => {
    setSaving(true);
    const payload: CbcAssessmentItem[] = STUDENTS_MOCK.map(s => ({
      studentId: s.id,
      studentName: s.name,
      admissionNumber: s.admission,
      learningArea: selectedArea,
      strand: activeStrandPair.strand,
      subStrand: activeStrandPair.subStrand,
      level: ratings[s.id] || "ME",
    }));

    await saveCbcAssessments(payload);
    setSaving(false);
    toast({
      title: "CBC Competencies Saved to Supabase 🎉",
      description: `Evaluations for ${STUDENTS_MOCK.length} students recorded under ${activeStrandPair.subStrand}.`,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="CBC Competency Assessment"
        subtitle="Competency-Based Curriculum rubric assessment for Primary and Junior Secondary"
        actions={
          <Button 
            onClick={handleSaveToSupabase}
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 px-5 rounded-xl gap-2 shadow-sm"
          >
            <Save size={15} />
            {saving ? "Saving to Supabase..." : "Save Assessment to Supabase"}
          </Button>
        }
      />

      {/* Configuration Selectors */}
      <Card className="border-slate-200 shadow-sm bg-white rounded-2xl">
        <CardContent className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Class / Grade</label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="h-10 text-xs rounded-xl font-bold"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Grade 4B", "Grade 5A", "Grade 5B", "Grade 6A", "Grade 7A", "Grade 8A"].map(c => (
                  <SelectItem key={c} value={c} className="text-xs font-semibold">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Learning Area</label>
            <Select value={selectedArea} onValueChange={(val) => { setSelectedArea(val); setSelectedStrandIndex(0); }}>
              <SelectTrigger className="h-10 text-xs rounded-xl font-bold"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CBC_LEARNING_AREAS.map(a => (
                  <SelectItem key={a} value={a} className="text-xs font-semibold">{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Strand & Sub-strand</label>
            <div className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold text-indigo-700">
              <span className="truncate">{activeStrandPair.strand} · {activeStrandPair.subStrand}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competency Level Guide Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { code: "EE", label: "Exceeding Expectation", desc: "Demonstrates deep mastery beyond standard", color: "bg-emerald-50 text-emerald-800 border-emerald-200" },
          { code: "ME", label: "Meeting Expectation", desc: "Achieves expected learning outcomes", color: "bg-blue-50 text-blue-800 border-blue-200" },
          { code: "AE", label: "Approaching Expectation", desc: "Requires occasional support to meet outcome", color: "bg-amber-50 text-amber-800 border-amber-200" },
          { code: "BE", label: "Below Expectation", desc: "Requires structured remedial intervention", color: "bg-rose-50 text-rose-800 border-rose-200" },
        ].map((guide) => (
          <div key={guide.code} className={cn("p-3 rounded-2xl border text-xs", guide.color)}>
            <div className="flex items-center justify-between mb-1">
              <span className="font-black text-sm">{guide.code}</span>
              <span className="text-[10px] font-bold uppercase">{guide.label}</span>
            </div>
            <p className="text-[10px] opacity-80 leading-tight">{guide.desc}</p>
          </div>
        ))}
      </div>

      {/* Student Rubric Matrix */}
      <Card className="border-slate-200 shadow-sm bg-white rounded-3xl overflow-hidden">
        <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-black text-slate-900">
              Student Assessment Roster ({STUDENTS_MOCK.length} Learners)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Select performance rubric for each learner on: <strong className="text-slate-800">{activeStrandPair.subStrand}</strong>
            </CardDescription>
          </div>
          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 text-xs font-bold px-3 py-1">
            Term 2 · 2026
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {STUDENTS_MOCK.map((student, idx) => {
              const currentLevel = ratings[student.id] || "ME";
              return (
                <div key={student.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-400 w-6">#{idx + 1}</span>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{student.name}</p>
                      <p className="text-[11px] font-mono text-slate-400">{student.admission}</p>
                    </div>
                  </div>

                  {/* Rubric Selector Buttons */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    {(["EE", "ME", "AE", "BE"] as const).map((lvl) => {
                      const isSelected = currentLevel === lvl;
                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handleLevelChange(student.id, lvl)}
                          className={cn(
                            "h-9 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 border",
                            isSelected && lvl === "EE" && "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100",
                            isSelected && lvl === "ME" && "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100",
                            isSelected && lvl === "AE" && "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-100",
                            isSelected && lvl === "BE" && "bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-100",
                            !isSelected && "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                          )}
                        >
                          {lvl}
                          {isSelected && <CheckCircle2 size={13} className="ml-0.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

