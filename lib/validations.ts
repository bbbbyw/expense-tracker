import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name must be less than 50 characters'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color').optional().or(z.literal('')),
  icon: z.string().max(10, 'Icon must be less than 10 characters').optional().or(z.literal('')),
})

export const expenseSchema = z.object({
  amount: z.preprocess(
    (val) => {
      if (typeof val === 'string') return parseFloat(val) || 0
      return val
    },
    z.number({ required_error: 'Amount is required', invalid_type_error: 'Amount must be a number' })
      .positive('Amount must be greater than 0')
  ),
  description: z.string().min(1, 'Description is required').max(200, 'Description must be less than 200 characters'),
  date: z.string().min(1, 'Date is required').refine((date) => {
    const d = new Date(date)
    return !isNaN(d.getTime())
  }, 'Invalid date format'),
  categoryId: z.string().min(1, 'Category is required'),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional().or(z.literal('')),
})

export const updateExpenseSchema = expenseSchema.partial().extend({
  amount: z.number().positive('Amount must be greater than 0').optional(),
  date: z.string().datetime('Invalid date format').optional(),
})

export const updateCategorySchema = categorySchema.partial()

export type CategoryInput = z.infer<typeof categorySchema>
export type ExpenseInput = z.infer<typeof expenseSchema>
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>

