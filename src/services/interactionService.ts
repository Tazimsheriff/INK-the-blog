import { supabase } from '../lib/supabase';

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: Date;
}

export const interactionService = {
  // --- Comments ---
  async getComments(postId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('postId', postId)
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(comment => ({
      ...comment,
      createdAt: new Date(comment.createdAt)
    })) as Comment[];
  },

  async addComment(commentData: Omit<Comment, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('comments')
      .insert([commentData])
      .select()
      .single();
    
    if (error) throw error;
    return data.id;
  },

  async deleteComment(commentId: string) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);
    
    if (error) throw error;
  },

  // --- Likes ---
  async checkLike(postId: string, userId: string) {
    const { data, error } = await supabase
      .from('likes')
      .select('id')
      .eq('postId', postId)
      .eq('userId', userId)
      .maybeSingle();
    
    if (error) throw error;
    return !!data;
  },

  async toggleLike(postId: string, userId: string, isCurrentlyLiked: boolean) {
    if (isCurrentlyLiked) {
      // Unlike
      const { error: deleteError } = await supabase
        .from('likes')
        .delete()
        .eq('postId', postId)
        .eq('userId', userId);
      
      if (deleteError) throw deleteError;
      
      // Decrement likeCount
      const { data: post } = await supabase.from('posts').select('likeCount').eq('id', postId).single();
      await supabase.from('posts').update({ likeCount: (post?.likeCount || 0) - 1 }).eq('id', postId);
      
      return false;
    } else {
      // Like
      const { error: insertError } = await supabase
        .from('likes')
        .insert([{ postId, userId }]);
      
      if (insertError) throw insertError;
      
      // Increment likeCount
      const { data: post } = await supabase.from('posts').select('likeCount').eq('id', postId).single();
      await supabase.from('posts').update({ likeCount: (post?.likeCount || 0) + 1 }).eq('id', postId);
      
      return true;
    }
  }
};
