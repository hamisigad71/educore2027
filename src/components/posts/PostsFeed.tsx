import React, { useEffect, useState } from 'react';
import { getPosts, PostItem, createPost } from '@/lib/api';
import { PostCard } from './PostCard';
import { Send, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function PostsFeed({ className }: { className?: string }) {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (e) {
      console.error("Failed to load posts", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className={cn("flex flex-col space-y-4 animate-pulse", className)}>
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-100 h-96 w-full rounded-3xl" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("max-w-xl mx-auto flex flex-col w-full", className)}>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      <div className="py-8 text-center text-sm text-gray-400 font-medium">
        You are all caught up!
      </div>
    </div>
  );
}

export function CreatePostWidget({ onPostCreated }: { onPostCreated?: () => void }) {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [imageInputOpen, setImageInputOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageUrl.trim()) return;
    
    setSubmitting(true);
    try {
      await createPost({
        content,
        imageUrl: imageUrl.trim() || undefined,
        authorName: "System Admin",
        authorRole: "Administrator"
      });
      setContent('');
      setImageUrl('');
      setImageInputOpen(false);
      onPostCreated?.();
    } catch(err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-4 mb-6 max-w-xl mx-auto w-full transition-all">
      <div className="flex space-x-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-inner">
          SA
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share an update or announcement..."
            className="w-full bg-transparent resize-none outline-none text-gray-800 placeholder:text-gray-400 pt-2 min-h-[60px]"
          />
          
          {imageInputOpen && (
            <div className="mt-2 text-sm">
              <input 
                type="text" 
                placeholder="Paste an image URL..." 
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>
          )}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
            <button 
              type="button" 
              onClick={() => setImageInputOpen(!imageInputOpen)}
              className={cn("p-2 rounded-full transition-colors", imageInputOpen ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:bg-gray-50")}
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            
            <Button 
              type="submit" 
              disabled={submitting || (!content.trim() && !imageUrl.trim())}
              className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 shadow-sm"
              size="sm"
            >
              {submitting ? 'Posting...' : 'Post'}
              {!submitting && <Send className="w-4 h-4 ml-2 -mr-1" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
