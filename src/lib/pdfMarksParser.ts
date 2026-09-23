import { supabase } from "./supabase";

export interface ParsedStudentRow {
  studentName: string;
  subjects: Record<string, number>;
}

export interface ParsedMarksResult {
  headers: string[];
  students: ParsedStudentRow[];
  rawText: string;
  warnings: string[];
}

export async function parsePdfMarks(file: File): Promise<ParsedMarksResult> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    
    // Invoke the secure Supabase Edge Function instead of parsing in the browser
    const { data, error } = await supabase.functions.invoke('parse-pdf-marks', {
      body: formData,
    });
    
    if (error) throw error;
    return data as ParsedMarksResult;
  } catch (err: any) {
    return {
      headers: [],
      students: [],
      rawText: "",
      warnings: [`Failed to parse PDF via backend API: ${err.message || err}`],
    };
  }
}
