// Vercel Serverless Function entry point for Express backend
// Import the Express app from server/index.ts
// Vercel will compile this TypeScript file to CommonJS automatically

// Add logging to see if this file is being called
console.log('[API INDEX] Serverless function loaded')

// Import using ES6 syntax - Vercel will compile this correctly
import app from '../server/index'

// Export the Express app
// Using default export which Vercel will convert to module.exports
export default app
