---
id: issue_{XXX}
title: {Brief descriptive title - keep specific and actionable}
date: {YYYY-MM-DD}
status: open
author: {Reporter Name}
assignee: 
priority: {critical|high|medium|low}
category: {bug|enhancement|feature-request|performance|security|documentation}
tags: [{component}, {area}, {impact}]
related_pr: 
related_adr: 
---

# Issue #{XXX}: {Full Descriptive Title}

## Summary
{Provide a clear, concise description of the issue in 1-2 sentences. This should quickly convey what's wrong and why it matters.}

## Environment
- **OS**: {e.g., macOS 14.2, Windows 11, Ubuntu 22.04}
- **Browser**: {e.g., Chrome 120.0.6099.129, Firefox 121.0, Safari 17.2}
- **Node Version**: {e.g., v20.10.0}
- **Package Manager**: {e.g., bun 1.0.21, npm 10.2.4}
- **Framework Version**: {e.g., React 18.2.0}
- **Commit Hash**: {git commit hash where issue was found}
- **Environment Type**: {development|staging|production}
- **Device**: {if relevant - e.g., iPhone 15 Pro, Desktop}

## Steps to Reproduce
{Provide clear, numbered steps that reliably reproduce the issue}

1. Navigate to {specific URL or component}
2. {Action taken - be very specific about inputs, clicks, etc.}
3. {Next action}
4. {Final action that triggers the issue}
5. Observe {what happens}

### Reproduction Rate
- [ ] Always (100%)
- [ ] Frequently (>50%)
- [ ] Sometimes (10-50%)
- [ ] Rarely (<10%)

### Minimal Reproduction
```typescript
// If applicable, provide minimal code to reproduce
// This helps isolate the issue
```

Link to reproduction: {CodeSandbox, StackBlitz, or GitHub repo if available}

## Expected Behavior
{Describe what should happen when following the reproduction steps. Be specific about the expected outcome, including any UI changes, data updates, or system responses.}

### Success Criteria
- [ ] {Specific measurable outcome 1}
- [ ] {Specific measurable outcome 2}
- [ ] {Specific measurable outcome 3}

## Actual Behavior
{Describe what actually happens. Include:}
- {Visual differences from expected}
- {Error messages displayed}
- {Incorrect data or calculations}
- {Performance issues observed}
- {Any console errors or warnings}

### Error Details
```
{Paste any error messages, stack traces, or console output here}
{Include the full error, not just the message}
```

### Browser Console Output
```javascript
// Include any relevant console logs, warnings, or errors
// Use browser DevTools to capture this
```

### Network Activity
{If relevant, describe any failed network requests, unusual API calls, or performance issues}
- Failed requests: {endpoints, status codes}
- Slow requests: {endpoints, response times}
- Unexpected requests: {any unusual API calls}

## Screenshots/Recordings
{Attach screenshots or screen recordings that show the issue}

### Before (Expected)
![Expected behavior]({link-to-screenshot})

### After (Actual)
![Actual behavior]({link-to-screenshot})

### Video Recording
{Link to video showing the issue occurring}

### Additional Visual Evidence
{Any other relevant screenshots, GIFs, or diagrams}

## Impact Analysis

### Severity Assessment
**Severity**: {critical|high|medium|low}

**Justification**: {Explain why this severity level was chosen}

### User Impact
- **Affected Users**: {All users|Specific user segment|Edge case}
- **Frequency**: {How often users encounter this}
- **User Experience**: {How badly this affects usability}
- **Business Impact**: {Revenue loss, user churn, reputation}

### System Impact
- **Performance**: {Does this affect system performance?}
- **Data Integrity**: {Risk of data loss or corruption?}
- **Security**: {Any security implications?}
- **Scalability**: {Does this get worse with load?}

### Affected Components
- [ ] `src/components/{Component}.tsx` - {How it's affected}
- [ ] `src/utils/{utility}.ts` - {How it's affected}
- [ ] `src/api/{endpoint}.ts` - {How it's affected}
- [ ] Database table `{table_name}` - {How it's affected}
- [ ] External service `{service}` - {How it's affected}

## Root Cause Analysis

### Investigation Steps
- [ ] Reviewed recent commits in affected area
- [ ] Checked error logs and monitoring
- [ ] Tested in different environments
- [ ] Verified against different browsers/devices
- [ ] Reviewed related issues
- [ ] Checked documentation for correct usage
- [ ] Analyzed performance profiles
- [ ] Reviewed security implications

### Initial Findings
{Document what you've discovered so far:}
- **Observation 1**: {What you found}
- **Observation 2**: {What you found}
- **Observation 3**: {What you found}

### Hypothesis
{Your current theory about what's causing the issue:}
- **Primary hypothesis**: {Most likely cause}
- **Alternative hypothesis**: {Other possible cause}

### Root Cause
{Once identified, clearly state the root cause:}
- **Direct cause**: {The immediate cause}
- **Underlying cause**: {The deeper systemic issue}
- **Contributing factors**: {Other elements that made this possible}

## Proposed Solution

### Approach
{High-level description of how to fix this issue}

1. **Immediate fix**: {Quick solution to stop the bleeding}
2. **Proper fix**: {Long-term solution}
3. **Preventive measures**: {How to prevent recurrence}

### Implementation Details
```typescript
// Pseudocode or actual code showing the fix
// Include before/after if helpful

// Before (buggy):
function calculateTotal(items: Item[]) {
  // buggy implementation
}

// After (fixed):
function calculateTotal(items: Item[]) {
  // fixed implementation
}
```

### Changes Required
- [ ] **File**: `src/components/Example.tsx`
  - Line 45-52: {Description of change}
  - Line 78: {Description of change}
  
- [ ] **File**: `src/utils/helper.ts`
  - Add new validation function
  - Update existing logic

- [ ] **Configuration**: 
  - Update environment variable
  - Modify build configuration

### Testing Plan
**Unit Tests**:
- [ ] Add test for {specific scenario}
- [ ] Add test for {edge case}
- [ ] Update existing test {test name}

**Integration Tests**:
- [ ] Test {user flow 1}
- [ ] Test {user flow 2}
- [ ] Test {error scenario}

**Manual Testing**:
- [ ] Verify fix in development
- [ ] Test in staging environment
- [ ] Cross-browser testing
- [ ] Mobile device testing

**Regression Testing**:
- [ ] Verify {related feature 1} still works
- [ ] Verify {related feature 2} still works
- [ ] Check performance hasn't degraded

## Workaround
{If a temporary workaround exists, document it here}

### For Users
1. {Step 1 users can take to avoid the issue}
2. {Step 2}
3. {Step 3}

### For Developers
```typescript
// Temporary code workaround
// Remove this after issue #{XXX} is fixed
if (condition) {
  // workaround implementation
}
```

### Limitations of Workaround
- {What doesn't work with the workaround}
- {Performance implications}
- {Other caveats}

## Definition of Done
- [ ] Root cause identified and documented
- [ ] Fix implemented and code reviewed
- [ ] Unit tests added/updated (coverage > 80%)
- [ ] Integration tests passing
- [ ] Manual testing completed
- [ ] No regression in related features
- [ ] Documentation updated if needed
- [ ] Performance impact measured
- [ ] Security review if applicable
- [ ] Deployed to staging and verified
- [ ] Deployed to production and monitored

## References
### Related Issues
- #{XXX}: {Related issue title}
- #{XXX}: {Similar issue that was resolved}

### Related PRs
- PR #{XXX}: {PR that may have introduced this}
- PR #{XXX}: {PR with similar fix}

### External Resources
- [{Resource title}]({URL}) - {Why it's relevant}
- [{Stack Overflow post}]({URL}) - {Similar problem}
- [{Documentation}]({URL}) - {Official docs about this}

### Internal Documentation
- [Architecture Decision]({link to ADR}) - {Relevance}
- [Design Document]({link}) - {Relevance}
- [Runbook]({link}) - {If this affects operations}

## Timeline
### History
- {YYYY-MM-DD HH:MM}: Issue first reported by {name}
- {YYYY-MM-DD HH:MM}: Confirmed reproducible by {name}
- {YYYY-MM-DD HH:MM}: Assigned to {name}
- {YYYY-MM-DD HH:MM}: Root cause identified
- {YYYY-MM-DD HH:MM}: Fix implemented in PR #{XXX}
- {YYYY-MM-DD HH:MM}: Deployed to staging
- {YYYY-MM-DD HH:MM}: Verified in staging
- {YYYY-MM-DD HH:MM}: Deployed to production
- {YYYY-MM-DD HH:MM}: Issue resolved and closed

### Time Tracking
- **Time to Detection**: {How long issue existed before discovery}
- **Time to Assignment**: {From report to assignment}
- **Time to Root Cause**: {From assignment to root cause}
- **Time to Fix**: {From root cause to PR}
- **Time to Deploy**: {From PR to production}
- **Total Resolution Time**: {From report to close}

## Lessons Learned
{After resolution, document what we learned:}

### What Went Well
- {Good practice that helped resolve this}
- {Tool or process that worked well}

### What Could Be Improved
- {Process gap that delayed resolution}
- {Missing tool or automation}
- {Knowledge gap that should be addressed}

### Action Items
- [ ] {Specific improvement to implement}
- [ ] {Process change to make}
- [ ] {Documentation to create}
- [ ] {Tool to evaluate or implement}

### Prevention Recommendations
- {How to prevent similar issues}
- {Code review checklist items to add}
- {Automated checks to implement}
- {Monitoring to add}

---

## Metadata
- **Issue Type**: {bug|task|story}
- **Resolution**: {fixed|wont-fix|duplicate|cannot-reproduce}
- **Version Fixed In**: {version number}
- **Milestone**: {sprint or release}

---

*Template Version: 1.0*
*Last Updated: 2024-01-15*

<!-- 
INSTRUCTIONS FOR USE:
1. Copy this template to a new file with the naming convention: issue_{number}_{kebab-case-title}.md
2. Replace all {placeholders} with actual content
3. Remove any sections that aren't applicable
4. Use checkboxes [ ] for tracking progress
5. Keep updating the timeline as the issue progresses
6. After resolution, complete the Lessons Learned section
7. Delete this instruction block
--> 