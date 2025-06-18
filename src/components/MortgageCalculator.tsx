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
      {/* Hero Section */}
      <header className="bg-primary text-primary-foreground" role="banner">
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Mortgage Calculator
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Annuity and Linear mortgage calculator for the Netherlands
            </p>
          </div>
        </div>
      </header>

      <main 
        id="main-content" 
        className="container mx-auto px-4 py-8 space-y-12" 
        role="main"
        tabIndex={-1}
      >
        {/* Mortgage Information Section */}
        <section 
          className="max-w-6xl mx-auto" 
          aria-labelledby="mortgage-info-heading"
        >
          <h2 id="mortgage-info-heading" className="text-2xl font-semibold mb-6">
            Mortgage Information
          </h2>
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
          <h2 id="mortgage-structure-heading" className="text-2xl font-semibold mb-6">
            Mortgage Structure
          </h2>
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
          <div className="bg-muted/50 rounded-lg p-6 border">
            <h3 className="text-lg font-semibold mb-3 text-muted-foreground">Disclaimer:</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>This calculator is for illustrative purposes only.</p>
              <p>No guarantee is made for the accuracy of the data provided.</p>
              <p>Consult a qualified professional before making any decision.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30" role="contentinfo">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <a
              href="https://github.com/santiago-pan/mortgage-calculator"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md px-2 py-1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source code on GitHub (opens in new tab)"
            >
              <Image
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNOS45OTkgMGMtNS41MjEgMC05Ljk5OSA0LjU5LTkuOTk5IDEwLjI1MyAwIDQuNTMgMi44NjUgOC4zNzMgNi44MzkgOS43MjguNS4wOTQuNjgzLS4yMjIuNjgzLS40OTRsLS4wMTQtMS43NDRjLTIuNzgyLjYxOS0zLjM2OC0xLjM3NS0zLjM2OC0xLjM3NS0uNDU1LTEuMTg1LTEuMTExLTEuNS0xLjExMS0xLjUtLjkwOC0uNjM2LjA2OS0uNjIzLjA2OS0uNjIzIDEuMDA0LjA3MiAxLjUzMiAxLjA1NyAxLjUzMiAxLjA1Ny44OTIgMS41NjcgMi4zNDEgMS4xMTQgMi45MS44NTIuMDkxLS42NjIuMzQ5LTEuMTE0LjYzNS0xLjM3LTIuMjItLjI1OS00LjU1NS0xLjEzOS00LjU1NS01LjA2OCAwLTEuMTE5LjM5LTIuMDM1IDEuMDI5LTIuNzUxLS4xMDMtLjI1OS0uNDQ2LTEuMzAyLjA5OC0yLjcxMyAwIDAgLjgzOS0uMjc2IDIuNzUgMS4wNTEuNzk3LS4yMjggMS42NTMtLjM0MSAyLjUwMy0uMzQ2Ljg1LjAwNCAxLjcwNS4xMTggMi41MDMuMzQ2IDEuOTA5LTEuMzI3IDIuNzQ3LTEuMDUxIDIuNzQ3LTEuMDUxLjU0NiAxLjQxMS4yMDMgMi40NTQuMSAyLjcxMy42NDEuNzE2IDEuMDI4IDEuNjMyIDEuMDI4IDIuNzUxIDAgMy45MzktMi4zMzggNC44MDYtNC41NjYgNS4wNTkuMzU5LjMxNy42NzguOTQyLjY3OCAxLjg5OCAwIDEuMzcxLS4wMTIgMi40NzctLjAxMiAyLjgxMyAwIC4yNzQuMTguNTk0LjY4OC40OTMgMy45NzEtMS4zNTkgNi44MzMtNS4xOTkgNi44MzMtOS43MjggMC01LjY2My00LjQ3OC0xMC4yNTMtMTAuMDAxLTEwLjI1MyIgZmlsbD0iIzAwMCIvPgo8L3N2Zz4K"
                alt="GitHub"
                width={20}
                height={20}
                className="w-5 h-5"
              />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}