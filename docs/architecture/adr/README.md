# Architecture Decision Records (ADRs)

This directory contains the Architecture Decision Records for the Mortgage Calculator project. ADRs document significant architectural decisions, their context, and consequences to maintain a clear history of why the system evolved the way it did.

## What is an ADR?

An Architecture Decision Record captures:
- **Context**: The situation and forces at play
- **Decision**: What was decided
- **Consequences**: The resulting context after applying the decision
- **Alternatives**: Other options that were considered

## When to Write an ADR

Create an ADR when:
- Selecting fundamental technologies or frameworks
- Choosing between architectural patterns
- Making decisions with long-term impact
- Changing existing architectural decisions
- Decisions that affect multiple components
- Trade-offs need to be documented for future reference

## ADR Lifecycle

```
Proposed → Accepted → Deprecated → Superseded
```

- **Proposed**: Under discussion and review
- **Accepted**: Approved and implemented
- **Deprecated**: No longer recommended but still in use
- **Superseded**: Replaced by a newer decision

## Current ADRs

### Active ADRs

| Number | Title | Date | Status |
|--------|-------|------|--------|
| ADR-001 | [Migrate from Bulma CSS to shadcn/ui + Tailwind CSS](./2025-06-17-adr-001-migrate-from-bulma-to-shadcn-ui.md) | 2025-06-17 | Accepted |
| ADR-002 | [Adopt Bun as Primary JavaScript Runtime and Package Manager](./2025-06-17-adr-002-adopt-bun-as-primary-javascript-runtime.md) | 2025-06-17 | Accepted |
| ADR-003 | [Migrate from React+Vite to Next.js and Deploy on Vercel](./2025-06-17-adr-003-migrate-to-nextjs-and-vercel.md) | 2025-06-17 | Proposed |

### Deprecated ADRs

| Number | Title | Deprecated Date | Superseded By |
|--------|-------|-----------------|---------------|
| - | - | - | - |

### ADR Statistics

- **Total ADRs**: 3
- **Active**: 2
- **Proposed**: 1
- **Deprecated**: 0

## ADR Naming Convention

Files follow this pattern:
```
YYYY-MM-DD-adr-{number}-{kebab-case-title}.md
```

Example: `2024-01-15-adr-001-use-bun-package-manager.md`

## ADR Template

Use this template when creating new ADRs:

```markdown
---
id: adr-{number}
title: {descriptive-title}
date: {YYYY-MM-DD}
status: {proposed|accepted|deprecated|superseded}
author: {author-name}
tags: [{tag1}, {tag2}]
supersedes: {adr-id}
superseded_by: {adr-id}
---

# ADR-{number}: {Title}

## Status
{proposed|accepted|deprecated|superseded}

## Context
Describe the context and problem statement. What is the issue that we're seeing that is motivating this decision?

### Current Situation
- How things work today
- Problems with current approach
- Constraints we're operating under

### Requirements
- What we need to achieve
- Non-negotiable constraints
- Quality attributes to optimize for

## Decision
State the architectural decision that was made.

### Chosen Solution: {solution-name}
Detailed description of what we will do.

#### Implementation Details
- Technical specifics
- Integration points
- Migration strategy if applicable

## Consequences

### Positive Consequences
- Benefits of this decision
- Problems it solves
- Opportunities it creates

### Negative Consequences
- Drawbacks or limitations
- Technical debt incurred
- Risks introduced

### Neutral Consequences
- Changes that are neither good nor bad
- Side effects to be aware of

## Alternatives Considered

### Option 1: {alternative-name}
**Description**: What this alternative would involve

**Pros**:
- Advantage 1
- Advantage 2

**Cons**:
- Disadvantage 1
- Disadvantage 2

**Reason for rejection**: Why we didn't choose this

### Option 2: {alternative-name}
**Description**: What this alternative would involve

**Pros**:
- Advantage 1
- Advantage 2

**Cons**:
- Disadvantage 1
- Disadvantage 2

**Reason for rejection**: Why we didn't choose this

## Decision Criteria
Factors that influenced this decision:
1. **{criterion-1}**: Weight: {high|medium|low}
2. **{criterion-2}**: Weight: {high|medium|low}
3. **{criterion-3}**: Weight: {high|medium|low}

## Implementation Plan
### Phase 1: {phase-name}
- [ ] Step 1
- [ ] Step 2

### Phase 2: {phase-name}
- [ ] Step 3
- [ ] Step 4

### Success Metrics
How we'll know if this decision was correct:
- Metric 1: {description}
- Metric 2: {description}

## References
- [Link to relevant documentation]
- [Link to similar decisions in other projects]
- [Link to technical resources]

## Appendix
### Research Notes
Additional research or benchmarks conducted.

### Meeting Notes
Key points from decision meetings.

### Diagrams
Any architectural diagrams illustrating the decision.

## Change Log
- {YYYY-MM-DD}: Initial proposal by {name}
- {YYYY-MM-DD}: Revised based on feedback
- {YYYY-MM-DD}: Accepted by team
- {YYYY-MM-DD}: Implementation started
```

