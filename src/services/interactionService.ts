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
      .eq('post_id', postId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(comment => ({
      ...comment,
      postId: comment.post_id,
      userId: comment.user_id,
      userName: comment.user_name,
      userAvatar: comment.user_avatar,
      createdAt: new Date(comment.created_at)
    })) as Comment[];
  },

  async addComment(commentData: Omit<Comment, 'id' | 'createdAt'>) {
    const { data, error } = await supabase
      .from('comments')
      .insert([{
        post_id: commentData.postId,
        user_id: commentData.userId,
        user_name: commentData.userName,
        user_avatar: commentData.userAvatar,
        content: commentData.content
      }])
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
      .eq('post_id', postId)
      .eq('user_id', userId)
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
        .eq('post_id', postId)
        .eq('user_id', userId);
      
      if (deleteError) throw deleteError;
      
      // Decrement like_count
      const { data: post } = await supabase.from('posts').select('like_count').eq('id', postId).single();
      await supabase.from('posts').update({ like_count: Math.max(0, (post?.like_count || 0) - 1) }).eq('id', postId);
      
      return false;
    } else {
      // Like
      const { error: insertError } = await supabase
        .from('likes')
        .insert([{ post_id: postId, user_id: userId }]);
      
      if (insertError) throw insertError;
      
      // Increment like_count
      const { data: post } = await supabase.from('posts').select('like_count').eq('id', postId).single();
      await supabase.from('posts').update({ like_count: (post?.like_count || 0) + 1 }).eq('id', postId);
      
      return true;
    }
  }
};
