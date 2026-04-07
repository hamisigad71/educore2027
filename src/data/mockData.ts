// ========================
// Types
// ========================

export type Student = {
  id: string;
  admission: string;
  name: string;
  klass: string;
  parent: string;
  phone: string;
  balance: number;
  attendance: number;
  performance: number;
  photo?: string;
};

export type Teacher = {
  id: string;
  name: string;
  subject: string;
  email: string;
  phone: string;
  classes: string[];
  photo?: string;
};

export type FeeRecord = {
  id: string;
  studentId: string;
  date: string;
  amount: number;
  method: "M-Pesa" | "Cash" | "Bank";
  receipt: string;
};

export type Mark = {
  id: string;
  studentId: string;
  subject: string;
  term: "Term 1" | "Term 2" | "Term 3";
  score: number;
  grade: string;
  comment?: string;
};

export type ClassInfo = {
  id: string;
  name: string;
  teacherId?: string;
  students: number;
};

// ========================
// Helpers
// ========================

const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const currency = (n: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(n);

export function classGrade(klass: string) {
  const m = klass.match(/Grade\s+(\d+)/);
  return m ? Number(m[1]) : 0;
}

// ========================
// Seed Data
// ========================

const kenyanNames = [
  "Amani Otieno", "Wanjiku Njoroge", "Kiptoo Cheruiyot", "Fatma Hassan",
  "Brian Ochieng", "Faith Mutiso", "Samuel Mwangi", "Aisha Mohammed",
  "Derrick Kamau", "Cynthia Wairimu", "Ian Kiprotich", "Mercy Akoth",
  "Victor Owino", "Grace Muthoni", "Emmanuel Kariuki", "Lilian Akinyi",
];

export const teachersSeed: Teacher[] = [
  {
    id: "t1", name: "Mrs. Jane Wambui", subject: "Mathematics",
    email: "jane.wambui@shule.go.ke", phone: "+254712345678",
    classes: ["Grade 5A", "Grade 6B"],
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
  },
  {
    id: "t2", name: "Mr. Peter Otieno", subject: "English",
    email: "peter.otieno@shule.go.ke", phone: "+254722334455",
    classes: ["Grade 7A", "Grade 8A"],
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
  },
  {
    id: "t3", name: "Ms. Salome Njeri", subject: "Science",
    email: "salome.njeri@shule.go.ke", phone: "+254733221100",
    classes: ["Grade 4B", "Grade 5B"],
    photo: "https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?q=80&w=200",
  },
  {
    id: "t4", name: "Mr. Joseph Mwenda", subject: "Kiswahili",
    email: "joseph.mwenda@shule.go.ke", phone: "+254701998877",
    classes: ["Grade 6A", "Grade 9A"],
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
  },
];

export const classesSeed: ClassInfo[] = [
  "Grade 4B", "Grade 5A", "Grade 5B", "Grade 6A",
  "Grade 6B", "Grade 7A", "Grade 8A", "Grade 9A",
].map((name, i) => ({
  id: `c${i + 1}`,
  name,
  teacherId: teachersSeed[i % teachersSeed.length].id,
  students: rand(32, 42),
}));

function makeStudents(): Student[] {
  return Array.from({ length: 48 }).map((_, i) => {
    const name = kenyanNames[i % kenyanNames.length];
    const klass = classesSeed[i % classesSeed.length].name;
    return {
      id: `s${i + 1}`,
      admission: `ADM/${2025 - rand(0, 3)}/${String(i + 1).padStart(3, "0")}`,
      name,
      klass,
      parent: `${name.split(" ")[0]}'s Parent`,
      phone: `+2547${rand(10, 99)}${rand(100000, 999999)}`,
      balance: rand(0, 4) === 0 ? rand(5000, 18500) : 0,
      attendance: rand(84, 99),
      performance: rand(58, 94),
      photo: `https://images.unsplash.com/photo-${[1544005313, 1547425260, 1502685104226, 1494790108377, 1517841905240][i % 5]}?q=80&w=200`,
    };
  });
}
export const studentsSeed: Student[] = makeStudents();

function makeMarks(): Mark[] {
  const subjects = ["Mathematics", "English", "Kiswahili", "Science", "SST"];
  const out: Mark[] = [];
  studentsSeed.forEach((s) => {
    subjects.forEach((subj) => {
      const score = rand(45, 98);
      const grade =
        score >= 80 ? "A" : score >= 75 ? "A-" : score >= 70 ? "B+" :
        score >= 65 ? "B" : score >= 60 ? "B-" : score >= 55 ? "C+" :
        score >= 50 ? "C" : "D";
      out.push({ id: `${s.id}-${subj}`, studentId: s.id, subject: subj, term: "Term 2", score, grade });
    });
  });
  return out;
}
export const marksSeed: Mark[] = makeMarks();

function makeFees(): FeeRecord[] {
  const rec: FeeRecord[] = [];
  studentsSeed.slice(0, 36).forEach((s, i) => {
    const payments = rand(1, 3);
    for (let p = 0; p < payments; p++) {
      rec.push({
        id: `f-${i}-${p}`,
        studentId: s.id,
        date: `2025-${String(rand(1, 9)).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
        amount: [5000, 7500, 10000, 12500, 15000][rand(0, 4)],
        method: (["M-Pesa", "Cash", "Bank"] as const)[rand(0, 2)],
        receipt: `RCP-${2025000 + i * 10 + p}`,
      });
    }
  });
  return rec.sort((a, b) => b.date.localeCompare(a.date));
}
export const feesSeed: FeeRecord[] = makeFees();
