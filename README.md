# Tazim Sheriff Blog - Modern Blogging Platform

A premium, full-stack personal blogging platform inspired by Medium and Substack.

## Features

### Public View
- **Minimalist Design**: Clean typography (Cormorant Garamond & Inter) with a focused reading experience.
- **Responsive Layout**: Seamlessly transitions from ultra-wide desktops to mobile devices.
- **Infinite Reading**: Featured posts, categories, and trending stories.
- **Interactions**: Likes, comments, bookmarks, and social sharing.
- **Rich Content**: Support for images, code blocks, and blockquotes.

### Admin Dashboard
- **Analytics**: Beautiful dashboard cards and engagement charts.
- **Post Management**: Full CRUD for stories, drafts, and categories.
- **Premium Editor**: Built with TipTap, supporting markdown shortcuts, image uploads, and live meta-management.
- **Secure Auth**: Firebase Authentication with support for Google Login and Email.

## Tech Stack
- **Frontend**: React 19 + Vite + Tailwind CSS 4.
- **Animations**: Framer Motion.
- **Backend**: Express (Hybrid SPA server).
- **Database**: Google Cloud Firestore.
- **File Storage**: Firebase Storage.
- **Editor**: TipTap (Headless Rich Text Framework).

## Database Schema (Firestore)
- `/users`: Profiles and roles.
- `/posts`: Main blog content.
- `/comments`: Nested responses.
- `/newsletter`: Email subscribers.
- `/likes`: User interactions.

## Environment Variables
- `GEMINI_API_KEY`: Injected automatically for AI features.
- `APP_URL`: Base URL of the application.

## Admin Access
The user `mubashirtazim2k@gmail.com` is automatically bootstrapped as an administrator.

## Development
```bash
npm run dev
# Vite server at http://0.0.0.0:3000
```
