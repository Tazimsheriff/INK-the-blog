import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { supabase } from '../lib/supabase';
import { 
  LayoutDashboard, FileText, Image as ImageIcon, MessageSquare, 
  Settings, TrendingUp, Users, LogOut, ChevronRight, Plus, 
  Search, Bell, MoreVertical, ExternalLink, PenTool, Trash2
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatDate, slugify, extractFirstImage } from '../lib/utils';
import { BlogEditor } from './BlogEditor';
import { WallpaperManager } from './WallpaperManager';
import { postService } from '../services/postService';
import { Post } from '../types';
import { toast } from 'react-hot-toast';
import { DownloadCloud } from 'lucide-react';

// --- Dashboard Sub-Pages ---

const Overview = () => {
  const navigate = useNavigate();
  const stats = [
    { label: 'Total Views', value: '45.2k', change: '+12%', icon: (props: any) => <TrendingUp {...props} /> },
    { label: 'Active Readers', value: '2.8k', change: '+5%', icon: (props: any) => <Users {...props} /> },
    { label: 'Published Stories', value: '142', change: '+2', icon: (props: any) => <FileText {...props} /> },
    { label: 'Avg. Engagement', value: '8.4%', change: '-1%', icon: (props: any) => <TrendingUp {...props} /> },
  ];

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 border border-black/5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-black/5 rounded-full text-black/40">
                {stat.icon({ size: 24 })}
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest px-2 py-1",
                stat.change.startsWith('+') ? "text-green-600" : "text-red-600"
              )}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-4xl font-serif font-black mb-1 text-primary">{stat.value}</h3>
            <p className="text-black/40 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-black/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-xl font-medium">Monthly Performance</h3>
            <select className="bg-black/5 border-none rounded-full text-xs font-bold uppercase tracking-widest px-4 py-2">
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
            </select>
          </div>
          <div className="aspect-[2/1] bg-black/[0.02] rounded-2xl flex items-center justify-center italic text-black/20">
             Analytics Visualization (Coming Soon)
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-black/5">
           <h3 className="font-serif text-xl font-medium mb-8">Recent Comments</h3>
           <div className="space-y-6 text-sm">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex space-x-4 border-b border-black/5 pb-6 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-black/5 flex-shrink-0" />
                  <div>
                    <span className="block font-semibold mb-1">Marcus Stone</span>
                    <p className="text-black/60 line-clamp-2 leading-relaxed">Loved the deep dive into minimalist living. Definitely changing my digital habits...</p>
                    <span className="text-[10px] text-black/20 font-bold uppercase tracking-widest mt-2 block">Post: Art of Slow Living</span>
                  </div>
                </div>
              ))}
           </div>
           <button 
             onClick={() => navigate('/admin/comments')}
             className="w-full mt-8 py-3 bg-black/5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black/10 transition-colors"
           >
              Manage All
           </button>
        </div>
      </div>
    </div>
  );
};

const AllPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [repairing, setRepairing] = useState(false);
  const [bloggerUrl, setBloggerUrl] = useState('https://mizatblogger.blogspot.com/');
  const { user } = useAppStore();

  const loadPosts = async () => {
    try {
      setLoading(true);
      const fetched = await postService.getAllPostsAdmin();
      setPosts(fetched);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const repairThumbnails = async () => {
    setRepairing(true);
    const toastId = toast.loading('Scanning thoughts for missing images...');
    let fixedCount = 0;

    try {
      const postsToProcess = posts.filter(p => !p.coverImage || p.coverImage.trim() === '');
      
      if (postsToProcess.length === 0) {
         toast.success('All thoughts already have thumbnails!', { id: toastId });
         return;
      }

      for (const post of postsToProcess) {
        const imgMatch = post.content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch && imgMatch[1]) {
          await postService.updatePost(post.id, { coverImage: imgMatch[1] });
          fixedCount++;
        }
      }

      toast.success(`Recovered ${fixedCount} thumbnails!`, { id: toastId });
      if (fixedCount > 0) await loadPosts();
    } catch (err) {
      console.error('Repair failed:', err);
      toast.error('Thumbnail recovery failed', { id: toastId });
    } finally {
      setRepairing(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const importFromBlogger = async () => {
    if (!bloggerUrl) {
      toast.error('Please enter a Blogger URL');
      return;
    }

    setImporting(true);
    const toastId = toast.loading('Connecting to Blogger...');

    try {
      const proxyUrl = `/api/proxy/blogger?url=${encodeURIComponent(bloggerUrl)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch (Status: ${response.status})`);
      }
      
      const data = await response.json();
      const entries = data.feed?.entry || [];

      if (entries.length === 0) {
        toast.error('No posts found at this URL. Make sure it is a public Blogger blog.', { id: toastId });
        return;
      }

      toast.loading(`Found ${entries.length} posts. Importing into your inventory...`, { id: toastId });

      // Get latest posts to ensure we don't duplicate
      const currentPosts = await postService.getAllPostsAdmin();
      
      let importedCount = 0;
      for (const entry of entries) {
        const title = entry.title.$t;
        const slug = slugify(title);
        
        // Check if post already exists
        const isExisting = currentPosts.some(p => p.slug === slug);
        if (isExisting) continue;

        const content = entry.content.$t;
        const excerpt = content.replace(/<[^>]*>/g, '').slice(0, 160) + '...';
        const authorName = user?.user_metadata?.full_name || user?.email || 'Mizat';
        
        // Extract category if available
        const bloggerCategories = entry.category?.map((c: any) => c.term) || [];
        const category = bloggerCategories[0] || 'Lifestyle';
        
        // Try to extract an image from the content if Blogger doesn't provide a thumbnail link
        let coverImage = '';
        const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch && imgMatch[1]) {
          coverImage = imgMatch[1];
        }

        try {
          await postService.createPost({
            title,
            slug,
            excerpt,
            content,
            category,
            coverImage, // Now extracting image
            authorId: user?.id,
            authorName,
            status: 'published',
            publishedAt: entry.published.$t
          });
          importedCount++;
        } catch (err) {
          console.error(`Failed to import post: ${title}`, err);
        }
      }

      if (importedCount > 0) {
        toast.success(`Successfully imported ${importedCount} new stories!`, { id: toastId });
        await loadPosts();
      } else {
        toast.success('All stories from this blog are already in your inventory.', { id: toastId });
      }
    } catch (err: any) {
      console.error('Import error:', err);
      toast.error(`Import failed: ${err.message}`, { id: toastId });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-black/5 overflow-hidden">
      <div className="p-8 border-b border-black/5 flex flex-col space-y-6 bg-[#FBFBFB]">
         <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-medium">Content Inventory</h3>
            <div className="flex items-center space-x-3">
               <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
                  <input type="text" placeholder="Search stories..." className="pl-10 pr-6 py-2 bg-black/5 border-none rounded-full text-sm focus:ring-1 focus:ring-black transition-all" />
               </div>
               <button 
                 onClick={repairThumbnails}
                 disabled={repairing}
                 className="bg-black/5 text-black/40 px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black/10 transition-all flex items-center space-x-2"
               >
                 <ImageIcon size={16} />
                 <span>{repairing ? 'Repairing...' : 'Repair Thumbnails'}</span>
               </button>
               <Link to="/admin/create" className="bg-black text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black/80 transition-all flex items-center space-x-2">
                  <Plus size={16} />
                  <span>Create</span>
               </Link>
            </div>
         </div>

         <div className="flex items-center space-x-4 p-4 bg-black/5 rounded-2xl border border-black/5">
            <div className="flex-1 relative">
               <input 
                  type="text" 
                  value={bloggerUrl}
                  onChange={(e) => setBloggerUrl(e.target.value)}
                  placeholder="https://yourblog.blogspot.com/"
                  className="w-full bg-white border border-black/10 rounded-full px-6 py-2.5 text-sm focus:ring-1 focus:ring-black transition-all"
               />
            </div>
            <button 
              onClick={importFromBlogger}
              disabled={importing}
              className="flex items-center space-x-2 px-6 py-2.5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-all outline-none disabled:opacity-50"
            >
              <DownloadCloud size={14} className={importing ? "animate-pulse" : ""} />
              <span>{importing ? 'Importing...' : 'Import from Blogger'}</span>
            </button>
         </div>
      </div>
      <table className="w-full text-left">
         <thead className="bg-[#FBFBFB] border-b border-black/5 text-[10px] font-bold uppercase tracking-widest text-black/40">
            <tr>
               <th className="py-4 px-8">Story Title</th>
               <th className="py-4 px-8">Category</th>
               <th className="py-4 px-8">Status</th>
               <th className="py-4 px-8">Published At</th>
               <th className="py-4 px-8 text-right">Actions</th>
            </tr>
         </thead>
         <tbody className="divide-y divide-black/[0.03]">
            {loading ? (
              <tr><td colSpan={5} className="py-12 text-center italic text-black/20">Loading your thoughts...</td></tr>
            ) : posts.length === 0 ? (
              <tr><td colSpan={5} className="py-12 text-center italic text-black/20">No stories yet. Start writing!</td></tr>
            ) : posts.map(post => (
              <tr key={post.id} className="hover:bg-black/[0.01] transition-colors group">
                 <td className="py-6 px-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-black/5 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={post.coverImage || extractFirstImage(post.content) || `https://ui-avatars.com/api/?name=${post.title}&background=random`} 
                            alt="" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                       <div>
                          <Link to={`/blog/${post.slug}`} className="block font-medium mb-1 hover:underline">{post.title}</Link>
                          <span className="block text-[10px] text-black/30 font-bold uppercase tracking-widest">By {post.authorName}</span>
                       </div>
                    </div>
                 </td>
                 <td className="py-6 px-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-black/40">{post.category}</span>
                 </td>
                 <td className="py-6 px-8">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                      post.status === 'published' ? "bg-green-50 text-green-600 border-green-100" : "bg-gray-50 text-gray-400 border-gray-100"
                    )}>
                      {post.status}
                    </span>
                 </td>
                 <td className="py-6 px-8 text-xs text-black/40">
                    {formatDate(post.createdAt)}
                 </td>
                 <td className="py-6 px-8 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => navigate(`/admin/edit/${post.id}`)}
                        className="p-2 hover:bg-black/5 rounded-lg text-black/20 hover:text-black transition-colors"
                        title="Edit Story"
                      >
                         <PenTool size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('Delete this story?')) {
                            postService.deletePost(post.id).then(() => {
                              toast.success('Story deleted');
                              loadPosts();
                            });
                          }
                        }}
                        className="p-2 hover:bg-red-50 rounded-lg text-black/20 hover:text-red-500 transition-colors"
                        title="Delete Story"
                      >
                         <Trash2 size={18} />
                      </button>
                    </div>
                 </td>
              </tr>
            ))}
         </tbody>
      </table>
    </div>
  );
};

