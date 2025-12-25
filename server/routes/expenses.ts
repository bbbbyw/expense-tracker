import express, { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { expenseSchema } from '../lib/validations'
import { Prisma } from '@prisma/client'

const router = express.Router()

// GET /api/expenses - Get expenses with filtering and pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      startDate,
      endDate,
      categoryId,
      sortBy = 'date',
      order = 'desc',
      page = '1',
      limit = '50',
      search,
    } = req.query

    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    // Build where clause
    const where: Prisma.ExpenseWhereInput = {}

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

    if (search) {
      where.OR = [
        { description: { contains: search as string, mode: 'insensitive' } },
        { notes: { contains: search as string, mode: 'insensitive' } },
      ]
    }

    // Build orderBy clause
    let orderBy: Prisma.ExpenseOrderByWithRelationInput = {}
    if (sortBy === 'amount') {
      orderBy = { amount: order as 'asc' | 'desc' }
    } else if (sortBy === 'category') {
      orderBy = { category: { name: order as 'asc' | 'desc' } }
    } else {
      orderBy = { date: order as 'asc' | 'desc' }
    }

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: {
          category: true,
        },
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.expense.count({ where }),
    ])

    const totalPages = Math.ceil(total / limitNum)

    res.json({
      expenses,
      total,
      page: pageNum,
      totalPages,
    })
  } catch (error) {
    console.error('Error fetching expenses:', error)
    res.status(500).json({ error: 'Failed to fetch expenses' })
  }
})

// POST /api/expenses - Create new expense
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = expenseSchema.parse(req.body)

    const expense = await prisma.expense.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
      },
      include: {
        category: true,
      },
    })

    res.status(201).json({ expense })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Invalid input data',
        details: error.errors,
      })
    }

    // Handle foreign key constraint
    if (error?.code === 'P2003') {
      return res.status(400).json({
        error: 'Invalid category ID',
      })
    }

    console.error('Error creating expense:', error)
    res.status(500).json({ error: 'Failed to create expense' })
  }
})

// PUT /api/expenses/:id - Update expense
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const validatedData = expenseSchema.partial().parse(req.body)

    const updateData: any = { ...validatedData }
    if (validatedData.date) {
      updateData.date = new Date(validatedData.date)
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    })

    res.json({ expense })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Invalid input data',
        details: error.errors,
      })
    }

    // Handle not found
    if (error?.code === 'P2025') {
      return res.status(404).json({
        error: 'Expense not found',
      })
    }

    // Handle foreign key constraint
    if (error?.code === 'P2003') {
      return res.status(400).json({
        error: 'Invalid category ID',
      })
    }

    console.error('Error updating expense:', error)
    res.status(500).json({ error: 'Failed to update expense' })
  }
})

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    await prisma.expense.delete({
      where: { id },
    })

    res.json({ message: 'Expense deleted successfully' })
  } catch (error: any) {
    // Handle not found
    if (error?.code === 'P2025') {
      return res.status(404).json({
        error: 'Expense not found',
      })
    }

    console.error('Error deleting expense:', error)
    res.status(500).json({ error: 'Failed to delete expense' })
  }
})

export default router

