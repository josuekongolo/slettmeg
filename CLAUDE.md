# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SlettMeg is a Norwegian SaaS application that helps users delete their digital footprint by managing account deletion requests across various platforms. It provides step-by-step guidance and generates GDPR-compliant deletion requests.

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

After modifying Prisma schema:
```bash
npx prisma generate    # Regenerate Prisma client (also runs on postinstall)
npx prisma db push     # Push schema changes to database
npx prisma migrate dev # Create and apply migrations
```

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives with shadcn/ui patterns
- **State Management**: Zustand with persist middleware
- **Email**: Resend
- **Payments**: Stripe

## Architecture

### Directory Structure

- `app/` - Next.js App Router pages and layouts
  - `dashboard/` - Authenticated user area (platforms, requests, billing, assistant)
  - `auth/` - Login/register pages
  - `api/` - API routes (not yet created)
- `components/` - React components
  - `ui/` - Reusable UI primitives (shadcn/ui style)
  - `layout/` - Layout components (Navbar, Footer, DashboardSidebar)
  - `providers/` - React context providers (ThemeProvider)
- `lib/` - Utilities and business logic
  - `db.ts` - Prisma client singleton
  - `utils.ts` - Utility functions (cn helper)
  - `platforms-data.ts` - Platform definitions with deletion metadata
  - `gdpr-generator.ts` - GDPR request letter templates in Norwegian
  - `stores/` - Zustand stores

### Key Patterns

**Client-side State**: The `deletion-store.ts` manages deletion request state with Zustand, persisted to localStorage. Contains platform-specific deletion step workflows for major platforms (Facebook, Instagram, Google, TikTok, LinkedIn, Spotify, Netflix).

**Database Models**: User, Platform, UserPlatform (join), DeletionRequest, Subscription (Stripe), ChatMessage. Uses enums for PlatformStatus, RequestType, RequestStatus, SubscriptionStatus, Plan.

**Path Alias**: `@/*` maps to project root.

## Language

This is a Norwegian application. UI text, GDPR templates, and user-facing content should be in Norwegian (Bokmål).
