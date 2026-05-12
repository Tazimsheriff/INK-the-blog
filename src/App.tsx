import React, { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { User, Role } from './types';
import { Toaster } from 'react-hot-toast';

import LandingPage from './pages/LandingPage';
import BlogListingPage from './pages/BlogListingPage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import QuotesPage from './pages/QuotesPage';

import { useAppStore } from './store/useAppStore';

export default function App() {
  const { setUser, setAuthLoading, isAuthLoading, user, isAdmin } = useAppStore();

  useEffect(() => {
    return onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser({
            ...fbUser,
            displayName: userData.displayName,
            photoURL: userData.photoURL
          } as any, userData.role === 'admin');
        } else {
          const newUser = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || 'Author',
            role: fbUser.email === 'mubashirtazim2k@gmail.com' ? 'admin' : 'reader',
          };
          await setDoc(doc(db, 'users', fbUser.uid), {
            ...newUser,
            createdAt: serverTimestamp()
          });
          setUser(fbUser as any, newUser.role === 'admin');
        }
      } else {
        setUser(null, false);
      }
      setAuthLoading(false);
    });
  }, [setUser, setAuthLoading]);

  if (isAuthLoading) return (
    <div className="min-h-screen flex items-center justify-center font-serif italic text-black/20">
      Authenticating...
    </div>
  );

  return (
    <BrowserRouter>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blog" element={<BlogListingPage />} />
        <Route path="/archive" element={<BlogListingPage />} />
        <Route path="/trending" element={<BlogListingPage />} />
        <Route path="/categories" element={<BlogListingPage />} />
        <Route path="/quotes" element={<QuotesPage />} />
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
