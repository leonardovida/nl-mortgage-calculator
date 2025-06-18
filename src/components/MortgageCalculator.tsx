'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  calculateAnnuityData,
  calculateLinearData,
  calgulateLoanFigures,
} from '@/common/Formulas';
import { AppState, InfoTabs, TableTabs, MonthMortgageData } from '@/common/Types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import dynamic from 'next/dynamic';
import { DataTableSkeleton } from '@/components/DataTableSkeleton';

// Dynamic imports for form components
const Mortgage = dynamic(() => import('@/components/Mortgage').then(mod => ({ default: mod.Mortgage })), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-muted rounded w-1/3"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    </div>
  ),
  ssr: true
});

const Costs = dynamic(() => import('@/components/Costs').then(mod => ({ default: mod.Costs })), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-muted rounded w-1/3"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    </div>
  ),
  ssr: true
});

const Interest = dynamic(() => import('@/components/Interest'), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-muted rounded w-1/3"></div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-4 bg-muted rounded"></div>
        ))}
      </div>
    </div>
  ),
  ssr: true
});

const RentVsBuy = dynamic(() => import('@/components/RentVsBuy').then(mod => ({ default: mod.RentVsBuy })), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-muted rounded w-1/3"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    </div>
  ),
  ssr: false
});

// Dynamic imports for heavy components
const DataTable = dynamic(() => import('@/components/DataTable').then(mod => ({ default: mod.DataTable })), {
  loading: () => <DataTableSkeleton />,
  ssr: false
});

const Graph = dynamic(() => import('@/components/Graph').then(mod => ({ default: mod.Graph })), {
  loading: () => (
    <div className="flex items-center justify-center h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">Loading graph...</p>
      </div>
    </div>
  ),
  ssr: false
});

