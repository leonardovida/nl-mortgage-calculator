---
id: issue_005
title: Phase 4 - Vercel Deployment and Domain Migration
date: 2025-06-17
status: planned
author: Development Team
priority: p1
category: deployment
estimated_hours: 32
sprint: migration-phase-4
tags: [vercel, deployment, domain, migration, production]
related_adr: ADR-003
epic: NextJS-Migration
assignee: Development Team
dependencies: [issue_004]
---

# Issue #005: Phase 4 - Vercel Deployment and Domain Migration

## Problem Statement
The optimized Next.js application needs to be deployed to Vercel production environment and the custom domain (whathemortgage.com) needs to be migrated from AWS S3/CloudFront to Vercel with zero downtime and proper redirect handling.

## Background
This is Phase 4 of the comprehensive migration from React+Vite to Next.js as documented in ADR-003. This phase focuses on production deployment to Vercel and seamless domain migration from the existing AWS infrastructure.

## User Impact
- **Performance**: Dramatically improved page load speeds through Vercel's edge network
- **Reliability**: Better uptime and automatic scaling with Vercel infrastructure  
- **Global Access**: Improved performance for international users
- **SEO**: Better search engine indexing through improved performance

## Acceptance Criteria

### Vercel Setup and Configuration
- [ ] **Vercel Project**: Create and configure Vercel project for mortgage calculator
- [ ] **Environment Variables**: Set up production environment variables
- [ ] **Build Configuration**: Optimize Vercel build settings for performance
- [ ] **Analytics Setup**: Configure Vercel Analytics for performance monitoring
- [ ] **Preview Deployments**: Set up preview deployments for pull requests

### Domain Migration Strategy
- [ ] **Domain Configuration**: Configure whathemortgage.com domain in Vercel
- [ ] **SSL Certificate**: Ensure automatic SSL certificate provisioning
- [ ] **DNS Migration**: Plan and execute DNS migration strategy
- [ ] **Redirect Strategy**: Implement redirects from old AWS URLs
- [ ] **Monitoring Setup**: Set up monitoring for the new deployment

### Performance Validation
- [ ] **Core Web Vitals**: Validate improved Core Web Vitals scores
- [ ] **Load Testing**: Perform load testing on Vercel infrastructure
- [ ] **Global Performance**: Test performance from multiple geographic locations
- [ ] **Uptime Monitoring**: Set up uptime monitoring and alerting
- [ ] **Error Tracking**: Configure error tracking and monitoring

### Migration Rollback Plan
- [ ] **Rollback Strategy**: Documented plan to rollback to AWS if needed
- [ ] **Health Checks**: Automated health checks for deployment validation
- [ ] **Traffic Monitoring**: Monitor traffic patterns during migration
- [ ] **User Feedback**: Mechanism to collect user feedback on new deployment
- [ ] **Performance Comparison**: Compare performance metrics before/after migration

## Technical Requirements

### Vercel Configuration
```javascript
// vercel.json configuration
{
  "framework": "nextjs",
  "buildCommand": "bun run build",
  "devCommand": "bun dev",
  "installCommand": "bun install",
  "outputDirectory": ".next",
  "functions": {
    "app/**/*.tsx": {
      "maxDuration": 10
    }
  },
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

### Environment Variables Setup
```bash
# Production environment variables
NEXT_PUBLIC_SITE_URL=https://whathemortgage.com
NEXT_PUBLIC_ANALYTICS_ID=<vercel-analytics-id>
NODE_ENV=production
```

### DNS Migration Strategy
```
Current DNS (AWS):
- A record: whathemortgage.com → CloudFront IP
- CNAME: www.whathemortgage.com → CloudFront domain

