# Component Migration Strategy: Bulma → shadcn/ui

## Overview
Systematic migration plan for replacing Bulma CSS components with shadcn/ui equivalents while maintaining functionality and improving mobile responsiveness.

## Component Mapping

### 1. Layout & Structure
| Current (Bulma) | shadcn/ui Equivalent | Priority | Notes |
|-----------------|---------------------|----------|-------|
| `container` | Tailwind container classes | High | Use `max-w-7xl mx-auto px-4` |
| `section` | Custom div with Tailwind | High | Use `py-12 px-4` |
| `columns/column` | Tailwind Grid/Flex | High | Use `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4` |
| `hero/hero-body` | Custom header section | High | Use Tailwind utilities |

### 2. Navigation & Tabs
| Current (Bulma) | shadcn/ui Equivalent | Priority | Notes |
|-----------------|---------------------|----------|-------|
| `tabs` + `is-primary` | shadcn/ui Tabs | High | Main navigation component |
| `is-active` | Tabs active state | High | Built into shadcn/ui Tabs |

### 3. Form Components
| Current (Bulma) | shadcn/ui Equivalent | Priority | Notes |
|-----------------|---------------------|----------|-------|
| `field/control` | shadcn/ui Input wrapper | High | Form field structure |
| `input` | shadcn/ui Input | High | Main input component |
| `has-icons-left` | Input with icon | High | Custom implementation needed |
| `icon` | Lucide React icons | High | Replace with lucide-react |

### 4. Data Display
| Current (Bulma) | shadcn/ui Equivalent | Priority | Notes |
|-----------------|---------------------|----------|-------|
| `table` + modifiers | shadcn/ui Table | High | Data table component |
| `is-striped` | Table row styling | High | Built into shadcn/ui Table |
| `is-bordered` | Table border styling | High | Tailwind border classes |
| `table-container` | Responsive table wrapper | High | Custom scroll container |

### 5. Typography
| Current (Bulma) | shadcn/ui Equivalent | Priority | Notes |
|-----------------|---------------------|----------|-------|
| `title` | Tailwind text classes | Medium | Use `text-3xl font-bold` |
| `subtitle` | Tailwind text classes | Medium | Use `text-xl text-muted-foreground` |

## Implementation Order

### Phase 1: Essential Components
1. **Input Component** - Core form functionality
2. **Tabs Component** - Main navigation
3. **Table Component** - Data display
4. **Button Component** - Interactive elements

### Phase 2: Layout Migration
1. **Container/Grid System** - Overall layout
2. **Hero Section** - Header component
3. **Section/Card Components** - Content areas

### Phase 3: Polish & Optimization
1. **Typography System** - Text styling
2. **Icon System** - Icon components
3. **Responsive Utilities** - Mobile optimization

## Technical Considerations

### Styling Approach
- **Gradual Migration**: Keep Bulma alongside Tailwind initially
- **Component Isolation**: Migrate one component at a time
- **CSS Scoping**: Use CSS modules to prevent conflicts

### Mobile-First Design
- **Breakpoints**: Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:)
- **Touch Targets**: Ensure 44px minimum for mobile
- **Typography**: Responsive text sizing
- **Spacing**: Consistent spacing scale

### Performance Optimization
- **Tree Shaking**: Remove unused Bulma after migration
- **Bundle Analysis**: Monitor bundle size changes
- **Component Lazy Loading**: Split large components

## Quality Assurance

### Testing Strategy
1. **Visual Regression**: Compare before/after screenshots
2. **Functionality Testing**: Ensure all calculations work
3. **Responsive Testing**: Test across device sizes
4. **Accessibility Testing**: Maintain a11y standards

### Migration Checklist
- [ ] Component renders correctly
- [ ] All props/functionality preserved
- [ ] Mobile responsive
- [ ] Accessibility maintained
- [ ] Performance not degraded
- [ ] Tests pass

Created: 2025-06-17
Status: In Progress