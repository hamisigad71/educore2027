/**
 * Complete 15 Kenyan Student Test Dataset with full academic report cards and fee balances.
 * Pre-seeded to allow instant registration testing via mobile or desktop.
 */

export interface TestStudentProfile {
  id: string;
  admission_number: string;
  name: string;
  firstName: string;
  lastName: string;
  className: string;
  portal: "highschool" | "primaryschool";
  gender: "Male" | "Female";
  guardian_name: string;
  guardian_phone: string;
  totalBilled: number;
  totalPaid: number;
  balance: number;
  feeStatus: "cleared" | "partial" | "unpaid";
  meanScore: number;
  overallGrade: string;
  overallPoints?: number;
  academicResults: Array<{
    subjectName: string;
    marks: number;
    grade: string;
    points: number;
    remarks: string;
  }>;
}

export const TEST_STUDENTS_ROSTER: TestStudentProfile[] = [
  // 1. High School - Form 3 West
  {
    id: "stu-2027-001",
    admission_number: "ADM-2027-001",
    name: "Amani Otieno",
    firstName: "Amani",
    lastName: "Otieno",
    className: "Form 3 West",
    portal: "highschool",
    gender: "Male",
    guardian_name: "Kennedy Otieno",
    guardian_phone: "+254 712 345 678",
    totalBilled: 35000,
    totalPaid: 10000,
    balance: 25000,
    feeStatus: "partial",
    meanScore: 77,
    overallGrade: "A-",
    overallPoints: 11,
    academicResults: [
      { subjectName: "Mathematics", marks: 84, grade: "A", points: 12, remarks: "Excellent problem solving" },
      { subjectName: "English", marks: 78, grade: "A-", points: 11, remarks: "Very articulate composition" },
      { subjectName: "Kiswahili", marks: 76, grade: "A-", points: 11, remarks: "Kazi nzuri sana" },
      { subjectName: "Chemistry", marks: 72, grade: "B+", points: 10, remarks: "Solid laboratory skills" },
      { subjectName: "Biology", marks: 80, grade: "A", points: 12, remarks: "Comprehensive understanding" },
      { subjectName: "Physics", marks: 68, grade: "B", points: 9, remarks: "Good conceptual grasp" },
      { subjectName: "Geography", marks: 82, grade: "A", points: 12, remarks: "Mastery of physical geography" },
    ]
  },
  {
    id: "stu-2027-002",
    admission_number: "ADM-2027-002",
    name: "Wanjiku Kamau",
    firstName: "Wanjiku",
    lastName: "Kamau",
    className: "Form 3 West",
    portal: "highschool",
    gender: "Female",
    guardian_name: "Peter Kamau",
    guardian_phone: "+254 722 111 222",
    totalBilled: 35000,
    totalPaid: 35000,
    balance: 0,
    feeStatus: "cleared",
    meanScore: 84,
    overallGrade: "A",
    overallPoints: 12,
    academicResults: [
      { subjectName: "Mathematics", marks: 92, grade: "A", points: 12, remarks: "Top in class" },
      { subjectName: "English", marks: 85, grade: "A", points: 12, remarks: "Outstanding literature analysis" },
      { subjectName: "Kiswahili", marks: 80, grade: "A", points: 12, remarks: "Insha bora kabisa" },
      { subjectName: "Chemistry", marks: 82, grade: "A", points: 12, remarks: "Thorough experiment notes" },
      { subjectName: "Biology", marks: 88, grade: "A", points: 12, remarks: "Exceptional mastery" },
      { subjectName: "Physics", marks: 78, grade: "A-", points: 11, remarks: "Strong analytical skill" },
      { subjectName: "Geography", marks: 85, grade: "A", points: 12, remarks: "Exemplary fieldwork project" },
    ]
  },
  {
    id: "stu-2027-003",
    admission_number: "ADM-2027-003",
    name: "Brian Kiprono",
    firstName: "Brian",
    lastName: "Kiprono",
    className: "Form 3 West",
    portal: "highschool",
    gender: "Male",
    guardian_name: "Ezekiel Kiprono",
    guardian_phone: "+254 733 444 555",
    totalBilled: 35000,
    totalPaid: 22500,
    balance: 12500,
    feeStatus: "partial",
    meanScore: 71,
    overallGrade: "B+",
    overallPoints: 10,
    academicResults: [
      { subjectName: "Mathematics", marks: 74, grade: "B+", points: 10, remarks: "Consistent accuracy" },
      { subjectName: "English", marks: 70, grade: "B+", points: 10, remarks: "Good grammar and structure" },
      { subjectName: "Kiswahili", marks: 68, grade: "B", points: 9, remarks: "Uwezo mzuri" },
      { subjectName: "Chemistry", marks: 72, grade: "B+", points: 10, remarks: "Passionate about lab experiments" },
      { subjectName: "Biology", marks: 75, grade: "A-", points: 11, remarks: "Very good diagrams" },
      { subjectName: "Physics", marks: 66, grade: "B", points: 9, remarks: "Shows steady progress" },
      { subjectName: "Geography", marks: 72, grade: "B+", points: 10, remarks: "Good map interpretation" },
    ]
  },
  {
    id: "stu-2027-004",
    admission_number: "ADM-2027-004",
    name: "Fatma Hassan",
    firstName: "Fatma",
    lastName: "Hassan",
    className: "Form 3 West",
    portal: "highschool",
    gender: "Female",
    guardian_name: "Hassan Omar",
    guardian_phone: "+254 701 999 888",
    totalBilled: 35000,
    totalPaid: 0,
    balance: 35000,
    feeStatus: "unpaid",
    meanScore: 66,
    overallGrade: "B",
    overallPoints: 9,
    academicResults: [
      { subjectName: "Mathematics", marks: 62, grade: "B-", points: 8, remarks: "Keep practicing algebra" },
      { subjectName: "English", marks: 75, grade: "A-", points: 11, remarks: "Eloquent speaker and writer" },
      { subjectName: "Kiswahili", marks: 78, grade: "A-", points: 11, remarks: "Fasaha ya hali ya juu" },
      { subjectName: "Chemistry", marks: 60, grade: "B-", points: 8, remarks: "Review balancing equations" },
      { subjectName: "Biology", marks: 65, grade: "B", points: 9, remarks: "Steady comprehension" },
      { subjectName: "Physics", marks: 58, grade: "C+", points: 7, remarks: "Needs more problem drill" },
      { subjectName: "Geography", marks: 68, grade: "B", points: 9, remarks: "Sound geographical knowledge" },
    ]
  },
  {
    id: "stu-2027-005",
    admission_number: "ADM-2027-005",
    name: "Kevin Mutiso",
    firstName: "Kevin",
    lastName: "Mutiso",
    className: "Form 3 West",
    portal: "highschool",
    gender: "Male",
    guardian_name: "James Mutiso",
    guardian_phone: "+254 720 777 666",
    totalBilled: 35000,
    totalPaid: 27000,
    balance: 8000,
    feeStatus: "partial",
    meanScore: 61,
    overallGrade: "B-",
    overallPoints: 8,
    academicResults: [
      { subjectName: "Mathematics", marks: 65, grade: "B", points: 9, remarks: "Shows good potential" },
      { subjectName: "English", marks: 62, grade: "B-", points: 8, remarks: "Improve creative writing" },
      { subjectName: "Kiswahili", marks: 60, grade: "B-", points: 8, remarks: "Kaza mwendo" },
      { subjectName: "Chemistry", marks: 56, grade: "C+", points: 7, remarks: "More effort in stoichiometry" },
      { subjectName: "Biology", marks: 64, grade: "B-", points: 8, remarks: "Good recall of taxonomy" },
      { subjectName: "Physics", marks: 55, grade: "C+", points: 7, remarks: "Focus on mechanics formulae" },
      { subjectName: "Geography", marks: 66, grade: "B", points: 9, remarks: "Fair understanding of weather" },
    ]
  },

  // 2. High School - Form 2 East
  {
    id: "stu-2027-006",
    admission_number: "ADM-2027-006",
    name: "Faith Chebet",
    firstName: "Faith",
    lastName: "Chebet",
    className: "Form 2 East",
    portal: "highschool",
    gender: "Female",
    guardian_name: "Sarah Chebet",
    guardian_phone: "+254 722 888 111",
    totalBilled: 32000,
    totalPaid: 32000,
    balance: 0,
    feeStatus: "cleared",
    meanScore: 82,
    overallGrade: "A",
    overallPoints: 12,
    academicResults: [
      { subjectName: "Mathematics", marks: 88, grade: "A", points: 12, remarks: "Speed and precision" },
      { subjectName: "English", marks: 82, grade: "A", points: 12, remarks: "Very strong essay skills" },
      { subjectName: "Kiswahili", marks: 80, grade: "A", points: 12, remarks: "Lugha safi na wazi" },
      { subjectName: "Chemistry", marks: 78, grade: "A-", points: 11, remarks: "Excellent theory grasp" },
      { subjectName: "Biology", marks: 84, grade: "A", points: 12, remarks: "Brilliant cell biology drawings" },
      { subjectName: "Physics", marks: 76, grade: "A-", points: 11, remarks: "Quick with vector calculations" },
      { subjectName: "Geography", marks: 86, grade: "A", points: 12, remarks: "High geographical acumen" },
    ]
  },
  {
    id: "stu-2027-007",
    admission_number: "ADM-2027-007",
    name: "Dennis Omondi",
    firstName: "Dennis",
    lastName: "Omondi",
    className: "Form 2 East",
    portal: "highschool",
    gender: "Male",
    guardian_name: "George Omondi",
    guardian_phone: "+254 711 222 333",
    totalBilled: 32000,
    totalPaid: 14000,
    balance: 18000,
    feeStatus: "partial",
    meanScore: 56,
    overallGrade: "C+",
    overallPoints: 7,
    academicResults: [
      { subjectName: "Mathematics", marks: 52, grade: "C", points: 6, remarks: "Keep reviewing quadratic steps" },
      { subjectName: "English", marks: 60, grade: "B-", points: 8, remarks: "Good reading comprehension" },
      { subjectName: "Kiswahili", marks: 58, grade: "C+", points: 7, remarks: "Jitahidi katika sarufi" },
      { subjectName: "Chemistry", marks: 54, grade: "C", points: 6, remarks: "Needs more revision on acids" },
      { subjectName: "Biology", marks: 62, grade: "B-", points: 8, remarks: "Passable anatomy grasp" },
      { subjectName: "Physics", marks: 50, grade: "C", points: 6, remarks: "Improve measurement precision" },
      { subjectName: "Geography", marks: 59, grade: "C+", points: 7, remarks: "Good grasp of topography" },
    ]
  },
  {
    id: "stu-2027-008",
    admission_number: "ADM-2027-008",
    name: "Mercy Wambui",
    firstName: "Mercy",
    lastName: "Wambui",
    className: "Form 2 East",
    portal: "highschool",
    gender: "Female",
    guardian_name: "Grace Wambui",
    guardian_phone: "+254 724 555 666",
    totalBilled: 32000,
    totalPaid: 27000,
    balance: 5000,
    feeStatus: "partial",
    meanScore: 73,
    overallGrade: "B+",
    overallPoints: 10,
    academicResults: [
      { subjectName: "Mathematics", marks: 76, grade: "A-", points: 11, remarks: "Very strong numerical logic" },
      { subjectName: "English", marks: 74, grade: "B+", points: 10, remarks: "Expressive oral presentation" },
      { subjectName: "Kiswahili", marks: 72, grade: "B+", points: 10, remarks: "Ufahamu bora" },
      { subjectName: "Chemistry", marks: 70, grade: "B+", points: 10, remarks: "Active laboratory contributor" },
      { subjectName: "Biology", marks: 75, grade: "A-", points: 11, remarks: "Well illustrated diagrams" },
      { subjectName: "Physics", marks: 68, grade: "B", points: 9, remarks: "Steady mathematical execution" },
      { subjectName: "Geography", marks: 78, grade: "A-", points: 11, remarks: "Impressive climatic analysis" },
    ]
  },
  {
    id: "stu-2027-009",
    admission_number: "ADM-2027-009",
    name: "Samuel Mwangi",
    firstName: "Samuel",
    lastName: "Mwangi",
    className: "Form 2 East",
    portal: "highschool",
    gender: "Male",
    guardian_name: "Francis Mwangi",
    guardian_phone: "+254 729 333 444",
    totalBilled: 32000,
    totalPaid: 0,
    balance: 32000,
    feeStatus: "unpaid",
    meanScore: 52,
    overallGrade: "C",
    overallPoints: 6,
    academicResults: [
      { subjectName: "Mathematics", marks: 48, grade: "C-", points: 5, remarks: "More regular study required" },
      { subjectName: "English", marks: 56, grade: "C+", points: 7, remarks: "Fair vocabulary" },
      { subjectName: "Kiswahili", marks: 54, grade: "C", points: 6, remarks: "Boresha mwandiko" },
      { subjectName: "Chemistry", marks: 49, grade: "C-", points: 5, remarks: "Seek teacher consultation" },
      { subjectName: "Biology", marks: 55, grade: "C+", points: 7, remarks: "Fair biology definitions" },
      { subjectName: "Physics", marks: 46, grade: "C-", points: 5, remarks: "Review SI units and formulas" },
      { subjectName: "Geography", marks: 57, grade: "C+", points: 7, remarks: "Passable map analysis" },
    ]
  },
  {
    id: "stu-2027-010",
    admission_number: "ADM-2027-010",
    name: "Aisha Mohammed",
    firstName: "Aisha",
    lastName: "Mohammed",
    className: "Form 2 East",
    portal: "highschool",
    gender: "Female",
    guardian_name: "Fatuma Mohammed",
    guardian_phone: "+254 700 888 777",
    totalBilled: 32000,
    totalPaid: 32000,
    balance: 0,
    feeStatus: "cleared",
    meanScore: 76,
    overallGrade: "A-",
    overallPoints: 11,
    academicResults: [
      { subjectName: "Mathematics", marks: 78, grade: "A-", points: 11, remarks: "High algebraic competence" },
      { subjectName: "English", marks: 80, grade: "A", points: 12, remarks: "Excellent essay flow" },
      { subjectName: "Kiswahili", marks: 82, grade: "A", points: 12, remarks: "Ufasaha wa kupigiwa mfano" },
      { subjectName: "Chemistry", marks: 71, grade: "B+", points: 10, remarks: "Very dedicated in class" },
      { subjectName: "Biology", marks: 79, grade: "A-", points: 11, remarks: "Strong physiological recall" },
      { subjectName: "Physics", marks: 69, grade: "B", points: 9, remarks: "Good experimental technique" },
      { subjectName: "Geography", marks: 75, grade: "A-", points: 11, remarks: "Deep knowledge of human geography" },
    ]
  },

  // 3. Primary School (CBC) - Grade 5 Blue
  {
    id: "stu-2027-011",
    admission_number: "ADM-2027-011",
    name: "Victor Kipchumba",
    firstName: "Victor",
    lastName: "Kipchumba",
    className: "Grade 5 Blue",
    portal: "primaryschool",
    gender: "Male",
    guardian_name: "David Kipchumba",
    guardian_phone: "+254 721 444 333",
    totalBilled: 24000,
    totalPaid: 10000,
    balance: 14000,
    feeStatus: "partial",
    meanScore: 85,
    overallGrade: "EE",
    academicResults: [
      { subjectName: "Mathematics Activities", marks: 88, grade: "EE", points: 4, remarks: "Exceeding expectations in fractions" },
      { subjectName: "English Language Activities", marks: 84, grade: "EE", points: 4, remarks: "High vocabulary fluency" },
      { subjectName: "Kiswahili Language Activities", marks: 80, grade: "EE", points: 4, remarks: "Kazi nzuri sana katika kusoma" },
      { subjectName: "Science & Technology", marks: 86, grade: "EE", points: 4, remarks: "Creative science projects" },
      { subjectName: "Social Studies & Citizenship", marks: 82, grade: "EE", points: 4, remarks: "Deep civic engagement" },
      { subjectName: "Agriculture & Nutrition", marks: 85, grade: "EE", points: 4, remarks: "Passionate school farm leader" },
      { subjectName: "Creative Arts & Sports", marks: 89, grade: "EE", points: 4, remarks: "Talented athlete and artist" },
    ]
  },
  {
    id: "stu-2027-012",
    admission_number: "ADM-2027-012",
    name: "Joy Njeri",
    firstName: "Joy",
    lastName: "Njeri",
    className: "Grade 5 Blue",
    portal: "primaryschool",
    gender: "Female",
    guardian_name: "Nancy Njeri",
    guardian_phone: "+254 723 666 999",
    totalBilled: 24000,
    totalPaid: 24000,
    balance: 0,
    feeStatus: "cleared",
    meanScore: 89,
    overallGrade: "EE",
    academicResults: [
      { subjectName: "Mathematics Activities", marks: 92, grade: "EE", points: 4, remarks: "Exceptional mathematical thinking" },
      { subjectName: "English Language Activities", marks: 90, grade: "EE", points: 4, remarks: "Avid reader and storyteller" },
      { subjectName: "Kiswahili Language Activities", marks: 88, grade: "EE", points: 4, remarks: "Usomaji fasaha sana" },
      { subjectName: "Science & Technology", marks: 87, grade: "EE", points: 4, remarks: "Inquisitive experimenter" },
      { subjectName: "Social Studies & Citizenship", marks: 85, grade: "EE", points: 4, remarks: "Strong social awareness" },
      { subjectName: "Agriculture & Nutrition", marks: 86, grade: "EE", points: 4, remarks: "Diligent farm maintenance" },
      { subjectName: "Creative Arts & Sports", marks: 94, grade: "EE", points: 4, remarks: "Award-winning painter" },
    ]
  },
  {
    id: "stu-2027-013",
    admission_number: "ADM-2027-013",
    name: "Caleb Barasa",
    firstName: "Caleb",
    lastName: "Barasa",
    className: "Grade 5 Blue",
    portal: "primaryschool",
    gender: "Male",
    guardian_name: "Simon Barasa",
    guardian_phone: "+254 734 111 000",
    totalBilled: 24000,
    totalPaid: 2000,
    balance: 22000,
    feeStatus: "unpaid",
    meanScore: 68,
    overallGrade: "ME",
    academicResults: [
      { subjectName: "Mathematics Activities", marks: 66, grade: "ME", points: 3, remarks: "Meeting expectations in geometry" },
      { subjectName: "English Language Activities", marks: 70, grade: "ME", points: 3, remarks: "Good comprehension" },
      { subjectName: "Kiswahili Language Activities", marks: 65, grade: "ME", points: 3, remarks: "Kiwango cha kuridhisha" },
      { subjectName: "Science & Technology", marks: 72, grade: "ME", points: 3, remarks: "Active in group practicals" },
      { subjectName: "Social Studies & Citizenship", marks: 67, grade: "ME", points: 3, remarks: "Understands community roles" },
      { subjectName: "Agriculture & Nutrition", marks: 68, grade: "ME", points: 3, remarks: "Proper crop care skills" },
      { subjectName: "Creative Arts & Sports", marks: 71, grade: "ME", points: 3, remarks: "Enthusiastic sports player" },
    ]
  },
  {
    id: "stu-2027-014",
    admission_number: "ADM-2027-014",
    name: "Stacy Moraa",
    firstName: "Stacy",
    lastName: "Moraa",
    className: "Grade 5 Blue",
    portal: "primaryschool",
    gender: "Female",
    guardian_name: "Beatrice Moraa",
    guardian_phone: "+254 726 777 888",
    totalBilled: 24000,
    totalPaid: 17500,
    balance: 6500,
    feeStatus: "partial",
    meanScore: 72,
    overallGrade: "ME",
    academicResults: [
      { subjectName: "Mathematics Activities", marks: 74, grade: "ME", points: 3, remarks: "Good problem solving" },
      { subjectName: "English Language Activities", marks: 76, grade: "EE", points: 4, remarks: "Exceeding expectations in speech" },
      { subjectName: "Kiswahili Language Activities", marks: 72, grade: "ME", points: 3, remarks: "Kazi thabiti" },
      { subjectName: "Science & Technology", marks: 70, grade: "ME", points: 3, remarks: "Curious about natural living" },
      { subjectName: "Social Studies & Citizenship", marks: 69, grade: "ME", points: 3, remarks: "Respectful team player" },
      { subjectName: "Agriculture & Nutrition", marks: 71, grade: "ME", points: 3, remarks: "Careful kitchen garden work" },
      { subjectName: "Creative Arts & Sports", marks: 73, grade: "ME", points: 3, remarks: "Strong musical rhythm" },
    ]
  },
  {
    id: "stu-2027-015",
    admission_number: "ADM-2027-015",
    name: "Emmanuel Juma",
    firstName: "Emmanuel",
    lastName: "Juma",
    className: "Grade 5 Blue",
    portal: "primaryschool",
    gender: "Male",
    guardian_name: "Titus Juma",
    guardian_phone: "+254 713 000 111",
    totalBilled: 24000,
    totalPaid: 13000,
    balance: 11000,
    feeStatus: "partial",
    meanScore: 54,
    overallGrade: "AE",
    academicResults: [
      { subjectName: "Mathematics Activities", marks: 52, grade: "AE", points: 2, remarks: "Approaching expectations; practice division" },
      { subjectName: "English Language Activities", marks: 58, grade: "ME", points: 3, remarks: "Meeting vocabulary basics" },
      { subjectName: "Kiswahili Language Activities", marks: 55, grade: "AE", points: 2, remarks: "Mazoezi zaidi ya kusoma yanahitajika" },
      { subjectName: "Science & Technology", marks: 51, grade: "AE", points: 2, remarks: "Review plant parts carefully" },
      { subjectName: "Social Studies & Citizenship", marks: 54, grade: "AE", points: 2, remarks: "More engagement in discussions" },
      { subjectName: "Agriculture & Nutrition", marks: 56, grade: "ME", points: 3, remarks: "Practical work is satisfactory" },
      { subjectName: "Creative Arts & Sports", marks: 58, grade: "ME", points: 3, remarks: "Enjoys outdoor games" },
    ]
  }
];