const ComingSoon = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
    <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center text-black/20">
      <LayoutDashboard size={40} />
    </div>
    <h2 className="font-serif text-3xl font-bold">{title}</h2>
    <p className="text-black/40 text-sm max-w-xs">We're still fine-tuning this section for the editorial experience. Check back soon.</p>
  </div>
);

// --- Main Dashboard Controller ---

export default function AdminDashboard() {
  const { user } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Stories', path: '/admin/posts', icon: FileText },
    { label: 'Compose', path: '/admin/create', icon: PenTool },
    { label: 'Wallpapers', path: '/admin/wallpapers', icon: ImageIcon },
    { label: 'Drafts', path: '/admin/drafts', icon: FileText },
    { label: 'Comments', path: '/admin/comments', icon: MessageSquare },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 border-r border-black/5 bg-white flex flex-col h-screen sticky top-0 overflow-hidden">
        <div className="p-8 border-b border-black/5">
           <Link to="/" className="flex items-center space-x-1">
            <span className="font-serif text-2xl font-black tracking-tighter uppercase text-primary">INK.</span>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
          {menuItems.map(item => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center justify-between px-4 py-3 transition-all duration-300 rounded-lg",
                  isActive 
                    ? "bg-black text-white" 
                    : "hover:bg-black/5 text-black/40 hover:text-black"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={16} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-black/5 bg-[#FBFBFB]">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-black/5">
              <img src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user?.user_metadata?.full_name || user?.email}&background=random`} alt={user?.user_metadata?.full_name} />
            </div>
            <div className="overflow-hidden">
               <span className="block text-xs font-bold truncate">{user?.user_metadata?.full_name || user?.email || 'Admin'}</span>
               <span className="block text-[10px] text-black/40 font-bold uppercase tracking-widest">Administrator</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-4 rounded-2xl border border-black/5 hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all font-bold uppercase tracking-widest text-[10px]"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header */}
        <header className="h-24 glass border-b border-black/5 flex items-center justify-between px-12 sticky top-0 z-40">
           <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-black/40">
              <span>INK</span>
              <ChevronRight size={12} />
              <span className="text-black">Dashboard</span>
           </div>

           <div className="flex items-center space-x-6">
              <button className="p-3 bg-black/5 rounded-full hover:bg-black/10 transition-colors text-black/40">
                 <Bell size={18} />
              </button>
              <div className="h-6 w-[1px] bg-black/10" />
              <Link to="/" target="_blank" className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest hover:text-black/60 transition-colors">
                 <span>View Site</span>
                 <ExternalLink size={14} />
              </Link>
           </div>
        </header>

        {/* Dynamic Route Content */}
        <div className="flex-1 p-12">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="posts" element={<AllPosts />} />
            <Route path="wallpapers" element={<WallpaperManager />} />
            <Route path="create" element={<BlogEditor />} />
            <Route path="edit/:id" element={<BlogEditor />} />
            <Route path="drafts" element={<ComingSoon title="Archive & Drafts" />} />
            <Route path="comments" element={<ComingSoon title="Comment Moderation" />} />
            <Route path="settings" element={<ComingSoon title="Editorial Settings" />} />
            <Route path="*" element={<Overview />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
