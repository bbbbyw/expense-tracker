import { Category, Expense } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

export type { Category, Expense }

export interface CategoryWithCount extends Category {
  _count?: {
    expenses: number
  }
}

export interface ExpenseWithCategory extends Expense {
  category: Category
}

export interface AnalyticsSummary {
  totalExpenses: number
  totalAmount: Decimal
  averageExpense: Decimal
  expenseCount: number
  categoryBreakdown: Array<{
    categoryId: string
    categoryName: string
    total: Decimal
    count: number
    percentage: number
  }>
  dailyTotals: Array<{
    date: string
    total: Decimal
    count: number
  }>
  topExpenses: ExpenseWithCategory[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
}

