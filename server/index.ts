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

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
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
// In Vercel serverless, requests to /api/categories come to this function
// The path received is /categories (Vercel strips /api/)
app.use('/categories', categoriesRoutes)
app.use('/expenses', expensesRoutes)
app.use('/analytics', analyticsRoutes)

// Also handle /api/* paths in case Vercel doesn't strip the prefix
app.use('/api/categories', categoriesRoutes)
app.use('/api/expenses', expensesRoutes)
app.use('/api/analytics', analyticsRoutes)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Only start server if not in Vercel serverless environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Express server running on http://localhost:${PORT}`)
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`)
  })
}

export default app

