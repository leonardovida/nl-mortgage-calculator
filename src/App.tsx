import queryString from 'query-string';
import { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './styles/globals.css';
import {
  calculateAnnuityData,
  calculateLinearData,
  calgulateLoanFigures,
} from './common/Formulas';
import { MonthMortgageData } from './common/Types';
import { Costs } from './components/Costs';
import { DataTable } from './components/DataTable';
import { Graph } from './components/Graph';
import { Interest } from './components/Interest';
import { Mortgage } from './components/Mortgage';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';

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
};

type InfoTabs = 'mortgage' | 'cost' | 'interest';
type TableTabs = 'annuity' | 'linear' | 'graph';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const search = queryString.parse(location.search, {
    parseNumbers: true,
  });

  const [state, setState] = useState<AppState>({
    price: (search.price as number) || 310000,
    interest: (search.interest as number) || 4.62,
    deduction: (search.deduction as number) || 36.93,
    savings: (search.savings as number) || 40000,
    rent: (search.rent as number) || 1600,

    notary: 1200,
    valuation: 800,
    financialAdvisor: 2500,
    realStateAgent: 2750*1.21,
    structuralSurvey: 800,
  });

  const [tab, setTab] = useState<TableTabs>('annuity');
  const [infoTab, setInfoTab] = useState<InfoTabs>('mortgage');

  const { loan, cost, percentage } = calgulateLoanFigures(state);

  const linear = useMemo(
    () =>
      calculateLinearData(state.interest, state.deduction, state.savings, loan),
    [state.interest, state.deduction, state.savings, loan],
  );

  const annuity = useMemo(
    () =>
      calculateAnnuityData(
        state.interest,
        state.deduction,
        state.savings,
        loan,
      ),
    [state.interest, state.deduction, state.savings, loan],
  );

  function handleChange(field: string, value: number) {
    setState({ ...state, [field]: value });
  }

  useEffect(() => {
    const stateQueryString = queryString.stringify({
      price: state.price,
      interest: state.interest,
      deduction: state.deduction,
      savings: state.savings,
      rent: state.rent
    });

    if (location.search !== '?' + stateQueryString) {
      navigate({ search: '?' + stateQueryString }, { replace: true });
    }
  }, [state, navigate, location.search]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="bg-primary text-primary-foreground">
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

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Mortgage Information Section */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Mortgage Information</h2>
          <Tabs value={infoTab} onValueChange={(value) => setInfoTab(value as InfoTabs)}>
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:inline-flex">
              <TabsTrigger value="mortgage">Mortgage</TabsTrigger>
              <TabsTrigger value="cost">Purchase Costs</TabsTrigger>
              <TabsTrigger value="interest">Interest</TabsTrigger>
            </TabsList>
            <TabsContent value="mortgage" className="mt-6">
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
            <TabsContent value="cost" className="mt-6">
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
            <TabsContent value="interest" className="mt-6">
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
          </Tabs>
        </section>

        {/* Mortgage Structure Section */}
        <section className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Mortgage Structure</h2>
          <Tabs value={tab} onValueChange={(value) => setTab(value as TableTabs)}>
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-none lg:inline-flex">
              <TabsTrigger value="annuity">Annuity</TabsTrigger>
              <TabsTrigger value="linear">Linear</TabsTrigger>
              <TabsTrigger value="graph">Graph</TabsTrigger>
            </TabsList>
            <TabsContent value="annuity" className="mt-6">
              {renderMortgageTabs('annuity', annuity.monthly, linear.monthly)}
            </TabsContent>
            <TabsContent value="linear" className="mt-6">
              {renderMortgageTabs('linear', annuity.monthly, linear.monthly)}
            </TabsContent>
            <TabsContent value="graph" className="mt-6">
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
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center">
            <a
              href="https://github.com/santiago-pan/mortgage-calculator"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNOS45OTkgMGMtNS41MjEgMC05Ljk5OSA0LjU5LTkuOTk5IDEwLjI1MyAwIDQuNTMgMi44NjUgOC4zNzMgNi44MzkgOS43MjguNS4wOTQuNjgzLS4yMjIuNjgzLS40OTRsLS4wMTQtMS43NDRjLTIuNzgyLjYxOS0zLjM2OC0xLjM3NS0zLjM2OC0xLjM3NS0uNDU1LTEuMTg1LTEuMTExLTEuNS0xLjExMS0xLjUtLjkwOC0uNjM2LjA2OS0uNjIzLjA2OS0uNjIzIDEuMDA0LjA3MiAxLjUzMiAxLjA1NyAxLjUzMiAxLjA1Ny44OTIgMS41NjcgMi4zNDEgMS4xMTQgMi45MS44NTIuMDkxLS42NjIuMzQ5LTEuMTE0LjYzNS0xLjM3LTIuMjItLjI1OS00LjU1NS0xLjEzOS00LjU1NS01LjA2OCAwLTEuMTE5LjM5LTIuMDM1IDEuMDI5LTIuNzUxLS4xMDMtLjI1OS0uNDQ2LTEuMzAyLjA5OC0yLjcxMyAwIDAgLjgzOS0uMjc2IDIuNzUgMS4wNTEuNzk3LS4yMjggMS42NTMtLjM0MSAyLjUwMy0uMzQ2Ljg1LjAwNCAxLjcwNS4xMTggMi41MDMuMzQ2IDEuOTA5LTEuMzI3IDIuNzQ3LTEuMDUxIDIuNzQ3LTEuMDUxLjU0NiAxLjQxMS4yMDMgMi40NTQuMSAyLjcxMy42NDEuNzE2IDEuMDI4IDEuNjMyIDEuMDI4IDIuNzUxIDAgMy45MzktMi4zMzggNC44MDYtNC41NjYgNS4wNTkuMzU5LjMxNy42NzguOTQyLjY3OCAxLjg5OCAwIDEuMzcxLS4wMTIgMi40NzctLjAxMiAyLjgxMyAwIC4yNzQuMTguNTk0LjY4OC40OTMgMy45NzEtMS4zNTkgNi44MzMtNS4xOTkgNi44MzMtOS43MjggMC01LjY2My00LjQ3OC0xMC4yNTMtMTAuMDAxLTEwLjI1MyIgZmlsbD0iIzAwMCIvPgo8L3N2Zz4K"
                alt="GitHub"
                className="w-5 h-5"
              />
              <span>View on GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

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
      return <Costs {...state} loan={loan} onChange={handleChange} />;
    case 'interest':
      return <Interest />;
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

export default App;
