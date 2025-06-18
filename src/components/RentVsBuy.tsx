'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputField } from './InputField';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NumericFormat } from 'react-number-format';

type Props = {
  price: number;
  rent: number;
  savings: number;
  loan: number;
  cost: number;
  annuityTotals: {
    totalPaidGross: number;
    totalPaidNet: number;
  };
  propertyAppreciationRate: number;
  comparisonPeriodYears: number;
  onChange: (field: string, value: number) => void;
};

type YearlyComparison = {
  year: number;
  propertyValue: number;
  remainingLoan: number;
  equity: number;
  totalRentPaid: number;
  totalMortgagePaid: number;
  netWorthDifference: number;
};

export function RentVsBuy(props: Props) {
  const yearlyData = useMemo(() => {
    const data: YearlyComparison[] = [];
    const monthlyMortgagePayment = props.annuityTotals.totalPaidNet / 360; // 30 years
    const yearlyMortgagePayment = monthlyMortgagePayment * 12;
    const rentIncreaseRate = 0.02; // 2% annual rent increase
    
    for (let year = 1; year <= props.comparisonPeriodYears; year++) {
      // Property value with appreciation
      const propertyValue = props.price * Math.pow(1 + props.propertyAppreciationRate / 100, year);
      
      // Simplified loan remaining (actual would need amortization schedule)
      const yearlyPrincipalPayment = props.loan / 30; // Simplified 30-year amortization
      const remainingLoan = Math.max(0, props.loan - (yearlyPrincipalPayment * year));
      
      // Equity calculation
      const equity = propertyValue - remainingLoan;
      
      // Total rent paid with annual increases
      let totalRentPaid = 0;
      for (let y = 1; y <= year; y++) {
        const yearlyRent = props.rent * 12 * Math.pow(1 + rentIncreaseRate, y - 1);
        totalRentPaid += yearlyRent;
      }
      
      // Total mortgage payments
      const totalMortgagePaid = yearlyMortgagePayment * year;
      
      // Net worth difference (buying vs renting)
      // Buying: equity minus total costs
      // Renting: savings invested minus total rent paid
      const buyingNetWorth = equity - props.cost;
      const rentingNetWorth = props.savings * Math.pow(1.03, year) - totalRentPaid; // 3% investment return
      const netWorthDifference = buyingNetWorth - rentingNetWorth;
      
      data.push({
        year,
        propertyValue,
        remainingLoan,
        equity,
        totalRentPaid,
        totalMortgagePaid,
        netWorthDifference,
      });
    }
    
    return data;
  }, [props.price, props.rent, props.loan, props.cost, props.annuityTotals, props.propertyAppreciationRate, props.comparisonPeriodYears, props.savings]);

  const finalYear = yearlyData[yearlyData.length - 1];
  const breakEvenYear = yearlyData.find(year => year.netWorthDifference > 0)?.year;

  return (
    <div className="space-y-6">
      {/* Settings Card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Comparison Settings</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            title="Property appreciation rate"
            append="%"
            value={props.propertyAppreciationRate}
            onChange={(value) =>
              props.onChange('propertyAppreciationRate', parseFloat(value) || 0)
            }
          />
          <InputField
            title="Comparison period"
            append="years"
            value={props.comparisonPeriodYears}
            onChange={(value) =>
              props.onChange('comparisonPeriodYears', parseInt(value, 10) || 5)
            }
          />
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Summary ({props.comparisonPeriodYears} years)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Property Value</h4>
              <NumericFormat
                value={finalYear?.propertyValue || 0}
                displayType="text"
                thousandSeparator={true}
                prefix="€"
                decimalScale={0}
                className="text-xl font-bold"
              />
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Your Equity</h4>
              <NumericFormat
                value={finalYear?.equity || 0}
                displayType="text"
                thousandSeparator={true}
                prefix="€"
                decimalScale={0}
                className="text-xl font-bold text-green-600"
              />
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Total Rent Paid</h4>
              <NumericFormat
                value={finalYear?.totalRentPaid || 0}
                displayType="text"
                thousandSeparator={true}
                prefix="€"
                decimalScale={0}
                className="text-xl font-bold text-red-600"
              />
            </div>
          </div>
          
          <div className="text-center p-4 border-2 rounded-lg">
            <h4 className="font-semibold text-sm text-muted-foreground mb-2">
              Net Worth Advantage (Buying vs Renting)
            </h4>
            <NumericFormat
              value={finalYear?.netWorthDifference || 0}
              displayType="text"
              thousandSeparator={true}
              prefix={finalYear?.netWorthDifference >= 0 ? '+€' : '-€'}
              decimalScale={0}
              className={`text-2xl font-bold ${
                finalYear?.netWorthDifference >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            />
            {breakEvenYear && (
              <p className="text-sm text-muted-foreground mt-2">
                Break-even at year {breakEvenYear}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown Table */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Year-by-Year Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Year</TableHead>
                  <TableHead className="text-center">Property Value</TableHead>
                  <TableHead className="text-center">Your Equity</TableHead>
                  <TableHead className="text-center">Total Rent Paid</TableHead>
                  <TableHead className="text-center">Net Worth Diff</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {yearlyData.map((year) => (
                  <TableRow key={year.year} className="hover:bg-muted/50">
                    <TableCell className="text-center font-medium">{year.year}</TableCell>
                    <TableCell className="text-right font-mono">
                      <NumericFormat
                        value={year.propertyValue}
                        displayType="text"
                        thousandSeparator={true}
                        prefix="€"
                        decimalScale={0}
                      />
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <NumericFormat
                        value={year.equity}
                        displayType="text"
                        thousandSeparator={true}
                        prefix="€"
                        decimalScale={0}
                      />
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      <NumericFormat
                        value={year.totalRentPaid}
                        displayType="text"
                        thousandSeparator={true}
                        prefix="€"
                        decimalScale={0}
                      />
                    </TableCell>
                    <TableCell className={`text-right font-mono ${
                      year.netWorthDifference >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <NumericFormat
                        value={Math.abs(year.netWorthDifference)}
                        displayType="text"
                        thousandSeparator={true}
                        prefix={year.netWorthDifference >= 0 ? '+€' : '-€'}
                        decimalScale={0}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Assumptions Card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Assumptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <ul className="space-y-2">
              <li>• Rent increases by 2% annually</li>
              <li>• Property appreciates at set rate annually</li>
              <li>• 30-year mortgage amortization</li>
            </ul>
            <ul className="space-y-2">
              <li>• Saved money invested at 3% return</li>
              <li>• No major repairs or renovations</li>
              <li>• Market conditions remain stable</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}