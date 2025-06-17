# TODO and Task Management

This directory contains all planned tasks, features, and improvements for the Mortgage Calculator project. Tasks are organized by priority and tracked through their lifecycle.

## Task Management System

### Task Lifecycle

```
Planning → Prioritization → Assignment → Development → Review → Completion → Archive
```

### Task Categories

- **Feature**: New functionality to implement
- **Enhancement**: Improvements to existing features
- **Refactor**: Code quality improvements
- **Performance**: Optimization tasks
- **Testing**: Test coverage improvements
- **Documentation**: Documentation updates
- **Maintenance**: Dependency updates, cleanup

## Current Tasks

### Active Tasks

| Priority | ID | Title | Category | Status | Assignee | Due Date |
|----------|-----|-------|----------|--------|----------|----------|
| P1 | 001 | [Complete UI Migration from Bulma to shadcn/ui](./todo-p1-ui-migration-completion.md) | Enhancement | In Progress | Development Team | 2025-06-17 |

### Backlog

| Priority | ID | Title | Category | Estimated Effort |
|----------|-----|-------|----------|------------------|
| - | - | - | - | - |

### Completed Tasks

| ID | Title | Completed Date | Related PR |
|-----|-------|----------------|------------|
| - | - | - | - |

### Legacy/Archive

| ID | Title | Status | Notes |
|-----|-------|--------|-------|
| legacy | [Component Migration Strategy: Bulma → shadcn/ui](./todo_1.md) | Superseded | Replaced by TODO-001 with proper template format |

### Task Statistics

- **Total Tasks**: 1
- **In Progress**: 1
- **Blocked**: 0
- **Completed**: 0
- **This Sprint**: 1
- **Next Sprint**: 0

## Task Naming Convention

Files should follow this pattern:
```
todo_{priority}_{kebab-case-title}.md
```

Priority levels:
- `p1` - Critical (must do this sprint)
- `p2` - High (should do this sprint)
- `p3` - Medium (nice to have)
- `p4` - Low (future consideration)

Example: `todo_p1_implement-amortization-table.md`

## TODO Template

Use this template when creating new task documentation:

```markdown
---
id: todo_{number}
title: {descriptive-title}
date: {YYYY-MM-DD}
status: {planned|in-progress|blocked|completed|cancelled}
author: {creator-name}
assignee: {assignee-name}
priority: {p1|p2|p3|p4}
category: {feature|enhancement|refactor|performance|testing|documentation|maintenance}
estimated_hours: {number}
actual_hours: {number}
sprint: {sprint-number}
tags: [{tag1}, {tag2}]
dependencies: [{todo-id}, {issue-id}]
related_issue: {issue-id}
related_adr: {adr-id}
---

# {Task Title}

## Overview
Brief description of what needs to be done and why.

## Motivation
Why this task is important and what value it provides.

## Requirements
### Functional Requirements
- [ ] Requirement 1
- [ ] Requirement 2
- [ ] Requirement 3

### Non-Functional Requirements
- [ ] Performance criteria
- [ ] Security considerations
- [ ] Accessibility standards

## Technical Details
### Approach
High-level technical approach to implement this task.

### Components Affected
- `src/components/Component.tsx`
- `src/utils/helper.ts`

### API Changes
Any API modifications required.

### Database Changes
Any schema or data changes needed.

## Implementation Plan
### Phase 1: {phase-name}
- [ ] Task 1
- [ ] Task 2

### Phase 2: {phase-name}
- [ ] Task 3
- [ ] Task 4

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

## Testing Strategy
### Unit Tests
- Test cases to add

### Integration Tests
- Scenarios to verify

### Manual Testing
- User flows to validate

## Documentation Updates
- [ ] Update user documentation
- [ ] Update API documentation
- [ ] Update README
- [ ] Add code comments

## Dependencies
### Blocking
Tasks or issues that must be completed first:
- {todo-id}: {title}
- {issue-id}: {title}

### Blocked By
Tasks that depend on this:
- {todo-id}: {title}

## Risk Assessment
### Technical Risks
- Risk 1: {description} - Mitigation: {strategy}
- Risk 2: {description} - Mitigation: {strategy}

### Timeline Risks
- Risk: {description} - Mitigation: {strategy}

## Notes
### Design Decisions
Important decisions made during planning.

### Open Questions
- Question 1?
- Question 2?

### References
- [Related Documentation](link)
- [Similar Implementation](link)
- [Technical Resource](link)

## Progress Log
- {YYYY-MM-DD}: Task created
- {YYYY-MM-DD}: Started implementation
- {YYYY-MM-DD}: Blocker encountered: {description}
- {YYYY-MM-DD}: Completed phase 1
- {YYYY-MM-DD}: Task completed
```

