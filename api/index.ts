// Vercel Serverless Function entry point for Express backend
// Using TypeScript - Vercel will compile this automatically
import app from '../server/index'

// Add logging to see if this file is being called
console.log('[API INDEX] Serverless function loaded')

// Export the Express app - Vercel serverless functions automatically handle Express apps
export default app

