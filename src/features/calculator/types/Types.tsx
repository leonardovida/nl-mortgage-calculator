export type MonthMortgageData = {
  month: number;
  balance: number;
  grossPaid: number;
  capitalPaid: number;
  interest: number;
  deduction: number;
  netPaid: number;
}

export type MortgageData = {
  totals: {
    totalPaidGross: number;
    totalPaidNet: number;
    totalInterestGross: number;
    totalInterestNet: number;
    totalInvestedGross: number;
    totalInvestedNet: number;
  };
  monthly: Array<MonthMortgageData>;
};

export type AppState = {
  // mortgage
  price: number;
  interest: number;
  deduction: number;
  savings: number;
  rent: number;

  // costs
  notary: number;
  valuation: number;
  financialAdvisor: number;
  realStateAgent: number;
  structuralSurvey: number;

  // tax settings
  isFirstTimeBuyer: boolean;
  transferTaxRate: number;

  // rent vs buy comparison
  propertyAppreciationRate: number;
  comparisonPeriodYears: number;
};

export type InfoTabs = 'mortgage' | 'cost' | 'interest' | 'rentbuy';
export type TableTabs = 'annuity' | 'linear' | 'graph';