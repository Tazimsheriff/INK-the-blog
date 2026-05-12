import React, { useEffect, useState } from 'react';
import { SEO } from '../components/SEO';
import { Post } from '../types';
import { Navbar, Footer } from '../components/Navigation';
import { PostCard, Newsletter } from '../components/BlogComponents';
import { ArrowRight, TrendingUp, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { postService } from '../services/postService';

export default function LandingPage() {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const posts = await postService.getPublishedPosts('All', 6);
        
        if (posts.length > 0) {
          setFeaturedPosts(posts);
          setTrendingPosts([...posts].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching landing data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <SEO />
      <Navbar />
      
      {/* Hero Section */}
      <header className="pt-24 pb-32 border-b border-black/10 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col"
          >
            <div className="mb-8 flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#F27D26]">
              <span className="px-2 py-0.5 border border-[#F27D26]">INK. Featured Selection</span>
              <span className="text-black/40">•</span>
              <span className="text-black/60">Issue #12 • Spring 2026</span>
            </div>
            
            <h1 className="font-serif text-[60px] md:text-[110px] leading-[0.9] tracking-tight font-black mb-12 max-w-5xl">
              The Invisible Architecture <br className="hidden md:block"/> of Digital Quietude.
            </h1>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-12 border-t border-black/5">
              <p className="text-xl md:text-2xl text-black/80 font-serif max-w-xl leading-relaxed italic">
                In an era of relentless algorithmic noise, the bravest design choice is silence. We examine the principles of subtractive UI.
              </p>
              <div className="flex items-center space-x-6">
                <Link to="/blog" className="px-10 py-5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-black/80 transition-all shadow-xl shadow-black/10">
                  Read Stories
                </Link>
                <Link to="/newsletter" className="text-[10px] font-bold uppercase tracking-widest text-black underline underline-offset-8 decoration-accent">
                  Join Newsletter
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Featured Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-16">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] border-b border-black pb-2">Must Read Today</h3>
          <Link to="/blog" className="group flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors">
            <span>The Archive</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        {loading ? (
          <div className="h-[400px] flex items-center justify-center italic text-black/40">Gathering stories...</div>
        ) : (
          <div className="space-y-0">
            {featuredPosts.map(post => (
              <PostCard key={post.id} post={post} variant="large" />
            ))}
          </div>
        )}
      </section>

      {/* Grid Highlights & Trending */}
      <section className="py-24 bg-[#f1f1f1]/30">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-24">
          <div className="lg:col-span-2">
             <div className="flex items-center space-x-4 mb-12">
              <BookOpen size={18} className="text-[#FF6321]" />
              <h2 className="font-semibold text-sm uppercase tracking-[0.3em]">Latest Reflections</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-12">
               {featuredPosts.slice(0, 4).map(post => (
                 <PostCard key={post.id} post={post} />
               ))}
            </div>
          </div>
          
          <aside>
            <div className="flex items-center space-x-4 mb-12">
              <TrendingUp size={18} className="text-[#FF6321]" />
              <h2 className="font-semibold text-sm uppercase tracking-[0.3em]">On the Rise</h2>
            </div>
            <div className="flex flex-col space-y-4">
              {trendingPosts.map(post => (
                <PostCard key={post.id} post={post} variant="minimal" />
              ))}
            </div>
            
            <div className="mt-16 bg-white p-10 rounded-2xl border border-black/5">
              <h3 className="font-serif text-2xl font-medium mb-4 italic">Write with us.</h3>
              <p className="text-black/60 text-sm mb-8 leading-relaxed">
                INK is a community-driven publication. We're always looking for new voices to join our circle of writers.
              </p>
              <button className="w-full py-4 border border-black font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all rounded-full">
                Apply as Author
              </button>
            </div>
          </aside>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </div>
  );
}
