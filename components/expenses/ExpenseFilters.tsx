'use client'

import React from 'react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Category } from '@/types'
import { Search, X } from 'lucide-react'

interface ExpenseFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  categoryId: string
  onCategoryChange: (value: string) => void
  categories: Category[]
  onClear: () => void
}

export function ExpenseFilters({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  categories,
  onClear,
}: ExpenseFiltersProps) {
  const hasFilters = search || categoryId

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map((cat) => ({
      value: cat.id,
      label: `${cat.icon || ''} ${cat.name}`,
    })),
  ]

  return (
    <div className="flex flex-wrap gap-4 items-end">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="w-48">
        <Select
          options={categoryOptions}
          value={categoryId}
          onChange={(e) => onCategoryChange(e.target.value)}
        />
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X size={16} className="mr-1" />
          Clear
        </Button>
      )}
    </div>
  )
}

