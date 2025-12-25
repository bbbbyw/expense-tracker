import express from 'express'
import cors from 'cors'
import categoriesRoutes from './routes/categories'
import expensesRoutes from './routes/expenses'
import analyticsRoutes from './routes/analytics'

const app = express()
const PORT = process.env.PORT || 3001

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
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} | originalUrl: ${req.originalUrl} | baseUrl: ${req.baseUrl}`)
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
// Vercel routes it to api/index.js, and Express receives the FULL path: /api/categories
// So we MUST handle /api/* paths (not just /categories)
app.use('/api/categories', categoriesRoutes)
app.use('/api/expenses', expensesRoutes)
app.use('/api/analytics', analyticsRoutes)

// Also handle paths without /api/ prefix for local development (when running on port 3001)
app.use('/categories', categoriesRoutes)
app.use('/expenses', expensesRoutes)
app.use('/analytics', analyticsRoutes)

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
  console.log(`[404] Route not found: ${req.method} ${req.path} | originalUrl: ${req.originalUrl}`)
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    originalUrl: req.originalUrl,
    method: req.method
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

