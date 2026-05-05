import { Bus, Clock, Phone, ShieldCheck, Navigation, Plus, User, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { FeatureHeader } from "@/components/portal/FeatureHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const ROUTE_DATA = {
  busNumber: "KCD 445Z",
  driverName: "Mr. John Kamau",
  driverPhone: "+254 712 345 678",
  route: "Route C - Northlands",
  status: "In Transit",
  eta: "12 mins",
  nextStop: "Oakwood Estate Gate",
  stops: [
    { name: "School Campus", time: "04:00 PM", status: "passed" },
    { name: "Riverside Drive", time: "04:15 PM", status: "passed" },
    { name: "Oakwood Estate Gate", time: "04:35 PM", status: "next" },
    { name: "Lavington Center", time: "04:50 PM", status: "upcoming" },
    { name: "Home Drop-off", time: "05:05 PM", status: "upcoming" },
  ]
};

export default function PortalTransport() {
  return (
    <div className="space-y-8 pb-12">
      <FeatureHeader 
        title="Transport Tracking" 
        description="Real-time location monitoring for school buses. Enhanced safety and peace of mind for every commute."
        badge="Live Logistics"
        icon={<Bus className="size-8 text-indigo-400" />}
        actions={
          <Button className="bg-indigo-600 hover:bg-black text-white shadow-lg shadow-indigo-100 gap-2 font-medium h-11 px-8 rounded-2xl group transition-all">
            <Navigation size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            View Routes
          </Button>
        }
      />

      <div className="grid gap-8 lg:grid-cols-3">
         {/* Live Map Simulation */}
         <Card className="lg:col-span-2 border-slate-200/60 shadow-soft bg-slate-100 rounded-[32px] overflow-hidden relative min-h-[400px]">
            {/* Map Placeholder Graphic */}
            <div className="absolute inset-0 bg-slate-200" />
            
            {/* Map Grid/Patttern */}
            <div className="absolute inset-0 bg-indigo-900/5 backdrop-blur-[1px]" />
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#4F46E5 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

            {/* Bus Indicator */}
            <motion.div 
               className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 z-20"
               animate={{ x: [0, 100, 0], y: [0, -50, 0] }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
               <div className="relative">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-500/40 flex items-center justify-center text-white ring-4 ring-white">
                     <Bus size={24} />
                  </div>
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-xl shadow-lg border border-slate-100 whitespace-nowrap">
                     <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">{ROUTE_DATA.busNumber}</span>
                  </div>
                  <div className="absolute top-0 left-0 h-12 w-12 rounded-2xl bg-indigo-400 animate-ping opacity-25" />
               </div>
            </motion.div>

            {/* Controls Overlay */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-30">
               <Button size="icon" className="h-10 w-10 rounded-xl bg-white shadow-lg text-slate-600 hover:bg-slate-50 border-0 text-center">
                  <Plus size={20} className="mx-auto" />
               </Button>
               <Button size="icon" className="h-10 w-10 rounded-xl bg-white shadow-lg text-slate-600 hover:bg-slate-50 border-0 flex items-center justify-center">
                  <span className="font-bold text-xl">-</span>
               </Button>
            </div>

            {/* Live Indicator Badge */}
            <div className="absolute top-6 left-6 z-30">
               <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 shadow-xl flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold text-slate-900 uppercase tracking-[0.1em]">Live Tracking Active</span>
               </div>
            </div>
         </Card>

         {/* Transport Details Sidebar */}
         <div className="space-y-6">
            <Card className="border-slate-200/60 shadow-soft bg-white rounded-[32px] overflow-hidden group">
               <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                     <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-100 text-[10px] font-bold px-3 py-1 rounded-xl">
                        {ROUTE_DATA.status}
                     </Badge>
                     <div className="flex items-center gap-1.5">
                        <Clock className="size-3 text-slate-400" />
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">ETA: {ROUTE_DATA.eta}</span>
                     </div>
                  </div>
                  
                  <h3 className="text-xl font-medium text-slate-900 tracking-tight mb-2">{ROUTE_DATA.route}</h3>
                  <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-[0.15em] mb-8">Next Stop: {ROUTE_DATA.nextStop}</p>

                  <div className="p-5 rounded-3xl bg-slate-50/50 border border-slate-100 flex items-center gap-4 mb-6">
                     <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                        <User className="size-6 text-slate-400" />
                     </div>
                     <div className="flex-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1.5">Driver</p>
                        <p className="text-sm font-medium text-slate-900 leading-none">{ROUTE_DATA.driverName}</p>
                     </div>
                     <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-emerald-600 hover:bg-emerald-50">
                        <Phone size={18} />
                     </Button>
                  </div>

                  <div className="space-y-6 relative pl-4">
                     <div className="absolute left-[19px] top-2 bottom-2 w-[1px] bg-slate-100" />
                     
                     {ROUTE_DATA.stops.map((stop, i) => (
                        <div key={i} className="relative flex items-center gap-4">
                           <div className={cn(
                             "h-3 w-3 rounded-full ring-4 ring-white z-10 shrink-0",
                             stop.status === "passed" ? "bg-slate-300" : 
                             stop.status === "next" ? "bg-indigo-600 ring-indigo-50" : "bg-slate-100"
                           )} />
                           <div className="flex-1 flex items-center justify-between">
                              <span className={cn(
                                "text-sm font-medium",
                                stop.status === "passed" ? "text-slate-400" : "text-slate-700"
                              )}>{stop.name}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stop.time}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            {/* Safety Notice */}
            <div className="p-6 rounded-[32px] bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
               <ShieldCheck className="absolute -bottom-4 -right-4 size-24 text-white/5" />
               <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                     <ShieldCheck className="size-4 text-emerald-400" />
                     <span className="text-[10px] font-bold uppercase tracking-widest">Safety Assured</span>
                  </div>
                  <p className="text-xs font-medium text-indigo-100/80 leading-relaxed mb-4">
                     Our buses are equipped with GPS tracking and speed governors for maximum student safety.
                  </p>
                  <Button variant="link" className="text-white font-bold text-[10px] uppercase tracking-widest p-0 h-auto opacity-60 hover:opacity-100 transition-opacity">
                     Safety Policy <ChevronRight size={14} className="ml-1" />
                  </Button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
