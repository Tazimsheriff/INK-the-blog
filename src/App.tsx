import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';

import LandingPage from './pages/LandingPage';
import BlogListingPage from './pages/BlogListingPage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import QuotesPage from './pages/QuotesPage';
import WallpapersPage from './pages/WallpapersPage';

import { SEO } from './components/SEO';
import { useAppStore } from './store/useAppStore';

export default function App() {
  const { setUser, setAuthLoading, isAuthLoading, user, isAdmin } = useAppStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const user = session.user;
        const isAdmin = user.email === 'mubashirtazim2k@gmail.com';
        setUser(user, isAdmin);
      } else {
        setUser(null, false);
      }
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const user = session.user;
        const isAdmin = user.email === 'mubashirtazim2k@gmail.com';
        setUser(user, isAdmin);
      } else {
        setUser(null, false);
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setAuthLoading]);

  if (isAuthLoading) return (
    <div className="min-h-screen flex items-center justify-center font-serif italic text-black/40">
      Authenticating...
    </div>
  );

  return (
    <BrowserRouter>
      <Analytics />
      <SEO />
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blog" element={<BlogListingPage />} />
        <Route path="/archive" element={<BlogListingPage />} />
        <Route path="/trending" element={<BlogListingPage />} />
        <Route path="/categories" element={<BlogListingPage />} />
        <Route path="/quotes" element={<QuotesPage />} />
        <Route path="/wallpapers" element={<WallpapersPage />} />
        <Route path="/blog/:slug" element={<PostPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/newsletter" element={<LandingPage />} />
        <Route path="/about" element={<LandingPage />} />

        <Route 
          path="/admin/*" 
          element={
            (!user || !isAdmin) ? <Navigate to="/login" /> : <AdminDashboard />
          } 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
