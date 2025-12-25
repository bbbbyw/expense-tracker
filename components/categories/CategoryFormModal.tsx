'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categorySchema, type CategoryInput } from '@/lib/validations'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Category } from '@/types'

interface CategoryFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CategoryInput) => Promise<void>
  category?: Category | null
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  category,
}: CategoryFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      color: '#3B82F6',
      icon: '',
    },
  })

  useEffect(() => {
    if (category) {
      setValue('name', category.name)
      setValue('color', category.color || '#3B82F6')
      setValue('icon', category.icon || '')
    } else {
      reset()
      setValue('color', '#3B82F6')
    }
  }, [category, setValue, reset])

  const handleFormSubmit = async (data: CategoryInput) => {
    try {
      // Clean up the data - remove empty optional fields
      const formData = {
        name: data.name.trim(),
        color: data.color && data.color.trim() ? data.color.trim() : undefined,
        icon: data.icon && data.icon.trim() ? data.icon.trim() : undefined,
      }
      await onSubmit(formData)
      reset()
      onClose()
    } catch (error) {
      console.error('Error submitting category:', error)
    }
  }

  const presetColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
    '#98D8C8', '#F7B731', '#5F27CD', '#95A5A6',
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444',
  ]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'Add New Category'}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Category Name"
          {...register('name', { required: 'Category name is required' })}
          error={errors.name?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              {...register('color')}
              className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
            />
            <Input
              {...register('color')}
              className="flex-1"
              error={errors.color?.message}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setValue('color', color)}
                className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400 transition-colors"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>

        <Input
          label="Icon (emoji or text, optional)"
          placeholder="🍔"
          maxLength={10}
          {...register('icon')}
          error={errors.icon?.message}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {category ? 'Update' : 'Create'} Category
          </Button>
        </div>
      </form>
    </Modal>
  )
}

