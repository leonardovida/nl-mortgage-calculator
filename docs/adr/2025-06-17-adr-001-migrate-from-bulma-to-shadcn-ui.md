# ADR-001: Migrate from Bulma CSS to shadcn/ui + Tailwind CSS

**Date**: 2025-06-17  
**Status**: Accepted  
**Author**: Development Team  
**Decision ID**: ADR-001  

## Context

The current mortgage calculator application uses Bulma CSS as its primary UI framework. However, several challenges have emerged:

1. **Mobile Responsiveness**: Bulma's default responsive behavior doesn't meet our Netherlands market requirements for mobile-first design
2. **Customization Limitations**: Bulma's SASS-based theming system creates build complexity and limits dynamic theming capabilities
3. **Bundle Size**: Full Bulma framework adds unnecessary weight for our specific component needs
4. **Developer Experience**: Limited TypeScript integration and component composition patterns
5. **Modern Stack Alignment**: shadcn/ui provides better React integration and follows current best practices

## Decision

We will migrate from Bulma CSS to **shadcn/ui + Tailwind CSS** for the following reasons:

### Chosen Solution: shadcn/ui + Tailwind CSS
- **Component Architecture**: Copy-paste components that we own and can customize
- **TypeScript First**: Full TypeScript support with proper type definitions
- **Accessibility**: Built-in accessibility features and ARIA support
- **Mobile-First**: Tailwind's responsive design system
- **Performance**: Tree-shakable utilities and components
- **Developer Experience**: Better IDE support and IntelliSense

## Implementation Plan

### Phase 1: Foundation Setup (Completed)
- [x] Install shadcn/ui and Tailwind CSS dependencies
- [x] Configure Tailwind CSS with shadcn/ui presets
- [x] Set up component library structure in `src/components/ui/`

### Phase 2: Core Component Migration (In Progress)
- [x] Input component migration
- [x] Tabs component migration  
- [x] Table component migration
- [x] Button component migration
- [x] Card component migration

### Phase 3: Layout System Migration (Planned)
- [ ] Container and grid system conversion
- [ ] Section and hero component migration
- [ ] Responsive breakpoint optimization

### Phase 4: Cleanup and Optimization (Planned)
- [ ] Remove Bulma dependencies
- [ ] Bundle size optimization
- [ ] Performance testing and validation

## Consequences

### Positive
- **Improved Mobile Experience**: Better responsive design for Netherlands users
- **Enhanced Developer Experience**: TypeScript integration and better tooling
- **Performance Gains**: Smaller bundle size and faster load times
- **Customization Freedom**: Full control over component styling and behavior
- **Future-Proof**: Modern React patterns and active maintenance

### Negative  
- **Migration Effort**: Requires systematic component replacement
- **Learning Curve**: Team needs to learn Tailwind CSS utility classes
- **Design System Consistency**: Need to establish new design tokens and patterns

### Neutral
- **Functionality Preservation**: All existing calculations and business logic remain unchanged
- **User Experience**: End users see improved mobile experience without feature changes

## Alternatives Considered

### 1. Stay with Bulma + Custom CSS
- **Pros**: No migration effort required
- **Cons**: Mobile responsiveness issues persist, limited customization

### 2. Material-UI (MUI)
- **Pros**: Comprehensive component library, good TypeScript support
- **Cons**: Heavy bundle size, opinionated design system, harder to customize

### 3. Chakra UI
- **Pros**: Good developer experience, modular architecture
- **Cons**: Less active development, smaller community than shadcn/ui

### 4. Ant Design
- **Pros**: Comprehensive component set, good documentation
- **Cons**: Large bundle size, design oriented towards enterprise applications

## Decision Criteria

1. **Mobile-First Design**: Must support excellent mobile experience
2. **Bundle Size**: Should reduce or maintain current bundle size
3. **Developer Experience**: TypeScript support and modern React patterns
4. **Customization**: Ability to customize without framework limitations
5. **Maintenance**: Active community and long-term viability

shadcn/ui + Tailwind CSS scored highest across all criteria.

## Success Metrics

- **Performance**: Bundle size reduction of 20%+ 
- **Mobile Experience**: Lighthouse mobile score improvement to 90+
- **Developer Velocity**: Component development time reduction
- **Accessibility**: Maintain WCAG 2.1 AA compliance
- **User Engagement**: No regression in user interaction metrics

## Risk Assessment

### Technical Risks
- **Migration Bugs**: Component behavior changes during migration
  - *Mitigation*: Comprehensive testing and gradual rollout
- **Performance Regression**: Potential CSS-in-JS overhead
  - *Mitigation*: Bundle analysis and performance monitoring

### Schedule Risks  
- **Extended Timeline**: Migration takes longer than expected
  - *Mitigation*: Phased approach allows for iterative delivery
- **Feature Development Delay**: Migration blocks new feature work
  - *Mitigation*: Parallel development streams and clear priorities

## References

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Migration TODO: todo_1.md](/todos/todo_1.md)
- [Component Migration Tracking](https://github.com/project/issues)

## Change Log

- **2025-06-17**: ADR created and approved
- **2025-06-17**: Phase 1 and Phase 2 implementation completed

---

*This ADR documents the architectural decision to migrate from Bulma CSS to shadcn/ui + Tailwind CSS for improved mobile responsiveness and developer experience.*