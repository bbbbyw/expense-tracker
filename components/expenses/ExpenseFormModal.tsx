'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { expenseSchema, type ExpenseInput } from '@/lib/validations'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { ExpenseWithCategory, Category } from '@/types'

interface ExpenseFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ExpenseInput) => Promise<void>
  categories: Category[]
  expense?: ExpenseWithCategory | null
}

export function ExpenseFormModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  expense,
}: ExpenseFormModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm<ExpenseInput>({
    resolver: zodResolver(expenseSchema),
    mode: 'onBlur',
    defaultValues: {
      amount: 0,
      description: '',
      date: new Date().toISOString().slice(0, 16), // Format for datetime-local
      categoryId: '',
      notes: '',
    },
  })

  // Reset form when modal opens/closes or expense changes
  useEffect(() => {
    if (isOpen) {
      if (expense) {
        const amountValue = typeof expense.amount === 'string' 
          ? parseFloat(expense.amount) 
          : (expense.amount as any)?.toNumber?.() || parseFloat(String(expense.amount))
        reset({
          amount: amountValue,
          description: expense.description,
          date: new Date(expense.date).toISOString().slice(0, 16),
          categoryId: expense.categoryId,
          notes: expense.notes || '',
        })
      } else {
        reset({
          amount: 0,
          description: '',
          date: new Date().toISOString().slice(0, 16),
          categoryId: '',
          notes: '',
        })
      }
    }
  }, [expense, isOpen, reset])

  const handleFormSubmit = async (data: ExpenseInput) => {
    try {
      // Get current form values in case data is incomplete
      const currentValues = getValues()
      
      // Use data from handleSubmit, fallback to currentValues
      const formDataRaw = {
        amount: data.amount ?? currentValues.amount ?? 0,
        description: data.description ?? currentValues.description ?? '',
        date: data.date ?? currentValues.date ?? '',
        categoryId: data.categoryId ?? currentValues.categoryId ?? '',
        notes: data.notes ?? currentValues.notes ?? '',
      }
      
      // Convert datetime-local format to ISO string
      let dateValue = formDataRaw.date
      if (dateValue && !dateValue.includes('Z') && !dateValue.includes('+')) {
        dateValue = new Date(dateValue).toISOString()
      }
      
      const formData: ExpenseInput = {
        amount: typeof formDataRaw.amount === 'string' ? parseFloat(formDataRaw.amount) : (formDataRaw.amount || 0),
        description: (formDataRaw.description || '').trim(),
        date: dateValue,
        categoryId: formDataRaw.categoryId || '',
        notes: formDataRaw.notes || '',
      }
      
      await onSubmit(formData)
      reset()
      onClose()
    } catch (error) {
      console.error('Error submitting expense:', error)
      throw error // Re-throw so form doesn't close on error
    }
  }

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: `${cat.icon || ''} ${cat.name}`,
  }))

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={expense ? 'Edit Expense' : 'Add New Expense'}
      size="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            step="0.01"
            min="0.01"
            {...register('amount', { 
              valueAsNumber: true,
              required: 'Amount is required',
              validate: (value) => {
                const num = typeof value === 'number' ? value : parseFloat(String(value || 0))
                return (num > 0) || 'Amount must be greater than 0'
              }
            })}
            error={errors.amount?.message}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="datetime-local"
              {...register('date', { 
                required: 'Date is required',
                valueAsDate: false, // Keep as string for datetime-local
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>
        </div>

        <Input
          label="Description"
          {...register('description', { required: 'Description is required' })}
          error={errors.description?.message}
        />

        <Select
          label="Category"
          options={[
            { value: '', label: 'Select a category' },
            ...categoryOptions,
          ]}
          {...register('categoryId', { 
            required: 'Category is required',
            validate: (value) => value !== '' || 'Please select a category'
          })}
          error={errors.categoryId?.message}
        />

        <Textarea
          label="Notes (optional)"
          rows={3}
          {...register('notes')}
          error={errors.notes?.message}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {expense ? 'Update' : 'Create'} Expense
          </Button>
        </div>
      </form>
    </Modal>
  )
}

