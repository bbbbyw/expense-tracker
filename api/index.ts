// Vercel Serverless Function entry point for Express backend
// This file wraps the Express app to work as a Vercel serverless function
import app from '../server/index'

// Export as handler for Vercel serverless functions
export default app

