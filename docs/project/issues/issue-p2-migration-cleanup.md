---
id: issue_006
title: Phase 5 - Migration Cleanup and Enhancement
date: 2025-06-17
status: planned
author: Development Team
priority: p2
category: maintenance
estimated_hours: 24
sprint: migration-phase-5
tags: [cleanup, aws, documentation, enhancement, post-migration]
related_adr: ADR-003
epic: NextJS-Migration
assignee: Development Team
dependencies: [issue_005]
---

# Issue #006: Phase 5 - Migration Cleanup and Enhancement

## Problem Statement
After successful migration to Next.js and Vercel deployment, legacy AWS infrastructure needs to be decommissioned, documentation needs comprehensive updates, and Next.js-specific enhancements should be implemented to maximize the benefits of the new platform.

## Background
This is Phase 5 of the comprehensive migration from React+Vite to Next.js as documented in ADR-003. This phase focuses on cleanup activities, documentation updates, and implementing enhancements that leverage Next.js capabilities.

## User Impact
- **Cost Reduction**: Elimination of AWS infrastructure costs
- **Enhanced Features**: New capabilities enabled by Next.js platform
- **Better Maintenance**: Improved documentation and development processes
- **Future Development**: Foundation for Next.js-specific features

## Acceptance Criteria

### AWS Infrastructure Cleanup
- [ ] **S3 Bucket Decommission**: Safely remove S3 bucket and contents
- [ ] **CloudFront Distribution**: Delete CloudFront distribution
- [ ] **Route 53 Cleanup**: Remove unused DNS records if applicable
- [ ] **IAM Cleanup**: Remove unused IAM roles and policies
- [ ] **Cost Verification**: Verify AWS costs are eliminated

### Documentation Updates
- [ ] **README Update**: Complete rewrite for Next.js development
- [ ] **CLAUDE.md Update**: Update development commands and workflows
- [ ] **Deployment Guide**: New deployment documentation for Vercel
- [ ] **Architecture Documentation**: Update architecture docs for Next.js
- [ ] **Migration Retrospective**: Document lessons learned and migration metrics

### Development Process Enhancement
- [ ] **GitHub Actions**: Update CI/CD pipeline for Next.js and Vercel
- [ ] **Testing Strategy**: Enhance testing for Next.js SSR environment
- [ ] **Development Workflow**: Update development workflow documentation
- [ ] **Code Quality**: Implement Next.js-specific linting rules
- [ ] **Performance Monitoring**: Set up continuous performance monitoring

### Next.js Feature Implementation
- [ ] **API Routes**: Implement API routes for future backend needs
- [ ] **Middleware**: Implement Next.js middleware for enhanced functionality
- [ ] **Dynamic Sitemap**: Implement dynamic sitemap generation
- [ ] **Advanced SEO**: Implement advanced SEO features
- [ ] **Progressive Enhancement**: Enhance progressive web app features

## Technical Requirements

### AWS Cleanup Checklist
```bash
# AWS resource cleanup commands
aws s3 rm s3://whathemortgage.com --recursive
aws s3api delete-bucket --bucket whathemortgage.com
aws cloudfront delete-distribution --id E2K5CCBOOMKKA6
aws iam delete-role --role-name mortgage-calculator-deploy-role
```

### Updated Development Commands
```json
// package.json - Updated scripts
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start", 
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "test": "bun test",
    "test:watch": "bun test --watch",
    "analyze": "ANALYZE=true next build",
    "export": "next export"
  }
}
```

