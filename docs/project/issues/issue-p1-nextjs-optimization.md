---
id: issue_004
title: Phase 3 - Next.js Optimization and Enhancement
date: 2025-06-17
status: planned
author: Development Team
priority: p1
category: performance
estimated_hours: 48
sprint: migration-phase-3
tags: [nextjs, optimization, seo, performance, enhancement]
related_adr: ADR-003
epic: NextJS-Migration
assignee: Development Team
dependencies: [issue_003]
---

# Issue #004: Phase 3 - Next.js Optimization and Enhancement

## Problem Statement
The migrated Next.js application needs optimization for SEO, performance, and user experience to fully realize the benefits of the Next.js platform and prepare for production deployment on Vercel.

## Background
This is Phase 3 of the comprehensive migration from React+Vite to Next.js as documented in ADR-003. This phase focuses on implementing Next.js-specific optimizations and enhancements that weren't possible with the previous React+Vite setup.

## User Impact
- **SEO**: Dramatically improved search engine visibility for mortgage calculator
- **Performance**: Faster page loads, especially on mobile devices
- **Accessibility**: Enhanced accessibility features and better screen reader support
- **User Experience**: Optimized images, better error handling, and improved responsiveness

## Acceptance Criteria

### SEO Optimization
- [ ] **Metadata Implementation**: Comprehensive meta tags, Open Graph, and Twitter Cards
- [ ] **Structured Data**: JSON-LD structured data for mortgage calculator
- [ ] **Sitemap Generation**: Automatic sitemap.xml generation
- [ ] **Robots.txt**: Proper robots.txt configuration for SEO
- [ ] **Page Titles**: Dynamic, descriptive page titles for all routes

### Performance Optimization
- [ ] **Image Optimization**: Implement Next.js Image component for all images
- [ ] **Static Generation**: Implement SSG for static content where appropriate
- [ ] **Code Splitting**: Optimize bundle splitting and lazy loading
- [ ] **Font Optimization**: Implement Next.js font optimization
- [ ] **Bundle Analysis**: Analyze and optimize bundle size

### Error Handling & User Experience
- [ ] **Error Boundaries**: Implement comprehensive error boundaries
- [ ] **404 Page**: Custom 404 page with navigation back to calculator
- [ ] **Loading States**: Implement loading states for better UX
- [ ] **Offline Support**: Basic offline functionality for calculations
- [ ] **Progressive Enhancement**: Ensure calculator works without JavaScript

### Accessibility Enhancement
- [ ] **ARIA Labels**: Comprehensive ARIA labeling for form elements
- [ ] **Keyboard Navigation**: Full keyboard navigation support
- [ ] **Screen Reader**: Optimized screen reader experience
- [ ] **Color Contrast**: Ensure WCAG 2.1 AA color contrast compliance
- [ ] **Focus Management**: Proper focus management throughout the application

## Technical Requirements

### SEO Implementation
```typescript
// app/layout.tsx - Root metadata
export const metadata: Metadata = {
  title: {
    template: '%s | Mortgage Calculator Netherlands',
    default: 'Mortgage Calculator Netherlands - Annuity & Linear Calculations'
  },
  description: 'Calculate and compare Annuity and Linear mortgage structures for the Netherlands market. Include property price, interest rates, tax deductions, and purchase costs.',
  keywords: ['mortgage calculator', 'netherlands', 'annuity', 'linear', 'hypotheek'],
  authors: [{ name: 'Mortgage Calculator Team' }],
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
    description: 'Calculate and compare mortgage structures for the Netherlands market',
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
  }
}
```

### Structured Data Implementation
```typescript
// Structured data for mortgage calculator
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
```

### Performance Configuration
```typescript
// next.config.js optimizations
const nextConfig = {
  images: {
    domains: ['whathemortgage.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'recharts']
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
}
```

## Implementation Tasks

### SEO Implementation (16 hours)
- [ ] **Metadata Setup**: Implement comprehensive metadata for all pages
- [ ] **Open Graph**: Create and optimize Open Graph images and metadata
- [ ] **Structured Data**: Implement JSON-LD structured data
- [ ] **Sitemap**: Set up automatic sitemap generation
- [ ] **Robots.txt**: Configure robots.txt for optimal crawling

### Performance Optimization (16 hours)
- [ ] **Image Optimization**: Convert all images to Next.js Image component
- [ ] **Font Optimization**: Implement Next.js font optimization with local fonts
- [ ] **Bundle Analysis**: Analyze bundle and optimize imports
- [ ] **Code Splitting**: Implement dynamic imports for heavy components
- [ ] **Static Generation**: Implement SSG for static content

### Error Handling (8 hours)
- [ ] **Error Boundaries**: Implement React error boundaries
- [ ] **Custom 404**: Create custom 404 page with calculator navigation
- [ ] **Error Pages**: Create custom error pages for different error types
- [ ] **Loading States**: Implement loading spinners and skeleton screens
- [ ] **Fallback Components**: Create fallback components for failed loads

### Accessibility Enhancement (8 hours)
- [ ] **ARIA Implementation**: Add comprehensive ARIA labels and descriptions
- [ ] **Keyboard Navigation**: Ensure full keyboard accessibility
- [ ] **Focus Management**: Implement proper focus management
- [ ] **Screen Reader Testing**: Test and optimize for screen readers
- [ ] **Color Contrast**: Audit and fix any contrast issues

## Success Criteria

