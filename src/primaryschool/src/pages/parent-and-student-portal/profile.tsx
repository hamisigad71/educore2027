import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout";
import { studentsSeed, currency } from "@/primaryschool/src/data/mockData";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

// lucide
import {
  User, Mail, Phone, MapPin, Map,
  Calendar, Shield, Settings, LogOut,
  Pencil, CheckCircle2, Star, Clock,
  BookOpen, CreditCard, TrendingUp,
  Lock, Eye, EyeOff, ChevronRight,
  GraduationCap, Bus, Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Info row helper ──────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon, label, value, mono = false,
}: {
  icon: React.ElementType; label: string; value: string; mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 group/row">
      <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover/row:bg-indigo-50 group-hover/row:border-indigo-100 transition-colors">
        <Icon size={13} className="text-slate-400 group-hover/row:text-indigo-500 transition-colors" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className={cn("text-[12px] font-semibold text-slate-700 truncate mt-0.5", mono && "font-mono")}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Info tile ────────────────────────────────────────────────────────────────

function InfoTile({
  icon: Icon, title, value, color = "text-indigo-500", bg = "bg-indigo-50",
}: {
  icon: React.ElementType; title: string; value: string;
  color?: string; bg?: string;
}) {
  return (
    <div className="p-4 rounded-xl border border-slate-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group/tile shadow-sm">
      <div className="flex items-center gap-2 mb-2.5">
        <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center", bg)}>
          <Icon size={13} className={color} />
        </div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 group-hover/tile:text-slate-600 transition-colors">
          {title}
        </p>
      </div>
      <p className="text-sm font-semibold text-slate-800 leading-snug">{value}</p>
    </div>
  );
}

// ─── Activity item ────────────────────────────────────────────────────────────

function ActivityItem({
  label, time, dot,
}: {
  label: string; time: string; dot: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="relative flex flex-col items-center">
        <div className={cn("h-2 w-2 rounded-full mt-1.5 shrink-0", dot)} />
        <div className="w-px flex-1 bg-slate-100 mt-1" />
      </div>
      <div className="pb-3 flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-700 leading-snug">{label}</p>
        <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
          <Clock size={9} />{time}
        </p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortalProfile() {
  const navigate = useNavigate();
  const student = studentsSeed[0];
  const [pwdModal, setPwdModal] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const email = student.admission.toLowerCase().replace(/\//g, "-") + "@school.com";
  const profileCompleteness = 85;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        subtitle="Your personal details, academic record and account settings"
        badge={{ label: "Active", variant: "success" }}
        actions={
          <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 shadow-sm gap-1.5 text-xs">
            <Pencil size={13} />Request Update
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">

        {/* ── LEFT: Profile Card ─────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-5">
          <Card className="shadow-sm border-slate-200/80 overflow-hidden">
            {/* Cover */}
            <div className="h-24 bg-gradient-to-r from-indigo-500/80 to-violet-500/80 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/20" />
              <div className="absolute -bottom-4 left-8 w-20 h-20 rounded-full bg-indigo-400/20" />
              {/* Edit cover button */}
              <button className="absolute top-3 right-3 h-7 w-7 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                <Pencil size={12} className="text-white" />
              </button>
            </div>

            <CardContent className="px-5 pb-5 -mt-10">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-[3px] border-white shadow-lg ring-4 ring-slate-50">
                    <AvatarImage src={student.photo} className="object-cover" />
                    <AvatarFallback className="text-xl font-bold bg-indigo-50 text-indigo-700">
                      {student.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                    <CheckCircle2 size={11} className="text-white" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-slate-900 tracking-tight mt-4">{student.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Student · {student.klass}</p>

                <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
                  <Badge variant="outline" className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 border-indigo-200 uppercase tracking-wider px-2.5">
                    {student.klass}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-semibold border-slate-200 text-slate-500 uppercase px-2.5">
                    #{student.admission}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border-emerald-200 px-2.5">
                    Active
                  </Badge>
                </div>

                {/* Profile completeness */}
                <div className="w-full mt-5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Profile completeness</span>
                    <span className="text-[11px] font-semibold text-indigo-600">{profileCompleteness}%</span>
                  </div>
                  <Progress value={profileCompleteness} className="h-1.5 bg-slate-200 [&>div]:bg-indigo-500" />
                  <p className="text-[10px] text-slate-400 mt-1.5">Add emergency contact to reach 100%</p>
                </div>
              </div>

              <Separator className="my-5" />

              {/* Contact info */}
              <div className="space-y-3">
                <InfoRow icon={Mail} label="School Email" value={email} />
                <InfoRow icon={Phone} label="Emergency Contact" value={student.phone} mono />
                <InfoRow icon={MapPin} label="Address" value="Nairobi, Kenya" />
              </div>

              <Separator className="my-5" />

              {/* Actions */}
              <div className="space-y-2">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 h-9 text-xs font-semibold shadow-sm gap-1.5">
                  <Pencil size={13} />Request Detail Update
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="w-full border-slate-200 text-slate-600 h-9 text-xs font-semibold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all gap-1.5"
                >
                  <LogOut size={13} />Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Academic snapshot */}
          <Card className="shadow-sm border-slate-200/80">
            <CardContent className="p-4">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">Academic Snapshot</p>
              <div className="space-y-3">
                {[
                  { label: "Attendance", value: `${student.attendance}%`, color: "bg-emerald-500", pct: student.attendance },
                  { label: "Fee Cleared", value: student.balance === 0 ? "100%" : `${Math.round((1 - student.balance / 50000) * 100)}%`, color: "bg-amber-500", pct: student.balance === 0 ? 100 : Math.round((1 - student.balance / 50000) * 100) },
                  { label: "Assignments", value: "78%", color: "bg-indigo-500", pct: 78 },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] text-slate-600 font-medium">{s.label}</span>
                      <span className="text-[11px] font-semibold text-slate-700">{s.value}</span>
                    </div>
                    <Progress value={s.pct} className={cn("h-1.5 bg-slate-100", `[&>div]:${s.color}`)} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── RIGHT: Detail Panels ───────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Background Information */}
          <Card className="shadow-sm border-slate-200/80">
            <CardHeader className="px-6 pt-5 pb-4 border-b border-slate-100">
              <CardTitle className="text-base font-semibold text-slate-900">Background Information</CardTitle>
              <CardDescription className="text-sm text-slate-500 mt-0.5">
                Personal and academic details on file
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoTile icon={User}        title="Parent / Guardian"    value={student.parent} color="text-indigo-500" bg="bg-indigo-50" />
                <InfoTile icon={Calendar}    title="Date of Enrollment"   value="January 15, 2024" color="text-sky-500"    bg="bg-sky-50"    />
                <InfoTile icon={Heart}       title="Health Records"       value="Certified Up to Date" color="text-rose-500"   bg="bg-rose-50"   />
                <InfoTile icon={Bus}         title="Transport Zone"       value="Route 04 – Green Bus" color="text-emerald-500" bg="bg-emerald-50"/>
                <InfoTile icon={GraduationCap} title="Academic Level"     value={student.klass}  color="text-purple-500" bg="bg-purple-50"  />
                <InfoTile icon={BookOpen}    title="Admission Number"     value={student.admission} color="text-amber-500"  bg="bg-amber-50"  />
              </div>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card className="shadow-sm border-slate-200/80">
            <CardHeader className="px-6 pt-5 pb-4 border-b border-slate-100">
              <CardTitle className="text-base font-semibold text-slate-900">Account Security</CardTitle>
              <CardDescription className="text-sm text-slate-500 mt-0.5">
                Manage your password and login preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Password row */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Lock size={15} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Login Password</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Last changed 3 months ago</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => setPwdModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 h-8 text-xs shadow-sm">
                  Change
                </Button>
              </div>

              {/* 2FA row */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Shield size={15} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Two-Factor Auth</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Adds an extra layer of security</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-500 border-slate-200 font-semibold">
                  Not enabled
                </Badge>
              </div>

              {/* Sessions row */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Settings size={15} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Active Sessions</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">1 active session · Chrome, Nairobi</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-rose-600 hover:bg-rose-50 h-8">
                  Revoke
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-sm border-slate-200/80">
            <CardHeader className="px-6 pt-5 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900">Recent Activity</CardTitle>
                  <CardDescription className="text-sm text-slate-500 mt-0.5">Your latest portal actions</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-indigo-600 hover:text-indigo-700 h-8 gap-1">
                  See all <ChevronRight size={12} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-0">
                <ActivityItem label="Viewed Term 2 results" time="Today, 10:32 AM" dot="bg-indigo-400" />
                <ActivityItem label="Downloaded fee receipt – KES 10,000" time="Yesterday, 3:45 PM" dot="bg-emerald-400" />
                <ActivityItem label="Updated profile contact number" time="2 days ago" dot="bg-amber-400" />
                <ActivityItem label="Signed in from Chrome · Nairobi" time="3 days ago" dot="bg-slate-300" />
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full mt-1.5 shrink-0 bg-slate-200" />
                  <p className="text-[10px] text-slate-400 pb-0">Checked attendance report</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Change Password Modal ──────────────────────────────────── */}
      <Dialog open={pwdModal} onOpenChange={setPwdModal}>
        <DialogContent className="sm:max-w-[420px] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                <Lock size={15} className="text-indigo-600" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-slate-900">Change Password</DialogTitle>
                <p className="text-xs text-slate-400 mt-0.5">Choose a strong, unique password</p>
              </div>
            </div>
          </DialogHeader>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">Current Password</Label>
              <div className="relative">
                <Input type={showPwd ? "text" : "password"} placeholder="••••••••"
                  className="h-9 text-sm border-slate-200 pr-10 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400" />
                <button onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">New Password</Label>
              <Input type="password" placeholder="••••••••"
                className="h-9 text-sm border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-slate-600">Confirm New Password</Label>
              <Input type="password" placeholder="••••••••"
                className="h-9 text-sm border-slate-200 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-400" />
            </div>
            <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3 flex gap-2">
              <CheckCircle2 size={14} className="text-indigo-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-indigo-700">Use at least 8 characters, including a number and a symbol.</p>
            </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 gap-2">
            <Button variant="outline" size="sm" onClick={() => setPwdModal(false)} className="border-slate-300 text-slate-700">Cancel</Button>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 shadow-sm gap-1.5">
              <Lock size={13} />Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}