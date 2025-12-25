import React from 'react'
import { formatCurrency } from '@/lib/utils'

interface SummaryCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  subtitle?: string
}

export function SummaryCard({ title, value, icon, subtitle }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {subtitle && (
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      )}
    </div>
  )
}

