'use client';

import { Suspense } from 'react';
import { MortgageCalculator } from '@/components/MortgageCalculator';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { SkipNavigation } from '@/components/SkipNavigation';

interface ClientMortgageCalculatorProps {
  jsonLd?: any;
}

export function ClientMortgageCalculator({ jsonLd }: ClientMortgageCalculatorProps) {
  return (
    <>
      <SkipNavigation />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ErrorBoundary
        onError={(error, errorInfo) => {
          // Log mortgage calculation errors specifically
          console.error('Mortgage Calculator Error:', error, errorInfo);
        }}
      >
        <Suspense fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading calculator...</p>
            </div>
          </div>
        }>
          <MortgageCalculator />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}