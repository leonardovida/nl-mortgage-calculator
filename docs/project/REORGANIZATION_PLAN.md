# Project Reorganization Plan

## Overview
This document outlines the reorganization plan for the mortgage-calculator project to create a more scalable and maintainable structure.

## Current Issues
1. Multiple documentation files scattered in root directory
2. Mixed organizational patterns in docs/
3. Test files scattered across src/
4. Examples folder at root level
5. Database/Supabase files mixed with application code
6. No clear feature boundaries

## Proposed Structure

```
mortgage-calculator/
├── .github/                    # GitHub Actions, workflows, and templates
│   ├── workflows/             # CI/CD workflows
│   └── ISSUE_TEMPLATE/        # Issue templates
│
├── docs/                      # All documentation
│   ├── architecture/          # Technical architecture
│   │   ├── adr/              # Architecture Decision Records
│   │   └── diagrams/         # System diagrams
│   ├── guides/               # How-to guides
│   │   ├── getting-started.md
│   │   ├── deployment.md
│   │   └── development.md
│   ├── api/                  # API documentation
│   └── project/              # Project management
│       ├── issues/           # Issue tracking
│       ├── todos/            # Task management
│       └── REORGANIZATION_PLAN.md
│
├── src/                       # Source code
│   ├── app/                  # Next.js app router
│   │   ├── api/             # API routes
│   │   ├── (routes)/        # Page routes
│   │   └── layout.tsx       # Root layout
│   │
│   ├── features/            # Feature-based modules
│   │   ├── calculator/      # Core calculator feature
│   │   │   ├── components/  # Calculator-specific components
│   │   │   ├── hooks/       # Calculator hooks
│   │   │   ├── lib/         # Calculator logic
│   │   │   └── types/       # Calculator types
│   │   │
│   │   ├── analytics/       # Analytics feature
│   │   │   ├── components/  # Analytics components
│   │   │   ├── lib/         # Analytics implementation
│   │   │   └── types/       # Analytics types
│   │   │
│   │   ├── database/        # Database feature
│   │   │   ├── components/  # Database UI components
│   │   │   ├── hooks/       # Database hooks
│   │   │   ├── lib/         # Supabase client
│   │   │   └── types/       # Database types
│   │   │
│   │   └── comparison/      # Rent vs Buy feature
│   │       ├── components/  # Comparison components
│   │       └── lib/         # Comparison logic
│   │
│   ├── components/          # Shared components
│   │   ├── ui/             # Base UI components (shadcn)
│   │   └── common/         # App-wide components
│   │
│   ├── hooks/              # Shared React hooks
│   ├── lib/                # Core utilities
│   ├── styles/             # Global styles
│   └── types/              # Shared TypeScript types
│
├── tests/                   # All test files
│   ├── unit/               # Unit tests
│   │   ├── calculator/
│   │   ├── analytics/
│   │   └── database/
│   ├── integration/        # Integration tests
│   └── e2e/               # End-to-end tests
│
├── database/              # Database infrastructure
│   ├── schema/           # Schema definitions
│   ├── migrations/       # Database migrations
│   └── seeds/           # Seed data
│
├── scripts/              # Build and utility scripts
│   ├── build.sh
│   ├── deploy.sh
│   └── generate-icons.sh
│
├── config/              # Configuration files
│   ├── jest.config.js
│   └── test-setup.ts
│
└── public/              # Static assets
    ├── icons/
    ├── images/
    └── screenshots/
```

## Migration Steps

### Phase 1: Create New Structure
1. Create all new directories
2. Move documentation files to appropriate locations
3. Create index files for each feature module

### Phase 2: Reorganize Features
1. Move calculator logic to features/calculator
2. Move analytics code to features/analytics
3. Move database code to features/database
4. Move rent vs buy to features/comparison

### Phase 3: Consolidate Tests
1. Move all test files to tests/ directory
2. Organize by test type (unit, integration, e2e)
3. Update test imports

### Phase 4: Update Imports
1. Update all import paths
2. Create barrel exports for features
3. Update TypeScript path aliases

### Phase 5: Clean Up
1. Remove empty directories
2. Update documentation
3. Update CI/CD configurations

## Benefits

1. **Scalability**: Feature-based structure makes it easy to add new features
2. **Maintainability**: Clear separation of concerns
3. **Discoverability**: Logical organization helps find code quickly
4. **Testing**: Centralized test location with clear test types
5. **Documentation**: All docs in one place with clear categories
6. **Collaboration**: Better structure for team development

## TypeScript Path Aliases

Add to tsconfig.json:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@features/*": ["./src/features/*"],
      "@components/*": ["./src/components/*"],
      "@lib/*": ["./src/lib/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@types/*": ["./src/types/*"]
    }
  }
}
```

## Next Steps

1. Review and approve this plan
2. Create feature branches for each phase
3. Execute migration in phases
4. Update all documentation
5. Run full test suite after each phase