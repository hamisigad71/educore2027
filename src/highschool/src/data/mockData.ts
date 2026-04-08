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

export type InventoryItem = {
  id: string;
  name: string;
  category: "Science Lab" | "ICT" | "Kitchen" | "Maintenance";
  stock: number;
  unit: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
};

export type LibraryRecord = {
  id: string;
  bookTitle: string;
  studentName: string;
  borrowDate: string;
  dueDate: string;
  status: "Borrowed" | "Returned" | "Overdue";
};

export type MedicalLog = {
  id: string;
  studentName: string;
  complaint: string;
  treatment: string;
  date: string;
  status: "Observation" | "Discharged" | "Referred";
};

export type VisitorLog = {
  id: string;
  name: string;
  purpose: string;
  timeIn: string;
  timeOut?: string;
  idNumber: string;
};

export type BusRoute = {
  id: string;
  routeName: string;
  driver: string;
  students: number;
  status: "En Route" | "Scheduled" | "Completed";
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
  const m = klass.match(/Form\s+(\d+)/);
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
  "Zainab Abdalla", "Felix Kemboi", "Stacy Moraa", "Collins Juma"
];

const highSchoolSubjects = [
  "Mathematics", "English", "Kiswahili", "Physics", "Chemistry", "Biology",
  "History", "Geography", "C.R.E", "Business Studies", "Agriculture", "Computer Studies"
];

export const teachersSeed: Teacher[] = [
  {
    id: "t1", name: "Mr. David Kimani", subject: "Physics",
    email: "david.kimani@shulesec.go.ke", phone: "+254712345678",
    classes: ["Form 4 Red", "Form 3 Blue"],
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200",
  },
  {
    id: "t2", name: "Mrs. Sarah Njui", subject: "Chemistry",
    email: "sarah.njui@shulesec.go.ke", phone: "+254722334455",
    classes: ["Form 4 Green", "Form 2 White"],
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200",
  },
  {
    id: "t3", name: "Mr. Omar Hassan", subject: "Biology",
    email: "omar.hassan@shulesec.go.ke", phone: "+254733221100",
    classes: ["Form 1 Red", "Form 4 Blue"],
    photo: "https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?q=80&w=200",
  },
];

const streams = ["White", "Blue", "Green", "Red"];
const forms = ["1", "2", "3", "4"];

export const classesSeed: ClassInfo[] = [];
forms.forEach(f => {
  streams.forEach(s => {
    classesSeed.push({
      id: `c-${f}-${s}`,
      name: `Form ${f} ${s}`,
      teacherId: teachersSeed[rand(0, teachersSeed.length - 1)].id,
      students: rand(40, 55),
    });
  });
});

function makeStudents(): Student[] {
  return Array.from({ length: 120 }).map((_, i) => {
    const name = kenyanNames[i % kenyanNames.length];
    const klass = classesSeed[i % classesSeed.length].name;
    return {
      id: `s${i + 1}`,
      admission: `SEC/${2025 - rand(0, 3)}/${String(i + 1).padStart(3, "0")}`,
      name,
      klass,
      parent: `${name.split(" ")[0]}'s Parent`,
      phone: `+2547${rand(10, 99)}${rand(100000, 999999)}`,
      balance: rand(0, 4) === 0 ? rand(15000, 45000) : 0,
      attendance: rand(80, 100),
      performance: rand(45, 95),
      photo: `https://images.unsplash.com/photo-${[1544005313, 1547425260, 1502685104226, 1494790108377, 1517841905240][i % 5]}?q=80&w=200`,
    };
  });
}
export const studentsSeed: Student[] = makeStudents();

function makeMarks(): Mark[] {
  const out: Mark[] = [];
  studentsSeed.slice(0, 40).forEach((s) => {
    highSchoolSubjects.slice(0, 8).forEach((subj) => {
      const score = rand(30, 98);
      const grade =
        score >= 80 ? "A" : score >= 75 ? "A-" : score >= 70 ? "B+" :
        score >= 65 ? "B" : score >= 60 ? "B-" : score >= 55 ? "C+" :
        score >= 50 ? "C" : score >= 45 ? "C-" : score >= 40 ? "D+" : "D";
      out.push({ id: `${s.id}-${subj}`, studentId: s.id, subject: subj, term: "Term 2", score, grade });
    });
  });
  return out;
}
export const marksSeed: Mark[] = makeMarks();

function makeFees(): FeeRecord[] {
  const rec: FeeRecord[] = [];
  studentsSeed.slice(0, 60).forEach((s, i) => {
    const payments = rand(1, 2);
    for (let p = 0; p < payments; p++) {
      rec.push({
        id: `f-${i}-${p}`,
        studentId: s.id,
        date: `2025-${String(rand(1, 9)).padStart(2, "0")}-${String(rand(1, 28)).padStart(2, "0")}`,
        amount: [15000, 25000, 35000][rand(0, 2)],
        method: (["M-Pesa", "Bank"] as const)[rand(0, 1)],
        receipt: `SEC-RCP-${2025000 + i * 10 + p}`,
      });
    }
  });
  return rec.sort((a, b) => b.date.localeCompare(a.date));
}
export const feesSeed: FeeRecord[] = makeFees();

// --- New Staff Seeds ---

export const inventorySeed: InventoryItem[] = [
  { id: "inv1", name: "Laptop - Dell Latitude", category: "ICT", stock: 12, unit: "units", status: "In Stock" },
  { id: "inv2", name: "Bunsen Burner", category: "Science Lab", stock: 24, unit: "pcs", status: "In Stock" },
  { id: "inv3", name: "Hydrochloric Acid", category: "Science Lab", stock: 2, unit: "liters", status: "Low Stock" },
  { id: "inv4", name: "Whiteboards", category: "Maintenance", stock: 5, unit: "units", status: "In Stock" },
  { id: "inv5", name: "Cooking Oil", category: "Kitchen", stock: 20, unit: "liters", status: "In Stock" },
];

export const librarySeed: LibraryRecord[] = [
  { id: "lib1", bookTitle: "Advanced Biology", studentName: kenyanNames[0], borrowDate: "2025-05-10", dueDate: "2025-05-17", status: "Borrowed" },
  { id: "lib2", bookTitle: "Geographical Atlas", studentName: kenyanNames[5], borrowDate: "2025-05-01", dueDate: "2025-05-08", status: "Overdue" },
];

export const medicalLogsSeed: MedicalLog[] = [
  { id: "med1", studentName: kenyanNames[2], complaint: "Flu-like symptoms", treatment: "Paracetamol & Rest", date: "2025-05-20", status: "Discharged" },
  { id: "med2", studentName: kenyanNames[10], complaint: "Sprained Ankle", treatment: "Elastic bandage applied", date: "2025-05-21", status: "Observation" },
];

export const visitorLogsSeed: VisitorLog[] = [
  { id: "v1", name: "James Maina", purpose: "Deliver stationery", timeIn: "08:30 AM", timeOut: "09:12 AM", idNumber: "23456789" },
  { id: "v2", name: "Sarah Otieno", purpose: "Parent Meeting", timeIn: "10:15 AM", idNumber: "87654321" },
];

export const transportSeed: BusRoute[] = [
  { id: "bus1", routeName: "Nairobi West - South C", driver: "John Kamau", students: 32, status: "En Route" },
  { id: "bus2", routeName: "Lang'ata - Rongai", driver: "Peter Owino", students: 45, status: "Scheduled" },
];
