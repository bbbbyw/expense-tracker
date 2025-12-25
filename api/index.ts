// Vercel Serverless Function entry point for Express backend
// Using TypeScript - Vercel will compile this automatically
import app from '../server/index'

// Export the Express app - Vercel serverless functions automatically handle Express apps
export default app

