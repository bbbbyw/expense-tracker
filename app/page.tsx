'use client'

import React, { useState, useEffect } from 'react'
import { DateRangeSelector } from '@/components/shared/DateRangeSelector'
import { SummaryCard } from '@/components/dashboard/SummaryCard'
import { CategoryPieChart } from '@/components/dashboard/CategoryPieChart'
import { ExpenseTrendChart } from '@/components/dashboard/ExpenseTrendChart'
import { RecentExpensesList } from '@/components/dashboard/RecentExpensesList'
import { Card } from '@/components/ui/Card'
import { getDateRangePreset } from '@/lib/date-utils'
import { formatCurrency } from '@/lib/utils'
import { AnalyticsSummary } from '@/types'
import { DollarSign, TrendingUp, Receipt, Tag } from 'lucide-react'
import { api } from '@/lib/api-client'

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState(getDateRangePreset('thisMonth'))
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const params = {
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString(),
      }

      const data = await api.getAnalytics(params) as AnalyticsSummary
      setAnalytics(data)
    } catch (error: any) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const categoryBreakdown = analytics?.categoryBreakdown.map((item) => ({
    name: item.categoryName,
    value: typeof item.total === 'number' ? item.total : parseFloat(String(item.total)),
    color: '#3B82F6', // Default color, would be better to get from category
    percentage: item.percentage,
  })) || []

  const dailyTotals = analytics?.dailyTotals.map((item) => ({
    date: item.date,
    total: typeof item.total === 'number' ? item.total : parseFloat(String(item.total)),
    count: item.count,
  })) || []

  const mostExpensiveCategory = analytics?.categoryBreakdown[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <DateRangeSelector value={dateRange} onChange={setDateRange} />
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SummaryCard
              title="Total Expenses"
              value={formatCurrency(analytics?.totalAmount || 0)}
              icon={<DollarSign size={20} />}
            />
            <SummaryCard
              title="Average Expense"
              value={formatCurrency(analytics?.averageExpense || 0)}
              icon={<TrendingUp size={20} />}
            />
            <SummaryCard
              title="Transactions"
              value={analytics?.expenseCount || 0}
              icon={<Receipt size={20} />}
            />
            <SummaryCard
              title="Top Category"
              value={mostExpensiveCategory?.categoryName || 'N/A'}
              icon={<Tag size={20} />}
              subtitle={mostExpensiveCategory ? `${mostExpensiveCategory.percentage.toFixed(1)}% of total` : undefined}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card title="Category Breakdown">
              <CategoryPieChart data={categoryBreakdown} />
            </Card>
            <Card title="Expense Trend">
              <ExpenseTrendChart data={dailyTotals} />
            </Card>
          </div>

          {/* Recent Expenses */}
          <Card title="Recent Expenses">
            <RecentExpensesList expenses={analytics?.topExpenses || []} />
          </Card>
        </>
      )}
    </div>
  )
}

