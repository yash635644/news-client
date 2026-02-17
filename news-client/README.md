# News Client - User-Facing Frontend

This is the main user-facing frontend for the Gathered News Aggregator.

## Setup

```bash
npm install --legacy-peer-deps
npm run dev
```

Server will run on `http://localhost:3000`

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://your-backend-url
```

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## Deployment

Deploy the `dist/` folder to Vercel, Netlify, or any static hosting service.

### Vercel Deployment
1. Connect your repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy!
