# ADR-003: Migrate from React+Vite to Next.js and Deploy on Vercel

**Date**: 2025-06-17  
**Status**: Proposed  
**Author**: Development Team  
**Decision ID**: ADR-003  

## Context

The current mortgage calculator application uses React 18 + Vite with deployment on AWS S3 + CloudFront. While this setup works, several factors are driving a migration to Next.js and Vercel:

### Current Architecture Limitations
1. **Static Site Limitations**: Current S3 deployment limits dynamic capabilities and SEO optimization
2. **Deployment Complexity**: AWS S3 + CloudFront requires manual configuration and maintenance
3. **Performance Optimization**: Missing server-side rendering and automatic optimization features
4. **Developer Experience**: Vite setup requires manual configuration for production optimization

### Business Requirements
1. **SEO Enhancement**: Mortgage calculator needs better search engine visibility for Netherlands market
2. **Performance**: Faster loading times critical for mobile users (60%+ of traffic)
3. **Scalability**: Need platform that can handle traffic growth and feature expansion
4. **Maintenance**: Reduce infrastructure management overhead

### Technical Drivers
1. **Modern Web Standards**: Need support for latest web performance standards
2. **Edge Computing**: Global performance optimization for international users
3. **Automatic Optimization**: Built-in performance and security features
4. **TypeScript Integration**: Enhanced TypeScript support and tooling

## Decision

We will migrate from **React + Vite** to **Next.js** and deploy on **Vercel** for the following reasons:

### Chosen Solution: Next.js 14+ with App Router + Vercel Platform

#### Next.js Benefits
- **Server-Side Rendering (SSR)**: Improved SEO and initial page load performance
- **Static Site Generation (SSG)**: Pre-render mortgage calculation pages for performance
- **Automatic Code Splitting**: Optimized bundle sizes and loading
- **Built-in TypeScript Support**: Enhanced developer experience
- **File-based Routing**: Simplified routing compared to React Router
- **Image Optimization**: Automatic image optimization for better performance
- **API Routes**: Ability to add backend functionality if needed

#### Vercel Platform Benefits
- **Zero-Configuration Deployment**: Automatic builds and deployments
- **Global Edge Network**: Worldwide performance optimization
- **Preview Deployments**: Automatic preview environments for PRs
- **Analytics and Monitoring**: Built-in performance monitoring
- **Automatic HTTPS**: Security by default
- **Domain Management**: Simplified custom domain setup

## Implementation Strategy

### Migration Approach: Incremental with Parallel Development
We will use a **vertical migration strategy** to minimize risk and maintain functionality:

### Phase 1: Foundation Setup (Week 1)
- **Next.js Project Initialization**: Create new Next.js 14 project with App Router
- **Dependency Migration**: Port existing dependencies to Next.js compatible versions
- **Build Configuration**: Set up Tailwind CSS, TypeScript, and ESLint for Next.js
- **Component Library**: Migrate shadcn/ui components to Next.js structure

### Phase 2: Core Feature Migration (Week 2-3)
- **Routing Migration**: Convert React Router to Next.js App Router
- **State Management**: Adapt URL-based state management to Next.js patterns
- **Component Migration**: Port all React components to Next.js pages/components
- **Calculation Logic**: Ensure mortgage calculation formulas work in SSR environment

### Phase 3: Optimization and Enhancement (Week 4)
- **SEO Optimization**: Implement metadata, OpenGraph, and structured data
- **Performance Optimization**: Implement SSG for static content, optimize images
- **Testing Migration**: Port and enhance existing test suite
- **Error Handling**: Implement Next.js error boundaries and 404 pages

### Phase 4: Deployment and Migration (Week 5)
- **Vercel Setup**: Configure Vercel project and deployment pipeline
- **Domain Migration**: Setup custom domain and DNS configuration
- **Performance Validation**: Validate Core Web Vitals and performance metrics
- **Legacy Redirect**: Implement redirects from old AWS S3 deployment

### Phase 5: Cleanup and Enhancement (Week 6)
- **AWS Cleanup**: Decommission S3 bucket and CloudFront distribution
- **Documentation**: Update all documentation and deployment guides
- **Monitoring Setup**: Configure Vercel analytics and error monitoring
- **Future Enhancements**: Plan additional Next.js features (API routes, middleware)

## Technical Migration Details

### Component Migration Strategy
```typescript
// Current: React Router approach
import { useLocation, useNavigate } from 'react-router-dom';

// Target: Next.js App Router approach  
import { useRouter, useSearchParams } from 'next/navigation';
```

### State Management Migration
```typescript
// Current: URL state with query-string
const [state, setState] = useState(defaultState);
useEffect(() => {
  const query = queryString.parse(location.search);
  // Update state from URL
}, [location.search]);

// Target: Next.js searchParams and URL state
const searchParams = useSearchParams();
const router = useRouter();
// Implement URL state with Next.js patterns
```

### Routing Migration
```typescript
// Current: React Router v6 structure
src/
  App.tsx (Router setup)
  components/
    Mortgage.tsx
    Costs.tsx
    Interest.tsx

// Target: Next.js App Router structure
app/
  layout.tsx
  page.tsx
  mortgage/
    page.tsx
  costs/  
    page.tsx
  interest/
    page.tsx
```

## Consequences

### Positive Consequences
- **Improved SEO**: Server-side rendering enables better search engine indexing
- **Enhanced Performance**: Automatic optimizations and global edge deployment
- **Better Developer Experience**: Integrated tooling and automatic configuration
- **Reduced Infrastructure Complexity**: Vercel handles all deployment and scaling
- **Future-Proof Architecture**: Access to latest Next.js features and Vercel platform capabilities
- **Cost Optimization**: Potentially lower costs compared to AWS S3 + CloudFront

