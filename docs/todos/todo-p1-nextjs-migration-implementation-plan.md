---
id: todo_007
title: Next.js Migration - Detailed Implementation Plan
date: 2025-06-17
status: pending
author: Development Team
assignee: Development Team
priority: p1
category: feature
estimated_hours: 80
actual_hours: 
sprint: nextjs-migration
tags: [nextjs, migration, implementation, step-by-step]
dependencies: []
related_issue: [issue_002, issue_003, issue_004, issue_005, issue_006]
related_adr: ADR-003
epic: NextJS-Migration
story_points: 13
---

# TODO #007: Next.js Migration - Detailed Implementation Plan

## Overview
Comprehensive step-by-step implementation plan for migrating the React+Vite mortgage calculator to Next.js 14 with App Router and deploying to Vercel.

### User Story
As a developer,
I want a detailed implementation roadmap for the Next.js migration,
So that I can execute the migration systematically with minimal risk and maximum efficiency.

## Background
Based on the comprehensive codebase analysis, this plan provides exact steps for migrating from React+Vite to Next.js while preserving all functionality and improving performance, SEO, and developer experience.

## Migration Timeline: 6 Weeks (80 hours)

### **PHASE 1: Foundation Setup** (Week 1 - 16 hours)

#### **1.1 Project Initialization** (4 hours)
```bash
# Step 1: Create Next.js project in parallel directory
cd /Users/leov/workspace/personal/
npx create-next-app@latest mortgage-calculator-nextjs --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Step 2: Copy essential files
cd mortgage-calculator-nextjs
cp ../mortgage-calculator/package.json ./package-backup.json
cp ../mortgage-calculator/.gitignore ./
cp ../mortgage-calculator/README.md ./
cp ../mortgage-calculator/CLAUDE.md ./

# Step 3: Initialize with Bun
rm package-lock.json
bun install
```

#### **1.2 Dependency Migration** (6 hours)
```bash
# Remove React Router dependencies
bun remove react-router-dom query-string

# Add Next.js specific dependencies  
bun add next@latest

# Verify existing dependencies work with Next.js
bun install @radix-ui/react-slot @radix-ui/react-tabs
bun install class-variance-authority clsx lucide-react
bun install react-number-format recharts tailwind-merge

# Development dependencies
bun add -d @types/node
```

#### **1.3 Configuration Setup** (4 hours)

**next.config.js:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', '@radix-ui/react-tabs']
  },
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  eslint: {
    dirs: ['src', 'app']
  }
}

module.exports = nextConfig
```

**tsconfig.json updates:**
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**package.json scripts:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "bun test",
    "analyze": "ANALYZE=true next build"
  }
}
```

#### **1.4 Basic App Structure** (2 hours)
```typescript
// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mortgage Calculator Netherlands',
  description: 'Calculate and compare Annuity and Linear mortgage structures',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  )
}
```

```typescript
// app/page.tsx (basic placeholder)
export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold">Mortgage Calculator</h1>
      <p>Next.js migration in progress...</p>
    </main>
  )
}
```

---

### **PHASE 2: Core Component Migration** (Weeks 2-3 - 32 hours)

#### **2.1 Copy and Adapt Components** (8 hours)
```bash
# Copy component files
cp -r ../mortgage-calculator/src/components ./src/
cp -r ../mortgage-calculator/src/common ./src/
cp -r ../mortgage-calculator/src/lib ./src/
cp -r ../mortgage-calculator/src/styles ./src/

# Copy and adapt CSS
cp ../mortgage-calculator/src/index.css ./src/globals.css
cp ../mortgage-calculator/tailwind.config.js ./
cp ../mortgage-calculator/postcss.config.js ./
```

#### **2.2 Main App Component Migration** (12 hours)

