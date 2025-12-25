'use client'

import React, { useState, useEffect } from 'react'
import { CategoryCard } from '@/components/categories/CategoryCard'
import { CategoryFormModal } from '@/components/categories/CategoryFormModal'
import { Button } from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import { Category } from '@/types'
import { useToast } from '@/components/ui/Toast'
import { api } from '@/lib/api-client'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const { showToast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const data = await api.getCategories()
      setCategories(data.categories)
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      showToast(error.message || 'Failed to load categories', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCategory = async (data: any) => {
    try {
      await api.createCategory(data)
      showToast('Category created successfully', 'success')
      fetchCategories()
    } catch (error: any) {
      showToast(error.message || 'Failed to create category', 'error')
      throw error
    }
  }

  const handleUpdateCategory = async (data: any) => {
    if (!editingCategory) return

    try {
      await api.updateCategory(editingCategory.id, data)
      showToast('Category updated successfully', 'success')
      setEditingCategory(null)
      setIsModalOpen(false)
      fetchCategories()
    } catch (error: any) {
      showToast(error.message || 'Failed to update category', 'error')
      throw error
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All associated expenses will also be deleted.')) return

    try {
      await api.deleteCategory(id)
      showToast('Category deleted successfully', 'success')
      fetchCategories()
    } catch (error: any) {
      showToast(error.message || 'Failed to delete category', 'error')
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <Button onClick={() => {
          setEditingCategory(null)
          setIsModalOpen(true)
        }}>
          <Plus size={20} className="mr-2" />
          Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-lg text-gray-500 mb-4">No categories yet</p>
          <p className="text-sm text-gray-400 mb-6">Create your first category to get started</p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Create Category
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onEdit={handleEdit}
              onDelete={handleDeleteCategory}
            />
          ))}
        </div>
      )}

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCategory(null)
        }}
        onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
        category={editingCategory}
      />
    </div>
  )
}

