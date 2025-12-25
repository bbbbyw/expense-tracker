'use client'

import React from 'react'
import { ExpenseWithCategory } from '@/types'
import { formatCurrency, formatDateShort } from '@/lib/utils'

interface RecentExpensesListProps {
  expenses: ExpenseWithCategory[]
}

export function RecentExpensesList({ expenses }: RecentExpensesListProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No recent expenses</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
              style={{
                backgroundColor: `${expense.category.color || '#gray'}20`,
              }}
            >
              {expense.category.icon || '📌'}
            </div>
            <div>
              <p className="font-medium">{expense.description}</p>
              <p className="text-sm text-gray-500">
                {formatDateShort(expense.date)} • {expense.category.name}
              </p>
            </div>
          </div>
          <p className="font-semibold text-lg">{formatCurrency(expense.amount)}</p>
        </div>
      ))}
    </div>
  )
}

