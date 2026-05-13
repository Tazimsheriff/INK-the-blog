import React, { useState, useEffect } from 'react';
import { wallpaperService } from '../services/wallpaperService';
import { Wallpaper } from '../types';
import { toast } from 'react-hot-toast';
import { Plus, X, Image as ImageIcon, Trash2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAppStore } from '../store/useAppStore';

export const WallpaperManager = () => {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWallpaper, setNewWallpaper] = useState({
    title: '',
    url: '',
    category: 'Minimal'
  });
  const { user } = useAppStore();

  const loadWallpapers = async () => {
    try {
      setLoading(true);
      const data = await wallpaperService.getAllWallpapers();
      setWallpapers(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load wallpapers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallpapers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWallpaper.title || !newWallpaper.url) return;

    try {
      toast.loading('Saving wallpaper...', { id: 'save-wallpaper' });
      await wallpaperService.uploadWallpaper({
        ...newWallpaper,
        authorId: user?.id,
        createdAt: new Date().toISOString()
      });
      toast.success('Wallpaper added!', { id: 'save-wallpaper' });
      setShowAddForm(false);
      setNewWallpaper({ title: '', url: '', category: 'Minimal' });
      loadWallpapers();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add wallpaper', { id: 'save-wallpaper' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this wallpaper?')) return;
    try {
      await wallpaperService.deleteWallpaper(id);
      toast.success('Deleted');
      setWallpapers(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-3xl font-black mb-2">Wallpapers</h2>
          <p className="text-black/40 text-xs font-bold uppercase tracking-widest">Manage your digital collection</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-all flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add New</span>
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-white/80 backdrop-blur-sm"
          >
            <div className="bg-white w-full max-w-lg p-10 border border-black/5 shadow-2xl rounded-3xl relative">
              <button 
                onClick={() => setShowAddForm(false)}
                className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <h3 className="font-serif text-2xl font-bold mb-8 text-center">New Wallpaper</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 mb-2">Title</label>
                  <input 
                    type="text"
                    required
                    value={newWallpaper.title}
                    onChange={e => setNewWallpaper(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="E.g., Nordic Morning"
                    className="w-full bg-black/[0.02] border-none rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 mb-2">Image URL</label>
                  <input 
                    type="url"
                    required
                    value={newWallpaper.url}
                    onChange={e => setNewWallpaper(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-black/[0.02] border-none rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-black transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-black/40 mb-2">Category</label>
                  <select 
                    value={newWallpaper.category}
                    onChange={e => setNewWallpaper(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-black/[0.02] border-none rounded-2xl px-6 py-4 text-sm focus:ring-1 focus:ring-black transition-all appearance-none"
                  >
                    <option>Minimal</option>
                    <option>Nature</option>
                    <option>Abstract</option>
                    <option>Industrial</option>
                  </select>
                </div>

                <div className="pt-4">
                   <button 
                    type="submit"
                    className="w-full bg-black text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-all"
                  >
                    Save Wallpaper
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="aspect-[4/5] bg-black/5 rounded-3xl animate-pulse" />
          ))
        ) : wallpapers.length === 0 ? (
          <div className="col-span-full py-20 text-center italic text-black/20">
            No wallpapers in your collection yet.
          </div>
        ) : wallpapers.map((w, i) => (
          <motion.div 
            key={w.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group relative bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
          >
            <div className="aspect-[4/5] overflow-hidden bg-black/5">
              <img 
                src={w.url} 
                alt={w.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3">
                 <a 
                  href={w.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-white rounded-full text-black hover:bg-black hover:text-white transition-all transform title-up"
                >
                   <ExternalLink size={18} />
                 </a>
                 <button 
                  onClick={() => handleDelete(w.id)}
                  className="p-3 bg-white rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all transform title-up"
                >
                   <Trash2 size={18} />
                 </button>
              </div>
            </div>
            <div className="p-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-1 block">
                {w.category || 'Uncategorized'}
              </span>
              <h4 className="font-serif text-lg font-bold truncate">{w.title}</h4>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
