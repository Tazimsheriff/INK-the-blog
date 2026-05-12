import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Navbar, Footer } from '../components/Navigation';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        toast.success('Account created! Please check your email for verification.');
        setMode('signin');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Signed in successfully');
        navigate('/admin');
      }
    } catch (err: any) {
      toast.error(err.message || `Failed to ${mode === 'signup' ? 'sign up' : 'sign in'}`);
    } finally {
      setLoading(false);
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
            <h1 className="text-4xl font-serif font-medium mb-4">
              {mode === 'signin' ? 'Welcome back.' : 'Join the circle.'}
            </h1>
            <p className="text-black/40 font-serif italic text-lg leading-relaxed">
              {mode === 'signin' 
                ? 'Enter your credentials to manage your stories or join the conversation.' 
                : 'Create an account to start sharing your stories and perspectives.'}
            </p>
          </div>

          <div className="space-y-6">
            <form onSubmit={handleAuth} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="text-[10px] font-bold uppercase tracking-widest text-black/40 ml-4">Full Name</label>
                    <div className="relative">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-black/20">
                        <UserPlus size={18} />
                      </div>
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-black/5 border-none rounded-full py-4 pl-14 pr-6 focus:ring-2 focus:ring-black transition-all"
                        placeholder="John Doe"
                        required={mode === 'signup'}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

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
                {loading ? <span>Processing...</span> : (
                  <>
                    {mode === 'signin' ? <LogIn size={16} /> : <UserPlus size={16} />}
                    <span>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-black/30 pt-4">
              {mode === 'signin' ? (
                <>Don't have an account? <button onClick={() => setMode('signup')} className="text-black font-bold hover:underline">Sign up now</button></>
              ) : (
                <>Already have an account? <button onClick={() => setMode('signin')} className="text-black font-bold hover:underline">Sign in instead</button></>
              )}
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
