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
import { postService } from '../services/postService';

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      
      const mockPosts: Record<string, Post> = {
        'conflict': {
          id: '1',
          title: 'Conflict',
          slug: 'conflict',
          excerpt: 'I have been addicted to this Japanese song called conflict. Sometimes I wonder if I am liking songs for what they truly hold true and show...',
          content: `
            <p>I have been addicted to this Japanese song called conflict .Sometimes I wonder if I am liking songs for what they truly hold true and show.Because to me the songs I like just have a unique voicing of words in between which catches my ears and hence I just end up playing them on repeat.later I end up getting bored of em like sucking them dry and now nothing left off to satisfy me . I am not the kinda person to keep listening to songs I end up tired of them easily . but somehow I can do those things I end up getting bored about . trying to be relevant to the title is tough but I have to try.</p>

            <p>Sometimes life feels like its all about trying ,we all have big dreams as kids only to grow up opposed to them and still there are some who hold their dreams and hopes tight and close ,I worry for them ,what pain would it feel like to realize your dreams very kiddish and unrealistic so late in life ,such a thing could make anyone think there is no second time ,but clearly thats wrong life never gives you a second chance yes but you still try and thats the difference . there are people who know they can't be or do what they want but still try .</p>

            <blockquote>"its simply what separates what you are  from someone you wish to be even if its impossible try and keep trying doesn't matter if you lose cause it never mattered either way."</blockquote>

            <p>Conflict in ourselves is one thing we have to keep facing .while it poses itself everywhere this "conflict". You should still treat it differently every time .having the same mindset for every conflict would leave you behind of others and lost in track of your aim and objective . sometimes its better to just have a definitive goal of what you want of something and what role it would play in your life .so its better to welcome conflict than just oppose its visit . treats your guests as gods . one of many teachings or ethics commonly followed in India and many other places .but its important to keep in mind while we welcome conflict we should also hold some negative  thoughts of showing them their way out . you can't live with something which will eventually destroy you and that's why its just a guests by time it leaves or we have to make it leave .</p>
          `,
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
        'peace-amidst-chaos': {
            id: '4',
            title: 'Peace amidst chaos',
            slug: 'peace-amidst-chaos',
            excerpt: 'Another post and another chance for me to express my thought on this thing called blog.I feel the effect of sleep acting on me like a sedative...',
            content: `
              <p>Another post and another chance for me to express my thought on this thing called blog.I feel the effect of sleep acting on me like a sedative .How could sleep be so important to ones life when it contributes so much less to .Maybe it is needed for our overall well being but its just hard to notice since there are no immediate effect .Well that is ignoring headache,eye bags and inability to focus due of lack of sleep</p>
              <p>OK trying to get back on track I wanted to talk about equality.To be a bit more serious its about "EQUALITY".We tend to have a positive attitude or mindset that all humans are born equal ,that we are all born talented in our owns ways while some discover it early in life some do so later in time.But one things is said clearly that we all are special in some way .While this is a very charming thought it also gives us the wrong perspective,while as species we might have the same genus we still don't necessarily act the same or should be considered equal .We are unequal and  but we have the tendency to work towards the opposite,that is to be equal.</p>
              <p>One way to see this is that all humans are born unequal some are talented some are not while some discover their potential later in life some don't have potential ,but can simply use others potential .hence there is certainly inequality .What sets one to be different from another might be his academic process,physical power ,mental stability ,intelligence ,ability to learn and use things ,so on and so forth . While the most common and conventional way to measure ones worth or to differentiate them from others to see their equalness is to see how good,kind,honest,caring,loving and yeah whatever goody tuudy things there are which can be considered as key indicators of value .To me this is a very boring and dumb way to measure ones worth .</p>
            `,
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
        'last-smoke': {
            id: '5',
            title: 'Last smoke',
            slug: 'last-smoke',
            excerpt: 'She was just getting back from work, exhausted and tired. Walking down the street, her legs hurt and so did her head.',
            content: `
              <p>She was just getting back from work, exhausted and tired. Walking down the street, her legs hurt and so did her head. The workers at the office were being forced to over-time again. No, it's not only that. She feels uncomfortable being the sole female worker there, and strange thoughts keep running through her mind. She hates this. Even though everyone is so nice, why does she end up thinking like this? The thoughts perplex her. She thinks "Ha, I want to smoke." But she can't- she had promised her parents not to and hence, only smokes in her rented house and not even outside on the road.</p>
            `,
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
        'it-goes-on': {
            id: '2',
            title: 'It goes on',
            slug: 'it-goes-on',
            excerpt: 'The phones light keeps hitting my eyes right where it hurts .Ack my eyes ,I start having those thoughts of getting up early...',
            content: `
              <p>The phones light keeps hitting my eyes right where it hurts .Ack my eyes ,I start having those thoughts of getting up early ,start being productive .Why do I wanna be productive even after knowing I am being quite productive already . Its that endless craving and desire for something .When you do some thing you always face the consequences such consequences could be in the form of emotions .feeling bad,good,excited,scared,lonely and plenty more.I wish it wasn't too much to ask for when you want to experience it all .but it feels to make a big difference .experiencing everything life has to give and take might be like living multiple lives .that is considering that everyone experiences certain things in life which only they face and overcome .but its common knowledge that everyone experiences problems and tries to overcome it.</p>
            `,
            coverImage: 'https://i.ibb.co/zhJVGq1V/tazimfr.jpg',
            authorId: 'auth1',
            authorName: 'Mizat',
            category: 'Reflection',
            tags: ['productivity', 'thoughts'],
            status: 'published',
            viewCount: 1500,
            likeCount: 300,
            createdAt: new Date('2022-11-11'),
            updatedAt: new Date('2022-11-11'),
        },
        'day-1': {
            id: '3',
            title: 'Day 1',
            slug: 'day-1',
            excerpt: 'Its raining and I start to feel like the world has been separated again. The way we never get harmed by rains much when you have a roof over your head...',
            content: `
              <p>Its raining and I start to feel like the world has been separated again.The way we  never get harmed by rains much when you have a roof over your head is remarkable .It makes a whole different world between you and the rain .While everything outside is being drenched and pierced by the cold water droplets, I lay here with no hint of frightance . it's hilarious to think about such difference it makes in just having something to protect you and to not and whilst there are beings un faced by rain ,they simply are a different creed . It takes quite something in the heart to enjoy the rain and its smell . and yet I don't feel that today .its 10 p.m. and I don't feel any sign of giving in to sleep ,suppose sleep means death I could stay immortal for the foreseeable future .I am running out words though  there is so much to put in words yet the emptiness of the words get a hold of me .I know writing this would only delay the slight chance of early sleep I have but here I am still doing the unwanted .I remember learning somewhere that activeness at night is an indicator of intelligence and thinking how could being awake at night be considered intelligent .but there is something strange when more than half the humans around the world go to sleep and your stuck awake .a sense of victory no thats worse than thinking your the only one different .the number are still huge for those who aren't asleep .beings suffering from the same problem or perhaps working at something .If life could be valued I wonder what values it would use to deduce someone's life worth .normally anyone would think of good values like honesty,kindness etc.but I doubt they make any sense without having the opposite of them . bad values matter in life they are considered bad but they exist for defining the existence of good values .bad doesn't have to bad just like good doesn't hhbe good .don't judge a book by its cover perhaps</p>
            `,
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
      };

      try {
        const fetchedPost = await postService.getPostBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else if (mockPosts[slug]) {
          setPost(mockPosts[slug]);
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        if (mockPosts[slug]) {
          setPost(mockPosts[slug]);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  const handleLike = () => {
    setLiked(!liked);
    if (!liked) {
      toast.success('Added to your favorite stories');
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    if (!bookmarked) {
      toast.success('Saved to your reading list');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    setSubmittingComment(true);
    // Simulate API call
    setTimeout(() => {
      const newComment = {
        id: Date.now().toString(),
        userName: 'You',
        createdAt: new Date(),
        content: commentText
      };
      setComments([newComment, ...comments]);
      setCommentText('');
      setSubmittingComment(false);
      toast.success('Your response has been published');
    }, 800);
  };

  const shareOnTwitter = () => {
    const url = window.location.href;
    const text = post ? `${post.title} | Tazim Sheriff Blog` : 'Check out this story on Tazim Sheriff Blog';
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
      <Helmet>
        <title>{post.title} — Personal Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.coverImage} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      
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
                 <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{post.likeCount + (liked ? 1 : 0)}</span>
              </div>

              <div className="text-center space-y-2">
                 <button className="w-16 h-16 rounded-full border border-black/5 flex items-center justify-center hover:bg-blue-50 hover:border-blue-100 group transition-all">
                    <MessageCircle size={24} className="text-black/40 group-hover:text-blue-500 transition-colors" />
                 </button>
                 <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{comments.length}</span>
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
                      <p className="text-primary/60 text-sm">Follow Evelyn Reed for more reflections on minimalist living.</p>
                   </div>
                   <button 
                    onClick={() => toast.success('Now following Evelyn Reed')}
                    className="bg-black text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-black/80 transition-all font-sans"
                   >
                      Follow Author
                   </button>
                </div>
             </div>

             {/* Comments Section */}
             <section className="mt-32">
                <div className="flex items-center justify-between mb-12">
                   <h3 className="font-serif text-3xl font-bold text-primary">Responses ({comments.length})</h3>
                   <button className="text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black">Newest First</button>
                </div>
                
                <form onSubmit={handleCommentSubmit} className="bg-white border border-black/5 rounded-2xl p-6 mb-12">
                   <textarea 
                     placeholder="What are your thoughts?"
                     className="w-full bg-transparent border-none focus:ring-0 text-lg font-serif min-h-[100px] resize-none text-primary"
                     value={commentText}
                     onChange={(e) => setCommentText(e.target.value)}
                   />
                   <div className="flex justify-end pt-4 mt-4 border-t border-black/5">
                      <button 
                        type="submit"
                        disabled={submittingComment || !commentText.trim()}
                        className="bg-black text-white px-6 py-2 rounded-full font-bold uppercase tracking-widest text-[10px] disabled:opacity-30 font-sans"
                      >
                        {submittingComment ? 'Publishing...' : 'Publish Response'}
                      </button>
                   </div>
                </form>

                <div className="space-y-12">
                   {comments.map(comment => (
                     <div key={comment.id} className="group animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center space-x-3 mb-4">
                           <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent font-bold text-sm">Y</div>
                           <div>
                              <span className="block text-sm font-bold text-primary">{comment.userName}</span>
                              <span className="block text-[10px] text-black/40 tracking-widest uppercase font-bold">Just now</span>
                           </div>
                        </div>
                        <p className="text-primary/70 font-serif text-lg leading-relaxed mb-6">
                           {comment.content}
                        </p>
                     </div>
                   ))}
                </div>
             </section>
          </div>
        </div>
      </article>

      {/* Suggested Reading */}
      <aside className="bg-[#f1f1f1]/30 py-32 border-t border-black/5">
         <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-16">
               <h3 className="font-serif text-3xl font-medium">Continue reading from Tazim Sheriff Blog</h3>
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
