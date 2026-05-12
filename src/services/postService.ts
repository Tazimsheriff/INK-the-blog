import { 
  collection, 
  query, 
  where, 
  getDocs, 
  getDoc,
  doc,
  orderBy, 
  limit, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  increment,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Post } from '../types';

export const postService = {
  // --- Public Methods ---
  
  async getPublishedPosts(category?: string, maxLimit = 20) {
    let q = query(
      collection(db, 'posts'),
      where('status', '==', 'published'),
      orderBy('createdAt', 'desc'),
      limit(maxLimit)
    );
    
    if (category && category !== 'All') {
      q = query(q, where('category', '==', category));
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapPost(doc));
  },
  
  async getPostBySlug(slug: string) {
    const q = query(collection(db, 'posts'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    const postDoc = snapshot.docs[0];
    
    // Increment view count asynchronously
    this.incrementViews(postDoc.id);
    
    return this.mapPost(postDoc);
  },
  
  async incrementViews(postId: string) {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, { viewCount: increment(1) });
  },

  async toggleLike(postId: string, amount: number) {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, { likeCount: increment(amount) });
  },

  // --- Admin Methods ---

  async getAllPostsAdmin() {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => this.mapPost(doc));
  },

  async createPost(postData: Partial<Post>) {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      viewCount: 0,
      likeCount: 0,
      status: postData.status || 'draft'
    });
    return docRef.id;
  },

  async updatePost(postId: string, postData: Partial<Post>) {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, {
      ...postData,
      updatedAt: serverTimestamp()
    });
  },

  async deletePost(postId: string) {
    await deleteDoc(doc(db, 'posts', postId));
  },

  // --- Helpers ---
  
  mapPost(doc: any): Post {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
    } as Post;
  }
};
