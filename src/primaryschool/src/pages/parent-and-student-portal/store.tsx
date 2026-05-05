import { ShoppingBag, Package, Star, Clock, Filter, Search, Plus, Minus, CreditCard, ShieldCheck, Heart } from "lucide-react";
import { FeatureHeader } from "@/components/portal/FeatureHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PRODUCTS = [
  { id: 1, name: "Premium Blazer (Sky High Edition)", price: "$120", category: "Uniforms", rating: 4.9, reviews: 124, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=60" },
  { id: 2, name: "Sports Polo Shirt - Indigo", price: "$45", category: "Sportswear", rating: 4.8, reviews: 86, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=60" },
  { id: 3, name: "Official School Tie (Silk)", price: "$25", category: "Accessories", rating: 5.0, reviews: 42, image: "https://images.unsplash.com/photo-1542382257-80dedb725088?w=800&auto=format&fit=crop&q=60" },
  { id: 4, name: "Winter Cardigan - Charcoal", price: "$65", category: "Winter Wear", rating: 4.7, reviews: 68, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=60" },
];

export default function PortalStore() {
  return (
    <div className="space-y-8 pb-12">
      <FeatureHeader 
        title="Uniform & School Store" 
        description="Premium apparel and supplies for the modern student. Browse our catalog and enjoy seamless click-and-collect ordering."
        badge="Official Merchandise"
        icon={<ShoppingBag className="size-8 text-indigo-400" />}
        actions={
          <Button className="bg-indigo-600 hover:bg-black text-white shadow-lg shadow-indigo-100 gap-2 font-medium h-11 px-8 rounded-2xl group transition-all">
            <Package size={18} /> Order History
          </Button>
        }
      />

      <div className="grid gap-8 lg:grid-cols-4">
         {/* Categories & Filter Sidebar */}
         <div className="space-y-6">
            <Card className="border-slate-200 shadow-soft bg-white rounded-[32px] overflow-hidden p-8">
               <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Store Categories</h4>
               <div className="space-y-3">
                  {[
                    { label: "Full Uniforms", count: 12 },
                    { label: "Sportswear", count: 8 },
                    { label: "Accessories", count: 15 },
                    { label: "Stationery", count: 24 },
                    { label: "Digital Gear", count: 5 }
                  ].map((cat, i) => (
                    <button key={i} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group">
                       <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-600">{cat.label}</span>
                       <Badge variant="outline" className="text-[10px] font-bold text-slate-300 border-slate-100">{cat.count}</Badge>
                    </button>
                  ))}
               </div>

               <div className="mt-8 pt-8 border-t border-slate-50">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Price Range</h4>
                  <div className="px-2">
                     <div className="h-1.5 w-full bg-slate-100 rounded-full relative">
                        <div className="absolute left-0 right-1/4 h-full bg-indigo-500 rounded-full" />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white border-2 border-indigo-500 shadow-md" />
                        <div className="absolute right-1/4 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-white border-2 border-indigo-500 shadow-md" />
                     </div>
                     <div className="flex justify-between items-center mt-4">
                        <span className="text-[11px] font-bold text-slate-900">$10</span>
                        <span className="text-[11px] font-bold text-slate-900">$250</span>
                     </div>
                  </div>
               </div>
            </Card>

            <div className="p-8 rounded-[32px] bg-slate-100 border border-slate-200">
               <div className="flex items-center gap-3 mb-4">
                  <Clock size={18} className="text-orange-500" />
                  <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Store Hours</h5>
               </div>
               <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  The physical store is open Monday to Friday, 8:00 AM — 4:30 PM. Online orders are processed within 24 hours.
               </p>
            </div>
         </div>

         {/* Products Grid */}
         <div className="lg:col-span-3 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
               <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input type="text" placeholder="Search for uniforms or gear..." className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-5 py-3 text-sm font-medium outline-none focus:border-indigo-300" />
               </div>
               <div className="flex items-center gap-4">
                  <Button variant="outline" className="rounded-2xl border-slate-200 text-slate-600 font-medium gap-2">
                     <Filter size={16} /> Filter
                  </Button>
                  <Button className="bg-indigo-600 hover:bg-black text-white rounded-2xl font-medium gap-3 h-11 px-6 shadow-xl shadow-indigo-100 relative border-0">
                     <ShoppingBag size={18} />
                     Cart
                     <Badge className="bg-white text-indigo-600 border-2 border-indigo-600 text-[10px] font-bold h-6 w-6 rounded-full flex items-center justify-center p-0 -mr-2">2</Badge>
                  </Button>
               </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
               {PRODUCTS.map((prod) => (
                  <Card key={prod.id} className="border-slate-200/60 shadow-soft bg-white rounded-[40px] overflow-hidden group hover:shadow-2xl transition-all duration-500">
                     <CardContent className="p-0">
                        <div className="h-64 w-full relative overflow-hidden bg-slate-50">
                           <img src={prod.image} className="h-full w-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-110" alt={prod.name} />
                           {/* Quick Actions overlay */}
                           <div className="absolute top-6 right-6 flex flex-col gap-3 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                              <Button size="icon" className="h-10 w-10 rounded-2xl bg-white shadow-xl text-rose-500 hover:bg-rose-50 border-0">
                                 <Heart size={20} />
                              </Button>
                              <Button size="icon" className="h-10 w-10 rounded-2xl bg-white shadow-xl text-slate-600 hover:bg-slate-50 border-0">
                                 <Plus size={20} />
                              </Button>
                           </div>
                           <Badge className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-[10px] font-bold text-slate-900 border-0 px-4 py-1.5 rounded-2xl shadow-xl">
                              {prod.category}
                           </Badge>
                        </div>
                        
                        <div className="p-8">
                           <div className="flex justify-between items-start mb-4">
                              <div>
                                 <h4 className="text-lg font-medium text-slate-900 tracking-tight leading-tight mb-2 group-hover:text-indigo-600 transition-colors uppercase">{prod.name}</h4>
                                 <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-0.5">
                                       <Star className="size-3 text-amber-400 fill-amber-400" />
                                       <span className="text-[11px] font-bold text-slate-900">{prod.rating}</span>
                                    </div>
                                    <span className="text-[11px] font-medium text-slate-400">({prod.reviews} Reviews)</span>
                                 </div>
                              </div>
                              <span className="text-2xl font-bold text-slate-900">{prod.price}</span>
                           </div>

                           <div className="flex items-center gap-3 pt-6 border-t border-slate-50">
                              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl">
                                 <button className="text-slate-400 hover:text-slate-900 transition-colors"><Minus size={14} /></button>
                                 <span className="text-sm font-bold text-slate-900 w-4 text-center">1</span>
                                 <button className="text-slate-400 hover:text-slate-900 transition-colors"><Plus size={14} /></button>
                              </div>
                              <Button className="flex-1 bg-indigo-600 hover:bg-black text-white h-12 rounded-2xl font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-indigo-100">
                                 Pre-Order Now
                              </Button>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>

            {/* Loyalty/Benefits Card */}
            <div className="grid gap-6 md:grid-cols-2 pt-6">
               <Card className="border-emerald-100 bg-emerald-50/30 rounded-[32px] p-8 flex items-center gap-6 group hover:bg-emerald-50 transition-colors">
                  <div className="h-16 w-16 rounded-[24px] bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-100 shrink-0 transform group-hover:rotate-6 transition-transform">
                     <CreditCard size={32} />
                  </div>
                  <div>
                     <h5 className="text-lg font-medium text-slate-900 mb-1">EduPoints Rewards</h5>
                     <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                        Earn 2 poinst for every $1 spent. Use points to get discounts on stationery!
                     </p>
                  </div>
               </Card>

               <Card className="border-indigo-100 bg-indigo-50/30 rounded-[32px] p-8 flex items-center gap-6 group hover:bg-indigo-50 transition-colors">
                  <div className="h-16 w-16 rounded-[24px] bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-100 shrink-0 transform group-hover:-rotate-6 transition-transform">
                     <ShieldCheck size={32} />
                  </div>
                  <div>
                     <h5 className="text-lg font-medium text-slate-900 mb-1">Authentic Guarantee</h5>
                     <p className="text-[12px] text-slate-500 font-medium leading-relaxed">
                        Every item is quality-checked to meet school standards for durability and fit.
                     </p>
                  </div>
               </Card>
            </div>
         </div>
      </div>
    </div>
  );
}
