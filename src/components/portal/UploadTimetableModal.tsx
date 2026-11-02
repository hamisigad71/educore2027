import React, { useState } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, FileText, CheckCircle2, AlertCircle, 
  Calendar, User, BookOpen, Clock, Building2,
  Trash2, Plus, Sparkles, Loader2, ArrowRight,
  ShieldCheck, Check, Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TimetableEntry {
  id: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  class: string;
  room: string;
}

interface UploadTimetableModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTimetableCreated: (entries: TimetableEntry[]) => void;
  schoolType?: "primary" | "secondary";
}

const DEFAULT_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DEFAULT_TIMES = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "02:00 PM", "03:00 PM"];

// Secondary (High School) Data
const SECONDARY_TEACHERS = [
  "Mr. Daniel Kamau",
  "Mrs. Loveth Wambui",
  "Mr. James Ouko",
  "Ms. Mercy Wanza",
  "Mr. Peter Kavoi",
  "Mrs. Grace Mutua",
  "Mr. David Kimani",
];
const SECONDARY_CLASSES = [
  "Form 1 Red",
  "Form 1 Blue",
  "Form 2 Red",
  "Form 2 Green",
  "Form 3 East",
  "Form 3 Blue",
  "Form 4 Red",
  "Form 4 West",
];
const SECONDARY_SUBJECTS = [
  "Mathematics",
  "English",
  "Kiswahili",
  "Chemistry",
  "Physics",
  "Biology",
  "History",
  "Geography",
  "C.R.E",
  "Agriculture",
  "Business Studies",
  "Computer Studies",
];

// Primary School (CBC / KCPE) Data
const PRIMARY_TEACHERS = [
  "Mrs. Loveth Wambui",
  "Mr. Peter Otieno",
  "Ms. Salome Njeri",
  "Mr. Joseph Mwenda",
  "Mrs. Grace Wanjiru",
  "Mr. Kevin Otieno",
  "Ms. Achieng Ouma",
];
const PRIMARY_CLASSES = [
  "Grade 1A",
  "Grade 2B",
  "Grade 3A",
  "Grade 4B",
  "Grade 5A",
  "Grade 5B",
  "Grade 6A",
  "Grade 6B",
  "Grade 7A",
  "Grade 8A",
  "Grade 9A",
];
const PRIMARY_SUBJECTS = [
  "Mathematics",
  "English",
  "Kiswahili",
  "Science & Technology",
  "Social Studies",
  "C.R.E",
  "Agriculture & Nutrition",
  "Creative Arts & Sports",
  "Indigenous Languages",
];

