import React from "react";
import { 
  FileText, 
  Upload, 
  Search, 
  MoreVertical, 
  Folder, 
  Download,
  Link as LinkIcon,
  Video,
  FileArchive,
  Image as ImageIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const ResourcesPage = () => {
  const resources = [
    { name: "Unit 4: Plants Module.pdf", type: "PDF", size: "2.4 MB", date: "May 2, 2025", icon: FileText, color: "text-rose-600 bg-rose-50" },
    { name: "Photosynthesis Presentation.pptx", type: "Slides", size: "15.8 MB", date: "May 1, 2025", icon: FileText, color: "text-amber-600 bg-amber-50" },
    { name: "Biology Lab - Stems.mp4", type: "Video", size: "124 MB", date: "Apr 28, 2025", icon: Video, color: "text-indigo-600 bg-indigo-50" },
    { name: "Supplementary Quiz Links", type: "Link", size: "-", date: "Apr 25, 2025", icon: LinkIcon, color: "text-emerald-600 bg-emerald-50" },
    { name: "Semester 1 Archives.zip", type: "Archive", size: "450 MB", date: "Mar 12, 2025", icon: FileArchive, color: "text-slate-600 bg-slate-50" },
  ];

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Resource Library</h1>
          <p className="text-slate-500 font-medium">Manage and share your teaching materials with students.</p>
        </div>
        <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100">
          <Upload className="h-4 w-4 mr-2" />
          Upload Resource
        </Button>
      </div>

      {/* Storage Summary */}
      <Card className="border-none shadow-sm bg-gradient-to-r from-slate-900 to-indigo-950 text-white overflow-hidden relative">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-3 w-full">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-300">Total Cloud Storage</span>
                <span className="text-sm font-bold">12.4 GB / 50 GB</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[25%] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              </div>
              <p className="text-[10px] text-slate-400">Regularly archive old materials to free up space.</p>
            </div>
            <Separator orientation="vertical" className="h-12 bg-white/10 hidden md:block" />
            <div className="flex items-center gap-6">
               <div className="text-center">
                 <p className="text-2xl font-bold">142</p>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Total Files</p>
               </div>
               <div className="text-center">
                 <p className="text-2xl font-bold">12</p>
                 <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Folders</p>
               </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search resources by name, tag or file type..." 
            className="pl-10 h-11 rounded-xl border-slate-200 bg-white"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl border-slate-200 h-11 px-6">All Types</Button>
          <Button variant="outline" className="rounded-xl border-slate-200 h-11 px-6 font-semibold">
            <Folder className="h-4 w-4 mr-2" />
            Browse Folders
          </Button>
        </div>
      </div>

      {/* File List */}
      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="py-4 px-6 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Resource Name</th>
                  <th className="py-4 px-6 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Size</th>
                  <th className="py-4 px-6 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400">Uploaded On</th>
                  <th className="py-4 px-6 text-right text-[10px] font-bold uppercase tracking-widest text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((res, i) => (
                  <tr key={i} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0 text-slate-700">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center shrink-0", res.color)}>
                          <res.icon size={20} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{res.name}</span>
                          <span className="text-[10px] font-semibold text-slate-400">{res.type}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-500">{res.size}</td>
                    <td className="py-4 px-6 text-sm font-medium text-slate-500">{res.date}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                          <Download size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all">
                          <MoreVertical size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default ResourcesPage;
