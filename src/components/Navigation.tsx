import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { Menu, X, LogIn, LayoutDashboard, LogOut, Search, Feather, Plus, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export function Navbar() {
  const { user, isAdmin } = useAppStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-black/5 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-1">
            <span className="font-serif text-2xl font-black tracking-tighter uppercase">INK.</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-12">
            <nav className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-black/40">
              <Link to="/blog" className="hover:text-black transition-colors">Stories</Link>
              <Link to="/quotes" className="hover:text-black transition-colors">Quotes</Link>
              <Link to="/newsletter" className="hover:text-black transition-colors">Newsletter</Link>
              <Link to="/archive" className="hover:text-black transition-colors">Archive</Link>
            </nav>
            
            <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" />
              <input 
                type="text" 
                placeholder="Search Stories" 
                className="bg-black/5 border-none rounded-full pl-10 pr-4 py-1.5 text-[10px] font-bold uppercase tracking-widest w-40 focus:w-60 focus:ring-1 focus:ring-black/10 transition-all outline-none"
              />
            </div>

            {user ? (
              <div className="flex items-center space-x-6">
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-[0.2em] bg-black text-white px-5 py-2 rounded-full hover:bg-black/80 transition-all shadow-xl shadow-black/10"
                  >
                    <LayoutDashboard size={14} />
                    <span>Dashboard</span>
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="text-[10px] font-bold uppercase tracking-widest text-black/40 hover:text-black transition-colors flex items-center space-x-1"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-[10px] font-bold uppercase tracking-widest text-black/60 hover:text-black">Sign In</Link>
                <Link 
                  to="/login" 
                  className="bg-[#F27D26] text-white p-2 rounded-full shadow-lg shadow-[#F27D26]/20 hover:scale-105 transition-all"
                >
                  <Plus size={20} />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white border-b border-black/5 p-8 md:hidden flex flex-col space-y-6 shadow-2xl z-50"
          >
            <div className="flex flex-col space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20">Navigation</span>
              <Link to="/blog" className="text-2xl font-serif font-bold text-primary" onClick={() => setIsOpen(false)}>Stories</Link>
              <Link to="/quotes" className="text-2xl font-serif font-bold text-primary" onClick={() => setIsOpen(false)}>Quotes</Link>
              <Link to="/newsletter" className="text-2xl font-serif font-bold text-primary" onClick={() => setIsOpen(false)}>Newsletter</Link>
              <Link to="/archive" className="text-2xl font-serif font-bold text-primary" onClick={() => setIsOpen(false)}>Archive</Link>
              <Link to="/about" className="text-2xl font-serif font-bold text-primary" onClick={() => setIsOpen(false)}>Our Vision</Link>
            </div>
            
            <div className="h-[1px] bg-black/5" />
            
            {user ? (
              <div className="flex flex-col space-y-4">
                {isAdmin && <Link to="/admin" className="text-lg font-bold uppercase tracking-widest text-primary" onClick={() => setIsOpen(false)}>Admin Dashboard</Link>}
                <button onClick={handleLogout} className="text-lg font-bold uppercase tracking-widest text-red-500 text-left">Logout</button>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                <Link to="/login" className="text-lg font-bold uppercase tracking-widest text-primary" onClick={() => setIsOpen(false)}>Sign In</Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function Footer() {
  return (
    <>
      <footer className="bg-white border-t border-black/5 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center space-x-1 mb-6">
                <span className="font-serif text-2xl font-black tracking-tighter uppercase">INK.</span>
              </Link>
              <p className="text-black/60 max-w-sm font-serif text-xl leading-relaxed italic">
                Curated perspectives on design, culture, and the art of slowing down.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-widest mb-6">Sitemaps</h4>
              <ul className="space-y-4 text-black/60">
                <li><Link to="/blog" className="hover:text-black hover:underline underline-offset-4">Read All</Link></li>
                <li><Link to="/quotes" className="hover:text-black hover:underline underline-offset-4">Quotes</Link></li>
                <li><Link to="/trending" className="hover:text-black hover:underline underline-offset-4">Trending</Link></li>
                <li><Link to="/categories" className="hover:text-black hover:underline underline-offset-4">Topics</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm uppercase tracking-widest mb-6">Connect</h4>
              <ul className="space-y-4 text-black/60">
                <li><a href="https://www.instagram.com/tazzzunlikely_n_oblivious/" target="_blank" rel="noopener noreferrer" className="hover:text-black hover:underline underline-offset-4">Instagram</a></li>
                <li><a href="https://www.linkedin.com/in/tazim-sheriff-r-15a355230/" target="_blank" rel="noopener noreferrer" className="hover:text-black hover:underline underline-offset-4">LinkedIn</a></li>
                <li><a href="https://tazimsheriff.dev" target="_blank" rel="noopener noreferrer" className="hover:text-black hover:underline underline-offset-4">Portfolio</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-black/5 text-sm text-black/40">
            <p>© {new Date().getFullYear()} INK. Crafted for the curious.</p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <a 
                href="#" 
                className="hover:text-black transition-colors relative group/terms"
              >
                Terms
                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-[10px] rounded opacity-0 group-hover/terms:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl z-50">
                  Don't share with anyone ,thats the only terms 😉
                </span>
              </a>
            </div>
          </div>
        </div>
      </footer>
      <BackToTop />
    </>
  );
}

export function BackToTop() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-8 p-4 bg-black text-white rounded-full shadow-2xl z-50 hover:bg-[#F27D26] hover:scale-110 transition-all cursor-pointer"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
