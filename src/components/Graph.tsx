
'use client';

import dynamic from 'next/dynamic';
import { MonthMortgageData } from '@/common/Types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartSkeleton } from './ChartSkeleton';

// Create a chart component using MortgageChart
const MortgageChart = dynamic(
  () => import('./MortgageChart'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[300px] sm:h-[400px] w-full touch-manipulation">
        <div className="w-full h-full flex items-center justify-center bg-muted/10 rounded-md relative overflow-hidden">
          {/* Chart area skeleton */}
          <div className="absolute inset-4">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-3 w-8 bg-muted animate-pulse rounded" />
              ))}
            </div>
            
            {/* Chart lines simulation */}
            <div className="absolute left-16 right-4 top-4 bottom-12">
              <svg className="w-full h-full" viewBox="0 0 300 200">
                {/* Grid lines */}
                <defs>
                  <pattern id="grid" width="50" height="33.33" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 33.33" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Animated skeleton lines */}
                <path 
                  d="M0,150 Q75,120 150,100 T300,80" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none" 
                  opacity="0.3"
                  className="animate-pulse"
                />
                <path 
                  d="M0,120 Q75,90 150,110 T300,130" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none" 
                  opacity="0.3"
                  className="animate-pulse"
                  style={{ animationDelay: '0.5s' }}
                />
              </svg>
            </div>
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 left-16 right-4 h-8 flex justify-between items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-3 w-6 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
          
          {/* Loading indicator */}
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading chart...</p>
          </div>
        </div>
      </div>
    )
  }
);

type GraphProps = {
  annuity: Array<MonthMortgageData>;
  linear: Array<MonthMortgageData>;
};

export function Graph(props: GraphProps) {
  const data = props.annuity.map((item, index) => {
    const linearItem = props.linear[index];
    return {
      month: item.month,
      annuityGross: item.grossPaid,
      annuityCapital: item.capitalPaid,
      annuityInterest: item.interest,
      linearGross: linearItem.grossPaid,
      linearCapital: linearItem.capitalPaid,
      linearInterest: linearItem.interest,
    };
  });

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">
          Mortgage Payment Comparison
        </CardTitle>
        <CardDescription>
          Monthly payment breakdown over 30 years. Solid lines = Annuity, Dashed lines = Linear
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] sm:h-[400px] w-full touch-manipulation">
          <MortgageChart data={data} />
        </div>
      </CardContent>
    </Card>
  );
}