**Convert App.tsx to Client Component:**
```typescript
// src/components/MortgageCalculator.tsx
'use client'
import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  calculateAnnuityData,
  calculateLinearData,
  calgulateLoanFigures,
} from '@/common/Formulas'
import type { AppState, InfoTabs, TableTabs } from '@/common/Types'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
// ... other imports

const defaultState: AppState = {
  price: 310000,
  loan: 248000,
  interest: 4.62,
  // ... rest of default state
}

export function MortgageCalculator() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Initialize state from URL parameters
  const [state, setState] = useState<AppState>(() => {
    const params = Object.fromEntries(searchParams.entries())
    return {
      ...defaultState,
      price: Number(params.price) || defaultState.price,
      loan: Number(params.loan) || defaultState.loan,
      interest: Number(params.interest) || defaultState.interest,
      // ... map all URL parameters
    }
  })
  
  const [infoTab, setInfoTab] = useState<InfoTabs>('mortgage')
  const [tab, setTab] = useState<TableTabs>('annuity')

  // URL synchronization effect
  useEffect(() => {
    const params = new URLSearchParams()
    
    // Only add non-default values to URL
    if (state.price !== defaultState.price) {
      params.set('price', state.price.toString())
    }
    if (state.loan !== defaultState.loan) {
      params.set('loan', state.loan.toString())
    }
    // ... add all state values
    
    const newSearch = params.toString()
    const currentSearch = searchParams.toString()
    
    if (newSearch !== currentSearch) {
      router.replace(`/?${newSearch}`, { scroll: false })
    }
  }, [state, router, searchParams])

  // ... rest of component logic (calculations, handlers, etc.)
  
  return (
    <div className="space-y-12">
      {/* Mortgage Information Section */}
      <section className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Mortgage Information</h2>
        <Tabs value={infoTab} onValueChange={(value) => setInfoTab(value as InfoTabs)}>
          {/* ... rest of component JSX */}
        </Tabs>
      </section>
      {/* ... rest of sections */}
    </div>
  )
}
```

**Update app/page.tsx:**
```typescript
// app/page.tsx
import { MortgageCalculator } from '@/components/MortgageCalculator'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Mortgage Calculator
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Annuity and Linear mortgage calculator for the Netherlands
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <MortgageCalculator />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <a
              href="https://github.com/santiago-pan/mortgage-calculator"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
```

#### **2.3 Individual Component Updates** (8 hours)

**Graph Component (SSR handling):**
```typescript
// src/components/Graph.tsx
'use client'
import dynamic from 'next/dynamic'
import { MonthMortgageData } from '@/common/Types'

// Dynamically import Recharts to avoid SSR issues
const LineChart = dynamic(
  () => import('recharts').then(mod => mod.LineChart),
  { ssr: false }
)
const CartesianGrid = dynamic(
  () => import('recharts').then(mod => mod.CartesianGrid),
  { ssr: false }
)
// ... other Recharts imports

export function Graph(props: GraphProps) {
  // Component implementation with loading state
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return (
      <Card className="w-full">
        <CardContent className="h-[400px] flex items-center justify-center">
          <div>Loading chart...</div>
        </CardContent>
      </Card>
    )
  }
  
  // ... rest of component
}
```

**Update other components to remove React Router dependencies:**
- Remove `useLocation`, `useNavigate` imports
- Add `'use client'` directive where needed
- Ensure all components use proper TypeScript imports

#### **2.4 Testing and Validation** (4 hours)
```bash
# Test development server
bun dev

# Test build process
bun build

# Type checking
bun run type-check

# Linting
bun run lint
```

---

### **PHASE 3: SEO and Performance Optimization** (Week 4 - 16 hours)

#### **3.1 Metadata Implementation** (6 hours)

**Enhanced app/layout.tsx:**
```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | Mortgage Calculator Netherlands',
    default: 'Mortgage Calculator Netherlands - Annuity & Linear Calculations'
  },
  description: 'Calculate and compare Annuity and Linear mortgage structures for the Netherlands market. Include property price, interest rates, tax deductions, and purchase costs.',
  keywords: [
    'mortgage calculator netherlands',
    'hypotheek calculator', 
    'annuity mortgage',
    'linear mortgage',
    'netherlands mortgage',
    'NHG calculator',
    'tax deduction mortgage'
  ],
  authors: [{ name: 'Mortgage Calculator Team' }],
  creator: 'Mortgage Calculator Team',
  openGraph: {
    title: 'Mortgage Calculator Netherlands',
    description: 'Calculate and compare mortgage structures for the Netherlands market',
    url: 'https://whathemortgage.com',
    siteName: 'Mortgage Calculator',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mortgage Calculator Netherlands'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mortgage Calculator Netherlands',
    description: 'Calculate and compare mortgage structures',
    images: ['/twitter-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-verification-code'
  }
}
```

