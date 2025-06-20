# Issue P1: Rent vs Buy Comparison with Property Appreciation

**Issue ID**: P1-RENT-BUY-COMPARISON  
**Priority**: P1 (High)  
**Status**: Open  
**Created**: 2025-06-18  
**Assignee**: Claude Code  

## Description

Create a comprehensive rent vs buy comparison feature that helps users make informed decisions by comparing the total cost of renting versus buying a property, including property value appreciation assumptions.

## Requirements

### Functional Requirements
1. **New Comparison Tab**
   - Add "Rent vs Buy" tab alongside existing "Interest" tab
   - Move current rent comparison logic from main mortgage tab
   - Expand with detailed analysis and projections

2. **Property Appreciation Settings**
   - Input field for annual property value increase percentage
   - Historical data reference (suggest common rates like 2-5% annually)
   - Calculation period selector (5, 10, 15, 20, 30 years)

3. **Comprehensive Comparison Metrics**
   - Total cost of renting over selected period
   - Total cost of buying (including all costs, mortgage payments)
   - Property value after appreciation
   - Net equity gained from property ownership
   - Break-even point analysis
   - Monthly cash flow comparison

4. **Visual Representation**
   - Table showing year-by-year comparison
   - Charts showing cumulative costs and property value over time
   - Clear summary of financial advantages/disadvantages

### Technical Requirements
1. **New Components**
   - `RentVsBuy.tsx` component for the new tab
   - Calculation functions for property appreciation
   - Data visualization for long-term projections

2. **State Management**
   - Add property appreciation rate to AppState
   - Add comparison period to AppState
   - Maintain existing rent amount integration

3. **Calculation Logic**
   - Yearly property value calculation with compound appreciation
   - Total rental costs over time with potential rent increases
   - Mortgage balance and equity calculations over time
   - Net worth comparison calculations

## Acceptance Criteria

- [ ] New "Rent vs Buy" tab is functional and accessible
- [ ] Property appreciation rate is configurable (default: 3% annually)
- [ ] Comparison period is selectable (5-30 years)
- [ ] Accurate calculations for all scenarios
- [ ] Visual charts showing cost progression over time
- [ ] Year-by-year breakdown table
- [ ] Clear financial summary and recommendations
- [ ] Integration with existing mortgage calculations
- [ ] Responsive design for mobile devices
- [ ] Performance optimized with proper memoization

## Implementation Notes

### Calculation Methodology
1. **Property Value Growth**: `value * (1 + appreciationRate)^years`
2. **Equity Calculation**: Property value - remaining mortgage balance
3. **Total Rental Cost**: Monthly rent * 12 * years * (1 + rentIncrease)^years
4. **Net Worth Comparison**: (Property equity - total buying costs) vs (savings from not buying - total rental costs)

### Default Assumptions
- Property appreciation: 3% annually (conservative Netherlands average)
- Rent increase: 2% annually (typical inflation adjustment)
- Comparison periods: 5, 10, 15, 20, 30 years

### Files to Create/Modify
- `src/components/RentVsBuy.tsx` - New comparison component
- `src/common/Types.tsx` - Add new state properties
- `src/common/Formulas.tsx` - Add appreciation calculations
- `src/components/MortgageCalculator.tsx` - Add new tab integration
- `src/common/__tests__/` - Add test coverage for new calculations

## User Experience Considerations
- Intuitive controls for adjusting assumptions
- Clear explanations of calculations and assumptions
- Warning/info messages about market volatility
- Educational content about factors affecting property values

## References
- Netherlands historical property price data
- Current mortgage calculation methodology
- Existing UI patterns from Interest tab