/**
 * Initialize test student dataset into localStorage so offline/demo/real sessions
 * have 100% instant access to all 15 student records.
 */
export function initializeDemoSchoolData() {
  if (typeof window === "undefined") return;

  try {
    // 1. Whitelist for admission number validation
    const whitelistPayload = TEST_STUDENTS_ROSTER.map(s => ({
      id: s.id,
      admission: s.admission_number,
      admission_number: s.admission_number,
      name: s.name,
      Full_Name: s.name,
      klass: s.className,
      parent: s.guardian_name,
      phone: s.guardian_phone,
      balance: s.balance,
      termFee: s.totalBilled,
      paidAmount: s.totalPaid,
      portal: s.portal,
      isValid: true
    }));

    localStorage.setItem("educore_registered_students", JSON.stringify(whitelistPayload));
    localStorage.setItem("educore_demo_students_roster", JSON.stringify(TEST_STUDENTS_ROSTER));
  } catch (e) {
    console.warn("Could not seed demo students into localStorage:", e);
  }
}

/**
 * Find student by admission number
 */
export function findTestStudentByAdmission(adm: string): TestStudentProfile | undefined {
  const clean = adm.trim().toLowerCase();
  return TEST_STUDENTS_ROSTER.find(s => s.admission_number.toLowerCase() === clean);
}

/**
 * Find student by user or session context
 */
export function getActiveStudentProfile(admissionNumber?: string): TestStudentProfile {
  if (admissionNumber) {
    const found = findTestStudentByAdmission(admissionNumber);
    if (found) return found;
  }

  // Check localStorage for recently registered student
  if (typeof window !== "undefined") {
    try {
      const activeAdm = localStorage.getItem("educore_active_student_adm");
      if (activeAdm) {
        const found = findTestStudentByAdmission(activeAdm);
        if (found) return found;
      }
    } catch (_) {}
  }

  // Default to Amani Otieno
  return TEST_STUDENTS_ROSTER[0];
}
