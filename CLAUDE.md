# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React TypeScript mortgage calculator designed for the Netherlands market. It calculates and compares Annuity and Linear mortgage structures, allowing users to input property price, interest rates, tax deductions, and various costs to see detailed monthly payment breakdowns.

## Coding Guidelines

- Always try to use as many parallel agents as possible.
- Think deeply about the problem and the solution.
- Always make a plan before creating todos and going through the solution.
- Always update the CLAUDE.md file with the new information.
- Use the issues folder, create issues markdown files for each issue (like issue_1.md, issue_2.md, etc.) to track the progress of the issues and the solution.
- Use the todos folder, create todos markdown files for each todo following the template structure (like todo-p1-feature-name.md).

## Memory

- **Always use the `gh` brew tool to access Git and GitHub functionality** instead of git commands for GitHub operations like creating PRs, viewing issues, etc.

## Documentation Organization

The repository follows a structured documentation approach:

### Documentation Structure
- **docs/**: Central documentation hub with ADRs and guides
- **docs/adr/**: Architecture Decision Records documenting technical decisions
- **issues/**: Issue tracking with templates and structured workflow
- **todos/**: Task management with priority-based organization

### Current Documentation
- **ADR-001**: Migration from Bulma CSS to shadcn/ui + Tailwind CSS
- **ADR-002**: Adoption of Bun as primary JavaScript runtime and package manager
- **TODO-001**: UI migration completion tracking (P1 priority)

### File Organization Standards
- Follow template-driven documentation for consistency
- Use priority-based naming for todos (todo-p1-feature-name.md)
- Maintain cross-references between ADRs, issues, and todos
- Keep documentation up-to-date with implementation changes

## Development Commands

- **Start development server**: `bun dev` (Vite development server on localhost:3000)
- **Run tests**: `bun test` (Bun test runner)
- **Build for production**: `bun run build` (Vite production build to dist/)
- **Type checking**: `bun run typecheck` (TypeScript compiler check)
- **Linting**: `bun run lint` (ESLint with TypeScript support)
- **Code formatting**: `bun run format` (Prettier code formatting)
- **Deploy to AWS S3**: `bun run deploy` (Builds and syncs to S3 bucket with CloudFront invalidation)

## Architecture

### Core Components Structure
- **App.tsx**: Main application component managing global state (AppState) and routing between tabs
- **common/Formulas.tsx**: Contains mortgage calculation logic (PMT, IPMT, PPMT functions) and data generation for both annuity and linear mortgages
- **common/Types.tsx**: TypeScript type definitions for mortgage data structures
- **components/**: UI components for different sections (Mortgage, Costs, Interest, DataTable, Graph)

### Key Data Flow
1. User inputs are managed in App.tsx state (AppState type)
2. URL parameters sync with state for shareable links using query-string
3. Calculations performed using `calgulateLoanFigures()`, `calculateAnnuityData()`, and `calculateLinearData()`
4. Results displayed through tabbed interface (mortgage/costs/interest info tabs, annuity/linear/graph data tabs)

### Calculation Logic
- **Annuity**: Fixed monthly payments calculated using PMT formula over 360 months
- **Linear**: Fixed capital repayment with decreasing interest payments
- **Tax deductions**: Applied to interest payments based on Dutch tax system
- **NHG (National Mortgage Guarantee)**: Automatic calculation based on property price thresholds

## Technology Stack

- React 18 with TypeScript
- Vite for build tooling and development server
- Bun for package management and test runner
- **shadcn/ui + Tailwind CSS** for modern UI components and styling
- Recharts for data visualization
- React Router v6 for URL management
- Bun Test and React Testing Library for tests
- ESLint + Prettier for code quality
- GitHub Actions for CI/CD

## Recent Updates (2025-06-17)

### ✅ UI Modernization Complete
- **Migrated from Bulma to shadcn/ui + Tailwind CSS**
- **Mobile-first responsive design** implemented across all components
- **Performance optimized** by removing Bulma and Sass dependencies
- **Accessibility improved** with semantic HTML and ARIA support
- **All tests passing** with zero functionality regression

## Testing

Tests are located in `src/common/__tests__/` and focus on calculation accuracy. The test suite validates:
- Loan figure calculations with various input scenarios
- Annuity mortgage calculations across different time periods
- Linear mortgage calculations with expected monthly breakdowns
- Edge cases and mathematical precision

Run `bun test` to execute the test suite. The project uses Bun's built-in test runner with React Testing Library.

## Code Quality

- **Linting**: ESLint with TypeScript support and React rules
- **Formatting**: Prettier with consistent configuration
- **Type Safety**: Strict TypeScript configuration
- **CI/CD**: GitHub Actions workflow runs on all PRs to validate code quality, run tests, and ensure builds succeed