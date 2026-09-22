import React from 'react';
import { PageHeader } from "@/components/layout";
import { PostsFeed } from "@/components/posts/PostsFeed";
import { Zap } from "lucide-react";

export function SchoolFeedPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="School Feed"
        description="Latest news, announcements, and updates from the school administration."
      />
      <div className="pt-4 border-t border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-indigo-500" />
          School Feed
        </h2>
        <PostsFeed className="max-w-2xl mx-auto" />
      </div>
    </div>
  );
}
