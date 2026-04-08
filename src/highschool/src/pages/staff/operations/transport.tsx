import React from "react";
import { PageHeader } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";

export default function OperationsTransport() {
  return (
    <div className="space-y-6 pb-12">
      <PageHeader title="Transport & Fleet" subtitle="Managing school buses, driver assignments, and student transport routes." />
      <Card className="shadow-sm border-slate-200/80">
        <CardContent className="p-6">
          <p className="text-sm text-slate-500">Module under construction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
