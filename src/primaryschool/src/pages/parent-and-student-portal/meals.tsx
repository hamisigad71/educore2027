import { motion } from "framer-motion";
import { FeatureHeader } from "@/components/portal/FeatureHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Utensils, Coffee, Leaf, 
  ChevronRight, Apple, Soup,
  Milk
} from "lucide-react";

const MEALS = [
  { day: "Monday", breakfast: "Oatmeal with Honey & Berries", lunch: "Grilled Chicken with Steamed Veggies", snack: "Apple Slices with Nut Butter", dietary: ["Halal", "Nut-Free"] },
  { day: "Tuesday", breakfast: "Scrambled Eggs on Whole Grain", lunch: "Lentil Soup & Fresh Salad", snack: "Greek Yogurt with Granola", dietary: ["Vegetarian", "Vegan Options"] },
  { day: "Wednesday", breakfast: "Banana Pancakes (Honey Swirl)", lunch: "Beef Stew with Soft Mashed Potatoes", snack: "Cheese Cubes & Grapes", dietary: ["Halal"] },
  { day: "Thursday", breakfast: "Greek Yogurt & Mix Seeds", lunch: "Pasta Primavera (Creamy White Sauce)", snack: "Homemade Hummus & Carrots", dietary: ["Vegetarian", "Nut-Free"] },
  { day: "Friday", breakfast: "Whole Wheat Toast & Avocado", lunch: "Baked Fish with Savory Jollof Rice", snack: "Smoothie of the Day", dietary: ["Pescatarian", "Dairy-Free Options"] },
];

export default function PortalMeals() {
  const today = "Monday";

  return (
    <div className="space-y-8 pb-12">
      <FeatureHeader 
        title="Meal Planner" 
        description="A nutritious and balanced weekly menu curated for student health. Easily track dietary options and allergy-safe choices."
        badge="Health & Welfare"
        icon={<Utensils className="size-8 text-indigo-400" />}
        actions={
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 font-medium h-10 px-6 rounded-2xl backdrop-blur-md">
            <Apple className="size-4 mr-2" /> Nutrient Info
          </Button>
        }
      />

      <div className="grid gap-8 lg:grid-cols-3">
         {/* Today's Menu Highlight */}
         <div className="space-y-6">
            <h4 className="text-[13px] font-bold text-slate-400 uppercase tracking-widest px-1">Today's Selection</h4>
            <Card className="border-indigo-100 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-[32px] overflow-hidden p-8 shadow-2xl shadow-indigo-200/40 relative">
               <motion.div 
                 className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/10 blur-3xl"
                 animate={{ scale: [1, 1.2, 1] }}
                 transition={{ duration: 10, repeat: Infinity }}
               />
               <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                     <div className="h-10 w-10 min-w-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
                        <Soup className="size-6 text-indigo-100" />
                     </div>
                     <div>
                        <h5 className="text-xl font-medium tracking-tight">Monday's Special</h5>
                        <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Balanced & Nutritious</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                           <Coffee className="size-3" /> Breakfast
                        </p>
                        <p className="text-sm font-medium text-white/90">Oatmeal with Honey & Berries</p>
                     </div>
                     <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                           <Utensils className="size-3" /> Lunch
                        </p>
                        <p className="text-sm font-medium text-white/90">Grilled Chicken with Steamed Veggies</p>
                     </div>
                     <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5 flex items-center gap-2">
                           <Leaf className="size-3" /> Afternoon Snack
                        </p>
                        <p className="text-sm font-medium text-white/90">Apple Slices with Nut Butter</p>
                     </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-2">
                     <Badge className="bg-indigo-500 text-white border-0 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-xl">Halal Approved</Badge>
                     <Badge className="bg-white/10 text-white/60 border-0 text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-xl">Organic Produce</Badge>
                  </div>
               </div>
            </Card>
            
            <div className="p-6 rounded-[32px] border border-orange-100 bg-orange-50/20 flex items-center gap-4">
               <Apple className="size-6 text-orange-500 shrink-0" />
               <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
                  Have a specific dietary requirement or allergy? Please update the <span className="text-orange-600 font-bold underline cursor-pointer">Student Health Form</span>.
               </p>
            </div>
         </div>

         {/* Weekly Planner List */}
         <Card className="lg:col-span-2 border-slate-200/60 shadow-soft bg-white rounded-[32px] overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
               <h3 className="text-xl font-medium text-slate-900 tracking-tight">Weekly Menu Guide</h3>
               <div className="flex gap-2">
                  <Badge variant="outline" className="border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-1.5 h-auto rounded-xl">Term 2, Week 6</Badge>
               </div>
            </div>
            <CardContent className="p-0">
               <div className="divide-y divide-slate-50">
                  {MEALS.map((meal) => (
                    <div 
                      key={meal.day} 
                      className={cn(
                        "p-8 flex flex-col md:flex-row gap-8 transition-all duration-300 group",
                        meal.day === today ? "bg-indigo-50/30" : "hover:bg-slate-50/50"
                      )}
                    >
                       <div className="md:w-32 shrink-0">
                          <h4 className={cn(
                            "text-lg font-medium tracking-tight transition-colors",
                            meal.day === today ? "text-indigo-600" : "text-slate-900"
                          )}>{meal.day}</h4>
                          {meal.day === today && <Badge className="mt-2 bg-indigo-600 text-white border-0 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">TODAY</Badge>}
                       </div>

                       <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <Soup size={12} /> Lunch Main
                             </p>
                             <p className="text-sm font-medium text-slate-700 leading-snug">{meal.lunch}</p>
                          </div>
                          <div>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                <Leaf size={12} /> Dietary Labels
                             </p>
                             <div className="flex flex-wrap gap-1.5">
                                {meal.dietary.map(d => (
                                   <span key={d} className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2.5 py-0.5 rounded-lg">{d}</span>
                                ))}
                             </div>
                          </div>
                       </div>

                       <div className="shrink-0 flex items-center justify-end">
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                             <ChevronRight size={20} />
                          </Button>
                       </div>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>
      </div>

      {/* Info Notice */}
      <div className="p-8 rounded-[32px] bg-slate-100 border border-slate-200 flex flex-col md:flex-row items-center gap-8 group">
         <div className="h-16 w-16 rounded-[24px] bg-white flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110">
            <Milk className="size-8 text-indigo-600" />
         </div>
         <div className="flex-1 text-center md:text-left">
            <h5 className="text-lg font-medium text-slate-900 mb-1">Our Commitment to Quality</h5>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
              We source our ingredients from local organic farms to ensure every meal is fresh, sustainable, and rich in nutrients. All our chefs are certified in international food safety standards.
            </p>
         </div>
         <Button variant="outline" className="border-slate-300 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-white rounded-2xl px-8 h-12 shadow-sm">
            Read Policy
         </Button>
      </div>
    </div>
  );
}
