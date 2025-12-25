import express, { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { Decimal } from '@prisma/client/runtime/library'
import { format } from 'date-fns'

const router = express.Router()

// GET /api/analytics/summary - Get analytics summary
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, categoryId } = req.query

    const where: any = {}

    if (startDate || endDate) {
      where.date = {}
      if (startDate) {
        where.date.gte = new Date(startDate as string)
      }
      if (endDate) {
        where.date.lte = new Date(endDate as string)
      }
    }

    if (categoryId) {
      where.categoryId = categoryId as string
    }

    // Get all expenses with categories
    const expenses = await prisma.expense.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        amount: 'desc',
      },
    })

    // Calculate totals
    const expenseCount = expenses.length
    const totalAmount = expenses.reduce(
      (sum, exp) => sum.plus(exp.amount),
      new Decimal(0)
    )
    const averageExpense =
      expenseCount > 0 ? totalAmount.dividedBy(expenseCount) : new Decimal(0)

    // Category breakdown
    const categoryMap = new Map<string, {
      categoryId: string
      categoryName: string
      total: Decimal
      count: number
    }>()

    expenses.forEach((expense) => {
      const existing = categoryMap.get(expense.categoryId)
      if (existing) {
        existing.total = existing.total.plus(expense.amount)
        existing.count += 1
      } else {
        categoryMap.set(expense.categoryId, {
          categoryId: expense.categoryId,
          categoryName: expense.category.name,
          total: expense.amount,
          count: 1,
        })
      }
    })

    const categoryBreakdown = Array.from(categoryMap.values())
      .map((item) => ({
        ...item,
        total: item.total.toNumber(),
        percentage:
          totalAmount.toNumber() > 0
            ? (item.total.toNumber() / totalAmount.toNumber()) * 100
            : 0,
      }))
      .sort((a, b) => b.total - a.total)

    // Daily totals
    const dailyMap = new Map<string, { total: Decimal; count: number }>()

    expenses.forEach((expense) => {
      const dateKey = format(new Date(expense.date), 'yyyy-MM-dd')
      const existing = dailyMap.get(dateKey)
      if (existing) {
        existing.total = existing.total.plus(expense.amount)
        existing.count += 1
      } else {
        dailyMap.set(dateKey, {
          total: expense.amount,
          count: 1,
        })
      }
    })

    const dailyTotals = Array.from(dailyMap.entries())
      .map(([date, data]) => ({
        date,
        total: data.total.toNumber(),
        count: data.count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))

    // Top expenses (top 10)
    const topExpenses = expenses.slice(0, 10)

    res.json({
      totalExpenses: expenseCount,
      totalAmount: totalAmount.toNumber(),
      averageExpense: averageExpense.toNumber(),
      expenseCount,
      categoryBreakdown,
      dailyTotals,
      topExpenses,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    res.status(500).json({ error: 'Failed to fetch analytics' })
  }
})

export default router

