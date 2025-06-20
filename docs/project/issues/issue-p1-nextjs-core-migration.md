---
id: issue_003
title: Phase 2 - Next.js Core Feature Migration
date: 2025-06-17
status: planned
author: Development Team
priority: p1
category: feature
estimated_hours: 60
sprint: migration-phase-2
tags: [nextjs, migration, components, routing, state]
related_adr: ADR-003
epic: NextJS-Migration
assignee: Development Team
dependencies: [issue_002]
---

# Issue #003: Phase 2 - Next.js Core Feature Migration

## Problem Statement
The core functionality of the mortgage calculator (routing, state management, components, and business logic) needs to be migrated from React Router + Vite to Next.js App Router while preserving all existing functionality and user experience.

## Background
This is Phase 2 of the comprehensive migration from React+Vite to Next.js as documented in ADR-003. This phase focuses on migrating all core application features to work with Next.js App Router and SSR environment.

## User Impact
- **End Users**: Improved page load performance through SSR/SSG
- **SEO**: Better search engine visibility for mortgage calculator
- **Mobile Users**: Faster initial page loads and better Core Web Vitals

## Acceptance Criteria

### Routing Migration
- [ ] **App Router Structure**: Convert React Router v6 routes to Next.js App Router pages
- [ ] **URL Parameters**: Migrate URL-based state management to Next.js searchParams
- [ ] **Navigation**: Replace React Router navigation with Next.js navigation
- [ ] **Route Preservation**: All existing routes work with Next.js routing

### Component Migration
- [ ] **App Component**: Convert main App.tsx to Next.js layout.tsx and page.tsx
- [ ] **Mortgage Component**: Migrate mortgage input and calculation display
- [ ] **Costs Component**: Migrate purchase costs calculation and display
- [ ] **Interest Component**: Migrate interest rate and tax calculation display
- [ ] **DataTable Component**: Ensure table works with SSR environment
- [ ] **Graph Component**: Ensure Recharts works with Next.js SSR

### State Management Migration
- [ ] **URL State**: Convert query-string based state to Next.js searchParams
- [ ] **Application State**: Adapt React state management to SSR environment
- [ ] **Local Storage**: Handle client-side storage in Next.js hydration
- [ ] **Default State**: Ensure proper state initialization in SSR

### Business Logic Migration
- [ ] **Calculation Functions**: Verify mortgage calculations work in SSR environment
- [ ] **Data Processing**: Ensure data generation functions are SSR compatible
- [ ] **Input Validation**: Maintain input validation and error handling
- [ ] **URL Synchronization**: Maintain URL state synchronization for sharing

## Technical Requirements

### App Router Structure
```typescript
// Target directory structure
app/
  layout.tsx                 # Root layout with providers
  page.tsx                   # Main mortgage calculator page
  mortgage/
    page.tsx                 # Mortgage details page (optional)
  costs/
    page.tsx                 # Purchase costs page (optional) 
  interest/
    page.tsx                 # Interest details page (optional)
  globals.css               # Global styles
```

### State Management Pattern
```typescript
// Current pattern (React Router)
const [state, setState] = useState(defaultState);
const location = useLocation();
const navigate = useNavigate();

// Target pattern (Next.js)
'use client'
import { useSearchParams, useRouter } from 'next/navigation';
const searchParams = useSearchParams();
const router = useRouter();
```

### Component Migration Strategy
```typescript
// Current: Client-side only component
export function MortgageCalculator() {
  // Client-side logic
}

// Target: SSR-compatible component
'use client' // when needed for interactivity
export function MortgageCalculator() {
  // SSR-compatible logic with hydration handling
}
```

## Implementation Tasks

### Routing Migration (20 hours)
- [ ] **Page Structure**: Create Next.js page components for each route
- [ ] **Layout Design**: Implement root layout with navigation and providers
- [ ] **Route Configuration**: Set up dynamic routes if needed for sharing
- [ ] **Metadata**: Add proper metadata for SEO optimization

### Component Migration (24 hours)
- [ ] **App Component**: Split App.tsx into layout.tsx and page.tsx
- [ ] **Input Components**: Migrate InputField and form components
- [ ] **Display Components**: Migrate Mortgage, Costs, Interest components
- [ ] **Data Components**: Migrate DataTable with proper SSR handling
- [ ] **Graph Components**: Migrate Graph component with client-side rendering
- [ ] **UI Components**: Verify shadcn/ui components work correctly

### State Management (16 hours)
- [ ] **URL State Migration**: Convert query-string to searchParams
- [ ] **State Initialization**: Handle SSR state initialization
- [ ] **Client Hydration**: Ensure proper client-side hydration
- [ ] **State Persistence**: Maintain state sharing functionality
- [ ] **Error Boundaries**: Add proper error handling for SSR/client mismatches

## Success Criteria

