import React, { useState, useEffect } from 'react';
import { SEO } from '../components/SEO';
import { Navbar, Footer } from '../components/Navigation';
import { PostCard, Newsletter } from '../components/BlogComponents';
import { Post } from '../types';
import { Search, Grid, List as ListIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { postService } from '../services/postService';

export default function BlogListingPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Lifestyle', 'Design', 'Technology', 'Science', 'Business'];

  useEffect(() => {
    async function fetchPosts() {
      try {
        const fetchedPosts = await postService.getPublishedPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Stories" 
        description="Explore a collection of stories on lifestyle, design, and technology."
        url="https://blog.tazimsheriff.dev/blog"
      />
      
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 pt-24 pb-32">
        <header className="mb-20">
          <div className="mb-8 flex items-center gap-2 text-[10px] uppercase font-black tracking-[0.3em] text-accent">
            <span className="editorial-tag border-accent/20">The Collection</span>
            <span className="text-black/20">/</span>
            <span className="text-black/40">Archive</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tighter mb-12 text-primary">All Stories.</h1>
          
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between border-y border-black/5 py-8">
             <div className="relative w-full max-w-md">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-black/30" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by title..."
                  className="w-full bg-white border border-black/5 rounded-full py-4 pl-14 pr-6 focus:outline-none focus:ring-1 focus:ring-accent transition-all text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>

             <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="flex bg-black/5 p-1 rounded-full border border-black/5">
                   <button 
                     onClick={() => setView('grid')}
                     className={cn(
                       "p-2 rounded-full transition-all",
                       view === 'grid' ? "bg-white shadow-sm text-primary" : "text-black/30 hover:text-black"
                     )}
                   >
                      <Grid size={18} />
                   </button>
                   <button 
                     onClick={() => setView('list')}
                     className={cn(
                       "p-2 rounded-full transition-all",
                       view === 'list' ? "bg-white shadow-sm text-primary" : "text-black/30 hover:text-black"
                     )}
                   >
                      <ListIcon size={18} />
                   </button>
                </div>
                
                <div className="h-6 w-px bg-black/10 hidden md:block" />

                <div className="flex flex-wrap gap-2">
                   {categories.map(cat => (
                     <button
                       key={cat}
                       onClick={() => setSelectedCategory(cat)}
                       className={cn(
                         "text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all",
                         selectedCategory === cat ? "bg-black text-white" : "bg-black/5 text-black/40 hover:bg-black/10"
                       )}
                     >
                       {cat}
                     </button>
                   ))}
                </div>
             </div>
          </div>
        </header>

        <section>
          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
               {[1, 2, 3].map(i => (
                 <div key={i} className="animate-pulse">
                   <div className="bg-black/5 aspect-video rounded-2xl mb-6" />
                   <div className="h-4 bg-black/5 rounded w-1/4 mb-4" />
                   <div className="h-8 bg-black/5 rounded w-3/4 mb-4" />
                   <div className="h-4 bg-black/5 rounded w-full" />
                 </div>
               ))}
             </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-32">
               <h3 className="font-serif text-3xl italic text-black/20 mb-4">No stories found.</h3>
               <button 
                 onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}
                 className="text-xs font-bold uppercase tracking-widest underline underline-offset-8"
               >
                 Clear all filters
               </button>
            </div>
          ) : (
            <div className={cn(
              "grid gap-x-12 gap-y-16",
              view === 'grid' ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post, i) => (
                  <motion.div
                    layout
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <PostCard post={post} variant={view === 'list' ? 'large' : 'small'} />
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
