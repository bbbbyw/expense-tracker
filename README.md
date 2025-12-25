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
- **Backend**: Node.js with Express.js (separate server)
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Recharts
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

## Getting Started

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

Replace `username`, `password`, and `expense_tracker` with your PostgreSQL credentials.

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

The application runs two servers:
- **Express API Server** (port 3001) - Backend API
- **Next.js Frontend** (port 3000) - Frontend application

```bash
npm run dev
```

This will start both servers concurrently. Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note**: Make sure both servers are running. The frontend communicates with the Express API server.

## Project Structure

```
├── server/              # Express backend server
│   ├── index.ts        # Express server entry point
│   ├── routes/         # API route handlers
│   │   ├── categories.ts
│   │   ├── expenses.ts
│   │   └── analytics.ts
│   └── lib/            # Server utilities
│       ├── prisma.ts
│       └── validations.ts
├── app/                # Next.js frontend
│   ├── categories/     # Categories page
│   ├── expenses/       # Expenses page
│   └── page.tsx       # Dashboard page
├── components/
│   ├── ui/              # Reusable UI components
│   ├── expenses/        # Expense-related components
│   ├── categories/      # Category-related components
│   ├── dashboard/       # Dashboard components
│   └── shared/          # Shared components
├── lib/               # Frontend utilities
│   ├── api-client.ts  # API client helper
│   ├── api-config.ts  # API configuration
│   ├── utils.ts       # Utility functions
│   └── date-utils.ts # Date helper functions
├── prisma/
│   └── schema.prisma    # Database schema
└── types/
    └── index.ts        # TypeScript types
```

## API Endpoints

All API endpoints are served by the Express server running on port 3001.

### Categories
- `GET http://localhost:3001/api/categories` - Get all categories
- `POST http://localhost:3001/api/categories` - Create a category
- `PUT http://localhost:3001/api/categories/:id` - Update a category
- `DELETE http://localhost:3001/api/categories/:id` - Delete a category

### Expenses
- `GET http://localhost:3001/api/expenses` - Get expenses with filtering and pagination
- `POST http://localhost:3001/api/expenses` - Create an expense
- `PUT http://localhost:3001/api/expenses/:id` - Update an expense
- `DELETE http://localhost:3001/api/expenses/:id` - Delete an expense

### Analytics
- `GET http://localhost:3001/api/analytics/summary` - Get analytics summary

## Security Features

- Input validation with Zod schemas
- SQL injection protection via Prisma ORM
- Proper error handling and HTTP status codes
- Type-safe API routes with TypeScript

## Production Deployment

1. Build the Next.js frontend:
```bash
npm run build
```

2. Set environment variables in your hosting platform:
   - `DATABASE_URL` - PostgreSQL connection string
   - `NEXT_PUBLIC_API_URL` - Your Express API server URL (e.g., `https://api.yourapp.com`)
   - `PORT` - Express server port (default: 3001)

3. Run database migrations:
```bash
npx prisma migrate deploy
```

4. Start the servers:
```bash
# Start Express API server
npm run start:server

# In another terminal, start Next.js frontend
npm run start:client
```

**Note**: In production, you may want to use a process manager like PM2 or deploy the servers separately.

## Development

- Run linting: `npm run lint`
- View database: `npx prisma studio`
- Generate Prisma Client: `npx prisma generate`

## License

MIT

