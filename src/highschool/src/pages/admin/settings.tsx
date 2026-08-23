import React from "react";
import { PageHeader } from "@/components/layout";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

// lucide
import { 
  Settings, Building2, Bell, 
  ShieldCheck, Globe, CreditCard,
  Save, Trash2, Sliders, Settings2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Admin Settings" 
        subtitle="Global configuration for the school management system" 
        actions={
          <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-sm gap-1.5 font-bold text-xs h-9">
            <Save size={14} /> Commit Changes
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Nav */}
        <div className="lg:col-span-1 space-y-1.5">
           {[
             { label: "General Info", icon: Building2 },
             { label: "Notifications", icon: Bell },
             { label: "Security & Privacy", icon: ShieldCheck },
             { label: "Academics", icon: Sliders },
             { label: "Payments", icon: CreditCard },
             { label: "External Portal", icon: Globe },
           ].map((item, i) => (
             <button key={i} className={cn(
               "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-sm font-bold transition-all",
               i === 0 
                ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
             )}>
                <item.icon size={16} />
                {item.label}
             </button>
           ))}
        </div>

        {/* Content */}
        <Card className="lg:col-span-3 shadow-sm border-slate-200/80">
           <CardHeader className="px-6 py-5 border-b border-slate-50">
              <CardTitle className="text-base font-semibold">General Ingradeation</CardTitle>
              <CardDescription className="text-xs">Configure your institution's public branding and contact details</CardDescription>
           </CardHeader>
           <CardContent className="p-6 space-y-8">
              <div className="grid gap-6 sm:grid-cols-2">
                 <div className="space-y-2">
                    <Label htmlFor="schoolName" className="text-xs font-bold text-slate-500 uppercase tracking-widest">School Name</Label>
                    <Input id="schoolName" defaultValue="Bright Futures Academy" className="h-10 border-slate-200 bg-slate-50/30 focus-visible:ring-indigo-600 font-bold" />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="schoolTagline" className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tagline</Label>
                    <Input id="schoolTagline" defaultValue="Excellence in every step" className="h-10 border-slate-200 bg-slate-50/30 focus-visible:ring-indigo-600" />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="schoolEmail" className="text-xs font-bold text-slate-500 uppercase tracking-widest">Admin Email</Label>
                    <Input id="schoolEmail" defaultValue="contact@brightfutures.edu" className="h-10 border-slate-200 bg-slate-50/30 focus-visible:ring-indigo-600" />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="schoolPhone" className="text-xs font-bold text-slate-500 uppercase tracking-widest">Official Phone</Label>
                    <Input id="schoolPhone" defaultValue="+254 700 123 456" className="h-10 border-slate-200 bg-slate-50/30 focus-visible:ring-indigo-600" />
                 </div>
              </div>

              <Separator className="bg-slate-50" />

              <div className="space-y-6">
                 <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Settings2 size={14} className="text-indigo-500" /> System Preferences
                 </h4>
                 <div className="grid gap-4">
                    {[
                      { title: "Public Registration", desc: "Allow parents to apply for admission via the portal", active: true },
                      { title: "Automatic SMS Alerts", desc: "Send SMS notifications for attendance and fee balances", active: true },
                      { title: "Dark Mode Default", desc: "Set dark appearance as default for all portal users", active: false },
                      { title: "Audit Logging", desc: "Maintain detailed logs of all administrative actions", active: true },
                    ].map((pref, i) => (
                      <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/30 group hover:border-indigo-100 transition-colors">
                        <div className="space-y-0.5">
                           <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-950 transition-colors">{pref.title}</p>
                           <p className="text-[11px] text-slate-400 font-medium">{pref.desc}</p>
                        </div>
                        <Switch checked={pref.active} className="data-[state=checked]:bg-indigo-600" />
                      </div>
                    ))}
                 </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-50">
                 <Button variant="ghost" className="h-9 text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 gap-2 border-0">
                    <Trash2 size={14} /> Factory Reset
                 </Button>
                 <Button className="h-9 bg-indigo-600 hover:bg-indigo-700 shadow-md font-bold text-xs px-8 shadow-indigo-100 border-0">
                    Save Changes
                 </Button>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
