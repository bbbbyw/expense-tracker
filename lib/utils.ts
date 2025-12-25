import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | string | any): string {
  // Handle Decimal type from Prisma without importing it
  let numAmount: number
  if (typeof amount === 'string') {
    numAmount = parseFloat(amount)
  } else if (typeof amount === 'number') {
    numAmount = amount
  } else if (amount && typeof amount === 'object' && 'toNumber' in amount) {
    // Handle Prisma Decimal type
    numAmount = amount.toNumber()
  } else {
    numAmount = parseFloat(String(amount)) || 0
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numAmount)
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj)
}

export function formatDateShort(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(dateObj)
}

