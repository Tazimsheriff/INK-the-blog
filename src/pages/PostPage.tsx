import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Post } from '../types';
import { Navbar, Footer } from '../components/Navigation';
import { formatDate, estimateReadTime } from '../lib/utils';
import { motion, useScroll, useSpring } from 'motion/react';
import { Heart, MessageCircle, Share2, Bookmark, Twitter, Linkedin, Link as LinkIcon, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';
import { interactionService } from '../services/interactionService';
import { CommentSection } from '../components/CommentSection';
import { useAppStore } from '../store/useAppStore';
import { postService } from '../services/postService';
import { SEO } from '../components/SEO';

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAppStore();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      
      try {
        const fetchedPost = await postService.getPostBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
          
          // Check if current user liked this post
          if (user) {
            const hasLiked = await interactionService.checkLike(fetchedPost.id, user.id);
            setLiked(hasLiked);
          }
        }
      } catch (err) {
        console.error("Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug, user]);

  const handleLike = async () => {
    if (!user) {
      toast.error('Sign in to like this story');
      return;
    }
    if (!post) return;

    try {
      const newLikeStatus = await interactionService.toggleLike(post.id, user.id, liked);
      setLiked(newLikeStatus);
      if (newLikeStatus) {
        toast.success('Added to your favorite stories');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleBookmark = () => {
    if (!user) {
      toast.error('Sign in to save stories');
      return;
    }
    setBookmarked(!bookmarked);
    if (!bookmarked) {
      toast.success('Saved to your reading list');
    }
  };

  const shareOnTwitter = () => {
    const url = window.location.href;
    const text = post ? `${post.title} | INK.` : 'Check out this story on INK.';
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = window.location.href;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-serif italic text-black/40">
      Transcribing thoughts...
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex items-center justify-center font-serif text-2xl">
      Thought not found.
    </div>
  );

  return (
    <div className="min-h-screen">
      <SEO 
        title={post.title} 
        description={post.excerpt} 
        image={post.coverImage} 
        url={window.location.href}
        type="article"
      />
      
      <Navbar />
      
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-[64px] left-0 right-0 h-1 bg-accent origin-left z-[51]"
        style={{ scaleX }}
      />

      <article className="pt-20 pb-32">
        {/* Header Section */}
        <header className="max-w-5xl mx-auto px-4 mb-20">
          <div className="mb-10 flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-accent">
            <span className="editorial-tag">Featured Reflection</span>
            <span className="text-black/40">•</span>
            <span className="text-black/60">{post.category} • {estimateReadTime(post.content)} min read</span>
          </div>
          
          <h1 className="text-5xl md:text-[84px] font-serif font-black mb-12 leading-[0.9] tracking-tight">
            {post.title}
          </h1>

          <p className="text-2xl md:text-3xl text-black/60 font-serif mb-16 leading-relaxed italic">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between py-8 border-t border-black/5">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-black/5 bg-[#E5E7EB]">
                <img src={`https://ui-avatars.com/api/?name=${post.authorName}&background=random`} alt={post.authorName} />
              </div>
              <div className="text-sm">
                <span className="block font-bold text-primary">{post.authorName}</span>
                <span className="block text-black/40 uppercase tracking-widest text-[10px] font-bold">{formatDate(post.createdAt)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
               <button 
                 onClick={copyLink}
                 className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center text-black/40 hover:text-black transition-colors"
                 title="Copy Link"
               >
                  <Share2 size={18} />
               </button>
               <button 
                 onClick={handleBookmark}
                 className={cn(
                   "w-10 h-10 rounded-full border border-black/5 flex items-center justify-center transition-all",
                   bookmarked ? "bg-black text-white border-black" : "text-black/40 hover:text-black"
                 )}
                 title={bookmarked ? "Saved" : "Save story"}
               >
                  <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
               </button>
            </div>
          </div>
        </header>

        {/* Hero Image */}
        <div className="max-w-6xl mx-auto px-4 mb-20">
          <div className="aspect-[21/9] overflow-hidden rounded-3xl bg-gray-100 shadow-2xl shadow-black/5">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-20">
          {/* Sticky Sidebar (Left) */}
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-32 flex flex-col items-center space-y-12">
              <div className="text-center space-y-2">
                 <button 
                   onClick={handleLike}
                   className={cn(
                     "w-16 h-16 rounded-full border border-black/5 flex items-center justify-center group transition-all",
                     liked ? "bg-red-50 border-red-100" : "hover:bg-red-50 hover:border-red-100"
                   )}
                 >
                    <Heart 
                      size={24} 
                      className={cn("transition-colors", liked ? "text-red-500" : "text-black/40 group-hover:text-red-500")}
                      fill={liked ? "currentColor" : "none"}
                    />
                 </button>
                 <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{post.likeCount + (liked ? 0 : 0)}</span>
              </div>

              <div className="text-center space-y-2 cursor-pointer" onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}>
                 <button className="w-16 h-16 rounded-full border border-black/5 flex items-center justify-center hover:bg-blue-50 hover:border-blue-100 group transition-all">
                    <MessageCircle size={24} className="text-black/40 group-hover:text-blue-500 transition-colors" />
                 </button>
                 <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Responses</span>
              </div>

              <div className="pt-12 flex flex-col space-y-6">
                <button onClick={copyLink} className="p-2 text-black/40 hover:text-black transition-colors" title="Copy Link"><LinkIcon size={20}/></button>
                <button onClick={shareOnTwitter} className="p-2 text-black/40 hover:text-[#1DA1F2] transition-colors" title="Share on Twitter"><Twitter size={20}/></button>
                <button onClick={shareOnLinkedIn} className="p-2 text-black/40 hover:text-[#0077B5] transition-colors" title="Share on LinkedIn"><Linkedin size={20}/></button>
              </div>
            </div>
          </aside>

          {/* Body Text */}
          <div className="lg:col-span-7 lg:col-start-4">
             <div 
               className="typography-post"
               dangerouslySetInnerHTML={{ __html: post.content }}
             />

             {/* Tags and Engagement */}
             <div className="mt-20 pt-12 border-t border-black/5">
                <div className="flex flex-wrap gap-3 mb-12">
                  {post.tags.map(tag => (
                    <span key={tag} className="px-4 py-2 bg-black/5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black/10 cursor-pointer transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="bg-black/5 p-10 rounded-2xl flex flex-col md:flex-row items-center justify-between">
                   <div className="text-center md:text-left mb-8 md:mb-0">
                      <h4 className="font-serif text-2xl font-bold mb-2 italic text-primary">Enjoyed this story?</h4>
                      <p className="text-primary/60 text-sm">Follow {post.authorName} for more reflections.</p>
                   </div>
                   <button 
                    onClick={() => toast.success(`Now following ${post.authorName}`)}
                    className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-black/80 transition-all font-sans"
                   >
                      Follow Author
                   </button>
                </div>
             </div>

             {/* Comments Section */}
             <div id="comments-section">
                <CommentSection postId={post.id} />
             </div>
          </div>
        </div>
      </article>

      {/* Suggested Reading */}
      <aside className="bg-[#f1f1f1]/30 py-32 border-t border-black/5">
         <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-16">
               <h3 className="font-serif text-3xl font-medium">Continue reading from INK</h3>
               <Link to="/blog" className="flex items-center space-x-2 text-sm font-bold uppercase tracking-widest group">
                  <span>Explore archive</span>
                  <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
               </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-12">
               {/* Pre-populated with 3 small versions */}
               {[1, 2, 3].map(i => (
                  <div key={i} className="flex flex-col">
                     <div className="aspect-video bg-gray-200 rounded-xl mb-6" />
                     <h4 className="font-serif text-xl font-medium mb-2 group-hover:text-orange-500 transition-colors">The Future of Creative Computing and Emotional Intelligence</h4>
                     <span className="text-xs text-black/40 uppercase tracking-widest">Marcus Stone</span>
                  </div>
               ))}
            </div>
         </div>
      </aside>

      <Footer />
    </div>
  );
}
