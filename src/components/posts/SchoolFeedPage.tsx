import React from 'react';
import { PageHeader } from "@/components/layout";
import { PostsFeed, CreatePostWidget } from "@/components/posts/PostsFeed";
import { useAuth } from "@/context/AuthContext";
import { Zap } from "lucide-react";

export function SchoolFeedPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

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
        
        {isAdmin ? (
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <CreatePostWidget />
              <PostsFeed className="max-w-none w-full" />
            </div>
            <div className="hidden xl:block">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-sm sticky top-6">
                <h3 className="font-bold text-lg mb-2">School Announcements</h3>
                <p className="text-indigo-100 text-sm">Create updates here to broadcast them to all staff, teachers, and parents.</p>
              </div>
            </div>
          </div>
        ) : (
          <PostsFeed className="max-w-2xl mx-auto" />
        )}
      </div>
    </div>
  );
}
