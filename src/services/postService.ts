import { supabase } from '../lib/supabase';
import { Post } from '../types';

export const postService = {
  // --- Public Methods ---
  
  async getPublishedPosts(category?: string, maxLimit = 20) {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('createdAt', { ascending: false })
      .limit(maxLimit);
    
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(post => this.mapPost(post));
  },
  
  async getPostBySlug(slug: string) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    // Increment view count asynchronously
    this.incrementViews(data.id);
    
    return this.mapPost(data);
  },
  
  async incrementViews(postId: string) {
    const { error } = await supabase.rpc('increment_view_count', { post_id: postId });
    if (error) {
      // Fallback if RCP not defined yet
      const { data: post } = await supabase.from('posts').select('viewCount').eq('id', postId).single();
      await supabase.from('posts').update({ viewCount: (post?.viewCount || 0) + 1 }).eq('id', postId);
    }
  },

  async toggleLike(postId: string, amount: number) {
    const { data: post } = await supabase.from('posts').select('likeCount').eq('id', postId).single();
    await supabase.from('posts').update({ likeCount: (post?.likeCount || 0) + amount }).eq('id', postId);
  },

  // --- Admin Methods ---

  async getAllPostsAdmin() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(post => this.mapPost(post));
  },

  async createPost(postData: Partial<Post>) {
    const { data, error } = await supabase
      .from('posts')
      .insert([{
        ...postData,
        viewCount: 0,
        likeCount: 0,
        status: postData.status || 'draft'
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data.id;
  },

  async updatePost(postId: string, postData: Partial<Post>) {
    const { error } = await supabase
      .from('posts')
      .update({
        ...postData,
        updatedAt: new Date().toISOString()
      })
      .eq('id', postId);
    
    if (error) throw error;
  },

  async deletePost(postId: string) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);
    
    if (error) throw error;
  },

  // --- Helpers ---
  
  mapPost(data: any): Post {
    return {
      ...data,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
    } as Post;
  }
};
