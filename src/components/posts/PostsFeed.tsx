import React, { useEffect, useState } from 'react';
import { getPosts, PostItem, createPost, uploadPostImage, deletePost } from '@/lib/api';
import { PostCard } from './PostCard';
import { Send, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from "@/context/AuthContext";

export function PostsFeed({ className }: { className?: string }) {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

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

  // Called by CreatePostWidget after a post is saved — prepend optimistically
  const handlePostCreated = (newPost: PostItem) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostDeleted = async (id: string) => {
    // Optimistic delete
    setPosts(prev => prev.filter(p => p.id !== id));
    try {
      await deletePost(id);
    } catch (e) {
      console.error("Failed to delete post", e);
      // Revert if needed (simplified here)
    }
  };

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
      {isAdmin && <CreatePostWidget onPostCreated={handlePostCreated} />}
      {posts.map(post => (
        <PostCard 
          key={post.id} 
          post={post} 
          isAdmin={isAdmin}
          onDelete={handlePostDeleted}
        />
      ))}
      <div className="py-8 text-center text-sm text-gray-400 font-medium">
        You are all caught up!
      </div>
    </div>
  );
}


export function CreatePostWidget({ onPostCreated }: { onPostCreated?: (post: PostItem) => void }) {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    // Show a local base64 preview instantly — upload happens on submit
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !imageFile) return;

    setSubmitting(true);
    try {
      // Upload image to Supabase Storage first to get a persistent public URL
      let finalImageUrl: string | undefined;
      if (imageFile) {
        setUploading(true);
        finalImageUrl = await uploadPostImage(imageFile);
        setUploading(false);
      }

      const newPost = await createPost({
        content,
        imageUrl: finalImageUrl,
        authorName: "System Admin",
        authorRole: "Administrator"
      });
      setContent('');
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onPostCreated?.(newPost);
    } catch(err) {
      console.error(err);
      setUploading(false);
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

          {/* Image preview */}
          {imagePreview && (
            <div className="mt-2 relative w-full rounded-2xl overflow-hidden border border-gray-100">
              <img src={imagePreview} alt="Preview" className="w-full max-h-56 object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>
          )}

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload image"
              className={cn("p-2 rounded-full transition-colors", imagePreview ? "bg-indigo-50 text-indigo-600" : "text-gray-400 hover:bg-gray-50")}
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            
            <Button 
              type="submit" 
              disabled={submitting || (!content.trim() && !imageFile)}
              className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 shadow-sm"
              size="sm"
            >
              {uploading ? 'Uploading…' : submitting ? 'Posting…' : 'Post'}
              {!submitting && <Send className="w-4 h-4 ml-2 -mr-1" />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
