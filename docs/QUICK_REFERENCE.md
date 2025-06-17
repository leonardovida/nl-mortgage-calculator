# Documentation Quick Reference Guide

## 🚀 Quick Start

### Creating New Documentation

1. **ADR (Architecture Decision)**
   ```bash
   cp docs/adr/TEMPLATE-adr.md docs/adr/2024-01-15-adr-001-your-decision.md
   ```

2. **Issue**
   ```bash
   cp issues/TEMPLATE-issue.md issues/issue_001_your-issue-title.md
   ```

3. **TODO**
   ```bash
   cp todos/TEMPLATE-todo.md todos/todo_p1_your-task-title.md
   ```

## 📋 When to Use Each Type

### Use an ADR when:
- Selecting a new technology or framework
- Changing architectural patterns
- Making decisions with long-term impact
- You need to document why something was chosen

### Use an Issue when:
- Something is broken or not working as expected
- Users report problems
- Performance degradation is observed
- Security vulnerabilities are found

### Use a TODO when:
- Planning new features
- Scheduling improvements
- Tracking technical debt
- Managing sprint work

## 🏷️ Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| ADR | `YYYY-MM-DD-adr-{number}-{title}.md` | `2024-01-15-adr-001-use-react-framework.md` |
| Issue | `issue_{number}_{title}.md` | `issue_001_login-validation-error.md` |
| TODO | `todo_{priority}_{title}.md` | `todo_p1_implement-user-auth.md` |

## 📊 Priority Levels

### Issues
- **Critical (P0)**: System down, data loss, security breach
- **High (P1)**: Major feature broken, no workaround
- **Medium (P2)**: Feature degraded, workaround exists
- **Low (P3)**: Minor issues, cosmetic problems

### TODOs
- **P1**: Must do this sprint
- **P2**: Should do this sprint
- **P3**: Nice to have
- **P4**: Future consideration

## 🔄 Status Workflow

### ADR Status Flow
```proposed → accepted → deprecated → superseded
```

### Issue Status Flow
```open → in-progress → resolved → closed
```

### TODO Status Flow
```planned → in-progress → blocked → completed
```

## ✅ Required Metadata

### All Documents Need:
```yaml
---
id: {type}_{number}
title: {descriptive-title}
date: {YYYY-MM-DD}
status: {current-status}
author: {your-name}
tags: [{tag1}, {tag2}]
---
```

### Additional for Issues:
- `priority`: critical|high|medium|low
- `category`: bug|enhancement|feature-request|performance|security
- `assignee`: person responsible

### Additional for TODOs:
- `priority`: p1|p2|p3|p4
- `estimated_hours`: number
- `sprint`: sprint-number or 'backlog'
- `story_points`: 1|2|3|5|8|13

## 🔗 Cross-References

### In Documentation
- ADR: `[ADR-001](./adr/2024-01-15-adr-001-title.md)`
- Issue: `[Issue #001](../issues/issue_001_title.md)`
- TODO: `[TODO P1-001](../todos/todo_p1_title.md)`

### In Code
```javascript
// See ADR-001 for architecture decision
// Workaround for Issue #023
// Implementation of TODO #045
```

### In Git Commits
```bash
git commit -m "fix: resolve login validation (Issue #001)"
git commit -m "feat: implement user auth (TODO #045)"
git commit -m "refactor: apply ADR-003 pattern"
```

## 📝 Template Sections

### ADR Essential Sections
1. **Context**: Why we need this decision
2. **Decision**: What we decided
3. **Consequences**: Impact of the decision
4. **Alternatives**: Other options considered

### Issue Essential Sections
1. **Summary**: Brief description
2. **Reproduction**: How to recreate
3. **Root Cause**: Why it happens
4. **Solution**: How to fix it

### TODO Essential Sections
1. **Overview**: What and why
2. **Requirements**: What must be done
3. **Implementation Plan**: How to do it
4. **Acceptance Criteria**: Definition of done

## 🎯 Best Practices

### Do's
- ✅ Use templates - don't start from scratch
- ✅ Keep metadata updated
- ✅ Cross-reference related documents
- ✅ Include code examples
- ✅ Document decisions and rationale
- ✅ Update progress regularly

### Don'ts
- ❌ Skip the metadata
- ❌ Leave placeholders unfilled
- ❌ Create duplicate issues
- ❌ Mix concerns (one issue/todo per document)
- ❌ Forget to update status
- ❌ Delete completed documents (archive instead)

## 📈 Tracking Progress

### Daily
- Update TODO progress
- Check blocked items
- Log time spent

### Weekly
- Review open issues
- Update sprint progress
- Archive completed items

### Monthly
- ADR review
- Metrics analysis
- Process improvements

## 🔍 Finding Documents

### By Status
```bash
# Find all open issues
grep -l "status: open" issues/*.md

# Find in-progress TODOs
grep -l "status: in-progress" todos/*.md

# Find accepted ADRs
grep -l "status: accepted" docs/adr/*.md
```

### By Priority
```bash
# Find P1 TODOs
ls todos/todo_p1_*.md

# Find critical issues
grep -l "priority: critical" issues/*.md
```

### By Tag
```bash
# Find performance-related docs
grep -l "tags:.*performance" {docs/adr,issues,todos}/*.md
```

## 💡 Tips

1. **Start Small**: Don't try to fill every section initially
2. **Iterate**: Documents should evolve over time
3. **Be Specific**: Vague descriptions help no one
4. **Stay Current**: Outdated docs are worse than no docs
5. **Link Liberally**: Connect related information

## 🚨 Common Mistakes

1. **Too Much Detail**: Focus on what matters
2. **No Updates**: Keep documents living
3. **Wrong Type**: Issues aren't TODOs
4. **Missing Context**: Always explain why
5. **No Follow-through**: Complete the lifecycle

---

*Quick Reference Version: 1.0*
*Last Updated: 2024-01-15*

For full details, see:
- [Documentation Hub](./README.md)
- [ADR Guide](./adr/README.md)
- [Issue Guide](../issues/README.md)
- [TODO Guide](../todos/README.md) 