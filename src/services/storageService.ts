import { supabase } from '../lib/supabase';

export const storageService = {
  async uploadImage(file: File, folder: 'posts' | 'wallpapers' = 'posts'): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) {
      if (uploadError.message.includes('bucket not found')) {
        throw new Error('Supabase storage bucket "media" not found. Please create a public bucket named "media" in your Supabase project.');
      }
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    return publicUrl;
  }
};
