'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { getDateRangePreset, type DatePreset, type DateRange } from '@/lib/date-utils'
import { formatDateRange } from '@/lib/date-utils'

interface DateRangeSelectorProps {
  value: DateRange
  onChange: (range: DateRange) => void
}

const presets: Array<{ label: string; value: DatePreset }> = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'thisWeek' },
  { label: 'This Month', value: 'thisMonth' },
  { label: 'Last Month', value: 'lastMonth' },
  { label: 'Last 3 Months', value: 'last3Months' },
  { label: 'This Year', value: 'thisYear' },
]

export function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
  const [isCustom, setIsCustom] = useState(false)
  const [startDate, setStartDate] = useState(
    value.startDate.toISOString().split('T')[0]
  )
  const [endDate, setEndDate] = useState(
    value.endDate.toISOString().split('T')[0]
  )

  const handlePreset = (preset: DatePreset) => {
    const range = getDateRangePreset(preset)
    onChange(range)
    setIsCustom(false)
    setStartDate(range.startDate.toISOString().split('T')[0])
    setEndDate(range.endDate.toISOString().split('T')[0])
  }

  const handleCustomDateChange = () => {
    if (startDate && endDate) {
      onChange({
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      })
      setIsCustom(true)
    }
  }

  useEffect(() => {
    setStartDate(value.startDate.toISOString().split('T')[0])
    setEndDate(value.endDate.toISOString().split('T')[0])
  }, [value])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.value}
            variant="ghost"
            size="sm"
            onClick={() => handlePreset(preset.value)}
            className="text-sm"
          >
            {preset.label}
          </Button>
        ))}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value)
              if (e.target.value && endDate) {
                onChange({
                  startDate: new Date(e.target.value),
                  endDate: new Date(endDate),
                })
                setIsCustom(true)
              }
            }}
            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value)
              if (startDate && e.target.value) {
                onChange({
                  startDate: new Date(startDate),
                  endDate: new Date(e.target.value),
                })
                setIsCustom(true)
              }
            }}
            className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <span className="text-sm text-gray-600">
          {formatDateRange(value)}
        </span>
      </div>
    </div>
  )
}