Target DNS (Vercel):
- A record: whathemortgage.com → 76.76.19.61 (Vercel)
- CNAME: www.whathemortgage.com → cname.vercel-dns.com
```

## Implementation Tasks

### Vercel Setup (8 hours)
- [ ] **Account Setup**: Create/configure Vercel account and team
- [ ] **Project Creation**: Create new Vercel project from GitHub repository
- [ ] **Build Configuration**: Configure build settings and environment variables
- [ ] **Framework Detection**: Verify Next.js framework detection and settings
- [ ] **Analytics Integration**: Set up Vercel Analytics and Web Vitals monitoring

### Domain Configuration (8 hours)
- [ ] **Domain Addition**: Add whathemortgage.com domain to Vercel project
- [ ] **SSL Configuration**: Configure automatic SSL certificate renewal
- [ ] **Subdomain Setup**: Configure www subdomain and redirects
- [ ] **DNS Preparation**: Prepare DNS changes for migration
- [ ] **Verification Setup**: Set up domain verification and validation

### Deployment Pipeline (8 hours)
- [ ] **GitHub Integration**: Connect GitHub repository to Vercel project
- [ ] **Automatic Deployments**: Configure automatic deployments from main branch
- [ ] **Preview Deployments**: Set up preview deployments for feature branches
- [ ] **Build Optimization**: Optimize build settings for performance
- [ ] **Deployment Hooks**: Set up deployment webhooks if needed

### Migration Execution (8 hours)
- [ ] **Pre-migration Testing**: Final testing on Vercel staging environment
- [ ] **DNS Migration**: Execute DNS changes during low-traffic window
- [ ] **Traffic Monitoring**: Monitor traffic and performance during migration
- [ ] **Rollback Readiness**: Maintain ability to quickly rollback if issues arise
- [ ] **Post-migration Validation**: Validate all functionality after migration

## Success Criteria

### Deployment Criteria
- [ ] **Successful Builds**: All builds complete successfully on Vercel
- [ ] **Domain Access**: whathemortgage.com resolves to Vercel deployment
- [ ] **SSL Certificate**: Valid SSL certificate auto-provisioned and working
- [ ] **Preview Deployments**: Preview deployments work for all pull requests
- [ ] **Environment Variables**: All necessary environment variables configured

### Performance Criteria
- [ ] **Core Web Vitals**: LCP <1.5s, FID <50ms, CLS <0.05 (improved from previous)
- [ ] **Global Performance**: Consistent performance from US, Europe, and Asia
- [ ] **Uptime**: 99.9% uptime in first week after migration
- [ ] **Load Time**: First Contentful Paint <1 second globally
- [ ] **Time to Interactive**: TTI <2 seconds on 3G networks

### Migration Criteria
- [ ] **Zero Downtime**: No service interruption during domain migration
- [ ] **URL Preservation**: All existing URLs continue to work correctly
- [ ] **SEO Preservation**: No loss of search engine rankings
- [ ] **Analytics Continuity**: Tracking and analytics continue without interruption
- [ ] **User Experience**: No degradation in user experience during migration

## Detailed Migration Process

### Pre-Migration Checklist
1. **Staging Validation**
   - [ ] Full application testing on Vercel staging
   - [ ] Performance testing and optimization
   - [ ] SSL certificate validation
   - [ ] Analytics and monitoring setup verification

2. **Communication Preparation**
   - [ ] Stakeholder notification of migration timeline
   - [ ] User communication plan (if needed)
   - [ ] Support team briefing on potential issues
   - [ ] Documentation of migration process

### Migration Day Process
1. **Final Preparation** (1 hour)
   - [ ] Final deployment to Vercel production
   - [ ] Pre-migration health checks
   - [ ] AWS backup verification
   - [ ] Monitoring systems ready

2. **DNS Migration** (2 hours)
   - [ ] Update DNS A record to point to Vercel
   - [ ] Monitor DNS propagation globally  
   - [ ] Verify SSL certificate activation
   - [ ] Test domain access from multiple locations

3. **Post-Migration Validation** (2 hours)
   - [ ] Full application functionality testing
   - [ ] Performance validation and Core Web Vitals
   - [ ] Analytics data verification
   - [ ] Error monitoring check

4. **Traffic Monitoring** (24 hours)
   - [ ] Monitor traffic patterns and user behavior
   - [ ] Track performance metrics continuously
   - [ ] Monitor error rates and issues
   - [ ] Collect user feedback if available

### Rollback Procedure
```bash
# Emergency rollback steps
1. Revert DNS A record to AWS CloudFront
2. Monitor traffic return to AWS
3. Investigate and document issues
4. Plan remediation strategy
5. Communicate status to stakeholders
```

## Dependencies
- **Prerequisite**: Issue #004 (Phase 3 - Optimization) must be complete
- **External**: Domain registrar access for DNS changes
- **External**: AWS console access for potential rollback
- **Tools**: Vercel account and GitHub integration

## Risks & Mitigations

### Migration Risks
- **DNS Propagation Delays**: DNS changes may take time to propagate globally
  - *Mitigation*: Plan migration during low-traffic hours, monitor propagation
- **SSL Certificate Issues**: SSL certificate may not provision correctly
  - *Mitigation*: Pre-test SSL setup, have manual certificate option ready
- **Performance Regression**: Vercel performance may not meet expectations
  - *Mitigation*: Extensive pre-migration testing and rollback plan

### Business Risks
- **SEO Impact**: Domain migration may temporarily affect search rankings
  - *Mitigation*: Implement proper redirects and monitor search console
- **User Disruption**: Users may experience temporary access issues
  - *Mitigation*: Migration during low-traffic hours and quick rollback capability
- **Analytics Loss**: Potential gap in analytics data during migration
  - *Mitigation*: Ensure analytics tracking continues on new platform

## Monitoring and Validation

### Real-time Monitoring
```javascript
// Health check endpoints
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version
  })
})

// Performance monitoring
app.get('/api/performance', (req, res) => {
  res.status(200).json({
    performance: {
      loadTime: performance.now(),
      memory: process.memoryUsage()
    }
  })
})
```

### Monitoring Tools Setup
- [ ] **Vercel Analytics**: Built-in performance and usage analytics
- [ ] **Google Search Console**: Monitor SEO impact and crawling
- [ ] **Google Analytics**: Verify traffic tracking continuity
- [ ] **Uptime Robot**: External uptime monitoring
- [ ] **StatusPage**: Public status page for transparency

## Definition of Done
- [ ] Application successfully deployed to Vercel production
- [ ] Custom domain whathemortgage.com points to Vercel with valid SSL
- [ ] All application features work identically to previous deployment
- [ ] Performance metrics meet or exceed targets (Core Web Vitals improved)
- [ ] DNS migration completed with zero downtime
- [ ] Monitoring and analytics configured and working
- [ ] Rollback plan tested and documented
- [ ] AWS resources identified for cleanup (Phase 5)
- [ ] Migration documentation completed
- [ ] Stakeholders notified of successful migration

## Related Issues
- **Issue #004**: Phase 3 - Optimization (prerequisite) 
- **Issue #006**: Phase 5 - Cleanup and Enhancement (depends on this)
- **Future**: Post-migration optimization and feature enhancements

## Documentation Updates Required
- [ ] Update deployment documentation for Vercel
- [ ] Document domain management procedures
- [ ] Create troubleshooting guide for Vercel issues
- [ ] Update README with new deployment URL
- [ ] Document monitoring and alerting setup

---

*This issue tracks the production deployment to Vercel and seamless migration of the whathemortgage.com domain with zero downtime and improved performance.*