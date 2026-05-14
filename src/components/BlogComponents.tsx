import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';
import { formatDate, estimateReadTime, extractFirstImage } from '../lib/utils';
import { Clock, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';

interface PostCardProps {
  post: Post;
  variant?: 'large' | 'small' | 'minimal';
}

export function PostCard({ post, variant = 'small' }: PostCardProps) {
  if (variant === 'large') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative grid md:grid-cols-2 gap-8 items-center py-12 border-b border-black/5"
      >
        <Link to={`/blog/${post.slug}`} className="relative h-[400px] overflow-hidden bg-gray-100 rounded-2xl">
          <img 
            src={post.coverImage || extractFirstImage(post.content) || '/placeholder.jpg'} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>
        <div className="flex flex-col justify-center">
          <div className="mb-6 flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#F27D26]">
            <span className="px-2 py-0.5 border border-[#F27D26]">Featured Selection</span>
            <span className="text-black/40">•</span>
            <span className="text-black/60">{post.category}</span>
          </div>
          <Link to={`/blog/${post.slug}`} className="group-hover:opacity-70 transition-opacity">
            <h2 className="font-serif text-5xl lg:text-7xl font-black mb-6 leading-[0.95] tracking-tight">{post.title}</h2>
          </Link>
          <p className="text-black/60 font-serif text-xl mb-8 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#E5E7EB] border border-black/5 overflow-hidden">
              <img src={`https://ui-avatars.com/api/?name=${post.authorName}&background=random`} alt={post.authorName} />
            </div>
            <div className="text-sm">
              <p className="font-bold">{post.authorName}</p>
              <p className="text-black/40">{formatDate(post.createdAt)} • {estimateReadTime(post.content)} min read</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'minimal') {
    return (
      <Link to={`/blog/${post.slug}`} className="group flex items-start space-x-6 py-4 border-b border-black/5 last:border-0">
        <span className="text-3xl font-serif italic text-black/10 font-bold leading-none group-hover:text-black/20 transition-colors">
          {post.id.slice(-2)}
        </span>
        <div>
          <h4 className="text-sm font-bold leading-tight mb-1 group-hover:underline transition-all">{post.title}</h4>
          <p className="text-[10px] text-black/40 uppercase font-bold tracking-[0.15em]">{estimateReadTime(post.content)} min read • {post.category}</p>
        </div>
      </Link>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col pt-6 pb-12 border-b border-black/5"
    >
      <Link to={`/blog/${post.slug}`} className="relative h-64 overflow-hidden bg-gray-100 rounded-xl mb-6">
        <img 
          src={post.coverImage || extractFirstImage(post.content) || '/placeholder.jpg'} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>
      <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 mb-3">
        <span>{post.category}</span>
        <span>•</span>
        <span>{estimateReadTime(post.content)} min read</span>
      </div>
      <Link to={`/blog/${post.slug}`} className="group-hover:opacity-70 transition-opacity">
        <h3 className="font-serif text-2xl font-black mb-4 leading-tight text-primary">{post.title}</h3>
      </Link>
      <p className="text-black/60 font-serif text-base mb-6 line-clamp-2 leading-relaxed">
        {post.excerpt}
      </p>
      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="text-xs text-black/40">{formatDate(post.createdAt)}</span>
        <div className="flex items-center space-x-4 text-black/40">
          <div className="flex items-center space-x-1">
            <Heart size={14} />
            <span className="text-[10px] font-bold tracking-widest">{post.likeCount}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle size={14} />
            <span className="text-[10px] font-bold tracking-widest">12</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Newsletter() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = (e.target as any).querySelector('input').value;
    if (email) {
      toast.success(`Welcome to The Sunday Edit, ${email.split('@')[0]}!`);
      (e.target as any).reset();
    }
  };

  return (
    <section className="py-24 bg-[#F5F2ED] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h3 className="font-serif text-4xl font-bold mb-4 leading-tight text-primary">The Sunday Edit</h3>
        <p className="text-lg text-primary/60 font-serif mb-10 max-w-xl mx-auto">
          Curated insights on design, culture, and the art of slowing down. Delivered weekly to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
          <input 
            type="email" 
            placeholder="your@email.com"
            className="w-full px-6 py-4 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black"
            required
          />
          <button 
            type="submit"
            className="w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-black/80 transition-all font-sans"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
