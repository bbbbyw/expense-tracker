'use client'

import React from 'react'
import { ExpenseWithCategory } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Edit, Trash2 } from 'lucide-react'

interface ExpenseTableProps {
  expenses: ExpenseWithCategory[]
  onEdit: (expense: ExpenseWithCategory) => void
  onDelete: (id: string) => void
  isLoading?: boolean
}

export function ExpenseTable({
  expenses,
  onEdit,
  onDelete,
  isLoading,
}: ExpenseTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-200 h-16 rounded-lg" />
        ))}
      </div>
    )
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No expenses found</p>
        <p className="text-sm mt-2">Add your first expense to get started</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
            <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr
              key={expense.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-3 px-4 text-sm">{formatDate(expense.date)}</td>
              <td className="py-3 px-4">
                <div className="font-medium">{expense.description}</div>
                {expense.notes && (
                  <div className="text-sm text-gray-500 mt-1">{expense.notes}</div>
                )}
              </td>
              <td className="py-3 px-4">
                <span
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm"
                  style={{
                    backgroundColor: `${expense.category.color || '#gray'}20`,
                    color: expense.category.color || '#gray',
                  }}
                >
                  {expense.category.icon && <span>{expense.category.icon}</span>}
                  {expense.category.name}
                </span>
              </td>
              <td className="py-3 px-4 text-right font-semibold">
                {formatCurrency(expense.amount)}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(expense)}
                    title="Edit"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(expense.id)}
                    title="Delete"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

