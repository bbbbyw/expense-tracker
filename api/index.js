// Vercel Serverless Function entry point for Express backend
// Using .js file with require to avoid ES6 import compilation issues
// Vercel will automatically compile TypeScript files when required

// Use require to import the TypeScript server file
// Vercel's @vercel/node will compile it on the fly
const app = require('../server/index.ts');

// Handle default export (TypeScript default exports become .default in CommonJS)
const expressApp = app.default || app;

// Export the Express app
module.exports = expressApp;
