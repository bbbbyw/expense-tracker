// API Configuration
// In development, the Express server runs on port 3001
// In production (Vercel), use same domain (relative paths)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' 
    ? (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001')
    : (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'))

