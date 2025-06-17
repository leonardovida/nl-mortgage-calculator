# Issue Tracking Documentation

This directory contains detailed documentation for all issues encountered in the Mortgage Calculator project. Each issue is documented with context, analysis, and resolution steps.

## Issue Management Process

### Issue Lifecycle

```
Discovery → Documentation → Analysis → Implementation → Testing → Resolution → Archive
```

### Issue Categories

- **Bug**: Defects in existing functionality
- **Enhancement**: Improvements to existing features
- **Feature Request**: New functionality proposals
- **Performance**: Speed or resource usage problems
- **Security**: Vulnerabilities or security concerns
- **Documentation**: Missing or incorrect documentation

## Current Issues

### Active Issues

| ID | Title | Priority | Status | Assignee | Created |
|----|-------|----------|--------|----------|---------|
| 001 | Input Validation Error | High | Open | - | 2024-01-15 |

### Resolved Issues

| ID | Title | Resolution | Resolved Date |
|----|-------|------------|---------------|
| - | - | - | - |

### Issue Statistics

- **Total Issues**: 1
- **Open**: 1
- **In Progress**: 0
- **Resolved**: 0
- **Won't Fix**: 0

## Issue Naming Convention

Files should follow this pattern:
```
issue_{number}_{kebab-case-title}.md
```

Example: `issue_001_input-validation-error.md`

## Issue Template

Use this template when creating new issue documentation:

```markdown
---
id: issue_{number}
title: {descriptive-title}
date: {YYYY-MM-DD}
status: {open|in-progress|resolved|won't-fix}
author: {reporter-name}
assignee: {assignee-name}
priority: {critical|high|medium|low}
category: {bug|enhancement|feature-request|performance|security|documentation}
tags: [{tag1}, {tag2}]
related_pr: {pr-number}
related_adr: {adr-id}
---

# {Issue Title}

## Summary
Brief description of the issue in 1-2 sentences.

## Environment
- **OS**: {operating-system}
- **Browser**: {browser-version}
- **Node Version**: {node-version}
- **Package Manager**: {bun-version}
- **Commit Hash**: {git-hash}

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen when following the steps above.

## Actual Behavior
What actually happens, including any error messages.

## Screenshots/Logs
Include relevant screenshots or error logs.

## Root Cause Analysis
### Investigation Steps
- [ ] Check one
- [ ] Check two

### Findings
What was discovered during investigation.

### Root Cause
The underlying reason for the issue.

## Proposed Solution
### Approach
High-level approach to fixing the issue.

### Implementation Details
Specific code changes needed.

### Testing Plan
How to verify the fix works.

## Impact Analysis
- **Severity**: {critical|high|medium|low}
- **Affected Components**: [component1, component2]
- **User Impact**: Description of how users are affected
- **Workaround**: Temporary solution if available

## Resolution
### Fix Applied
Description of the actual fix implemented.

### Verification Steps
1. How to verify the fix
2. Test cases to run

### Lessons Learned
What can be improved to prevent similar issues.

## References
- Related PR: [PR #{number}](link)
- Related ADR: [ADR-{number}](link)
- External Resources: [Resource](link)

## History
- {YYYY-MM-DD}: Issue discovered by {name}
- {YYYY-MM-DD}: Assigned to {name}
- {YYYY-MM-DD}: Fix implemented in PR #{number}
- {YYYY-MM-DD}: Issue resolved
```

## Issue Prioritization

### Priority Levels

1. **Critical (P0)**
   - System is completely unusable
   - Data loss or corruption
   - Security vulnerability
   - Response time: < 4 hours

2. **High (P1)**
   - Major feature broken
   - Significant performance degradation
   - No reasonable workaround
   - Response time: < 1 day

3. **Medium (P2)**
   - Feature partially broken
   - Workaround available
   - Minor performance issue
   - Response time: < 1 week

4. **Low (P3)**
   - Minor inconvenience
   - Cosmetic issues
   - Enhancement requests
   - Response time: Next release cycle

## Search and Filter

### By Status
- [Open Issues](./issue_*) - `status: open`
- [In Progress](./issue_*) - `status: in-progress`
- [Resolved](./issue_*) - `status: resolved`

### By Category
- [Bugs](./issue_*) - `category: bug`
- [Enhancements](./issue_*) - `category: enhancement`
- [Performance](./issue_*) - `category: performance`

### By Priority
- [Critical](./issue_*) - `priority: critical`
- [High Priority](./issue_*) - `priority: high`
- [Medium Priority](./issue_*) - `priority: medium`
- [Low Priority](./issue_*) - `priority: low`

## Best Practices

### When Creating Issues
1. Search existing issues first to avoid duplicates
2. Use clear, descriptive titles
3. Include all environment details
4. Provide reproducible steps
5. Attach relevant logs or screenshots
6. Tag appropriately for better discovery

### When Resolving Issues
1. Document the investigation process
2. Explain the root cause clearly
3. Include code snippets for the fix
4. Add test cases that verify the fix
5. Update related documentation
6. Note any preventive measures

### When Reviewing Issues
1. Verify reproduction steps work
2. Confirm priority is appropriate
3. Check for related issues
4. Ensure proper categorization
5. Validate proposed solutions

## Integration with Development

### Git Commits
Reference issues in commits:
```
fix: resolve input validation error

Fixes issue #001
```

### Pull Requests
Link issues in PR descriptions:
```
## Related Issues
- Fixes #001: Input validation error
```

### Code Comments
Reference issue context:
```javascript
// Workaround for issue #001
// TODO: Remove after proper fix is implemented
```

## Metrics and Reporting

### Key Metrics
- **Mean Time to Resolution (MTTR)**: Average time from discovery to resolution
- **Issue Velocity**: Issues resolved per week
- **Backlog Health**: Age of open issues
- **Recurrence Rate**: Issues that reappear after resolution

### Monthly Report Template
```
## Issue Report - {Month Year}

### Summary
- New Issues: {count}
- Resolved Issues: {count}
- Open Issues: {count}

### Highlights
- Major issues resolved
- Recurring problems identified
- Process improvements made

### Next Month Focus
- Priority issues to address
- Preventive measures to implement
```

---

*Last updated: 2024-01-15*
*Template version: 1.0* 