## Priority Matrix

### P1 - Critical
- **Timeline**: Must complete this sprint
- **Impact**: Blocks other work or critical functionality
- **Examples**: Security fixes, core features, blocking bugs

### P2 - High
- **Timeline**: Should complete this sprint
- **Impact**: Important for user experience
- **Examples**: Key features, significant improvements

### P3 - Medium  
- **Timeline**: Next 2-3 sprints
- **Impact**: Nice to have, improves quality
- **Examples**: Minor features, optimizations

### P4 - Low
- **Timeline**: Future consideration
- **Impact**: Minor improvements
- **Examples**: Cosmetic changes, nice-to-haves

## Sprint Planning

### Current Sprint: Sprint {number} ({start-date} - {end-date})
#### Goals
1. Goal 1
2. Goal 2

#### Committed Tasks
- [ ] P1-001: Task title
- [ ] P2-003: Task title

### Sprint Velocity
- **Average Velocity**: {points}/sprint
- **Last Sprint**: {points}
- **Current Sprint**: {points} planned

## Task Workflow

### 1. Creation
1. Identify need from issues, reviews, or planning
2. Create task file with template
3. Assign initial priority
4. Add to backlog

### 2. Prioritization
1. Review in sprint planning
2. Assess dependencies
3. Estimate effort
4. Assign to sprint

### 3. Development
1. Assign to developer
2. Update status to `in-progress`
3. Create feature branch
4. Implement solution

### 4. Completion
1. Create pull request
2. Pass code review
3. Update documentation
4. Mark as `completed`

## Search and Organization

### By Priority
- [Critical Tasks (P1)](./todo_p1_*)
- [High Priority (P2)](./todo_p2_*)
- [Medium Priority (P3)](./todo_p3_*)
- [Low Priority (P4)](./todo_p4_*)

### By Category
- [Features](./todo_*) - `category: feature`
- [Enhancements](./todo_*) - `category: enhancement`
- [Refactoring](./todo_*) - `category: refactor`
- [Performance](./todo_*) - `category: performance`

### By Status
- [In Progress](./todo_*) - `status: in-progress`
- [Blocked](./todo_*) - `status: blocked`
- [Completed](./todo_*) - `status: completed`

## Best Practices

### Task Creation
1. Clear, actionable titles
2. Specific acceptance criteria
3. Realistic time estimates
4. Identify dependencies early
5. Include technical approach

### Task Execution
1. Update status promptly
2. Log blockers immediately
3. Track actual vs estimated time
4. Document decisions made
5. Update related documentation

### Task Review
1. Verify acceptance criteria met
2. Ensure tests are added
3. Check documentation updates
4. Validate no regressions
5. Update completion metrics

## Integration Points

### With Issues
- TODOs often originate from issues
- Reference issue IDs in tasks
- Close issues when TODOs complete

### With ADRs
- Major tasks may require ADRs
- Reference ADR decisions
- Update ADRs if approach changes

### With Git
```bash
# Branch naming
feature/todo-001-implement-amortization

# Commit messages
feat: implement amortization table (TODO #001)

# PR titles
[TODO #001] Add amortization table feature
```

## Metrics and Reporting

### Key Metrics
- **Velocity**: Story points per sprint
- **Cycle Time**: Time from start to completion
- **Throughput**: Tasks completed per week
- **WIP Limit**: Maximum concurrent tasks

### Weekly Standup Template
```
## TODO Status - Week of {date}

### Completed This Week
- TODO #X: {title}

### In Progress
- TODO #Y: {title} - {percent}% complete

### Blocked
- TODO #Z: {title} - Blocked by: {reason}

### Next Week Plan
- Start TODO #A
- Complete TODO #Y
```

### Sprint Retrospective Template
```
## Sprint {number} Retrospective

### Completed
- {list of completed TODOs}

### Carried Over
- {list of incomplete TODOs}

### Velocity
- Planned: {points}
- Actual: {points}

### Lessons Learned
- What went well
- What could improve
- Action items
```

## Automation

### Status Updates
Tasks automatically transition when:
- PR created → `in-progress`
- PR merged → `completed`
- Dependency blocked → `blocked`

### Notifications
Alerts sent for:
- Task assigned
- Status changed
- Due date approaching
- Blocker added

---

*Last updated: 2024-01-15*
*Process version: 1.0* 