import React, { useState } from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { issueExeatGatePass, GateExeatItem } from "@/lib/schoolFeatures";
import { 
  ShieldCheck, Plus, CheckCircle2, QrCode, 
  Clock, AlertTriangle, ArrowRight, UserCheck, Search, Filter 
} from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_EXEATS: GateExeatItem[] = [
  {
    id: "ext-1",
    studentName: "Emmanuel Kariuki",
    admissionNumber: "ADM-2023-084",
    className: "Form 4 Red",
    reason: "Medical Checkup (Nairobi West Hospital)",
    destination: "Nairobi",
    guardianContact: "+254722113344",
    expectedReturn: "Tomorrow, 05:00 PM",
    status: "departed",
    qrPassCode: "EXIT-M8Z4K-9281",
  },
  {
    id: "ext-2",
    studentName: "Mercy Akoth",
    admissionNumber: "ADM-2024-112",
    className: "Form 3 Blue",
    reason: "National Drama & Music Festival",
    destination: "Nakuru",
    guardianContact: "+254733445566",
    expectedReturn: "May 12, 06:00 PM",
    status: "approved",
    qrPassCode: "EXIT-D3N9P-4402",
  },
  {
    id: "ext-3",
    studentName: "Victor Owino",
    admissionNumber: "ADM-2022-019",
    className: "Form 4 West",
    reason: "Bereavement / Family Emergency",
    destination: "Kisumu",
    guardianContact: "+254711889900",
    expectedReturn: "May 08, 04:00 PM",
    status: "returned",
    qrPassCode: "EXIT-B7V1Q-6190",
  },
];

