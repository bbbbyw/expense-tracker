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

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/expense_tracker"
NODE_ENV="development"
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init

# (Optional) Seed default categories
npx prisma db seed
```

### 4. Run Development Servers

```bash
npm run dev
```

This starts both:
- **Express API Server** on http://localhost:3001
- **Next.js Frontend** on http://localhost:3000

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

**See `DEPLOY.md` for simple deployment instructions.**

Quick summary:
1. Set up cloud database (Supabase/Railway/Neon)
2. Run migrations: `npx prisma migrate deploy`
3. Push to GitHub
4. Deploy to Vercel (one project - frontend and backend together)
5. Add `DATABASE_URL` environment variable
6. Done! 🚀

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

## Development

- Run linting: `npm run lint`
- View database: `npx prisma studio`
- Generate Prisma Client: `npx prisma generate`

## License

MIT
