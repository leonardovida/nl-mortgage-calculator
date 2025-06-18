import { test, expect } from 'bun:test';
import {
  PMT,
  IPMT,
  PPMT,
  calculateAnnuityData,
  calculateLinearData,
  calgulateLoanFigures,
} from '../Formulas';
import { AppState } from '../Types';

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
  };

  const result = calgulateLoanFigures(state);
  expect(result.loan).toBeGreaterThan(0);
  expect(result.cost).toBeGreaterThan(0);
  expect(result.percentage).toBeGreaterThan(0);
  expect(result.percentage).toBeLessThan(1.2); // Should not exceed 120% LTV
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