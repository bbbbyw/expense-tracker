// Vercel Serverless Function entry point for Express backend
// Import the Express app from server/index.ts


// Add logging to see if this file is being called-debug
console.log('[API INDEX] Serverless function loaded')

import app from '../server/index'

export default app
