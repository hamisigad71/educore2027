import React from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";

export default function AdmissionsTransfers() {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader title="Student Transfers" subtitle="Processing students transferring in or leaving the school." />
      <Card className="shadow-sm border-slate-200/80">
        <CardContent className="p-6">
          <p className="text-sm text-slate-500">Module under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
