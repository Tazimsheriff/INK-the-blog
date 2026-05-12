import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Post } from '../types';
import { Navbar, Footer } from '../components/Navigation';
import { PostCard, Newsletter } from '../components/BlogComponents';
import { ArrowRight, TrendingUp, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Use mock data as fallback
      const mockPosts: Post[] = [
        {
          id: '5',
          title: 'Last smoke',
          slug: 'last-smoke',
          excerpt: 'She was just getting back from work, exhausted and tired. Walking down the street, her legs hurt and so did her head.',
          content: 'Full content here...',
          coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
          authorId: 'auth1',
          authorName: 'Mizat',
          category: 'Narrative',
          tags: ['story', 'urban'],
          status: 'published',
          viewCount: 3200,
          likeCount: 890,
          createdAt: new Date('2022-11-13'),
          updatedAt: new Date('2022-11-13'),
        },
        {
          id: '4',
          title: 'Peace amidst chaos',
          slug: 'peace-amidst-chaos',
          excerpt: 'Another post and another chance for me to express my thought on this thing called blog.I feel the effect of sleep acting on me like a sedat...',
          content: 'Full content here...',
          coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop',
          authorId: 'auth1',
          authorName: 'Mizat',
          category: 'Reflection',
          tags: ['peace', 'solitude'],
          status: 'published',
          viewCount: 850,
          likeCount: 210,
          createdAt: new Date('2022-11-12'),
          updatedAt: new Date('2022-11-12'),
        },
        {
          id: '1',
          title: 'Conflict',
          slug: 'conflict',
          excerpt: 'I have been addicted to this Japanese song called conflict .Sometimes I wonder if I am liking songs for what they truly hold true and show.',
          content: 'Full content here...',
          coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1974&auto=format&fit=crop',
          authorId: 'auth1',
          authorName: 'Mizat',
          category: 'Personal',
          tags: ['thoughts', 'reflection', 'life'],
          status: 'published',
          viewCount: 1200,
          likeCount: 450,
          createdAt: new Date('2022-11-11'),
          updatedAt: new Date('2022-11-11'),
        },
        {
          id: '2',
          title: 'It goes on',
          slug: 'it-goes-on',
          excerpt: 'The phones light keeps hitting my eyes right where it hurts .Ack my eyes ,I start having those thoughts of getting up early...',
          content: 'Full content here...',
          coverImage: 'https://i.ibb.co/zhJVGq1V/tazimfr.jpg',
          authorId: 'auth1',
          authorName: 'Mizat',
          category: 'Philosophy',
          tags: ['productivity', 'thoughts'],
          status: 'published',
          viewCount: 1500,
          likeCount: 300,
          createdAt: new Date('2022-11-11'),
          updatedAt: new Date('2022-11-11'),
        },
        {
          id: '3',
          title: 'Day 1',
          slug: 'day-1',
          excerpt: 'Its raining and I start to feel like the world has been separated again. The way we never get harmed by rains much when you have a roof...',
          content: 'Full content here...',
          coverImage: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1974&auto=format&fit=crop',
          authorId: 'auth1',
          authorName: 'Mizat',
          category: 'Reflection',
          tags: ['rain', 'solitude'],
          status: 'published',
          viewCount: 2200,
          likeCount: 560,
          createdAt: new Date('2022-11-11'),
          updatedAt: new Date('2022-11-11'),
        }
      ];

      try {
        const q = query(
          collection(db, 'posts'),
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc'),
          limit(6)
        );
        const snapshot = await getDocs(q);
        const posts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Post[];
        
        if (posts.length > 0) {
          setFeaturedPosts(posts);
          setTrendingPosts([...posts].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 3));
        } else {
          setFeaturedPosts(mockPosts);
          setTrendingPosts([...mockPosts].reverse());
        }
      } catch (err) {
        console.error("Error fetching landing data:", err);
        setFeaturedPosts(mockPosts);
        setTrendingPosts([...mockPosts].reverse());
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
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
              <span className="px-2 py-0.5 border border-[#F27D26]">Ink. Featured Selection</span>
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
                Ink & Insight is a community-driven publication. We're always looking for new voices to join our circle of writers.
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
