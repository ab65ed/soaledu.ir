'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogComment } from '@/services/api';
import { cn } from '@/utils/cn';
import { 
  ChatBubbleLeftIcon, 
  UserIcon, 
  CalendarIcon,
  ArrowUturnRightIcon,
  HeartIcon,
  FlagIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface CommentSectionProps {
  postId: string;
  comments?: BlogComment[];
  isLoading?: boolean;
  onSubmitComment?: (data: {
    postId: string;
    authorName: string;
    authorEmail: string;
    content: string;
    parentId?: string;
  }) => Promise<void>;
  onLikeComment?: (commentId: string) => void;
  onReportComment?: (commentId: string) => void;
}

interface CommentFormData {
  authorName: string;
  authorEmail: string;
  content: string;
}

const CommentForm: React.FC<{
  onSubmit: (data: CommentFormData) => void;
  isSubmitting?: boolean;
  placeholder?: string;
  buttonText?: string;
  parentId?: string;
  onCancel?: () => void;
}> = ({ 
  onSubmit, 
  isSubmitting, 
  placeholder = "نظر خود را بنویسید...",
  buttonText = "ارسال نظر",
  parentId,
  onCancel 
}) => {
  const [formData, setFormData] = useState<CommentFormData>({
    authorName: '',
    authorEmail: '',
    content: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.content.trim() && formData.authorName.trim() && formData.authorEmail.trim()) {
      onSubmit(formData);
      if (!parentId) {
        setFormData({ authorName: '', authorEmail: '', content: '' });
      }
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {/* Name and Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            نام
          </label>
          <input
            type="text"
            value={formData.authorName}
            onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
            className={cn(
              "w-full px-3 py-2 border border-gray-300 dark:border-gray-600",
              "rounded-lg bg-white dark:bg-gray-800",
              "text-gray-900 dark:text-white",
              "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "text-right"
            )}
            placeholder="نام شما"
            required
            dir="rtl"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            ایمیل
          </label>
          <input
            type="email"
            value={formData.authorEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, authorEmail: e.target.value }))}
            className={cn(
              "w-full px-3 py-2 border border-gray-300 dark:border-gray-600",
              "rounded-lg bg-white dark:bg-gray-800",
              "text-gray-900 dark:text-white",
              "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "text-left"
            )}
            placeholder="your@email.com"
            required
            dir="ltr"
          />
        </div>
      </div>

      {/* Comment Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          نظر
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          rows={4}
          className={cn(
            "w-full px-3 py-2 border border-gray-300 dark:border-gray-600",
            "rounded-lg bg-white dark:bg-gray-800",
            "text-gray-900 dark:text-white",
            "focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            "resize-vertical text-right"
          )}
          placeholder={placeholder}
          required
          dir="rtl"
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {parentId && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              انصراف
            </button>
          )}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !formData.content.trim() || !formData.authorName.trim() || !formData.authorEmail.trim()}
          className={cn(
            "px-6 py-2 rounded-lg text-sm font-medium transition-all",
            "bg-blue-600 text-white hover:bg-blue-700",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center gap-2"
          )}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              در حال ارسال...
            </>
          ) : (
            buttonText
          )}
        </button>
      </div>
    </motion.form>
  );
};

const CommentItem: React.FC<{
  comment: BlogComment;
  onReply: (parentId: string) => void;
  onLike?: (commentId: string) => void;
  onReport?: (commentId: string) => void;
  depth?: number;
}> = ({ comment, onReply, onLike, onReport, depth = 0 }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike?.(comment.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "border-r-2 border-gray-200 dark:border-gray-700 pr-4",
        depth > 0 && "mr-8"
      )}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              {comment.authorAvatar ? (
                <div className="w-10 h-10 relative overflow-hidden rounded-full">
                  <span>{comment.authorName.charAt(0)}</span>
                </div>
              ) : (
                <UserIcon className="w-5 h-5 text-white" />
              )}
            </div>
            
            {/* Author Info */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {comment.authorName}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <CalendarIcon className="w-3 h-3" />
                <span>{new Date(comment.createdAt).toLocaleDateString('fa-IR')}</span>
                {!comment.isApproved && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">
                    در انتظار تایید
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
            >
              {isLiked ? (
                <HeartSolidIcon className="w-4 h-4 text-red-500" />
              ) : (
                <HeartIcon className="w-4 h-4" />
              )}
              <span>پسندیدن</span>
            </button>
            
            {onReport && (
              <button
                onClick={() => onReport(comment.id)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-500 transition-colors"
              >
                <FlagIcon className="w-4 h-4" />
                <span>گزارش</span>
              </button>
            )}
          </div>
        </div>

        {/* Comment Content */}
        <div className="mb-3">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-right" dir="rtl">
            {comment.content}
          </p>
        </div>

        {/* Reply Button */}
        <button
          onClick={() => onReply(comment.id)}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowUturnRightIcon className="w-4 h-4" />
          <span>پاسخ</span>
        </button>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onLike={onLike}
              onReport={onReport}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  comments = [],
  isLoading,
  onSubmitComment,
  onLikeComment,
  onReportComment
}) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (data: CommentFormData) => {
    if (!onSubmitComment) return;
    
    setIsSubmitting(true);
    try {
      await onSubmitComment({
        postId,
        ...data,
        parentId: replyingTo || undefined
      });
      setReplyingTo(null);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = (parentId: string) => {
    setReplyingTo(replyingTo === parentId ? null : parentId);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <ChatBubbleLeftIcon className="w-6 h-6 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            نظرات
          </h3>
        </div>
        
        {/* Loading Skeletons */}
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
              <div className="space-y-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <ChatBubbleLeftIcon className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          نظرات ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
          نظر جدید
        </h4>
        <CommentForm
          onSubmit={handleSubmitComment}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <ChatBubbleLeftIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>هنوز نظری ثبت نشده است</p>
            <p className="text-sm mt-1">اولین نفری باشید که نظر می‌دهد!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                onReply={handleReply}
                onLike={onLikeComment}
                onReport={onReportComment}
              />
              
              {/* Reply Form */}
              <AnimatePresence>
                {replyingTo === comment.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 mr-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4"
                  >
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                      پاسخ به {comment.authorName}
                    </h5>
                    <CommentForm
                      onSubmit={handleSubmitComment}
                      isSubmitting={isSubmitting}
                      placeholder="پاسخ خود را بنویسید..."
                      buttonText="ارسال پاسخ"
                      parentId={comment.id}
                      onCancel={() => setReplyingTo(null)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection; 