**Add structured data:**
```typescript
// app/page.tsx - Add JSON-LD
export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Mortgage Calculator Netherlands",
    "description": "Calculate and compare Annuity and Linear mortgage structures",
    "url": "https://whathemortgage.com",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Rest of component */}
    </>
  )
}
```

#### **3.2 Image Optimization** (4 hours)
```bash
# Optimize images and add to public directory
mkdir -p public/images
# Add og-image.jpg, twitter-image.jpg, favicon.ico

# Replace any img tags with Next.js Image component
# Update components to use optimized images
```

#### **3.3 Error Handling** (4 hours)

**Create error boundaries:**
```typescript
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-4">
        There was an error with the mortgage calculator.
      </p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  )
}
```

**Create 404 page:**
```typescript
// app/not-found.tsx
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-4">
        The page you're looking for doesn't exist.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Return to Calculator
      </Link>
    </div>
  )
}
```

#### **3.4 Performance Optimization** (2 hours)
```typescript
// next.config.js - Performance optimizations
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
    optimizeCss: true
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  poweredByHeader: false,
  compress: true
}
```

---

### **PHASE 4: Vercel Deployment** (Week 5 - 12 hours)

#### **4.1 Vercel Setup** (4 hours)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_SITE_URL production
# Add value: https://whathemortgage.com
```

**Create vercel.json:**
```json
{
  "framework": "nextjs",
  "buildCommand": "bun run build",
  "devCommand": "bun dev", 
  "installCommand": "bun install",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection", 
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/index.html",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

#### **4.2 Domain Configuration** (4 hours)
```bash
# Add domain to Vercel project
vercel domains add whathemortgage.com

# Configure DNS records
# A record: whathemortgage.com → 76.76.19.61
# CNAME: www.whathemortgage.com → cname.vercel-dns.com
```

#### **4.3 Deployment and Testing** (4 hours)
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Test deployment
curl -I https://whathemortgage.com
# Verify SSL, headers, performance
```

---

### **PHASE 5: AWS Cleanup & Documentation** (Week 6 - 8 hours)

#### **5.1 AWS Resource Cleanup** (4 hours)
```bash
# Backup any necessary data
aws s3 sync s3://whathemortgage.com ./aws-backup/

# Remove S3 bucket contents
aws s3 rm s3://whathemortgage.com --recursive

# Delete S3 bucket
aws s3api delete-bucket --bucket whathemortgage.com

# Delete CloudFront distribution
aws cloudfront delete-distribution --id E2K5CCBOOMKKA6

# Remove IAM roles/policies if any
```

#### **5.2 Documentation Updates** (4 hours)

**Update README.md:**
```markdown
# Mortgage Calculator Netherlands

A Next.js application for calculating and comparing Annuity and Linear mortgage structures in the Netherlands market.

## 🚀 Tech Stack
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS + shadcn/ui** for styling
- **Recharts** for data visualization  
- **Bun** for package management
- **Vercel** for deployment

## 📦 Installation
\```bash
bun install
\```

## 🛠️ Development
\```bash
# Start development server
bun dev

# Build for production  
bun build

# Type checking
bun run type-check

# Linting
bun run lint
\```

## 🚀 Deployment
Automatically deployed to Vercel on push to main branch.

**Live Site:** https://whathemortgage.com
```

**Update CLAUDE.md:**
```markdown
## Development Commands

- **Start development server**: `bun dev` (Next.js development server on localhost:3000)
- **Run tests**: `bun test` (Bun test runner)
- **Build for production**: `bun build` (Next.js production build)
- **Type checking**: `bun run type-check` (TypeScript compiler check)
- **Linting**: `bun run lint` (Next.js ESLint with TypeScript support)
- **Deploy to Vercel**: Automatic on push to main branch

## Architecture

### Next.js App Router Structure
- **app/layout.tsx**: Root layout with metadata and global styles
- **app/page.tsx**: Main mortgage calculator page with SSR/CSR optimization
- **src/components/**: React components with proper client/server boundaries
- **src/common/**: Shared utilities and calculation logic
- **src/lib/**: Utility functions and configurations

### Migration Notes
- **Migrated from React Router to Next.js App Router** for better SEO and performance
- **URL state management** uses Next.js useSearchParams for seamless sharing
- **SSR optimization** for faster initial page loads
- **Vercel deployment** replaces AWS S3/CloudFront for better DX
```

---

## **Critical Migration Checkpoints**

### **Before Starting Migration:**
- [ ] Create backup of current working application
- [ ] Ensure AWS access for final cleanup
- [ ] Verify Vercel account setup
- [ ] Plan migration timeline during low-traffic periods

### **After Each Phase:**
- [ ] **Functionality Test**: All calculations work identically
- [ ] **URL Sharing Test**: Shared URLs load correct state
- [ ] **Performance Test**: Load times and bundle size
- [ ] **Browser Test**: Chrome, Firefox, Safari, Edge
- [ ] **Mobile Test**: Responsive design and touch interactions

### **Pre-Production Checklist:**
- [ ] **SEO Validation**: Lighthouse SEO score 95+
- [ ] **Performance Validation**: Core Web Vitals targets met
- [ ] **Accessibility Validation**: WCAG 2.1 AA compliance
- [ ] **Cross-browser Testing**: All major browsers
- [ ] **Mobile Testing**: All device sizes
- [ ] **URL Sharing**: All state parameters work correctly

### **Post-Migration Validation:**
- [ ] **Domain Resolution**: whathemortgage.com resolves correctly
- [ ] **SSL Certificate**: Valid and auto-renewing
- [ ] **Performance Monitoring**: Core Web Vitals tracking
- [ ] **Error Monitoring**: Error tracking configured
- [ ] **Analytics**: Traffic tracking continues seamlessly

---

## **Rollback Plan**

If issues arise during migration:

1. **Immediate Rollback** (DNS):
   ```bash
   # Revert DNS to AWS CloudFront
   # A record: whathemortgage.com → <old-cloudfront-domain>
   ```

2. **Application Rollback**:
   ```bash
   # Keep original React+Vite version running
   # Switch domains back to AWS S3/CloudFront
   ```

3. **Investigation**:
   - Document issues encountered
   - Analyze root causes
   - Plan remediation strategy
   - Update migration plan

---

## **Success Metrics**

### **Performance Targets:**
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Lighthouse Scores**: Performance 90+, SEO 95+, Accessibility 95+
- **Bundle Size**: Maintain or reduce compared to Vite build
- **Load Time**: First Contentful Paint <2 seconds

### **Functionality Targets:**
- **Zero Regression**: All existing features work identically
- **URL Compatibility**: All existing shared URLs continue to work
- **Calculation Accuracy**: Identical mortgage calculation results
- **User Experience**: Maintained or improved responsiveness

### **Business Targets:**
- **SEO Improvement**: Better search engine visibility
- **Cost Reduction**: Elimination of AWS infrastructure costs
- **Developer Experience**: Faster development and deployment cycles
- **Maintenance**: Reduced infrastructure management overhead

---

This detailed implementation plan provides a systematic approach to migrating your React+Vite mortgage calculator to Next.js with Vercel deployment while minimizing risk and maximizing the benefits of the new architecture.

## Progress Tracking

### Completed ✅
- [ ] Phase 1: Foundation Setup
- [ ] Phase 2: Core Component Migration  
- [ ] Phase 3: SEO and Performance Optimization
- [ ] Phase 4: Vercel Deployment
- [ ] Phase 5: AWS Cleanup & Documentation

### Current Status
**Status**: Planning Complete - Ready for Implementation
**Next Step**: Begin Phase 1 - Foundation Setup

---

*This implementation plan provides the exact steps needed to successfully migrate the mortgage calculator from React+Vite to Next.js with Vercel deployment.*