export type Role = 'admin' | 'author' | 'reader';
export type PostStatus = 'draft' | 'published';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: Role;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  authorId: string;
  authorName: string;
  category: string;
  tags: string[];
  status: PostStatus;
  viewCount: number;
  likeCount: number;
  createdAt: any;
  updatedAt: any;
  publishedAt?: any;
}

export interface Comment {
  id: string;
  postId: string;
  parentId?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: any;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Wallpaper {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  category?: string;
  authorId?: string;
  createdAt: any;
}
