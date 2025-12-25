'use client'

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

interface CategoryData {
  name: string
  value: number
  color: string
  percentage: number
}

interface CategoryPieChartProps {
  data: CategoryData[]
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No data available</p>
      </div>
    )
  }

  const chartData = data.map((item) => ({
    name: item.name,
    value: item.value,
    percentage: item.percentage,
  }))

  const COLORS = data.map((item) => item.color)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-blue-600">
            ${payload[0].value.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            {payload[0].payload.percentage.toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

