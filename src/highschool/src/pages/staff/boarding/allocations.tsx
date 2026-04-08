import React from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";

export default function BoardingAllocations() {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader title="Dormitory Allocations" subtitle="Managing houses, bed capacity, and assigning students to rooms." />
      <Card className="shadow-sm border-slate-200/80">
        <CardContent className="p-6">
          <p className="text-sm text-slate-500">Module under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
