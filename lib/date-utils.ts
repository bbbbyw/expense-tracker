import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear,
  subMonths,
  subDays,
  startOfDay,
  endOfDay,
  format,
  parseISO,
} from 'date-fns'

export interface DateRange {
  startDate: Date
  endDate: Date
}

export type DatePreset = 
  | 'today'
  | 'thisWeek'
  | 'thisMonth'
  | 'lastMonth'
  | 'last3Months'
  | 'thisYear'
  | 'custom'

export function getDateRangePreset(preset: DatePreset): DateRange {
  const now = new Date()
  
  switch (preset) {
    case 'today':
      return {
        startDate: startOfDay(now),
        endDate: endOfDay(now),
      }
    case 'thisWeek':
      return {
        startDate: startOfWeek(now, { weekStartsOn: 1 }),
        endDate: endOfWeek(now, { weekStartsOn: 1 }),
      }
    case 'thisMonth':
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
      }
    case 'lastMonth':
      const lastMonth = subMonths(now, 1)
      return {
        startDate: startOfMonth(lastMonth),
        endDate: endOfMonth(lastMonth),
      }
    case 'last3Months':
      return {
        startDate: startOfMonth(subMonths(now, 3)),
        endDate: endOfMonth(now),
      }
    case 'thisYear':
      return {
        startDate: startOfYear(now),
        endDate: endOfYear(now),
      }
    default:
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
      }
  }
}

export function formatDateRange(range: DateRange): string {
  return `${format(range.startDate, 'MMM d')} - ${format(range.endDate, 'MMM d, yyyy')}`
}