export function MortgageCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [state, setState] = useState<AppState>({
    price: Number(searchParams.get('price')) || 310000,
    interest: Number(searchParams.get('interest')) || 4.62,
    deduction: Number(searchParams.get('deduction')) || 36.93,
    savings: Number(searchParams.get('savings')) || 40000,
    rent: Number(searchParams.get('rent')) || 1600,
    notary: 1200,
    valuation: 800,
    financialAdvisor: 2500,
    realStateAgent: 2750 * 1.21,
    structuralSurvey: 800,
    isFirstTimeBuyer: searchParams.get('firstTime') === 'true' || false,
    transferTaxRate: Number(searchParams.get('taxRate')) || 2.0,
    propertyAppreciationRate: Number(searchParams.get('appreciation')) || 3.0,
    comparisonPeriodYears: Number(searchParams.get('period')) || 10,
  });

  const [infoTab, setInfoTab] = useState<InfoTabs>('mortgage');
  const [tableTab, setTableTab] = useState<TableTabs>('annuity');

  const { loan, cost, percentage, transferTax, transferTaxExempt } = calgulateLoanFigures(state);

  const linear = useMemo(
    () => calculateLinearData(state.interest, state.deduction, state.savings, loan),
    [state.interest, state.deduction, state.savings, loan]
  );

  const annuity = useMemo(
    () => calculateAnnuityData(state.interest, state.deduction, state.savings, loan),
    [state.interest, state.deduction, state.savings, loan]
  );

  function handleChange(field: string, value: number) {
    setState({ ...state, [field]: value });
  }

  function handleBooleanChange(field: string, value: boolean) {
    setState({ ...state, [field]: value });
  }

  // Update URL when state changes - only sync the main mortgage parameters
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('price', state.price.toString());
    params.set('interest', state.interest.toString());
    params.set('deduction', state.deduction.toString());
    params.set('savings', state.savings.toString());
    params.set('rent', state.rent.toString());
    params.set('firstTime', state.isFirstTimeBuyer.toString());
    params.set('taxRate', state.transferTaxRate.toString());
    params.set('appreciation', state.propertyAppreciationRate.toString());
    params.set('period', state.comparisonPeriodYears.toString());
    
    const queryString = params.toString();
    router.replace(`?${queryString}`, { scroll: false });
  }, [state.price, state.interest, state.deduction, state.savings, state.rent, state.isFirstTimeBuyer, state.transferTaxRate, state.propertyAppreciationRate, state.comparisonPeriodYears, router]);

  function renderInfoTabs(
    tab: InfoTabs,
    state: AppState,
    loan: number,
    cost: number,
    percentage: number,
    annuity: {
      totalPaidGross: number;
      totalPaidNet: number;
      totalInterestGross: number;
      totalInterestNet: number;
      totalInvestedGross: number;
      totalInvestedNet: number;
    },
    linear: {
      totalPaidGross: number;
      totalPaidNet: number;
      totalInterestGross: number;
      totalInterestNet: number;
      totalInvestedGross: number;
      totalInvestedNet: number;
    },
    handleChange: (field: string, value: number) => void,
  ) {
    switch (tab) {
      case 'mortgage':
        return (
          <Mortgage
            price={state.price}
            savings={state.savings}
            loan={loan}
            cost={cost}
            interest={state.interest}
            percentage={percentage}
            deduction={state.deduction}
            rent={state.rent}
            annuity={annuity}
            linear={linear}
            onChange={handleChange}
          />
        );
      case 'cost':
        return <Costs 
          {...state} 
          loan={loan} 
          transferTax={transferTax}
          transferTaxExempt={transferTaxExempt}
          onChange={handleChange} 
          onBooleanChange={handleBooleanChange}
        />;
      case 'interest':
        return <Interest />;
      case 'rentbuy':
        return <RentVsBuy
          price={state.price}
          rent={state.rent}
          savings={state.savings}
          loan={loan}
          cost={cost}
          annuityTotals={annuity}
          propertyAppreciationRate={state.propertyAppreciationRate}
          comparisonPeriodYears={state.comparisonPeriodYears}
          onChange={handleChange}
        />;
    }
  }

  function renderMortgageTabs(
    tab: TableTabs,
    annuity: Array<MonthMortgageData>,
    linear: Array<MonthMortgageData>,
  ) {
    switch (tab) {
      case 'annuity':
        return <DataTable data={annuity} />;
      case 'linear':
        return <DataTable data={linear} />;
      case 'graph':
        return <Graph annuity={annuity} linear={linear} />;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" role="banner">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iNyIgY3k9IjciIHI9IjEiLz48Y2lyY2xlIGN4PSI1MyIgY3k9IjciIHI9IjEiLz48Y2lyY2xlIGN4PSI1MyIgY3k9IjUzIiByPSIxIi8+PGNpcmNsZSBjeD0iNyIgY3k9IjUzIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="relative container mx-auto px-4 py-16 sm:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                  <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                </svg>
                <span>Netherlands Market</span>
              </div>
            </div>

            {/* Main Content */}
            <div className="text-center space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
                <span className="block">Smart Mortgage</span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Calculator
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Compare annuity and linear mortgages with{' '}
                <span className="font-semibold text-slate-900 dark:text-white">real-time rates</span>{' '}
                from leading Dutch banks
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>First-time buyer benefits</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Rent vs buy analysis</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Live interest rates</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom border gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"></div>
      </header>

      <main 
        id="main-content" 
        className="container mx-auto px-4 py-16 space-y-20" 
        role="main"
        tabIndex={-1}
      >
        {/* Mortgage Information Section */}
        <section 
          className="max-w-6xl mx-auto" 
          aria-labelledby="mortgage-info-heading"
        >
          <div className="text-center mb-12">
            <h2 id="mortgage-info-heading" className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Mortgage Information
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Configure your mortgage parameters and explore different scenarios with Dutch tax benefits
            </p>
          </div>
          <Tabs 
            value={infoTab} 
            onValueChange={(value) => setInfoTab(value as InfoTabs)}
            aria-label="Mortgage information options"
          >
            <TabsList 
              className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-none lg:inline-flex"
              aria-label="Mortgage information tabs"
            >
              <TabsTrigger value="mortgage" aria-controls="mortgage-tab-content">
                Mortgage
              </TabsTrigger>
              <TabsTrigger value="cost" aria-controls="cost-tab-content">
                Purchase Costs
              </TabsTrigger>
              <TabsTrigger value="interest" aria-controls="interest-tab-content">
                Interest
              </TabsTrigger>
              <TabsTrigger value="rentbuy" aria-controls="rentbuy-tab-content">
                Rent vs Buy
              </TabsTrigger>
            </TabsList>
            <TabsContent 
              value="mortgage" 
              className="mt-6"
              id="mortgage-tab-content"
              role="tabpanel"
              aria-labelledby="mortgage-tab"
            >
              {renderInfoTabs(
                'mortgage',
                state,
                loan,
                cost,
                percentage,
                annuity.totals,
                linear.totals,
                handleChange,
              )}
            </TabsContent>
            <TabsContent 
              value="cost" 
              className="mt-6"
              id="cost-tab-content"
              role="tabpanel"
              aria-labelledby="cost-tab"
            >
              {renderInfoTabs(
                'cost',
                state,
                loan,
                cost,
                percentage,
                annuity.totals,
                linear.totals,
                handleChange,
              )}
            </TabsContent>
            <TabsContent 
              value="interest" 
              className="mt-6"
              id="interest-tab-content"
              role="tabpanel"
              aria-labelledby="interest-tab"
            >
              {renderInfoTabs(
                'interest',
                state,
                loan,
                cost,
                percentage,
                annuity.totals,
                linear.totals,
                handleChange,
              )}
            </TabsContent>
            <TabsContent 
              value="rentbuy" 
              className="mt-6"
              id="rentbuy-tab-content"
              role="tabpanel"
              aria-labelledby="rentbuy-tab"
            >
              {renderInfoTabs(
                'rentbuy',
                state,
                loan,
                cost,
                percentage,
                annuity.totals,
                linear.totals,
                handleChange,
              )}
            </TabsContent>
          </Tabs>
        </section>

        {/* Mortgage Structure Section */}
        <section 
          className="max-w-6xl mx-auto" 
          aria-labelledby="mortgage-structure-heading"
          id="mortgage-calculator"
          tabIndex={-1}
        >
          <div className="text-center mb-12">
            <h2 id="mortgage-structure-heading" className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
              Mortgage Structure Comparison
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Compare annuity and linear mortgage structures with detailed payment breakdowns and visualizations
            </p>
          </div>
          <Tabs 
            value={tableTab} 
            onValueChange={(value) => setTableTab(value as TableTabs)}
            aria-label="Mortgage structure comparison options"
          >
            <TabsList 
              className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:inline-flex"
              aria-label="Mortgage structure tabs"
            >
              <TabsTrigger value="annuity" aria-controls="annuity-tab-content">
                Annuity
              </TabsTrigger>
              <TabsTrigger value="linear" aria-controls="linear-tab-content">
                Linear
              </TabsTrigger>
              <TabsTrigger value="graph" aria-controls="graph-tab-content">
                Graph
              </TabsTrigger>
            </TabsList>
            <TabsContent 
              value="annuity" 
              className="mt-6"
              id="annuity-tab-content"
              role="tabpanel"
              aria-labelledby="annuity-tab"
            >
              {renderMortgageTabs('annuity', annuity.monthly, linear.monthly)}
            </TabsContent>
            <TabsContent 
              value="linear" 
              className="mt-6"
              id="linear-tab-content"
              role="tabpanel"
              aria-labelledby="linear-tab"
            >
              {renderMortgageTabs('linear', annuity.monthly, linear.monthly)}
            </TabsContent>
            <TabsContent 
              value="graph" 
              className="mt-6"
              id="graph-tab-content"
              role="tabpanel"
              aria-labelledby="graph-tab"
            >
              {renderMortgageTabs('graph', annuity.monthly, linear.monthly)}
            </TabsContent>
          </Tabs>
        </section>

        {/* Disclaimer Section */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-8 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-amber-900 dark:text-amber-100">Important Disclaimer</h3>
                <div className="space-y-2 text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                  <p>This calculator provides estimates for illustrative purposes only and should not be considered as financial advice.</p>
                  <p>Interest rates, tax regulations, and market conditions may vary. Always consult with qualified financial professionals before making mortgage decisions.</p>
                  <p>The calculations assume current Dutch tax laws and may not reflect future changes in regulations.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900" role="contentinfo">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <a
                href="https://github.com/santiago-pan/mortgage-calculator"
                className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 shadow-sm hover:shadow-md"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source code on GitHub (opens in new tab)"
              >
                <Image
                  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNOS45OTkgMGMtNS41MjEgMC05Ljk5OSA0LjU5LTkuOTk5IDEwLjI1MyAwIDQuNTMgMi44NjUgOC4zNzMgNi44MzkgOS3MjguNS4wOTQuNjgzLS4yMjIuNjgzLS40OTRsLS4wMTQtMS43NDRjLTIuNzgyLjYxOS0zLjM2OC0xLjM3NS0zLjM2OC0xLjM3NS0uNDU1LTEuMTg1LTEuMTExLTEuNS0xLjExMS0xLjUtLjkwOC0uNjM2LjA2OS0uNjIzLjA2OS0uNjIzIDEuMDA0LjA3MiAxLjUzMiAxLjA1NyAxLjUzMiAxLjA1Ny44OTIgMS41NjcgMi4zNDEgMS4xMTQgMi45MS44NTIuMDkxLS42NjIuMzQ5LTEuMTE0LjYzNS0xLjM3LTIuMjItLjI1OS00LjU1NS0xLjEzOS00LjU1NS01LjA2OCAwLTEuMTE5LjM5LTIuMDM1IDEuMDI5LTIuNzUxLS4xMDMtLjI1OS0uNDQ2LTEuMzAyLjA5OC0yLjcxMyAwIDAgLjgzOS0uMjc2IDIuNzUgMS4wNTEuNzk3LS4yMjggMS42NTMtLjM0MSAyLjUwMy0uMzQ2Ljg1LjAwNCAxLjcwNS4xMTggMi41MDMuMzQ2IDEuOTA5LTEuMzI3IDIuNzQ3LTEuMDUxIDIuNzQ3LTEuMDUxLjU0NiAxLjQxMS4yMDMgMi40NTQuMSAyLjcxMy42NDEuNzE2IDEuMDI4IDEuNjMyIDEuMDI4IDIuNzUxIDAgMy45MzktMi4zMzggNC44MDYtNC41NjYgNS4wNTkuMzU5LjMxNy42NzguOTQyLjY3OCAxLjg5OCAwIDEuMzcxLS4wMTIgMi40NzctLjAxMiAyLjgxMyAwIC4yNzQuMTguNTk0LjY4OC40OTMgMy45NzEtMS4zNTkgNi44MzMtNS4xOTkgNi44MzMtOS43MjggMC01LjY2My00LjQ3OC0xMC4yNTMtMTAuMDAxLTEwLjI1MyIgZmlsbD0iIzAwMCIvPgo8L3N2Zz4K"
                  alt="GitHub"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span className="font-medium">View on GitHub</span>
              </a>
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">
              <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
              <p className="mt-1">© 2025 Smart Mortgage Calculator. For educational purposes.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}