### Enhanced CI/CD Pipeline
```yaml
# .github/workflows/vercel-deployment.yml
name: Vercel Deployment
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      
      - name: Install dependencies
        run: bun install
        
      - name: Run tests
        run: bun test
        
      - name: Type check
        run: bun run type-check
        
      - name: Lint
        run: bun run lint
        
      - name: Build
        run: bun run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Implementation Tasks

### AWS Cleanup (8 hours)
- [ ] **Resource Audit**: Identify all AWS resources related to mortgage calculator
- [ ] **Data Backup**: Ensure any necessary data is backed up before deletion
- [ ] **S3 Cleanup**: Remove S3 bucket and all contents safely
- [ ] **CloudFront Cleanup**: Delete CloudFront distribution and invalidations
- [ ] **DNS Cleanup**: Remove any unused Route 53 records
- [ ] **IAM Cleanup**: Remove deployment roles and policies
- [ ] **Cost Monitoring**: Verify complete cost elimination

### Documentation Updates (8 hours)
- [ ] **README Rewrite**: Complete rewrite focusing on Next.js development
- [ ] **Architecture Update**: Update all architecture documentation
- [ ] **API Documentation**: Document any new API routes or features
- [ ] **Deployment Guide**: Create comprehensive Vercel deployment guide
- [ ] **Troubleshooting**: Create troubleshooting guide for common issues
- [ ] **Migration Summary**: Document migration outcomes and metrics

### Development Enhancement (8 hours)
- [ ] **CI/CD Pipeline**: Update GitHub Actions for Next.js and Vercel
- [ ] **Testing Enhancement**: Add SSR-specific tests and strategies
- [ ] **Code Quality**: Implement Next.js ESLint rules and best practices
- [ ] **Performance Monitoring**: Set up Vercel Analytics and monitoring
- [ ] **Development Tools**: Set up additional development tools and workflows

## Success Criteria

### Cleanup Criteria
- [ ] **Zero AWS Costs**: AWS bill shows $0 for mortgage calculator resources
- [ ] **No Broken Links**: No references to old AWS URLs remain in codebase
- [ ] **Clean Repository**: No unused configuration files or dependencies
- [ ] **Updated Links**: All documentation links point to Vercel deployment

### Documentation Criteria
- [ ] **Complete Coverage**: All aspects of development and deployment documented
- [ ] **Accuracy**: All commands and processes work as documented
- [ ] **Clarity**: Documentation is clear for new team members
- [ ] **Maintenance**: Documentation includes maintenance procedures

### Enhancement Criteria
- [ ] **Improved Workflow**: Development workflow is faster and more reliable
- [ ] **Better Testing**: Testing covers SSR and Next.js specific features
- [ ] **Performance Monitoring**: Continuous monitoring provides actionable insights
- [ ] **Future Ready**: Foundation laid for Next.js-specific feature development

## AWS Resource Cleanup Details

### S3 Bucket Cleanup
```bash
# Step-by-step S3 cleanup
1. List all objects in bucket
   aws s3 ls s3://whathemortgage.com --recursive

2. Remove all objects
   aws s3 rm s3://whathemortgage.com --recursive

3. Remove bucket versioning if enabled
   aws s3api delete-bucket-versioning --bucket whathemortgage.com

4. Delete bucket
   aws s3api delete-bucket --bucket whathemortgage.com
```

### CloudFront Cleanup
```bash
# Step-by-step CloudFront cleanup
1. Disable distribution
   aws cloudfront update-distribution --id E2K5CCBOOMKKA6 --distribution-config file://disabled-config.json

2. Wait for deployment
   aws cloudfront wait distribution-deployed --id E2K5CCBOOMKKA6

3. Delete distribution
   aws cloudfront delete-distribution --id E2K5CCBOOMKKA6 --if-match <etag>
```

### Cost Monitoring Setup
- [ ] **AWS Cost Alerts**: Set up alerts for any unexpected charges
- [ ] **Resource Tagging**: Ensure all remaining resources are properly tagged
- [ ] **Billing Review**: Review final AWS bill to confirm cleanup
- [ ] **Account Cleanup**: Consider closing AWS account if no longer needed

## Documentation Update Requirements

### README.md Updates
```markdown
# Mortgage Calculator Netherlands

A Next.js application for calculating and comparing Annuity and Linear mortgage structures in the Netherlands market.

## Tech Stack
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS + shadcn/ui
- Recharts for data visualization
- Bun for package management
- Vercel for deployment

