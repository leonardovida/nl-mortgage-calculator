'use client';

import { Suspense } from 'react';
import { MortgageCalculator } from '@/components/common/MortgageCalculator';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { SkipNavigation } from '@/components/common/SkipNavigation';
import { DatabaseProvider } from '@features/database/components/DatabaseProvider';
import { useAnalyticsContext } from '@features/analytics/components/AnalyticsProvider';

interface ClientMortgageCalculatorProps {
  jsonLd?: any;
}

export function ClientMortgageCalculator({ jsonLd }: ClientMortgageCalculatorProps) {
  const { consentStatus } = useAnalyticsContext();

  return (
    <>
      <SkipNavigation />
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <DatabaseProvider consentGiven={consentStatus === 'accepted'}>
        <ErrorBoundary
          onError={(error, errorInfo) => {
            // Log mortgage calculation errors specifically
            console.error('Mortgage Calculator Error:', error, errorInfo);
            
            // Additional tracking for critical application errors
            if (typeof window !== 'undefined') {
              try {
                // Track application-level errors
                import('@features/analytics/lib/analytics').then(({ analytics }) => {
                  analytics.trackError({
                    error_type: 'component_error',
                    error_message: `ClientMortgageCalculator: ${error.message}`,
                    error_stack: error.stack,
                    component: 'ClientMortgageCalculator',
                    user_action: 'application_load',
                  });
                });

                // Also track in database if available
                import('@features/database/hooks/useDatabase').then(({ useEnhancedAnalytics }) => {
                  // Note: This is called outside of React component context, 
                  // so direct hook usage isn't possible here
                });
              } catch (trackingError) {
                console.warn('Failed to track critical error:', trackingError);
              }
            }
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
      </DatabaseProvider>
    </>
  );
}