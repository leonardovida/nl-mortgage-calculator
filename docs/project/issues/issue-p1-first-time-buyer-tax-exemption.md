# Issue P1: First-Time Buyer Tax Exemption Implementation

**Issue ID**: P1-FIRST-BUYER-TAX  
**Priority**: P1 (High)  
**Status**: Open  
**Created**: 2025-06-18  
**Assignee**: Claude Code  

## Description

Implement first-time buyer tax exemption feature for the Netherlands mortgage calculator. According to Dutch tax law, if the house price is less than €525,000 and it's a first house transaction, no transfer tax applies.

## Requirements

### Functional Requirements
1. **Tax Exemption Logic**
   - Houses < €525,000 AND first-time buyer = 0% transfer tax
   - Houses ≥ €525,000 OR not first-time buyer = standard transfer tax rate
   - Current standard transfer tax rate should be configurable

2. **User Interface**
   - Add "First-time buyer" toggle/checkbox in settings
   - Add "Transfer tax rate" input field for non-exempt purchases
   - Display calculated transfer tax amount in costs breakdown
   - Show exemption status and savings when applicable

3. **Settings Integration**
   - Add to existing cost calculation structure
   - Integrate with current cost breakdown display
   - Update URL parameters to include first-time buyer status

### Technical Requirements
1. **Type Updates**
   - Add `isFirstTimeBuyer: boolean` to AppState type
   - Add `transferTaxRate: number` to AppState type
   - Update cost calculation functions

2. **Calculation Updates**
   - Modify `calgulateLoanFigures` to include transfer tax
   - Update cost breakdown components
   - Ensure accurate total cost calculations

## Acceptance Criteria

- [ ] First-time buyer toggle is present and functional
- [ ] Transfer tax calculation is accurate based on Dutch law
- [ ] Tax exemption applies correctly for houses < €525,000 + first-time buyer
- [ ] Standard tax rate applies for all other scenarios
- [ ] Cost breakdown shows transfer tax amount and exemption status
- [ ] URL parameters sync with first-time buyer setting
- [ ] All existing tests continue to pass
- [ ] New tests added for tax calculation logic

## Implementation Notes

### Dutch Transfer Tax Rules (2024)
- First-time buyers: 0% for houses < €525,000
- Standard rate: 2% for all other purchases
- Age requirement: buyer must be < 35 years old (consider adding this as future enhancement)

### Files to Modify
- `src/common/Types.tsx` - Add new state properties
- `src/common/Formulas.tsx` - Add transfer tax calculation
- `src/components/Costs.tsx` - Add UI controls and display
- `src/components/MortgageCalculator.tsx` - Add state management
- `src/common/__tests__/Formulas.test.tsx` - Add test coverage

## References
- [Dutch Transfer Tax Information](https://www.belastingdienst.nl/wps/wcm/connect/bldcontentnl/belastingdienst/prive/woning/kosten_koop_verkoop/overdrachtsbelasting/)
- ADR-003: Next.js Migration provides technical context