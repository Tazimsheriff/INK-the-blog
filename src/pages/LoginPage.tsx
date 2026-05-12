import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Navbar, Footer } from '../components/Navigation';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import { Mail, Lock, LogIn, Chrome } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success('Signed in successfully');
      navigate('/admin');
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error('Google sign in failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 bg-[#FBFBFB]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white p-12 rounded-3xl border border-black/5 shadow-2xl shadow-black/5"
        >
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-medium mb-4">Welcome back.</h1>
            <p className="text-black/40 font-serif italic text-lg leading-relaxed">Enter your credentials to manage your stories or join the conversation.</p>
          </div>

          <div className="space-y-6">
            <button 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center space-x-3 border border-black/10 py-4 rounded-full hover:bg-black/5 transition-all font-medium text-sm"
            >
              <Chrome size={18} />
              <span>Continue with Google</span>
            </button>

            <div className="relative py-4 flex items-center">
              <div className="flex-grow border-t border-black/5"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-widest text-black/20">or email</span>
              <div className="flex-grow border-t border-black/5"></div>
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-4">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/5 border-none rounded-full py-4 pl-14 pr-6 focus:ring-2 focus:ring-black transition-all"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-4">Password</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20" size={18} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/5 border-none rounded-full py-4 pl-14 pr-6 focus:ring-2 focus:ring-black transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-black/80 transition-all shadow-lg shadow-black/10 flex items-center justify-center space-x-2"
              >
                {loading ? <span>Connecting...</span> : (
                  <>
                    <LogIn size={16} />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-black/30 pt-4">
              Don't have an account? <a href="#" className="text-black font-bold hover:underline">Apply to write</a>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