### SEO Criteria
- [ ] **Lighthouse SEO Score**: Achieve 95+ Lighthouse SEO score
- [ ] **Meta Tags**: All pages have appropriate meta tags
- [ ] **Structured Data**: Valid structured data for search engines
- [ ] **Search Console**: No errors in Google Search Console
- [ ] **Page Speed**: Google PageSpeed Insights score of 90+

### Performance Criteria
- [ ] **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- [ ] **Bundle Size**: Reduce bundle size by 20% compared to Vite version
- [ ] **Image Optimization**: All images use Next.js Image component
- [ ] **Load Time**: First Contentful Paint <2 seconds
- [ ] **Cumulative Layout Shift**: CLS score <0.1

### Accessibility Criteria
- [ ] **WCAG Compliance**: WCAG 2.1 AA compliance verified
- [ ] **Keyboard Navigation**: Full functionality via keyboard only
- [ ] **Screen Reader**: Smooth screen reader experience
- [ ] **Color Contrast**: 4.5:1 contrast ratio for normal text
- [ ] **Lighthouse Accessibility**: 95+ accessibility score

### User Experience Criteria
- [ ] **Error Handling**: Graceful error handling with helpful messages
- [ ] **Loading States**: Clear loading indicators for all async operations
- [ ] **Offline Support**: Basic offline functionality for calculations
- [ ] **Progressive Enhancement**: Works without JavaScript enabled

## Detailed Implementation Specifications

### Metadata Implementation
```typescript
// app/page.tsx - Home page metadata
export const metadata: Metadata = {
  title: 'Mortgage Calculator Netherlands - Compare Annuity & Linear Mortgages',
  description: 'Free mortgage calculator for the Netherlands. Compare Annuity and Linear mortgage structures, calculate monthly payments, and analyze purchase costs. Includes tax deductions and NHG calculations.',
  keywords: [
    'mortgage calculator netherlands',
    'hypotheek calculator',
    'annuity mortgage',
    'linear mortgage',
    'netherlands mortgage',
    'NHG calculator',
    'tax deduction mortgage'
  ],
  alternates: {
    canonical: 'https://whathemortgage.com'
  }
}
```

### Image Optimization Strategy
```typescript
// Replace current img tags with Next.js Image
import Image from 'next/image'

// Before
<img src="/favicon.ico" alt="Logo" className="w-5 h-5" />

// After  
<Image
  src="/favicon.ico"
  alt="Mortgage Calculator Logo"
  width={20}
  height={20}
  className="w-5 h-5"
  priority={true} // for above-the-fold images
/>
```

### Error Boundary Implementation
```typescript
'use client'
import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class MortgageCalculatorErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Mortgage Calculator Error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Oops! Something went wrong with the mortgage calculator.</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

## Dependencies
- **Prerequisite**: Issue #003 (Phase 2 - Core Migration) must be complete
- **Blocks**: Issue #005 (Phase 4 - Deployment) benefits from these optimizations
- **External**: Google Search Console setup for SEO validation

## Risks & Mitigations

### Performance Risks
- **Bundle Size Increase**: Additional optimizations may increase bundle size
  - *Mitigation*: Careful bundle analysis and selective optimization
- **Over-optimization**: Performance optimizations may impact functionality
  - *Mitigation*: Thorough testing after each optimization

### SEO Risks
- **Search Ranking Impact**: Changes may temporarily affect search rankings
  - *Mitigation*: Implement proper redirects and monitor search console
- **Structured Data Errors**: Invalid structured data may harm SEO
  - *Mitigation*: Use Google's structured data testing tools

## Testing Strategy

### Performance Testing
- [ ] **Lighthouse Audits**: Regular Lighthouse performance audits
- [ ] **Bundle Analysis**: Use @next/bundle-analyzer for bundle size tracking
- [ ] **Core Web Vitals**: Monitor Core Web Vitals with Vercel Analytics
- [ ] **Load Testing**: Test performance under various network conditions

### SEO Testing
- [ ] **Meta Tag Validation**: Verify meta tags render correctly
- [ ] **Structured Data**: Validate structured data with Google tools
- [ ] **Search Console**: Monitor Google Search Console for errors
- [ ] **Social Media**: Test Open Graph and Twitter Card rendering

### Accessibility Testing
- [ ] **Screen Reader Testing**: Test with NVDA, JAWS, and VoiceOver
- [ ] **Keyboard Testing**: Navigate entire application using only keyboard
- [ ] **Color Contrast**: Use tools like Colour Contrast Analyser
- [ ] **Lighthouse Accessibility**: Regular accessibility audits

## Definition of Done
- [ ] Lighthouse scores: Performance 90+, SEO 95+, Accessibility 95+
- [ ] All images optimized with Next.js Image component
- [ ] Comprehensive metadata implemented for all pages
- [ ] Valid structured data for search engines
- [ ] Custom error pages and error boundaries implemented
- [ ] WCAG 2.1 AA accessibility compliance verified
- [ ] Core Web Vitals targets achieved
- [ ] Bundle size optimized and analyzed
- [ ] All tests pass including new performance tests
- [ ] Documentation updated with optimization details

## Related Issues
- **Issue #003**: Phase 2 - Core Migration (prerequisite)
- **Issue #005**: Phase 4 - Deployment and Migration (depends on this)
- **Issue #006**: Phase 5 - Cleanup and Enhancement (optional dependency)

## Documentation Updates Required
- [ ] Document SEO implementation and best practices
- [ ] Create performance optimization guide
- [ ] Update accessibility documentation
- [ ] Document error handling patterns
- [ ] Create optimization troubleshooting guide

---

*This issue tracks the optimization and enhancement of the Next.js application to maximize SEO, performance, and user experience benefits before production deployment.*