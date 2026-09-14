/**
 * PDF Marks Parser — Client-side PDF text extraction & table parsing
 * Uses pdfjs-dist (Mozilla PDF.js) to extract text from uploaded PDF mark sheets.
 * 
 * Supported formats:
 * - Tables with header row containing subject names
 * - Data rows with student name + numeric marks
 * - Space/tab/pipe delimited columns
 */

import * as pdfjsLib from "pdfjs-dist";

// Point PDF.js to its worker (Vite-compatible)
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export interface ParsedStudentRow {
  studentName: string;
  subjects: Record<string, number>; // { "Mathematics": 88, "English": 76, ... }
}

export interface ParsedMarksResult {
  headers: string[];       // subject names extracted from header row
  students: ParsedStudentRow[];
  rawText: string;         // full extracted text for debugging
  warnings: string[];      // any parsing issues
}

/**
 * Extract all text content from a PDF File object
 */
async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    
    // Group text items by Y position to reconstruct rows
    const items = content.items as any[];
    const rows: Map<number, { x: number; text: string }[]> = new Map();
    
    for (const item of items) {
      const y = Math.round(item.transform[5]); // Y coordinate (rounded to group nearby items)
      if (!rows.has(y)) rows.set(y, []);
      rows.get(y)!.push({ x: item.transform[4], text: item.str });
    }
    
    // Sort rows by Y (descending = top to bottom in PDF coords) and items by X
    const sortedRows = [...rows.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([_, items]) => 
        items.sort((a, b) => a.x - b.x).map(i => i.text.trim()).filter(Boolean).join("\t")
      );
    
    fullText += sortedRows.join("\n") + "\n";
  }
  
  return fullText;
}

/**
 * Detect if a value looks like a numeric score
 */
function isScore(val: string): boolean {
  const cleaned = val.trim().replace(/[%]/g, "");
  const num = parseFloat(cleaned);
  return !isNaN(num) && num >= 0 && num <= 100;
}

/**
 * Detect if a string looks like a student name (not a number, not a subject)
 */
function isStudentName(val: string): boolean {
  if (!val || val.trim().length < 2) return false;
  if (/^\d+$/.test(val.trim())) return false; // pure number
  if (isScore(val)) return false;
  return /[a-zA-Z]{2,}/.test(val); // has at least 2 letters
}

/**
 * Common subject keywords to help identify header rows
 */
const SUBJECT_KEYWORDS = [
  "math", "eng", "kis", "sci", "sst", "social", "cre", "ire",
  "bio", "chem", "phy", "hist", "geo", "bus", "comp", "agri",
  "french", "german", "arabic", "music", "art", "pe", "home",
  "total", "average", "avg", "mean", "grade", "position", "rank"
];

function looksLikeSubjectHeader(val: string): boolean {
  const lower = val.toLowerCase().trim();
  return SUBJECT_KEYWORDS.some(kw => lower.includes(kw)) || lower.length > 2;
}

/**
 * Parse extracted text into structured marks data
 */
function parseMarksTable(rawText: string): ParsedMarksResult {
  const warnings: string[] = [];
  const lines = rawText.split("\n").map(l => l.trim()).filter(Boolean);
  
  if (lines.length < 2) {
    return { headers: [], students: [], rawText, warnings: ["PDF appears empty or has fewer than 2 rows."] };
  }

  // Strategy: Find the header row (contains subject-like words), then parse data rows below it
  let headerIndex = -1;
  let headers: string[] = [];

  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const parts = lines[i].split(/\t+|  {2,}|\|/).map(p => p.trim()).filter(Boolean);
    
    // A header row should have multiple columns, and most should look like subjects
    const subjectLikeCount = parts.filter(p => looksLikeSubjectHeader(p) && !isScore(p)).length;
    
    if (parts.length >= 3 && subjectLikeCount >= 2) {
      headerIndex = i;
      headers = parts;
      break;
    }
  }

  if (headerIndex === -1) {
    // Fallback: use the first row as header
    const parts = lines[0].split(/\t+|  {2,}|\|/).map(p => p.trim()).filter(Boolean);
    if (parts.length >= 3) {
      headerIndex = 0;
      headers = parts;
      warnings.push("Could not auto-detect header row. Using the first row.");
    } else {
      return { headers: [], students: [], rawText, warnings: ["Could not detect a valid table header in the PDF."] };
    }
  }

  // Identify which column index is the student name (first non-numeric, non-subject column)
  // Typically column 0 or 1 (if column 0 is a number/rank)
  let nameColIndex = 0;
  if (headers[0] && /^(no|#|s\/n|sn|rank|pos)/i.test(headers[0])) {
    nameColIndex = 1;
  }
  if (headers[nameColIndex] && /^(name|student|pupil|learner)/i.test(headers[nameColIndex])) {
    // confirmed
  }

  // Subject headers are everything after the name column (excluding non-subject cols like total, grade, etc.)
  const subjectHeaders = headers.slice(nameColIndex + 1).filter(h => {
    const lower = h.toLowerCase();
    return !["total", "average", "avg", "mean", "grade", "position", "rank", "no", "#", "s/n", "name", "student"].includes(lower);
  });

  // Parse student rows
  const students: ParsedStudentRow[] = [];
  
  for (let i = headerIndex + 1; i < lines.length; i++) {
    const parts = lines[i].split(/\t+|  {2,}|\|/).map(p => p.trim()).filter(Boolean);
    
    if (parts.length < 2) continue;
    
    // Extract name
    const nameVal = parts[nameColIndex];
    if (!nameVal || !isStudentName(nameVal)) continue;
    
    // Extract marks
    const subjects: Record<string, number> = {};
    const markParts = parts.slice(nameColIndex + 1);
    
    for (let j = 0; j < subjectHeaders.length && j < markParts.length; j++) {
      const cleaned = markParts[j].replace(/[%]/g, "").trim();
      const score = parseFloat(cleaned);
      if (!isNaN(score) && score >= 0 && score <= 100) {
        subjects[subjectHeaders[j]] = Math.round(score);
      }
    }
    
    if (Object.keys(subjects).length > 0) {
      students.push({ studentName: nameVal, subjects });
    } else {
      warnings.push(`Row "${nameVal}" — no valid marks found.`);
    }
  }

  if (students.length === 0) {
    warnings.push("No student data rows were detected. Check PDF format.");
  }

  return { headers: subjectHeaders, students, rawText, warnings };
}

/**
 * Main entry point: parse a PDF File into structured marks data
 */
export async function parsePdfMarks(file: File): Promise<ParsedMarksResult> {
  try {
    const rawText = await extractTextFromPdf(file);
    return parseMarksTable(rawText);
  } catch (err: any) {
    return {
      headers: [],
      students: [],
      rawText: "",
      warnings: [`Failed to parse PDF: ${err.message || err}`],
    };
  }
}
