# Documentation Hub

This directory serves as the central documentation repository for the Mortgage Calculator project. It maintains a structured approach to tracking Architecture Decision Records (ADRs), Issues, and TODOs across development sessions.

## Documentation Structure

```
docs/
├── README.md          # This file - central documentation index
├── adr/              # Architecture Decision Records
│   └── README.md     # ADR index and guidelines
├── issues/           # Issue tracking and resolution documentation
│   └── README.md     # Issues index and templates
└── todos/            # Task tracking and planning
    └── README.md     # TODOs index and workflow
```

## Quick Links

- [Architecture Decision Records (ADRs)](./adr/README.md)
- [Issues Documentation](../issues/README.md)
- [TODOs and Tasks](../todos/README.md)

## Documentation Standards

### Naming Conventions

All documentation files follow these naming patterns:

- **ADRs**: `YYYY-MM-DD-adr-{number}-{kebab-case-title}.md`
  - Example: `2024-01-15-adr-001-use-bun-package-manager.md`
  
- **Issues**: `issue_{number}_{kebab-case-title}.md`
  - Example: `issue_001_input-validation-error.md`
  
- **TODOs**: `todo_{priority}_{kebab-case-title}.md`
  - Example: `todo_p1_implement-amortization-table.md`
  - Priority levels: p1 (critical), p2 (high), p3 (medium), p4 (low)

### Document Metadata

Every document must include frontmatter with:

```yaml
---
id: {unique-identifier}
title: {descriptive-title}
date: {YYYY-MM-DD}
status: {draft|active|completed|deprecated}
author: {author-name}
tags: [{tag1}, {tag2}]
---
```

## Current Documentation Status

### Architecture Decisions
- Total ADRs: 2
- Active: 2
- Deprecated: 0
- Last Updated: 2025-06-17

### Issues
- Open Issues: 1
- Resolved Issues: 0
- In Progress: 0
- Last Updated: 2024-01-15

### TODOs
- Total Tasks: 1
- Completed: 0
- In Progress: 0
- Last Updated: 2024-01-15

## Documentation Workflow

### 1. Creating New Documentation

When adding new documentation:
1. Use the appropriate template from each section's README
2. Follow the naming convention strictly
3. Include all required metadata
4. Update the relevant index in the section's README
5. Update the status counts in this file

### 2. Status Transitions

Documents move through these states:
- `draft` → Initial creation, not yet reviewed
- `active` → Approved and current
- `completed` → Finished (for issues/todos)
- `deprecated` → No longer relevant but kept for history

### 3. Cross-References

Use these formats for linking between documents:
- ADR reference: `[ADR-001](./adr/2024-01-15-adr-001-use-bun-package-manager.md)`
- Issue reference: `[Issue #001](../issues/issue_001_input-validation-error.md)`
- TODO reference: `[TODO P1-001](../todos/todo_p1_implement-amortization-table.md)`

## Search and Discovery

### By Category
- **Architecture**: All ADRs related to system design
- **Bug Fixes**: Issues with `bug` tag
- **Features**: TODOs with `feature` tag
- **Performance**: Documents with `performance` tag
- **Security**: Documents with `security` tag

### By Status
- **Active Work**: All documents with `active` or `in-progress` status
- **Completed**: All documents with `completed` status
- **Historical**: All documents with `deprecated` status

## Maintenance Guidelines

### Weekly Review
- Update status counts
- Archive completed items
- Prioritize new items
- Clean up deprecated documents

### Monthly Audit
- Verify all cross-references
- Update index files
- Archive old completed items
- Generate summary reports

## Integration Points

This documentation integrates with:
- Git commit messages (reference doc IDs)
- Pull requests (link to relevant ADRs/Issues)
- Code comments (reference decision rationale)
- Project milestones (track TODO completion)

## Templates

Quick access to document templates:
- [ADR Template](./adr/README.md#adr-template)
- [Issue Template](../issues/README.md#issue-template)
- [TODO Template](../todos/README.md#todo-template)

---

*Last updated: 2024-01-15*
*Next review: 2024-01-22*
