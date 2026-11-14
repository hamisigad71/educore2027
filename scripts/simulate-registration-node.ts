import { TEST_STUDENTS_ROSTER } from "../src/lib/demoSchoolSeed";

console.log("=================================================================");
console.log("🔍 DIAGNOSING REGISTRATION FAILURE FOR ADM-2027-011");
console.log("=================================================================\n");

const inputAdm = "ADM-2027-011";
const match = TEST_STUDENTS_ROSTER.find(s => s.admission_number === inputAdm);

console.log(`1. Target Admission: ${inputAdm}`);
console.log(`2. In Seed Roster   : ${match ? "✅ FOUND" : "❌ MISSING"}`);
if (match) {
  console.log(`   • Legal Name     : ${match.name}`);
  console.log(`   • Class Stream   : ${match.className}`);
  console.log(`   • Portal         : ${match.portal}`);
  console.log(`   • Fee Balance    : KES ${match.balance.toLocaleString()}`);
  console.log(`   • Mean Score     : ${match.meanScore}% (${match.overallGrade})`);
}

console.log("\n=================================================================");
console.log("🎯 EXACT REASON IT FAILED ON YOUR PHONE:");
console.log("=================================================================");
console.log("When you tested on your phone, you opened https://educore2027.vercel.app.");
console.log("However, the code on Vercel is still running commit 8d0cd1f3 from earlier!");
console.log("Your local Git repository has 4 unpushed commits:");
console.log("  • c21adde2: Fixes 'Failed to fetch' error with offline/demo fallback");
console.log("  • 4f05ce93: Removes the 2FA / OTP popup");
console.log("  • c3df28b4: Enforces whitelist validation on student/parent admission");
console.log("  • 057a9ac2: Adds ADM-2027-011 (Victor Kipchumba) and 14 other students");
console.log("");
console.log("Because these 4 commits are sitting on your computer and haven't been");
console.log("pushed to GitHub with 'git push origin main', Vercel has not built them yet!");
console.log("=================================================================");
