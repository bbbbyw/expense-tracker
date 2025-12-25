import express from 'express'
import cors from 'cors'
import categoriesRoutes from './routes/categories'
import expensesRoutes from './routes/expenses'
import analyticsRoutes from './routes/analytics'

console.log('[SERVER INDEX] Express app initializing...')
console.log('[SERVER INDEX] VERCEL env:', process.env.VERCEL)
console.log('[SERVER INDEX] NODE_ENV:', process.env.NODE_ENV)

const app = express()
const PORT = process.env.PORT || 3001

console.log('[SERVER INDEX] Express app created')

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true // Allow same origin in production (monorepo - same domain)
    : 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging middleware - log full request details for debugging
app.use((req, res, next) => {
  console.log(`[DEBUG] ${new Date().toISOString()} - ${req.method} ${req.path}`)
  console.log(`[DEBUG] originalUrl: ${req.originalUrl}`)
  console.log(`[DEBUG] baseUrl: ${req.baseUrl}`)
  console.log(`[DEBUG] url: ${req.url}`)
  console.log(`[DEBUG] VERCEL env: ${process.env.VERCEL}`)
  next()
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Expense Tracker API is running' })
})

// Root API endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Expense Tracker API', version: '1.0.0' })
})

// API Routes
// IMPORTANT: In Vercel serverless, when request comes to /api/categories,
// Vercel routes it to api/index.ts, and Express receives the path
// We need to handle both cases: with /api/ prefix and without

console.log('[SERVER INDEX] Registering API routes...')

// Try /api/* paths first (for Vercel)
app.use('/api/categories', (req, res, next) => {
  console.log(`[ROUTE MATCH] /api/categories - path: ${req.path}, originalUrl: ${req.originalUrl}`)
  next()
}, categoriesRoutes)

app.use('/api/expenses', (req, res, next) => {
  console.log(`[ROUTE MATCH] /api/expenses - path: ${req.path}, originalUrl: ${req.originalUrl}`)
  next()
}, expensesRoutes)

app.use('/api/analytics', (req, res, next) => {
  console.log(`[ROUTE MATCH] /api/analytics - path: ${req.path}, originalUrl: ${req.originalUrl}`)
  next()
}, analyticsRoutes)

// Also handle paths without /api/ prefix (for local development and if Vercel strips prefix)
app.use('/categories', (req, res, next) => {
  console.log(`[ROUTE MATCH] /categories - path: ${req.path}, originalUrl: ${req.originalUrl}`)
  next()
}, categoriesRoutes)

app.use('/expenses', (req, res, next) => {
  console.log(`[ROUTE MATCH] /expenses - path: ${req.path}, originalUrl: ${req.originalUrl}`)
  next()
}, expensesRoutes)

app.use('/analytics', (req, res, next) => {
  console.log(`[ROUTE MATCH] /analytics - path: ${req.path}, originalUrl: ${req.originalUrl}`)
  next()
}, analyticsRoutes)

console.log('[SERVER INDEX] All routes registered successfully')

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// 404 handler - log the path for debugging
app.use((req, res) => {
  console.log(`[404 ERROR] Route not found:`)
  console.log(`  Method: ${req.method}`)
  console.log(`  Path: ${req.path}`)
  console.log(`  Original URL: ${req.originalUrl}`)
  console.log(`  Base URL: ${req.baseUrl}`)
  console.log(`  URL: ${req.url}`)
  console.log(`  All registered routes should be logged above`)
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    originalUrl: req.originalUrl,
    method: req.method,
    message: 'Check Vercel function logs for route matching details'
  })
})

// Only start server if not in Vercel serverless environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Express server running on http://localhost:${PORT}`)
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`)
  })
}

export default app