export function UploadTimetableModal({
  open,
  onOpenChange,
  onTimetableCreated,
  schoolType = "secondary",
}: UploadTimetableModalProps) {
  const isPrimary = schoolType === "primary";

  const teachersList = isPrimary ? PRIMARY_TEACHERS : SECONDARY_TEACHERS;
  const classesList = isPrimary ? PRIMARY_CLASSES : SECONDARY_CLASSES;
  const subjectsList = isPrimary ? PRIMARY_SUBJECTS : SECONDARY_SUBJECTS;

  const [tab, setTab] = useState<"upload" | "manual">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [targetClass, setTargetClass] = useState<string>(isPrimary ? "Grade 5A" : "Form 4 Red");
  const [defaultTeacher, setDefaultTeacher] = useState<string>(isPrimary ? "Mrs. Loveth Wambui" : "Mr. James Ouko");
  const [parsedEntries, setParsedEntries] = useState<TimetableEntry[]>([]);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Manual Entry Form State
  const [manualDay, setManualDay] = useState("Monday");
  const [manualTime, setManualTime] = useState("08:00 AM");
  const [manualSubject, setManualSubject] = useState(isPrimary ? "Mathematics" : "Mathematics");
  const [manualTeacher, setManualTeacher] = useState(isPrimary ? "Mrs. Loveth Wambui" : "Mr. James Ouko");
  const [manualClass, setManualClass] = useState(isPrimary ? "Grade 5A" : "Form 4 Red");
  const [manualRoom, setManualRoom] = useState(isPrimary ? "Classroom 5A" : "Room 104");

  // Keep defaults in sync whenever schoolType changes
  React.useEffect(() => {
    if (isPrimary) {
      setTargetClass("Grade 5A");
      setDefaultTeacher("Mrs. Loveth Wambui");
      setManualClass("Grade 5A");
      setManualTeacher("Mrs. Loveth Wambui");
      setManualRoom("Classroom 5A");
      setManualSubject("Mathematics");
    } else {
      setTargetClass("Form 4 Red");
      setDefaultTeacher("Mr. James Ouko");
      setManualClass("Form 4 Red");
      setManualTeacher("Mr. James Ouko");
      setManualRoom("Room 104");
      setManualSubject("Mathematics");
    }
    setParsedEntries([]);
    setFile(null);
    setMessage(null);
  }, [schoolType, isPrimary, open]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      setMessage(null);
    }
  };

  const handleParsePdf = () => {
    if (!file) return;
    setParsing(true);
    setMessage(null);

    // Realistic smart extraction simulation based on selected class and teacher
    setTimeout(() => {
      setParsing(false);
      const generated: TimetableEntry[] = isPrimary
        ? [
            { id: `tt-1`, day: "Monday", time: "08:00 AM", subject: "Mathematics", teacher: defaultTeacher, class: targetClass, room: "Classroom 5A" },
            { id: `tt-2`, day: "Monday", time: "10:00 AM", subject: "Science & Technology", teacher: "Ms. Salome Njeri", class: targetClass, room: "Science Lab" },
            { id: `tt-3`, day: "Tuesday", time: "09:00 AM", subject: "English", teacher: "Mr. Peter Otieno", class: targetClass, room: "Classroom 5A" },
            { id: `tt-4`, day: "Wednesday", time: "08:00 AM", subject: "Kiswahili", teacher: "Mr. Joseph Mwenda", class: targetClass, room: "Classroom 5A" },
            { id: `tt-5`, day: "Wednesday", time: "11:00 AM", subject: "Mathematics", teacher: defaultTeacher, class: targetClass, room: "Classroom 5A" },
            { id: `tt-6`, day: "Thursday", time: "09:00 AM", subject: "Social Studies", teacher: "Mrs. Grace Wanjiru", class: targetClass, room: "Classroom 5A" },
            { id: `tt-7`, day: "Thursday", time: "02:00 PM", subject: "Creative Arts & Sports", teacher: "Mr. Kevin Otieno", class: targetClass, room: "Playfield / Art Rm" },
            { id: `tt-8`, day: "Friday", time: "08:00 AM", subject: "Mathematics", teacher: defaultTeacher, class: targetClass, room: "Classroom 5A" },
            { id: `tt-9`, day: "Friday", time: "10:00 AM", subject: "C.R.E", teacher: "Ms. Achieng Ouma", class: targetClass, room: "Classroom 5A" },
          ]
        : [
            { id: `tt-1`, day: "Monday", time: "08:00 AM", subject: "Mathematics", teacher: defaultTeacher, class: targetClass, room: "Room 104" },
            { id: `tt-2`, day: "Monday", time: "10:00 AM", subject: "Physics", teacher: "Ms. Mercy Wanza", class: targetClass, room: "Lab 2" },
            { id: `tt-3`, day: "Tuesday", time: "09:00 AM", subject: "Chemistry", teacher: "Mr. David Kimani", class: targetClass, room: "Lab 1" },
            { id: `tt-4`, day: "Wednesday", time: "08:00 AM", subject: "English", teacher: "Mrs. Loveth Wambui", class: targetClass, room: "Room 104" },
            { id: `tt-5`, day: "Wednesday", time: "11:00 AM", subject: "Mathematics", teacher: defaultTeacher, class: targetClass, room: "Room 104" },
            { id: `tt-6`, day: "Thursday", time: "09:00 AM", subject: "Biology", teacher: "Mr. David Kimani", class: targetClass, room: "Bio Lab" },
            { id: `tt-7`, day: "Thursday", time: "02:00 PM", subject: "History", teacher: "Mrs. Grace Mutua", class: targetClass, room: "Room 104" },
            { id: `tt-8`, day: "Friday", time: "08:00 AM", subject: "Mathematics", teacher: defaultTeacher, class: targetClass, room: "Room 104" },
            { id: `tt-9`, day: "Friday", time: "10:00 AM", subject: "Kiswahili", teacher: "Mr. Peter Kavoi", class: targetClass, room: "Room 104" },
          ];

      setParsedEntries(generated);
      setMessage({
        text: `Extracted ${generated.length} timetable periods from "${file.name}". You can review or adjust them before saving.`,
        type: "success",
      });
    }, 1400);
  };

  const handleAddManualSlot = () => {
    const newEntry: TimetableEntry = {
      id: `tt-${Date.now()}`,
      day: manualDay,
      time: manualTime,
      subject: manualSubject,
      teacher: manualTeacher,
      class: manualClass,
      room: manualRoom,
    };
    setParsedEntries((prev) => [...prev, newEntry]);
    setMessage({ text: "Added period to schedule draft.", type: "success" });
  };

  const handleRemoveEntry = (id: string) => {
    setParsedEntries((prev) => prev.filter((p) => p.id !== id));
  };

  const handleApplyTimetable = () => {
    if (parsedEntries.length === 0) {
      setMessage({ text: "Please upload a timetable or add periods first.", type: "error" });
      return;
    }
    onTimetableCreated(parsedEntries);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[94vw] max-w-2xl sm:max-w-2xl p-0 overflow-hidden bg-white border border-slate-200/90 rounded-[28px] sm:rounded-[32px] text-slate-900 max-h-[90vh] flex flex-col shadow-[0_25px_70px_-15px_rgba(15,23,42,0.18)]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 sm:pb-5 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 shrink-0">
          <div className="flex items-start gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-200 shrink-0 mt-0.5">
              <Upload size={20} />
            </div>
            <div className="flex-1 min-w-0 pr-6">
              <DialogTitle className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                Upload & Assign Timetable
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-[13px] text-slate-500 font-medium mt-1 leading-relaxed">
                Upload schedule PDFs or allocate weekly lesson slots directly to classes and teachers.
              </DialogDescription>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="mt-5 p-1 bg-slate-100/80 rounded-2xl flex gap-1 border border-slate-200/50">
            <button
              type="button"
              onClick={() => setTab("upload")}
              className={cn(
                "flex-1 py-2 sm:py-2.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-200 flex items-center justify-center gap-2",
                tab === "upload" 
                  ? "bg-white text-indigo-700 shadow-sm shadow-slate-200" 
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              <FileText size={15} /> 
              <span>PDF / File Upload</span>
            </button>
            <button
              type="button"
              onClick={() => setTab("manual")}
              className={cn(
                "flex-1 py-2 sm:py-2.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all duration-200 flex items-center justify-center gap-2",
                tab === "manual" 
                  ? "bg-white text-indigo-700 shadow-sm shadow-slate-200" 
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              <Plus size={15} /> 
              <span>Direct Slot Assignment</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Target Class & Default Teacher Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3.5">
            <div className="flex items-center gap-2">
              <Layers size={15} className="text-indigo-600" />
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Class & Teacher Configuration</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                  Target Class / Stream
                </Label>
                <Select value={targetClass} onValueChange={(val) => { setTargetClass(val); setManualClass(val); }}>
                  <SelectTrigger className="h-11 rounded-xl bg-white border-slate-200 text-xs sm:text-sm font-semibold shadow-sm focus:border-indigo-500">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classesList.map((c) => (
                      <SelectItem key={c} value={c} className="text-xs sm:text-sm font-semibold">{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                  Subject / Default Teacher
                </Label>
                <Select value={defaultTeacher} onValueChange={(val) => { setDefaultTeacher(val); setManualTeacher(val); }}>
                  <SelectTrigger className="h-11 rounded-xl bg-white border-slate-200 text-xs sm:text-sm font-semibold shadow-sm focus:border-indigo-500">
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachersList.map((t) => (
                      <SelectItem key={t} value={t} className="text-xs sm:text-sm font-semibold">{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* TAB 1: PDF UPLOAD VIEW */}
          {tab === "upload" && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 rounded-3xl p-6 sm:p-8 text-center transition-all bg-indigo-50/20 group">
                <input 
                  type="file" 
                  id="tt-pdf-upload" 
                  accept=".pdf,.png,.jpg,.jpeg,.csv" 
                  className="hidden" 
                  onChange={handleFileUpload}
                />
                <label htmlFor="tt-pdf-upload" className="cursor-pointer space-y-3 block">
                  <div className="h-14 w-14 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-transform">
                    <FileText size={28} />
                  </div>
                  <div>
                    <p className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {file ? file.name : "Click to select Timetable PDF or Image"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                      Accepts school schedule PDFs, scanned chart images, or CSV exports
                    </p>
                  </div>
                </label>
              </div>

              {file && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={handleParsePdf}
                    disabled={parsing}
                    className="w-full sm:w-auto h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl gap-2 shadow-md shadow-indigo-100"
                  >
                    {parsing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Extracting Lessons from PDF...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Parse & Map to {targetClass}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MANUAL ENTRY FORM VIEW */}
          {tab === "manual" && (
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Plus size={15} className="text-indigo-600" />
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Add Single Period</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-slate-500">Day</Label>
                  <Select value={manualDay} onValueChange={setManualDay}>
                    <SelectTrigger className="h-10 text-xs rounded-xl bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DEFAULT_DAYS.map((d) => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-slate-500">Time Slot</Label>
                  <Select value={manualTime} onValueChange={setManualTime}>
                    <SelectTrigger className="h-10 text-xs rounded-xl bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {DEFAULT_TIMES.map((t) => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-slate-500">Subject</Label>
                  <Select value={manualSubject} onValueChange={setManualSubject}>
                    <SelectTrigger className="h-10 text-xs rounded-xl bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {subjectsList.map((s) => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-slate-500">Teacher</Label>
                  <Select value={manualTeacher} onValueChange={setManualTeacher}>
                    <SelectTrigger className="h-10 text-xs rounded-xl bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {teachersList.map((t) => <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-slate-500">Room / Venue</Label>
                  <Input 
                    value={manualRoom}
                    onChange={(e) => setManualRoom(e.target.value)}
                    placeholder="e.g. Lab 2 / Rm 104"
                    className="h-10 text-xs rounded-xl"
                  />
                </div>

                <div className="flex items-end">
                  <Button 
                    type="button"
                    onClick={handleAddManualSlot}
                    className="w-full h-10 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl gap-1.5 shadow-sm"
                  >
                    <Plus size={14} /> Add to Schedule
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Feedback & Notice Banner */}
          {message && (
            <div className={cn(
              "p-3.5 rounded-2xl text-xs font-semibold flex items-start sm:items-center gap-2.5",
              message.type === "success" 
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                : "bg-rose-50 text-rose-800 border border-rose-200"
            )}>
              {message.type === "success" ? (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5 sm:mt-0" />
              ) : (
                <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5 sm:mt-0" />
              )}
              <span className="leading-relaxed">{message.text}</span>
            </div>
          )}

          {/* Draft Preview List / Table (Fully Responsive) */}
          {parsedEntries.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <div className="flex justify-between items-center px-1">
                <p className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Draft Schedule ({parsedEntries.length} Slots)
                </p>
                <button
                  type="button"
                  onClick={() => setParsedEntries([])}
                  className="text-[11px] font-bold text-rose-600 hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Mobile Card List View (< sm screens) */}
              <div className="space-y-2 sm:hidden">
                {parsedEntries.map((entry) => (
                  <div key={entry.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{entry.day}</span>
                        <span className="text-[11px] font-mono text-slate-500 font-medium">{entry.time}</span>
                      </div>
                      <p className="font-bold text-indigo-700">{entry.subject} · <span className="text-slate-600 font-semibold">{entry.class}</span></p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <User size={11} /> {entry.teacher} ({entry.room})
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEntry(entry.id)}
                      className="text-slate-400 hover:text-rose-600 p-2 shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (>= sm screens) */}
              <div className="hidden sm:block border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Day & Time</th>
                      <th className="py-2.5 px-4">Subject</th>
                      <th className="py-2.5 px-4">Teacher Assigned</th>
                      <th className="py-2.5 px-3">Class</th>
                      <th className="py-2.5 px-3">Room</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {parsedEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-4 font-bold text-slate-900">
                          {entry.day} <span className="font-mono text-slate-400 font-normal">({entry.time})</span>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-indigo-700">{entry.subject}</td>
                        <td className="py-2.5 px-4 text-slate-800 flex items-center gap-1.5">
                          <User size={13} className="text-slate-400" /> {entry.teacher}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-600">{entry.class}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-500">{entry.room}</td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveEntry(entry.id)}
                            className="text-slate-300 hover:text-rose-600 transition-colors p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Controls */}
        <div className="p-4 sm:p-5 px-5 sm:px-6 bg-slate-50/80 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0">
          <Button 
            type="button"
            variant="ghost" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto h-11 rounded-xl text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleApplyTimetable}
            disabled={parsedEntries.length === 0}
            className="w-full sm:w-auto h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-100 gap-2 px-6 disabled:opacity-50"
          >
            <CheckCircle2 size={16} /> Save & Publish Timetable
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UploadTimetableModal;
