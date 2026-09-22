import React, { useState } from 'react';
import { Heart, MessageCircle, Send, MoreHorizontal, Bookmark, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from '@/lib/utils';
import { PostItem } from '@/lib/api';
import { cn } from '@/lib/utils';

interface PostCardProps {
  post: PostItem;
  className?: string;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export function PostCard({ post, className, isAdmin, onDelete }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <div className={cn("bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden mb-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
            {post.authorAvatar || post.authorName.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {post.authorName}
            </p>
            <div className="flex items-center text-xs text-gray-500 space-x-1">
              <span>{post.authorRole}</span>
              <span>•</span>
              <span suppressHydrationWarning>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {isAdmin && (
            <button 
              onClick={() => onDelete?.(post.id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-2"
              title="Delete post"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
          <button className="text-gray-400 hover:text-gray-600 transition-colors p-2">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Image if available */}
      {post.imageUrl && (
        <div className="w-full bg-gray-50">
          <img 
            src={post.imageUrl} 
            alt="Post content" 
            className="w-full h-auto object-contain"
            loading="lazy"
          />
        </div>
      )}

      {/* Actions */}
      <div className="p-4 pb-2">
        <div className="flex justify-between items-center mb-3">
          <div className="flex space-x-4">
            <button 
              onClick={handleLike}
              className={cn(
                "transition-all hover:scale-110 active:scale-95",
                liked ? "text-red-500" : "text-gray-700 hover:text-gray-900"
              )}
            >
              <Heart className="w-6 h-6" fill={liked ? "currentColor" : "none"} strokeWidth={liked ? 0 : 1.5} />
            </button>
            <button className="text-gray-700 hover:text-gray-900 transition-all hover:scale-110 active:scale-95">
              <MessageCircle className="w-6 h-6" strokeWidth={1.5} />
            </button>
            <button className="text-gray-700 hover:text-gray-900 transition-all hover:scale-110 active:scale-95">
              <Send className="w-6 h-6" strokeWidth={1.5} />
            </button>
          </div>
          <button className="text-gray-700 hover:text-gray-900 transition-all hover:scale-110 active:scale-95">
            <Bookmark className="w-6 h-6" strokeWidth={1.5} />
          </button>
        </div>

        {/* Likes Count */}
        <p className="font-semibold text-sm text-gray-900 mb-2">
          {likesCount.toLocaleString()} {likesCount === 1 ? 'like' : 'likes'}
        </p>

        {/* Caption */}
        <div className="text-sm font-normal text-gray-800 leading-relaxed break-words whitespace-pre-wrap">
          <span className="font-semibold mr-2">{post.authorName}</span>
          {post.content}
        </div>

        {/* Comments Hint */}
        {(post.comments || 0) > 0 && (
          <button className="text-sm text-gray-500 mt-2 block hover:underline">
            View all {post.comments} comments
          </button>
        )}
      </div>
    </div>
  );
}
