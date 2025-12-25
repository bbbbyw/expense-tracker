// Vercel Serverless Function entry point for Express backend
// Using .js file with require to avoid ES6 import compilation issues

// Use require to import the TypeScript server file
// Vercel's @vercel/node will compile it on the fly
const app = require('../server/index.ts');

// Handle default export (TypeScript default exports become .default in CommonJS)
const expressApp = app.default || app;

// Vercel routes /api/* to this function
// The request path received by Express will be the full path including /api/
// So /api/categories becomes /api/categories in Express
module.exports = expressApp;
