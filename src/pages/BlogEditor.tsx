import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { 
  Bold, Italic, List, ListOrdered, Quote, Code, Image as ImageIcon, 
  Link as LinkIcon, Undo, Redo, Save, Eye, Settings, Clock, 
  CheckCircle, ChevronLeft, Heading1, Heading2, Heading3,
  Copy, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { postService } from '../services/postService';
import { wallpaperService } from '../services/wallpaperService';
import { Wallpaper, Post } from '../types';
import { slugify, estimateReadTime } from '../lib/utils';
import { cn } from '../lib/utils';

const lowlight = createLowlight(common);

export function BlogEditor() {
  const { user } = useAppStore();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Lifestyle');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [activeTab, setActiveTab] = useState<'settings' | 'wallpapers'>('settings');
  const [isLoading, setIsLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: '<p>Start your story here...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] font-serif',
      },
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        // Load wallpapers
        const wData = await wallpaperService.getAllWallpapers();
        setWallpapers(wData);

        // Load existing post if editing
        if (id && id !== 'create') {
          const allPosts = await postService.getAllPostsAdmin();
          const existingPost = allPosts.find(p => p.id === id);
          if (existingPost) {
            setTitle(existingPost.title);
            setExcerpt(existingPost.excerpt);
            setCategory(existingPost.category);
            setCoverImage(existingPost.coverImage || '');
            setStatus(existingPost.status);
            editor?.commands.setContent(existingPost.content);
          }
        }
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id, editor]);

  const handlePublish = async () => {
    if (!title || !editor) return toast.error('Please add a title and content');
    
    setIsPublishing(true);
    const toastId = toast.loading(id ? 'Updating thought...' : 'Publishing thought...');
    
    try {
      const slug = slugify(title);
      const postData = {
        title,
        slug,
        excerpt: excerpt || editor.getText().slice(0, 160) + '...',
        content: editor.getHTML(),
        coverImage,
        category,
        authorId: user?.id,
        authorName: user?.user_metadata?.full_name || user?.email || 'Author',
        status,
      };

      if (id && id !== 'create') {
        await postService.updatePost(id, postData);
        toast.success('Thought updated', { id: toastId });
      } else {
        await postService.createPost(postData);
        toast.success('Thought published to the world', { id: toastId });
      }
      navigate('/admin/posts');
    } catch (err) {
      console.error(err);
      toast.error('Operation failed', { id: toastId });
    } finally {
      setIsPublishing(false);
    }
  };

  const addImage = () => {
    const url = window.prompt('URL');
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  };

  if (!editor) return null;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-12">
        <button 
          onClick={() => navigate('/admin/posts')}
          className="flex items-center space-x-2 text-black/40 hover:text-black transition-colors"
        >
          <ChevronLeft size={20} />
          <span className="text-xs font-bold uppercase tracking-widest">Back to stories</span>
        </button>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 bg-white border border-black/5 rounded-full hover:bg-black/5 transition-colors"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black/80 transition-all flex items-center space-x-2"
          >
            <Save size={16} />
            <span>{isPublishing ? 'Publishing...' : 'Publish'}</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-12">
        {/* Main Editor Area */}
        <div className="lg:col-span-3 space-y-8">
          <input 
            type="text" 
            placeholder="Story Title..."
            className="w-full text-5xl md:text-7xl font-serif font-medium bg-transparent border-none focus:ring-0 p-0 placeholder:text-black/10"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="flex flex-wrap items-center gap-2 py-4 border-y border-black/5 sticky top-24 bg-[#FBFBFB] z-10">
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={cn("p-2 rounded hover:bg-black/5", editor.isActive('heading', { level: 1 }) && "bg-black text-white hover:bg-black")}><Heading1 size={18}/></button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={cn("p-2 rounded hover:bg-black/5", editor.isActive('heading', { level: 2 }) && "bg-black text-white hover:bg-black")}><Heading2 size={18}/></button>
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={cn("p-2 rounded hover:bg-black/5", editor.isActive('bold') && "bg-black text-white hover:bg-black")}><Bold size={18}/></button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={cn("p-2 rounded hover:bg-black/5", editor.isActive('italic') && "bg-black text-white hover:bg-black")}><Italic size={18}/></button>
            <div className="w-[1px] h-6 bg-black/5 mx-2" />
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={cn("p-2 rounded hover:bg-black/5", editor.isActive('bulletList') && "bg-black text-white hover:bg-black")}><List size={18}/></button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={cn("p-2 rounded hover:bg-black/5", editor.isActive('orderedList') && "bg-black text-white hover:bg-black")}><ListOrdered size={18}/></button>
            <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={cn("p-2 rounded hover:bg-black/5", editor.isActive('blockquote') && "bg-black text-white hover:bg-black")}><Quote size={18}/></button>
            <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={cn("p-2 rounded hover:bg-black/5", editor.isActive('codeBlock') && "bg-black text-white hover:bg-black")}><Code size={18}/></button>
            <div className="w-[1px] h-6 bg-black/5 mx-2" />
            <button onClick={addImage} className="p-2 rounded hover:bg-black/5"><ImageIcon size={18}/></button>
            <button onClick={() => editor.chain().focus().undo().run()} className="p-2 rounded hover:bg-black/5 ml-auto"><Undo size={18}/></button>
            <button onClick={() => editor.chain().focus().redo().run()} className="p-2 rounded hover:bg-black/5"><Redo size={18}/></button>
          </div>

          <EditorContent editor={editor} className="typography-post" />
        </div>

        {/* Sidebar Settings */}
        <AnimatePresence>
          {(showSettings || window.innerWidth > 1024) && (
            <motion.aside 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:block space-y-10"
            >
              <div className="bg-white p-2 rounded-full border border-black/5 flex mb-6">
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={cn(
                    "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all",
                    activeTab === 'settings' ? "bg-black text-white" : "hover:bg-black/5 text-black/40"
                  )}
                >
                  Settings
                </button>
                <button 
                  onClick={() => setActiveTab('wallpapers')}
                  className={cn(
                    "flex-1 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full transition-all",
                    activeTab === 'wallpapers' ? "bg-black text-white" : "hover:bg-black/5 text-black/40"
                  )}
                >
                  Gallery
                </button>
              </div>

              {activeTab === 'settings' ? (
                <div className="bg-white p-8 rounded-3xl border border-black/5 space-y-6">
                  <h4 className="font-serif text-xl font-medium mb-6">Meta Details</h4>
                  
                  <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Cover Image</label>
                        <button 
                          onClick={() => setActiveTab('wallpapers')}
                          className="text-[9px] font-bold uppercase tracking-widest text-accent hover:underline"
                        >
                          Select from Wallpapers
                        </button>
                      </div>
                      <input 
                        type="text" 
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-black/5 border-none rounded-2xl py-3 px-4 text-xs"
                      />
                      {coverImage && <img src={coverImage} className="w-full h-32 object-cover rounded-xl mt-2 shadow-sm" />}
                  </div>

                  <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Category</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-black/5 border-none rounded-2xl py-3 px-4 text-xs font-bold uppercase tracking-widest appearance-none"
                      >
                        <option>Lifestyle</option>
                        <option>Design</option>
                        <option>Technology</option>
                        <option>Business</option>
                        <option>Psychology</option>
                      </select>
                  </div>

                  <div className="space-y-4">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black/40">Excerpt</label>
                      <textarea 
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="A short summary of your story..."
                        className="w-full bg-black/5 border-none rounded-2xl py-3 px-4 text-xs h-32 resize-none"
                      />
                  </div>

                  <div className="pt-6 border-t border-black/5 space-y-4">
                      <div className="flex items-center justify-between text-xs text-black/40 font-bold uppercase tracking-widest">
                        <span>Read Time</span>
                        <span>{estimateReadTime(editor.getHTML())} min</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-black/40 font-bold uppercase tracking-widest">
                        <span>Word Count</span>
                        <span>{editor.getText().trim().split(/\s+/).length} words</span>
                      </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-3xl border border-black/5 space-y-6 max-h-[80vh] overflow-y-auto">
                  <h4 className="font-serif text-xl font-medium mb-6">Wallpaper Gallery</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {wallpapers.map(w => (
                      <div key={w.id} className="group relative">
                        <img 
                          src={w.url} 
                          alt={w.title} 
                          className="w-full aspect-square object-cover rounded-xl border border-black/5"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex flex-col items-center justify-center space-y-2 p-2">
                           <button 
                            onClick={() => {
                              setCoverImage(w.url);
                              setActiveTab('settings');
                              toast.success('Cover image set');
                            }}
                            className="w-full py-1.5 bg-white text-black text-[8px] font-bold uppercase tracking-widest rounded-full hover:bg-accent hover:text-white transition-all"
                           >
                             Set Cover
                           </button>
                           <button 
                            onClick={() => {
                              editor.chain().focus().setImage({ src: w.url }).run();
                              toast.success('Inserted into post');
                            }}
                            className="w-full py-1.5 bg-black text-white text-[8px] font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-black transition-all"
                           >
                             Insert
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {wallpapers.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-black/20">No wallpapers found</p>
                      <button 
                        onClick={() => navigate('/admin/wallpapers')}
                        className="mt-4 text-[9px] font-bold uppercase tracking-widest text-accent underline"
                      >
                        Add wallpapers
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
