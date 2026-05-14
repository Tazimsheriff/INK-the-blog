import React, { useState, useEffect } from 'react';
import { interactionService, Comment } from '../services/interactionService';
import { useAppStore } from '../store/useAppStore';
import { toast } from 'react-hot-toast';
import { formatDate } from '../lib/utils';
import { MessageCircle, LogIn, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CommentSectionProps {
  postId: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { user, isAdmin } = useAppStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadComments() {
      try {
        const fetched = await interactionService.getComments(postId);
        setComments(fetched);
      } catch (error) {
        console.error("Error loading comments:", error);
      } finally {
        setLoading(false);
      }
    }
    loadComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Sign in to join the conversation');
      return;
    }
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const commentData = {
        postId,
        userId: user.id,
        userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Reader',
        userAvatar: user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=random`,
        content: commentText.trim()
      };
      
      const newId = await interactionService.addComment(commentData);
      
      const newComment: Comment = {
        id: newId,
        ...commentData,
        createdAt: new Date()
      };

      setComments([newComment, ...comments]);
      setCommentText('');
      toast.success('Your response has been published');
    } catch (error) {
      toast.error('Failed to publish comment');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await interactionService.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
      toast.success('Comment deleted');
    } catch (error) {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <section className="mt-32">
      <div className="flex items-center justify-between mb-12">
        <h3 className="font-serif text-3xl font-bold text-primary">
          Responses {loading ? '' : `(${comments.length})`}
        </h3>
        <button className="text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black">
          Newest First
        </button>
      </div>
      
      {user ? (
        <form onSubmit={handleSubmit} className="bg-white border border-black/5 rounded-2xl p-6 mb-12">
          <textarea 
            placeholder="What are your thoughts?"
            className="w-full bg-transparent border-none focus:ring-0 text-lg font-serif min-h-[100px] resize-none text-primary"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <div className="flex justify-end pt-4 mt-4 border-t border-black/5">
            <button 
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="bg-black text-white px-6 py-2 rounded-full font-bold uppercase tracking-widest text-[10px] disabled:opacity-30 font-sans"
            >
              {submitting ? 'Publishing...' : 'Publish Response'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-black/5 rounded-2xl p-12 mb-12 text-center">
          <MessageCircle size={32} className="mx-auto mb-4 text-black/20" />
          <h4 className="font-serif text-xl font-bold mb-2 italic">Join the conversation.</h4>
          <p className="text-black/40 text-sm mb-8">Sign in to share your thoughts on this story.</p>
          <button 
            onClick={() => navigate('/login')}
            className="inline-flex items-center space-x-2 bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-black/80 transition-all font-sans"
          >
            <LogIn size={14} />
            <span>Sign in to comment</span>
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-8 animate-pulse">
          {[1, 2].map(i => (
            <div key={i} className="flex space-x-4">
              <div className="w-10 h-10 rounded-full bg-black/5" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-black/5 rounded" />
                <div className="h-4 w-full bg-black/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-12">
          {comments.map(comment => (
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-black/5">
                        <img 
                          src={comment.userAvatar || `https://ui-avatars.com/api/?name=${comment.userName}&background=random`} 
                          alt={comment.userName} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <span className="block text-sm font-bold text-primary">{comment.userName}</span>
                        <span className="block text-[10px] text-black/40 tracking-widest uppercase font-bold">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    {(isAdmin || (user && user.id === comment.userId)) && (
                      <button 
                        onClick={() => handleDelete(comment.id)}
                        className="p-2 text-black/20 hover:text-red-500 transition-colors"
                        title="Delete comment"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <p className="text-primary/70 font-serif text-lg leading-relaxed mb-6">
                    {comment.content}
                  </p>
                </div>
          ))}
          
          {comments.length === 0 && (
            <p className="text-center text-black/30 font-serif italic py-12">
              No responses yet. Be the first to start the conversation.
            </p>
          )}
        </div>
      )}
    </section>
  );
};
