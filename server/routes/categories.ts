import express, { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { categorySchema } from '../lib/validations'
import { Decimal } from '@prisma/client/runtime/library'

const router = express.Router()

// GET /api/categories - Get all categories
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { expenses: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    // Calculate total amount for each category
    const categoriesWithTotals = await Promise.all(
      categories.map(async (category) => {
        const expenses = await prisma.expense.findMany({
          where: { categoryId: category.id },
          select: { amount: true },
        })
        
        const totalAmount = expenses.reduce(
          (sum, exp) => sum.plus(exp.amount),
          new Decimal(0)
        )

        return {
          ...category,
          totalAmount: totalAmount.toNumber(),
        }
      })
    )

    res.json({ categories: categoriesWithTotals })
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// POST /api/categories - Create new category
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = categorySchema.parse(req.body)

    const category = await prisma.category.create({
      data: validatedData,
    })

    res.status(201).json({ category })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: 'Invalid input data',
        details: error.errors,
      })
    }

    // Handle unique constraint violation
    if (error?.code === 'P2002') {
      return res.status(409).json({
        error: 'Category name already exists',
      })
    }

    console.error('Error creating category:', error)
    res.status(500).json({ error: 'Failed to create category' })
  }
})

// PUT /api/categories/:id - Update category
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const validatedData = categorySchema.partial().parse(req.body)

    const category = await prisma.category.update({
      where: { id },
      data: validatedData,
    })

    res.json({ category })
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
        error: 'Category not found',
      })
    }

    // Handle unique constraint violation
    if (error?.code === 'P2002') {
      return res.status(409).json({
        error: 'Category name already exists',
      })
    }

    console.error('Error updating category:', error)
    res.status(500).json({ error: 'Failed to update category' })
  }
})

// DELETE /api/categories/:id - Delete category
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    await prisma.category.delete({
      where: { id },
    })

    res.json({ message: 'Category deleted successfully' })
  } catch (error: any) {
    // Handle not found
    if (error?.code === 'P2025') {
      return res.status(404).json({
        error: 'Category not found',
      })
    }

    console.error('Error deleting category:', error)
    res.status(500).json({ error: 'Failed to delete category' })
  }
})

export default router