## Development
```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun build

# Run tests
bun test
```

## Deployment
This application is automatically deployed to Vercel on push to main branch.
Visit: https://whathemortgage.com
```

### CLAUDE.md Updates
```markdown
## Development Commands

- **Start development server**: `bun dev` (Next.js development server on localhost:3000)
- **Run tests**: `bun test` (Bun test runner with Next.js support)
- **Build for production**: `bun build` (Next.js production build)
- **Type checking**: `bun run type-check` (TypeScript compiler check)
- **Linting**: `bun run lint` (Next.js ESLint with TypeScript support)
- **Code formatting**: `bun run format` (Prettier code formatting)
- **Deploy to Vercel**: Automatic on push to main branch

## Architecture

### Next.js App Router Structure
- **app/layout.tsx**: Root layout with providers and global styles
- **app/page.tsx**: Main mortgage calculator page
- **app/globals.css**: Global styles with Tailwind CSS
- **components/**: Reusable UI components
- **lib/**: Utility functions and shared logic
```

## Enhancement Opportunities

### Next.js API Routes
```typescript
// app/api/calculate/route.ts - Future API endpoint
export async function POST(request: Request) {
  const body = await request.json()
  
  // Server-side mortgage calculations
  const result = calculateMortgage(body)
  
  return Response.json(result)
}
```

### Middleware Implementation
```typescript
// middleware.ts - Analytics and security
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Add security headers
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  return response
}
```

### Progressive Web App Features
```typescript
// Enhanced PWA capabilities
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

module.exports = withPWA({
  // Next.js config
})
```

## Dependencies
- **Prerequisite**: Issue #005 (Phase 4 - Deployment) must be complete
- **External**: AWS account access for resource cleanup
- **Tools**: Vercel analytics setup

## Risks & Mitigations

### Cleanup Risks
- **Data Loss**: Accidentally deleting important data during AWS cleanup
  - *Mitigation*: Comprehensive backup before cleanup, staged deletion process
- **Cost Continuation**: Some AWS resources may not be properly cleaned up
  - *Mitigation*: Thorough resource audit and cost monitoring

### Enhancement Risks
- **Feature Creep**: Adding unnecessary features during cleanup phase
  - *Mitigation*: Focus on essential enhancements, document future improvements
- **Documentation Drift**: Documentation may become outdated quickly
  - *Mitigation*: Regular review schedule and version control

## Definition of Done
- [ ] All AWS resources cleaned up and costs eliminated
- [ ] Complete documentation rewrite for Next.js workflow
- [ ] Enhanced CI/CD pipeline working correctly
- [ ] Performance monitoring setup and functioning
- [ ] Migration retrospective documented with metrics
- [ ] Team trained on new Next.js development workflow
- [ ] Future enhancement roadmap created
- [ ] Code quality tools configured and working
- [ ] All legacy references removed from codebase
- [ ] Migration marked as complete in project documentation

## Related Issues
- **Issue #005**: Phase 4 - Deployment (prerequisite)
- **All Previous Issues**: Complete migration workflow
- **Future**: Next.js-specific feature development roadmap

## Documentation Updates Required
- [ ] Complete README.md rewrite
- [ ] Update CLAUDE.md with Next.js workflow
- [ ] Create Vercel deployment documentation
- [ ] Document Next.js best practices for team
- [ ] Create migration retrospective report
- [ ] Update architecture documentation

## Migration Retrospective Planning
- [ ] **Performance Metrics**: Compare before/after performance data
- [ ] **Cost Analysis**: Document cost savings from AWS to Vercel migration
- [ ] **Developer Experience**: Survey team on development workflow improvements
- [ ] **User Impact**: Analyze user metrics and feedback post-migration
- [ ] **Lessons Learned**: Document key insights for future migrations
- [ ] **Recommendations**: Provide recommendations for similar projects

---

*This issue tracks the cleanup activities and enhancements following successful migration to Next.js and Vercel, ensuring the project is optimized for future development and maintenance.*