### Functional Criteria
- [ ] **All Features Work**: Every existing feature functions identically
- [ ] **URL Sharing**: Mortgage calculations can still be shared via URL
- [ ] **Navigation**: Tabs and navigation work correctly
- [ ] **Calculations**: All mortgage calculations produce correct results
- [ ] **Responsive Design**: All responsive behavior is preserved

### Technical Criteria
- [ ] **SSR Compatibility**: Pages render correctly on server-side
- [ ] **Hydration**: Client-side hydration works without errors
- [ ] **Performance**: No regression in client-side performance
- [ ] **Bundle Size**: Bundle size maintained or reduced
- [ ] **TypeScript**: All components pass TypeScript strict checks

### User Experience Criteria
- [ ] **Load Performance**: Faster initial page load times
- [ ] **Interactive Response**: Maintained responsiveness for user interactions
- [ ] **Visual Consistency**: Identical visual appearance and behavior
- [ ] **Accessibility**: All accessibility features preserved

## Component-Specific Migration Details

### App.tsx Migration
```typescript
// Current structure
function App() {
  const [state, setState] = useState(defaultState);
  const location = useLocation();
  
  return (
    <div className="container">
      <Router>
        <Routes>
          {/* Route definitions */}
        </Routes>
      </Router>
    </div>
  );
}

// Target structure - layout.tsx
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

// Target structure - page.tsx  
'use client'
export default function HomePage() {
  const searchParams = useSearchParams();
  const [state, setState] = useState(getStateFromParams(searchParams));
  
  return (
    <main>
      {/* Calculator content */}
    </main>
  );
}
```

### State Management Migration
```typescript
// Current URL state handling
useEffect(() => {
  const query = queryString.parse(location.search);
  if (Object.keys(query).length > 0) {
    setState(prevState => ({
      ...prevState,
      ...query
    }));
  }
}, [location.search]);

// Target searchParams handling
useEffect(() => {
  const params = Object.fromEntries(searchParams.entries());
  if (Object.keys(params).length > 0) {
    setState(prevState => ({
      ...prevState,
      ...params
    }));
  }
}, [searchParams]);
```

## Dependencies
- **Prerequisite**: Issue #002 (Phase 1 - Foundation Setup) must be complete
- **Blocks**: Issue #004 (Phase 3 - Optimization) cannot start until core migration is complete
- **Related**: Current shadcn/ui implementation provides component foundation

## Risks & Mitigations

### Technical Risks
- **SSR Hydration Issues**: Client/server state mismatches
  - *Mitigation*: Careful state initialization and hydration error handling
- **Recharts SSR**: Chart library may have SSR compatibility issues
  - *Mitigation*: Use dynamic imports with client-side rendering for charts
- **State Management Complexity**: URL state management may behave differently
  - *Mitigation*: Thorough testing of all state scenarios

### Business Risks
- **Functionality Regression**: Critical features may break during migration
  - *Mitigation*: Component-by-component migration with comprehensive testing
- **User Experience Impact**: Temporary performance or usability issues
  - *Mitigation*: Performance monitoring and rollback plan

## Testing Strategy

### Component Testing
- [ ] **Unit Tests**: Migrate and update existing component tests
- [ ] **Integration Tests**: Test component interaction in Next.js environment
- [ ] **SSR Testing**: Verify server-side rendering works correctly
- [ ] **Hydration Testing**: Ensure client-side hydration is seamless

### Functional Testing
- [ ] **Calculation Accuracy**: Verify all mortgage calculations remain accurate
- [ ] **URL State Testing**: Test all URL sharing and state persistence scenarios
- [ ] **Navigation Testing**: Verify all navigation and routing works correctly
- [ ] **Responsive Testing**: Test on multiple screen sizes and devices

### Performance Testing
- [ ] **Bundle Analysis**: Compare bundle sizes before and after migration
- [ ] **Load Testing**: Measure page load performance improvements
- [ ] **Core Web Vitals**: Establish baseline and measure improvements
- [ ] **Memory Usage**: Ensure no memory leaks in SSR environment

## Definition of Done
- [ ] All existing React components migrated to Next.js
- [ ] React Router replaced with Next.js App Router
- [ ] URL-based state management works identically to current version
- [ ] All mortgage calculations produce identical results
- [ ] SSR rendering works correctly for all pages
- [ ] Client-side hydration completes without errors
- [ ] All existing tests pass or are updated appropriately
- [ ] Performance is equal or better than current implementation
- [ ] Code review completed and approved
- [ ] Phase 3 prerequisites are met

## Related Issues
- **Issue #002**: Phase 1 - Foundation Setup (prerequisite)
- **Issue #004**: Phase 3 - Optimization and Enhancement (depends on this)
- **Issue #005**: Phase 4 - Deployment and Migration (depends on this)

## Documentation Updates Required
- [ ] Update component documentation for Next.js patterns
- [ ] Document SSR considerations and limitations
- [ ] Update state management documentation
- [ ] Create troubleshooting guide for SSR issues

---

*This issue tracks the core feature migration from React Router to Next.js App Router while preserving all existing functionality and improving performance through SSR.*