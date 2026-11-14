/**
 * Academic Broadsheet & Marks Importer / Exporter Utility
 * Supports both Kenyan High School (KCSE 0-100% & 12-point scale) and Primary School (CBC Rubrics: EE, ME, AE, BE)
 */

export interface BroadsheetStudentRow {
  admissionNumber: string;
  studentName: string;
  className: string;
  subjects: Record<string, number | string>; // subjectName -> numerical mark (0-100) or CBC rubric ("EE"|"ME"|"AE"|"BE")
  totalMarks?: number;
  meanScore?: number;
  kcseGrade?: string;
  kcsePoints?: number;
}

export interface ParsedAcademicSheet {
  headers: string[]; // subjects identified
  students: BroadsheetStudentRow[];
  warnings: string[];
}

export const HIGH_SCHOOL_SUBJECTS = [
  "Mathematics",
  "English",
  "Kiswahili",
  "Biology",
  "Chemistry",
  "Physics",
  "History",
  "Geography",
  "CRE",
  "Business Studies",
  "Agriculture"
];

export const PRIMARY_CBC_AREAS = [
  "Mathematics Activities",
  "English Language Activities",
  "Kiswahili Language Activities",
  "Science & Technology",
  "Social Studies & Citizenship",
  "Agriculture & Nutrition",
  "Creative Arts & Sports"
];

// KCSE standard Kenyan grading scale (12 points)
export function calculateKcseGrade(score: number): { grade: string; points: number } {
  if (score >= 80) return { grade: "A", points: 12 };
  if (score >= 75) return { grade: "A-", points: 11 };
  if (score >= 70) return { grade: "B+", points: 10 };
  if (score >= 65) return { grade: "B", points: 9 };
  if (score >= 60) return { grade: "B-", points: 8 };
  if (score >= 55) return { grade: "C+", points: 7 };
  if (score >= 50) return { grade: "C", points: 6 };
  if (score >= 45) return { grade: "C-", points: 5 };
  if (score >= 40) return { grade: "D+", points: 4 };
  if (score >= 35) return { grade: "D", points: 3 };
  if (score >= 30) return { grade: "D-", points: 2 };
  return { grade: "E", points: 1 };
}

/**
 * Generate and download pre-filled CSV template for a specific teacher's class roster
 */
export function downloadClassBroadsheetTemplate(
  className: string,
  examName: string,
  students: Array<{ admission_number: string; name: string }>,
  isHighSchool = true
) {
  const subjects = isHighSchool ? HIGH_SCHOOL_SUBJECTS.slice(0, 7) : PRIMARY_CBC_AREAS;
  
  const headers = ["Admission_No", "Student_Name", "Class", ...subjects];
  
  const rows = students.length > 0
    ? students.map(s => {
        const emptyCols = subjects.map(() => isHighSchool ? "" : "ME"); // default ME for CBC, blank for HS
        return [
          `"${s.admission_number}"`,
          `"${s.name.replace(/"/g, '""')}"`,
          `"${className}"`,
          ...emptyCols
        ].join(",");
      })
    : [
        // Demo placeholder if class has no students loaded yet
        isHighSchool 
          ? `"ADM-2024-001","Amani Otieno","${className}",78,82,75,80,72,68,85`
          : `"ADM-2024-001","Amani Otieno","${className}",EE,ME,EE,ME,AE,ME,EE`
      ];

  const csvContent = [
    `# EDUCORE OFFICIAL BROADSHEET - ${examName.toUpperCase()} - ${className.toUpperCase()}`,
    headers.join(","),
    ...rows
  ].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  const safeName = `${className.replace(/\s+/g, "_")}_${examName.replace(/\s+/g, "_")}_Broadsheet.csv`;
  link.setAttribute("download", safeName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parse uploaded CSV file from teacher into structured student marks
 */
export async function parseAcademicCsv(
  fileText: string,
  isHighSchool = true
): Promise<ParsedAcademicSheet> {
  const lines = fileText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith("#"));

  if (lines.length < 2) {
    throw new Error("CSV file does not contain enough data (header row + at least 1 student row).");
  }

  // Parse header
  const rawHeaders = splitCsvLine(lines[0]);
  const normHeaders = rawHeaders.map(h => h.trim().toLowerCase());

  // Find column indices
  const admIdx = normHeaders.findIndex(h => h.includes("adm") || h.includes("admission") || h.includes("reg"));
  const nameIdx = normHeaders.findIndex(h => h.includes("name") || h.includes("student"));
  const classIdx = normHeaders.findIndex(h => h.includes("class") || h.includes("grade") || h.includes("stream"));

  if (nameIdx === -1) {
    throw new Error("Could not find a 'Student_Name' or 'Name' column in the uploaded sheet.");
  }

  // Subject columns are non-metadata columns
  const metaIndices = new Set([admIdx, nameIdx, classIdx].filter(i => i !== -1));
  const subjectColumns: { index: number; name: string }[] = [];

  rawHeaders.forEach((h, idx) => {
    if (!metaIndices.has(idx) && h.trim().length > 0) {
      subjectColumns.push({ index: idx, name: h.trim() });
    }
  });

  const students: BroadsheetStudentRow[] = [];
  const warnings: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    if (cols.length === 0 || cols.every(c => c.trim() === "")) continue;

    const studentName = cols[nameIdx]?.trim() || `Student ${i}`;
    const admissionNumber = admIdx !== -1 ? cols[admIdx]?.trim() || `ADM-${i}` : `ADM-${i}`;
    const className = classIdx !== -1 ? cols[classIdx]?.trim() || "" : "";

    const subjects: Record<string, number | string> = {};
    let totalMarks = 0;
    let subjectCount = 0;

    subjectColumns.forEach(({ index, name }) => {
      const rawVal = cols[index]?.trim() || "";
      if (isHighSchool) {
        // High school numeric parsing (0-100)
        const numVal = parseFloat(rawVal);
        if (!isNaN(numVal)) {
          const bounded = Math.max(0, Math.min(100, Math.round(numVal)));
          subjects[name] = bounded;
          totalMarks += bounded;
          subjectCount++;
        }
      } else {
        // CBC Rubric (EE, ME, AE, BE)
        const upper = rawVal.toUpperCase();
        if (["EE", "ME", "AE", "BE"].includes(upper)) {
          subjects[name] = upper;
        } else if (rawVal) {
          // Try mapping numbers to CBC if teacher used percentages
          const num = parseFloat(rawVal);
          if (!isNaN(num)) {
            const mapped = num >= 80 ? "EE" : num >= 50 ? "ME" : num >= 30 ? "AE" : "BE";
            subjects[name] = mapped;
          }
        }
      }
    });

    const meanScore = subjectCount > 0 ? Math.round(totalMarks / subjectCount) : undefined;
    const kcse = meanScore !== undefined ? calculateKcseGrade(meanScore) : undefined;

    students.push({
      admissionNumber,
      studentName,
      className,
      subjects,
      totalMarks: subjectCount > 0 ? totalMarks : undefined,
      meanScore,
      kcseGrade: kcse?.grade,
      kcsePoints: kcse?.points
    });
  }

  return {
    headers: subjectColumns.map(s => s.name),
    students,
    warnings
  };
}

/**
 * Split CSV line respecting quoted fields
 */
function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      if (inQuotes && line[i + 1] === char) {
        current += char;
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
