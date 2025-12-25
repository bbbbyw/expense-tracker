'use client'

import React from 'react'
import { Category } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Edit, Trash2 } from 'lucide-react'
import { Decimal } from '@prisma/client/runtime/library'

interface CategoryCardProps {
  category: Category & {
    _count?: { expenses: number }
    totalAmount?: Decimal
  }
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  const expenseCount = category._count?.expenses || 0
  const totalAmountValue = category.totalAmount
    ? (typeof category.totalAmount === 'number' 
        ? category.totalAmount 
        : (category.totalAmount as any)?.toNumber?.() || parseFloat(String(category.totalAmount)) || 0)
    : 0
  const totalAmount = formatCurrency(totalAmountValue)

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {category.icon && (
            <span className="text-2xl">{category.icon}</span>
          )}
          <div>
            <h3 className="text-lg font-semibold">{category.name}</h3>
            <div
              className="w-6 h-6 rounded-full mt-1"
              style={{ backgroundColor: category.color || '#gray' }}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(category)}
            title="Edit"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(category.id)}
            title="Delete"
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-sm text-gray-500">Total Expenses</p>
          <p className="text-lg font-semibold">{expenseCount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-lg font-semibold">{totalAmount}</p>
        </div>
      </div>
    </div>
  )
}

