
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
# Project Name
Auto Invoice API

## Environment Variables

This project uses several environment variables for configuration. Create a `.env.local` file in the root of your project and add the following variables:

### Database Configuration
- `DATABASE_URL`: The connection string for your PostgreSQL database.
  Example: `postgresql://username:password@host:port/database?sslmode=require`

### Clerk Authentication
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key.
- `CLERK_SECRET_KEY`: Your Clerk secret key.
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: The URL for the sign-in page (default: `/sign-in`).
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: The URL for the sign-up page (default: `/sign-up`).

### API Configuration
- `NEXT_PUBLIC_URL`: The URL of your API.

## Setting Up Environment Variables

1. Copy the `.env.local` file in the root directory of the project.
2. Replace the placeholder values with your actual configuration details.

Example:

```env
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_
CLERK_SECRET_KEY=sk_test_
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_URL=http://localhost:3000
```