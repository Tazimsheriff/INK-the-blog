import { supabase } from '../lib/supabase';
import { Post } from '../types';

export const postService = {
  // --- Public Methods ---
  
  async getPublishedPosts(category?: string, maxLimit = 20) {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
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
      const { data: post } = await supabase.from('posts').select('view_count').eq('id', postId).single();
      await supabase.from('posts').update({ view_count: (post?.view_count || 0) + 1 }).eq('id', postId);
    }
  },

  async toggleLike(postId: string, amount: number) {
    const { data: post } = await supabase.from('posts').select('like_count').eq('id', postId).single();
    await supabase.from('posts').update({ like_count: (post?.like_count || 0) + amount }).eq('id', postId);
  },

  // --- Admin Methods ---

  async getAllPostsAdmin() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(post => this.mapPost(post));
  },

  async createPost(postData: Partial<Post>) {
    const { data, error } = await supabase
      .from('posts')
      .insert([this.toDBPost(postData)])
      .select()
      .single();
    
    if (error) throw error;
    return data.id;
  },

  async updatePost(postId: string, postData: Partial<Post>) {
    const { error } = await supabase
      .from('posts')
      .update(this.toDBPost(postData))
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
      id: data.id,
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      coverImage: data.cover_image,
      authorId: data.author_id,
      authorName: data.author_name,
      category: data.category,
      tags: data.tags || [],
      status: data.status,
      viewCount: data.view_count || 0,
      likeCount: data.like_count || 0,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
      updatedAt: data.updated_at ? new Date(data.updated_at) : new Date(),
      publishedAt: data.published_at ? new Date(data.published_at) : undefined,
    } as Post;
  },

  toDBPost(post: Partial<Post>) {
    const dbPost: any = {};
    if (post.title !== undefined) dbPost.title = post.title;
    if (post.slug !== undefined) dbPost.slug = post.slug;
    if (post.content !== undefined) dbPost.content = post.content;
    if (post.excerpt !== undefined) dbPost.excerpt = post.excerpt;
    if (post.coverImage !== undefined) dbPost.cover_image = post.coverImage;
    if (post.authorId !== undefined) dbPost.author_id = post.authorId;
    if (post.authorName !== undefined) dbPost.author_name = post.authorName;
    if (post.category !== undefined) dbPost.category = post.category;
    if (post.tags !== undefined) dbPost.tags = post.tags;
    if (post.status !== undefined) dbPost.status = post.status;
    if (post.viewCount !== undefined) dbPost.view_count = post.viewCount;
    if (post.likeCount !== undefined) dbPost.like_count = post.likeCount;
    
    if (post.publishedAt) {
      dbPost.published_at = typeof post.publishedAt === 'string' 
        ? post.publishedAt 
        : post.publishedAt.toISOString();
    }
    
    dbPost.updated_at = new Date().toISOString();
    
    return dbPost;
  }
};