### Negative Consequences
- **Migration Effort**: Significant development time required for migration
- **Learning Curve**: Team needs to learn Next.js patterns and Vercel platform
- **Platform Lock-in**: Increased dependency on Vercel ecosystem
- **SSR Complexity**: Need to handle server-side rendering considerations

### Neutral Consequences
- **Functionality Preservation**: All mortgage calculation logic remains unchanged
- **UI Consistency**: shadcn/ui and Tailwind CSS components remain the same
- **User Experience**: End users experience improved performance without feature changes

## Alternatives Considered

### 1. Stay with React + Vite + AWS S3
- **Pros**: No migration effort, team familiarity, current cost structure
- **Cons**: Limited SEO capabilities, manual optimization required, infrastructure complexity

### 2. React + Vite + Vercel (without Next.js)
- **Pros**: Simpler migration, keep existing React patterns
- **Cons**: Miss out on SSR/SSG benefits, limited Vercel platform integration

### 3. Migrate to Next.js + Stay on AWS
- **Pros**: Keep current infrastructure, get Next.js benefits  
- **Cons**: Complex AWS configuration for Next.js, miss Vercel optimizations

### 4. Alternative Frameworks (Remix, SvelteKit, etc.)
- **Pros**: Different architectural approaches, potential performance benefits
- **Cons**: Larger migration effort, smaller ecosystem, team learning curve

## Decision Criteria

1. **SEO Requirements**: Must support server-side rendering for search engines
2. **Performance**: Target Core Web Vitals scores of 90+ 
3. **Developer Experience**: Reduce configuration overhead and improve tooling
4. **Deployment Simplicity**: Minimize infrastructure management complexity
5. **Migration Risk**: Manageable migration timeline with minimal downtime
6. **Future Scalability**: Platform can grow with business requirements

Next.js + Vercel scored highest across all criteria, especially for SEO, performance, and developer experience.

## Success Metrics

### Performance Metrics
- **Core Web Vitals**: Target 90+ scores for LCP, FID, CLS
- **Page Load Speed**: <2 seconds First Contentful Paint
- **Bundle Size**: Maintain or reduce current bundle size
- **SEO Score**: Lighthouse SEO score of 95+

### Developer Experience Metrics
- **Build Time**: Faster builds compared to current Vite setup
- **Deployment Time**: <2 minutes from commit to production
- **Error Rate**: Zero deployment failures during migration
- **Developer Velocity**: Reduced time for feature development

### Business Metrics
- **Search Visibility**: Improved organic search rankings
- **User Engagement**: Maintain or improve current user metrics
- **Operational Cost**: Cost-neutral or reduced infrastructure costs
- **Uptime**: 99.9% availability during and after migration

## Risk Assessment

### Technical Risks
- **SSR Compatibility**: Some client-side only libraries may need adaptation
  - *Mitigation*: Audit dependencies and plan replacements
- **State Management**: URL-based state management may need rework
  - *Mitigation*: Incremental migration with thorough testing
- **Performance Regression**: Potential performance issues during migration
  - *Mitigation*: Performance monitoring at each phase

### Business Risks
- **Migration Downtime**: Potential service interruption during migration
  - *Mitigation*: Parallel development and seamless domain switch
- **SEO Impact**: Temporary search ranking fluctuations
  - *Mitigation*: Proper redirect strategy and gradual rollout
- **User Experience**: Temporary functionality issues
  - *Mitigation*: Comprehensive testing and rollback plan

### Project Risks
- **Timeline Overrun**: Migration takes longer than planned
  - *Mitigation*: Phased approach allows for timeline adjustments
- **Skill Gap**: Team learning curve for Next.js
  - *Mitigation*: Training and documentation before migration starts

## Implementation Plan

### Pre-Migration (Week 0)
- [ ] **Team Training**: Next.js and Vercel platform training
- [ ] **Environment Setup**: Development environment preparation
- [ ] **Dependency Audit**: Review all current dependencies for Next.js compatibility
- [ ] **Architecture Planning**: Detailed component and routing migration plan

### Migration Phases (Weeks 1-6)
- [ ] **Phase 1**: Foundation and setup
- [ ] **Phase 2**: Core feature migration
- [ ] **Phase 3**: Optimization and enhancement
- [ ] **Phase 4**: Deployment and domain migration
- [ ] **Phase 5**: Cleanup and documentation

### Post-Migration (Week 7+)
- [ ] **Performance Monitoring**: Continuous monitoring of Core Web Vitals
- [ ] **Feature Enhancement**: Implement Next.js-specific improvements
- [ ] **Documentation**: Complete documentation update
- [ ] **Team Training**: Advanced Next.js features and best practices

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Incremental Migration Guide](https://vercel.com/docs/incremental-migration)
- [React to Next.js Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/from-vite)
- [Current Project ADR-001](./2025-06-17-adr-001-migrate-from-bulma-to-shadcn-ui.md)
- [Current Project ADR-002](./2025-06-17-adr-002-adopt-bun-as-primary-javascript-runtime.md)

## Change Log

- **2025-06-17**: ADR created and proposed
- **2025-06-17**: Initial architecture analysis and migration strategy defined

---

*This ADR documents the decision to migrate from React+Vite to Next.js and deploy on Vercel for improved SEO, performance, and developer experience.*