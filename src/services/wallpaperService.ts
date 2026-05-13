import { supabase } from '../lib/supabase';
import { Wallpaper } from '../types';

export const wallpaperService = {
  async getAllWallpapers() {
    const { data, error } = await supabase
      .from('wallpapers')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(w => this.mapWallpaper(w));
  },

  async uploadWallpaper(wallpaper: Partial<Wallpaper>) {
    const { data, error } = await supabase
      .from('wallpapers')
      .insert([this.toDBWallpaper(wallpaper)])
      .select()
      .single();
    
    if (error) throw error;
    return this.mapWallpaper(data);
  },

  async deleteWallpaper(id: string) {
    const { error } = await supabase
      .from('wallpapers')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  mapWallpaper(data: any): Wallpaper {
    return {
      id: data.id,
      title: data.title,
      url: data.url,
      thumbnailUrl: data.thumbnail_url,
      category: data.category,
      authorId: data.author_id,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
    };
  },

  toDBWallpaper(data: any) {
    return {
      title: data.title,
      url: data.url,
      thumbnail_url: data.thumbnailUrl,
      category: data.category,
      author_id: data.authorId,
    };
  }
};
