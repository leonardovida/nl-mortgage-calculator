import { test, expect } from 'bun:test';
import {
  calculateAnnuityData,
  calgulateLoanFigures,
  calculateLinearData,
} from '../Formulas';
import { AppState } from '../../App';

const state: AppState = {
  price: 310000,
  notary: 1200,
  valuation: 800,
  financialAdvisor: 2500,
  realStateAgent: 3000,
  structuralSurvey: 800,
  savings: 40000,
  interest: 1.34,
  deduction: 36.93,
  rent: 1300,
};

test('calculates loan figures', () => {
  const figures = calgulateLoanFigures(state);

  expect(figures).toEqual({
    cost: 16529.175050301812,
    loan: 286529.1750503018,
    percentage: 0.9242876614525866,
  });
});

test('calculates annuity data', () => {
  const figures = calgulateLoanFigures(state);

  const annuityData = calculateAnnuityData(
    state.interest,
    state.deduction,
    state.savings,
    figures.loan,
  );

  expect(annuityData.monthly.length).toBe(360);

  // First month
  expect(annuityData.monthly[0]).toEqual({
    balance: 286529.1750503018,
    capitalPaid: 647.063776604936,
    deduction: 118.16033385311871,
    grossPaid: 967.0213554111065,
    interest: 319.9575788061704,
    month: 1,
    netPaid: 848.8610215579878,
  });

  // 15 years
  expect(annuityData.monthly[179]).toEqual({
    balance: 158396.5915977524,
    capitalPaid: 790.1451614602522,
    deduction: 65.32037842603913,
    grossPaid: 967.0213554110758,
    interest: 176.87619395082353,
    month: 180,
    netPaid: 901.7009769850366,
  });

  // 30 years
  expect(annuityData.monthly[359]).toEqual({
    balance: 965.942719374143,
    capitalPaid: 965.9427193741534,
    deduction: 0.3983402883291059,
    grossPaid: 967.0213554107878,
    interest: 1.0786360366344596,
    month: 360,
    netPaid: 966.6230151224587,
  });

  expect(annuityData.totals).toEqual({
    totalInterestGross: 61598.512897679815,
    totalInterestNet: 38850.18208456668,
    totalInvestedGross: 388127.68794798164,
    totalInvestedNet: 365379.3571348685,
    totalPaidGross: 348127.68794798164,
    totalPaidNet: 325379.3571348685,
  });
});

test('calculates linear data', () => {
  const figures = calgulateLoanFigures(state);

  const linearData = calculateLinearData(
    state.interest,
    state.deduction,
    state.savings,
    figures.loan,
  );

  expect(linearData.monthly.length).toBe(360);

  // First month
  expect(linearData.monthly[0]).toEqual({
    balance: 286529.1750503018,
    capitalPaid: 795.9143751397273,
    deduction: 118.16033385311871,
    grossPaid: 1115.8719539458978,
    interest: 319.9575788061704,
    month: 1,
    netPaid: 997.7116200927791,
  });

  // 15 years
  expect(linearData.monthly[179]).toEqual({
    balance: 144060.50190029063,
    capitalPaid: 795.9143751397273,
    deduction: 59.408390076151356,
    grossPaid: 956.7819355950519,
    interest: 160.86756045532454,
    month: 180,
    netPaid: 897.3735455189005,
  });

  // 30 years
  expect(linearData.monthly[359]).toEqual({
    balance: 795.9143751396914,
    capitalPaid: 795.9143751397273,
    deduction: 0.3282231495919817,
    grossPaid: 796.8031461919667,
    interest: 0.8887710522393221,
    month: 360,
    netPaid: 796.4749230423747,
  });

  expect(linearData.totals).toEqual({
    totalInterestGross: 57752.342974515515,
    totalInterestNet: 36424.40271402575,
    totalInvestedGross: 384281.51802481734,
    totalInvestedNet: 362953.5777643276,
    totalPaidGross: 344281.51802481734,
    totalPaidNet: 322953.5777643276,
  });
});

test('calculates savings vs total invested curve', () => {
  for (let s = 0; s < 21; s++) {
    state.savings = 20000 + s * 1000;
    const figures = calgulateLoanFigures(state);
    calculateAnnuityData(
      state.interest,
      state.deduction,
      state.savings,
      figures.loan,
    );
  }
});