export default function GateExeatPage() {
  const { toast } = useToast();
  const [exeats, setExeats] = useState<GateExeatItem[]>(INITIAL_EXEATS);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [verifyPassModal, setVerifyPassModal] = useState<GateExeatItem | null>(null);

  // Form State
  const [studentName, setStudentName] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [className, setClassName] = useState("Form 4 Red");
  const [reason, setReason] = useState("");
  const [destination, setDestination] = useState("");
  const [guardianContact, setGuardianContact] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreateExeat = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await issueExeatGatePass({
      studentName,
      admissionNumber,
      className,
      reason,
      destination,
      guardianContact,
      expectedReturn: "In 48 Hours",
      status: "approved",
    });

    const newExeat: GateExeatItem = {
      id: result.exeatId,
      studentName,
      admissionNumber,
      className,
      reason,
      destination,
      guardianContact,
      expectedReturn: "In 48 Hours",
      status: "approved",
      qrPassCode: result.qrPassCode,
    };

    setExeats(prev => [newExeat, ...prev]);
    setSubmitting(false);
    setCreateModalOpen(false);

    toast({
      title: "Exeat Gate Pass Approved & Stamped",
      description: `Gate token generated: ${result.qrPassCode}. Sent via SMS to guardian.`,
    });
  };

  const handleGateAction = (id: string, newStatus: GateExeatItem["status"]) => {
    setExeats(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
    toast({
      title: "Gate Clearance Updated",
      description: `Student marked as: ${newStatus.toUpperCase()}. Security log timestamped.`,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <PageHeader
        title="Student Gate Pass & Exeat Security"
        subtitle="Manage official departure clearance, parent authorization, and security gate checkouts"
        actions={
          <Button 
            onClick={() => setCreateModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs h-9 px-4 rounded-xl gap-1.5 shadow-sm"
          >
            <Plus size={15} /> Issue New Exeat
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Cleared Exeats", val: exeats.filter(e => e.status === "approved" || e.status === "departed").length, color: "text-indigo-600 bg-indigo-50" },
          { label: "Currently Off-Campus", val: exeats.filter(e => e.status === "departed").length, color: "text-amber-600 bg-amber-50" },
          { label: "Returned & Logged", val: exeats.filter(e => e.status === "returned").length, color: "text-emerald-600 bg-emerald-50" },
          { label: "Overdue Alerts", val: "0", color: "text-rose-600 bg-rose-50" },
        ].map((item, i) => (
          <Card key={i} className="border-slate-200/80 shadow-sm bg-white rounded-2xl">
            <CardContent className="p-4 sm:p-5">
              <span className={cn("text-xs font-bold px-2 py-1 rounded-lg", item.color)}>{item.label}</span>
              <p className="text-2xl font-black text-slate-900 mt-2">{item.val}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Exeat List */}
      <Card className="border-slate-200 shadow-sm bg-white rounded-3xl overflow-hidden">
        <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-black text-slate-900">Active Gate Pass Clearance Ledger</CardTitle>
            <CardDescription className="text-xs text-slate-500">Real-time status synchronized with the security main gate.</CardDescription>
          </div>
          <Badge className="bg-slate-100 text-slate-700 text-xs font-mono font-bold">
            Live Gate Scanner Active
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {exeats.map((ex) => (
              <div key={ex.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{ex.studentName}</span>
                    <Badge variant="outline" className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border-indigo-100">
                      {ex.className}
                    </Badge>
                    <span className="text-xs font-mono text-slate-400">({ex.admissionNumber})</span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Reason: <strong className="text-slate-800">{ex.reason}</strong> · To: {ex.destination}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <Clock size={12} /> Expected Return: {ex.expectedReturn} · Guardian: {ex.guardianContact}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <Badge className={cn(
                    "text-xs font-black uppercase px-3 py-1",
                    ex.status === "approved" && "bg-blue-50 text-blue-700 border-blue-200",
                    ex.status === "departed" && "bg-amber-50 text-amber-700 border-amber-200",
                    ex.status === "returned" && "bg-emerald-50 text-emerald-700 border-emerald-200",
                  )}>
                    {ex.status}
                  </Badge>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setVerifyPassModal(ex)}
                    className="h-9 rounded-xl border-slate-200 text-xs font-bold gap-1.5"
                  >
                    <QrCode size={14} /> View Pass
                  </Button>

                  {ex.status === "approved" && (
                    <Button
                      size="sm"
                      onClick={() => handleGateAction(ex.id, "departed")}
                      className="h-9 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold gap-1"
                    >
                      Clear Out Gate
                    </Button>
                  )}

                  {ex.status === "departed" && (
                    <Button
                      size="sm"
                      onClick={() => handleGateAction(ex.id, "returned")}
                      className="h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold gap-1"
                    >
                      Mark Returned
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Pass Dialog */}
      <Dialog open={!!verifyPassModal} onOpenChange={(open) => !open && setVerifyPassModal(null)}>
        <DialogContent className="max-w-sm w-[90vw] bg-white rounded-3xl p-6 border border-slate-200 text-center">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900">Official Gate Exit Slip</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">Scan code at the school main gate barrier.</DialogDescription>
          </DialogHeader>

          <div className="my-4 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center">
            <QrCode size={140} className="text-slate-900 mb-3" />
            <span className="font-mono font-bold text-sm text-indigo-700 tracking-wider">
              {verifyPassModal?.qrPassCode}
            </span>
            <p className="text-xs font-bold text-slate-800 mt-2">{verifyPassModal?.studentName}</p>
            <p className="text-[10px] text-slate-500">{verifyPassModal?.className} · {verifyPassModal?.reason}</p>
          </div>

          <Button 
            onClick={() => window.print()}
            className="w-full h-10 rounded-xl bg-slate-900 text-white font-bold text-xs"
          >
            Print Gate Pass Slip
          </Button>
        </DialogContent>
      </Dialog>

      {/* Issue Exeat Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md w-[94vw] bg-white rounded-3xl p-6 border border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900">Issue New Exeat Clearance</DialogTitle>
            <DialogDescription className="text-xs text-slate-500">Generate authenticated departure clearance with SMS token.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateExeat} className="space-y-3.5 mt-4">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-600 uppercase">Student Name</Label>
              <Input 
                value={studentName} 
                onChange={(e) => setStudentName(e.target.value)} 
                placeholder="e.g. Dennis Mutiso" 
                className="h-10 text-xs rounded-xl"
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-600 uppercase">Admission No</Label>
                <Input 
                  value={admissionNumber} 
                  onChange={(e) => setAdmissionNumber(e.target.value)} 
                  placeholder="ADM-2024-091" 
                  className="h-10 text-xs rounded-xl"
                  required 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-600 uppercase">Class</Label>
                <Input 
                  value={className} 
                  onChange={(e) => setClassName(e.target.value)} 
                  placeholder="Form 4 Red" 
                  className="h-10 text-xs rounded-xl"
                  required 
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-600 uppercase">Reason for Departure</Label>
              <Input 
                value={reason} 
                onChange={(e) => setReason(e.target.value)} 
                placeholder="e.g. Medical, Compassionate Leave, Sport Contest" 
                className="h-10 text-xs rounded-xl"
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-600 uppercase">Destination</Label>
                <Input 
                  value={destination} 
                  onChange={(e) => setDestination(e.target.value)} 
                  placeholder="City / Town" 
                  className="h-10 text-xs rounded-xl"
                  required 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-600 uppercase">Guardian Phone</Label>
                <Input 
                  value={guardianContact} 
                  onChange={(e) => setGuardianContact(e.target.value)} 
                  placeholder="+254 7..." 
                  className="h-10 text-xs rounded-xl"
                  required 
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <Button type="button" variant="ghost" onClick={() => setCreateModalOpen(false)} className="rounded-xl text-xs font-bold">
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white">
                {submitting ? "Approving..." : "Authorize Exeat Pass"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

