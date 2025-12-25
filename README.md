# Expense Tracker Application

A full-stack expense tracking application built with Next.js 14, TypeScript, PostgreSQL, and Prisma.

## Features

- 📊 **Dashboard** with analytics and visualizations
- 💰 **Expense Management** with filtering, sorting, and pagination
- 🏷️ **Category Management** with custom colors and icons
- 📈 **Charts & Analytics** showing spending trends and category breakdowns
- 🔍 **Search & Filter** expenses by date, category, and description
- 📱 **Responsive Design** works on all devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Recharts
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Project Structure

```
├── app/              # Next.js app directory (frontend)
├── server/           # Express backend
│   ├── routes/       # API routes
│   └── lib/          # Backend utilities
├── components/       # React components
├── lib/              # Frontend utilities
├── prisma/           # Database schema and migrations
├── api/              # Vercel serverless entry point
└── vercel.json       # Vercel configuration
```

## API Endpoints

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Expenses
- `GET /api/expenses` - Get expenses (with filtering, sorting, pagination)
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Analytics
- `GET /api/analytics/summary` - Get analytics summary
