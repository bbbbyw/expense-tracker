'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import { formatCurrency } from '@/lib/utils'

interface DailyTotal {
  date: string
  total: number | string
  count: number
}

interface ExpenseTrendChartProps {
  data: DailyTotal[]
}

export function ExpenseTrendChart({ data }: ExpenseTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No data available</p>
      </div>
    )
  }

  const chartData = data.map((item) => ({
    date: format(new Date(item.date), 'MMM d'),
    fullDate: item.date,
    total: typeof item.total === 'number' ? item.total : parseFloat(String(item.total)),
    count: item.count,
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-blue-600">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#3B82F6"
          strokeWidth={2}
          name="Total Expenses"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

