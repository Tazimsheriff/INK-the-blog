import React, { useState, useEffect } from 'react';
import { SEO } from '../components/SEO';
import { Navbar, Footer } from '../components/Navigation';
import { Newsletter } from '../components/BlogComponents';
import { Wallpaper } from '../types';
import { Download, ExternalLink, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { wallpaperService } from '../services/wallpaperService';

export default function WallpapersPage() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Minimal', 'Nature', 'Abstract', 'Industrial'];

  useEffect(() => {
    async function fetchWallpapers() {
      try {
        const fetched = await wallpaperService.getAllWallpapers();
        setWallpapers(fetched);
      } catch (err) {
        console.error("Error fetching wallpapers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWallpapers();
  }, []);

  const filteredWallpapers = wallpapers.filter(w => {
    const matchesSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || w.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Wallpapers" 
        description="A curated collection of minimalist wallpapers for your digital space."
        url="https://blog.tazimsheriff.dev/wallpapers"
      />
      
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-24 pb-32">
        <header className="mb-20">
          <div className="mb-8 flex items-center gap-2 text-[10px] uppercase font-black tracking-[0.3em] text-accent">
            <span className="editorial-tag border-accent/20">The Archive</span>
            <span className="text-black/20">/</span>
            <span className="text-black/40">Canvas</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tighter mb-12 text-primary">Wallpapers.</h1>
          
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between border-y border-black/5 py-8">
             <div className="relative w-full max-w-md">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black/30" size={18} />
                <input 
                  type="text" 
                  placeholder="Search wallpapers..."
                  className="w-full bg-white border border-black/5 rounded-full py-4 pl-14 pr-6 focus:outline-none focus:ring-1 focus:ring-accent transition-all text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>

             <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-full transition-all",
                      selectedCategory === cat ? "bg-black text-white" : "bg-black/5 text-black/40 hover:bg-black/10"
                    )}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>
        </header>

        <section>
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
               {[1, 2, 3, 4].map(i => (
                 <div key={i} className="animate-pulse">
                   <div className="bg-black/5 aspect-[4/5] rounded-3xl mb-4" />
                   <div className="h-4 bg-black/5 rounded w-1/4 mb-2" />
                   <div className="h-6 bg-black/5 rounded w-3/4" />
                 </div>
               ))}
             </div>
          ) : filteredWallpapers.length === 0 ? (
            <div className="text-center py-32">
               <h3 className="font-serif text-3xl italic text-black/20 mb-4">No artworks found.</h3>
               <button 
                 onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
                 className="text-xs font-bold uppercase tracking-widest underline underline-offset-8"
               >
                 View All Gallery
               </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredWallpapers.map((wallpaper, i) => (
                  <motion.div
                    layout
                    key={wallpaper.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="group relative"
                  >
                    <div className="aspect-[4/5] bg-black/5 rounded-3xl overflow-hidden mb-6 relative">
                      <img 
                        src={wallpaper.url || undefined} 
                        alt={wallpaper.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                         <a 
                            href={wallpaper.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary hover:bg-black hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
                         >
                            <ExternalLink size={20} />
                         </a>
                         <button 
                            onClick={() => window.open(wallpaper.url, '_blank')}
                            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary hover:bg-black hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                         >
                            <Download size={20} />
                         </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-accent mb-2 block">
                        {wallpaper.category}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-primary group-hover:underline transition-all">
                        {wallpaper.title}
                      </h3>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>

      <Newsletter />
      <Footer />
    </div>
  );
}
