import { test, expect } from 'bun:test';
import {
  PMT,
  IPMT,
  PPMT,
  calculateAnnuityData,
  calculateLinearData,
  calgulateLoanFigures,
} from '../../../src/features/calculator/lib/Formulas';
import { AppState } from '../../../src/features/calculator/types/Types';

test('PMT calculation', () => {
  const result = PMT(0.04 / 12, 360, -300000);
  expect(Math.round(result)).toBe(1432);
});

test('IPMT calculation', () => {
  const pv = 300000;
  const pmt = PMT(0.04 / 12, 360, -pv);
  const result = IPMT(pv, pmt, 0.04 / 12, 1);
  expect(Math.round(Math.abs(result))).toBe(1000);
});

test('PPMT calculation', () => {
  const result = PPMT(0.04 / 12, 1, 360, 300000);
  expect(Math.round(result)).toBe(-432);
});

test('Loan figures calculation', () => {
  const state: AppState = {
    price: 310000,
    interest: 4.62,
    deduction: 36.93,
    savings: 40000,
    rent: 1600,
    notary: 1500,
    valuation: 500,
    financialAdvisor: 2500,
    realStateAgent: 5000,
    structuralSurvey: 500,
    isFirstTimeBuyer: true,
    transferTaxRate: 2.0,
    propertyAppreciationRate: 3.0,
    comparisonPeriodYears: 10,
  };

  const result = calgulateLoanFigures(state);
  expect(result.loan).toBeGreaterThan(0);
  expect(result.cost).toBeGreaterThan(0);
  expect(result.percentage).toBeGreaterThan(0);
  expect(result.percentage).toBeLessThan(1.2); // Should not exceed 120% LTV
  
  // First-time buyer with house under €525,000 should have no transfer tax
  expect(result.transferTax).toBe(0);
  expect(result.transferTaxExempt).toBe(true);
  
  // Test non-first-time buyer scenario
  const nonFirstTimeState = { ...state, isFirstTimeBuyer: false };
  const nonFirstTimeResult = calgulateLoanFigures(nonFirstTimeState);
  expect(nonFirstTimeResult.transferTax).toBeGreaterThan(0);
  expect(nonFirstTimeResult.transferTaxExempt).toBe(false);
  
  // Test first-time buyer with expensive house
  const expensiveHouseState = { ...state, price: 600000 };
  const expensiveResult = calgulateLoanFigures(expensiveHouseState);
  expect(expensiveResult.transferTax).toBeGreaterThan(0);
  expect(expensiveResult.transferTaxExempt).toBe(false);
});

test('Annuity data calculation', () => {
  const result = calculateAnnuityData(4.5, 37, 40000, 300000);
  
  expect(result.monthly).toHaveLength(360);
  expect(result.monthly[0].month).toBe(1);
  expect(result.monthly[0].balance).toBe(300000);
  expect(result.monthly[0].grossPaid).toBeGreaterThan(0);
  expect(result.totals.totalPaidGross).toBeGreaterThan(300000);
});

test('Linear data calculation', () => {
  const result = calculateLinearData(4.5, 37, 40000, 300000);
  
  expect(result.monthly).toHaveLength(360);
  expect(result.monthly[0].month).toBe(1);
  expect(result.monthly[0].balance).toBe(300000);
  expect(result.monthly[0].capitalPaid).toBeCloseTo(300000 / 360);
  expect(result.totals.totalPaidGross).toBeGreaterThan(300000);
});