## Categories of ADRs

### Technology Selection
- Framework choices
- Library selections
- Tool decisions
- Platform choices

### Architectural Patterns
- Design patterns
- Communication patterns
- Data flow decisions
- Component structure

### Development Practices
- Coding standards
- Testing strategies
- Deployment processes
- Version control workflows

### Data Management
- Storage solutions
- Data formats
- API designs
- State management

### Security & Performance
- Authentication methods
- Authorization strategies
- Caching decisions
- Optimization approaches

## Best Practices

### Writing ADRs
1. **Be concise**: Focus on key information
2. **Be specific**: Avoid vague statements
3. **Be honest**: Document real trade-offs
4. **Be timely**: Write while context is fresh
5. **Be complete**: Include all alternatives considered

### Reviewing ADRs
1. Check for completeness
2. Verify alternatives were considered
3. Ensure consequences are realistic
4. Validate implementation feasibility
5. Confirm decision criteria are clear

### Maintaining ADRs
1. Review quarterly for relevance
2. Mark deprecated when superseded
3. Link related ADRs
4. Update status as implemented
5. Add notes on actual outcomes

## Search and Discovery

### By Status
- [Proposed ADRs](./YYYY-*) - `status: proposed`
- [Accepted ADRs](./YYYY-*) - `status: accepted`
- [Deprecated ADRs](./YYYY-*) - `status: deprecated`

### By Category
- [Technology](./YYYY-*) - `tags: [technology]`
- [Architecture](./YYYY-*) - `tags: [architecture]`
- [Security](./YYYY-*) - `tags: [security]`
- [Performance](./YYYY-*) - `tags: [performance]`

### By Year
- [2024 ADRs](./2024-*)
- [2025 ADRs](./2025-*)

## Integration with Development

### Code Comments
Reference ADRs in code:
```javascript
// See ADR-001 for why we chose this approach
// Implementation follows pattern from ADR-003
```

### Pull Requests
Link ADRs in PR descriptions:
```
This PR implements the decision from ADR-005.
See: docs/adr/2024-01-15-adr-005-state-management.md
```

### Documentation
Cross-reference in other docs:
```
The authentication flow (see ADR-007) uses JWT tokens...
```

## Review Process

### Proposal Phase
1. Author creates draft ADR
2. Share with team for feedback
3. Discuss in architecture meeting
4. Revise based on input

### Acceptance Phase
1. Final review by tech lead
2. Team consensus reached
3. Status updated to accepted
4. Implementation begins

### Deprecation Phase
1. Identify need for change
2. Create superseding ADR
3. Update original as deprecated
4. Plan migration if needed

## Metrics

### ADR Health Metrics
- **Decision Velocity**: ADRs per month
- **Implementation Rate**: % of accepted ADRs implemented
- **Deprecation Rate**: How often decisions change
- **Review Turnaround**: Time from proposed to accepted

### Quality Indicators
- Completeness of alternatives
- Clarity of consequences
- Accuracy of predictions
- Value of decisions made

---

*Last updated: 2024-01-15*
*Template version: 2.0*
