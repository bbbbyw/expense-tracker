'use client'

import React, { useState, useEffect } from 'react'
import { ExpenseTable } from '@/components/expenses/ExpenseTable'
import { ExpenseFormModal } from '@/components/expenses/ExpenseFormModal'
import { ExpenseFilters } from '@/components/expenses/ExpenseFilters'
import { Pagination } from '@/components/shared/Pagination'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { ExpenseWithCategory, Category } from '@/types'
import { useToast } from '@/components/ui/Toast'
import { getDateRangePreset } from '@/lib/date-utils'
import { api } from '@/lib/api-client'

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<ExpenseWithCategory | null>(null)
  
  // Filters
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  const { showToast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchExpenses()
  }, [search, categoryId, sortBy, order, page])

  const fetchCategories = async () => {
    try {
      const data = await api.getCategories()
      setCategories(data.categories)
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      showToast(error.message || 'Failed to load categories', 'error')
    }
  }

  const fetchExpenses = async () => {
    setIsLoading(true)
    try {
      const dateRange = getDateRangePreset('thisYear') // Get all expenses, filter by search/category
      const params: Record<string, string> = {
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
        sortBy,
        order,
        page: page.toString(),
        limit: '20',
      }

      if (search) params.search = search
      if (categoryId) params.categoryId = categoryId

      const data = await api.getExpenses(params)
      setExpenses(data.expenses)
      setTotalPages(data.totalPages)
    } catch (error: any) {
      console.error('Error fetching expenses:', error)
      showToast(error.message || 'Failed to load expenses', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateExpense = async (data: any) => {
    try {
      await api.createExpense(data)
      showToast('Expense created successfully', 'success')
      fetchExpenses()
    } catch (error: any) {
      showToast(error.message || 'Failed to create expense', 'error')
      throw error
    }
  }

  const handleUpdateExpense = async (data: any) => {
    if (!editingExpense) return

    try {
      await api.updateExpense(editingExpense.id, data)
      showToast('Expense updated successfully', 'success')
      setEditingExpense(null)
      setIsModalOpen(false)
      fetchExpenses()
    } catch (error: any) {
      showToast(error.message || 'Failed to update expense', 'error')
      throw error
    }
  }

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return

    try {
      await api.deleteExpense(id)
      showToast('Expense deleted successfully', 'success')
      fetchExpenses()
    } catch (error: any) {
      showToast(error.message || 'Failed to delete expense', 'error')
    }
  }

  const handleEdit = (expense: ExpenseWithCategory) => {
    setEditingExpense(expense)
    setIsModalOpen(true)
  }

  const handleClearFilters = () => {
    setSearch('')
    setCategoryId('')
    setPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
        <Button onClick={() => {
          setEditingExpense(null)
          setIsModalOpen(true)
        }}>
          <Plus size={20} className="mr-2" />
          Add Expense
        </Button>
      </div>

      <div className="mb-6">
        <ExpenseFilters
          search={search}
          onSearchChange={setSearch}
          categoryId={categoryId}
          onCategoryChange={setCategoryId}
          categories={categories}
          onClear={handleClearFilters}
        />
      </div>

      <div className="mb-4 flex items-center gap-4">
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value as any)
            setPage(1)
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="date">Sort by Date</option>
          <option value="amount">Sort by Amount</option>
          <option value="category">Sort by Category</option>
        </select>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setOrder(order === 'asc' ? 'desc' : 'asc')
            setPage(1)
          }}
        >
          {order === 'asc' ? '↑ Ascending' : '↓ Descending'}
        </Button>
      </div>

      <ExpenseTable
        expenses={expenses}
        onEdit={handleEdit}
        onDelete={handleDeleteExpense}
        isLoading={isLoading}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ExpenseFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingExpense(null)
        }}
        onSubmit={editingExpense ? handleUpdateExpense : handleCreateExpense}
        categories={categories}
        expense={editingExpense}
      />
    </div>
  )
}

