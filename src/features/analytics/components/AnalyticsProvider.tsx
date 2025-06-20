'use client';

import { createContext, useContext, useEffect, useState, useCallback, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analytics, useAnalytics } from '../lib/analytics';

// GDPR compliance types
type ConsentStatus = 'pending' | 'accepted' | 'rejected';

interface AnalyticsContextType {
  isInitialized: boolean;
  consentStatus: ConsentStatus;
  acceptConsent: () => void;
  rejectConsent: () => void;
  trackPageView: (pageName: string, properties?: Record<string, any>) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

interface AnalyticsProviderProps {
  children: React.ReactNode;
  enableConsentBanner?: boolean;
  consentRequired?: boolean;
}

function AnalyticsProviderInner({ 
  children, 
  enableConsentBanner = true,
  consentRequired = true 
}: AnalyticsProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('pending');
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize consent status from localStorage
  useEffect(() => {
    const savedConsent = localStorage.getItem('mortgage_calc_analytics_consent');
    if (savedConsent) {
      setConsentStatus(savedConsent as ConsentStatus);
    } else if (!consentRequired) {
      setConsentStatus('accepted');
    }
  }, [consentRequired]);

  const initializeAnalytics = useCallback(async () => {
    try {
      await analytics.initialize();
      setIsInitialized(true);
      
      // Mark user as returning if they've visited before
      const hasVisitedBefore = localStorage.getItem('mortgage_calc_visited');
      if (!hasVisitedBefore) {
        localStorage.setItem('mortgage_calc_visited', 'true');
      } else {
        localStorage.setItem('mortgage_calc_returning_user', 'true');
      }

      // Track initial user journey step
      analytics.trackUserJourneyStep({
        step: 'app_initialized',
        step_category: 'onboarding',
        step_number: 1,
      });

    } catch (error) {
      console.error('Failed to initialize analytics:', error);
      analytics.trackError({
        error_type: 'component_error',
        error_message: 'Analytics initialization failed',
        error_stack: error instanceof Error ? error.stack : undefined,
        component: 'AnalyticsProvider',
      });
    }
  }, []);

  // Initialize analytics when consent is given
  useEffect(() => {
    if (consentStatus === 'accepted' && !isInitialized) {
      initializeAnalytics();
    }
  }, [consentStatus, isInitialized, initializeAnalytics]);

  // Track page changes
  useEffect(() => {
    if (isInitialized && consentStatus === 'accepted') {
      const pageName = pathname === '/' ? 'home' : pathname.slice(1);
      
      // Get mortgage parameters from URL for context
      const mortgageParams = {
        has_price: searchParams.has('price'),
        has_interest: searchParams.has('interest'),
        has_savings: searchParams.has('savings'),
        has_rent: searchParams.has('rent'),
        is_first_time_buyer: searchParams.get('firstTime') === 'true',
        url_params_count: Array.from(searchParams.keys()).length,
      };

      analytics.trackPageView(pageName, mortgageParams);
    }
  }, [pathname, searchParams, isInitialized, consentStatus]);

  const acceptConsent = useCallback(() => {
    setConsentStatus('accepted');
    localStorage.setItem('mortgage_calc_analytics_consent', 'accepted');
    
    // Track consent acceptance
    if (isInitialized) {
      analytics.trackUserJourneyStep({
        step: 'consent_accepted',
        step_category: 'onboarding',
        step_number: 2,
      });
    }
  }, [isInitialized]);

  const rejectConsent = useCallback(() => {
    setConsentStatus('rejected');
    localStorage.setItem('mortgage_calc_analytics_consent', 'rejected');
  }, []);

  const trackPageView = useCallback((pageName: string, properties?: Record<string, any>) => {
    if (isInitialized && consentStatus === 'accepted') {
      analytics.trackPageView(pageName, properties);
    }
  }, [isInitialized, consentStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isInitialized) {
        analytics.shutdown();
      }
    };
  }, [isInitialized]);

  const contextValue: AnalyticsContextType = {
    isInitialized,
    consentStatus,
    acceptConsent,
    rejectConsent,
    trackPageView,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
      {enableConsentBanner && consentStatus === 'pending' && (
        <ConsentBanner onAccept={acceptConsent} onReject={rejectConsent} />
      )}
    </AnalyticsContext.Provider>
  );
}

// GDPR Consent Banner Component
interface ConsentBannerProps {
  onAccept: () => void;
  onReject: () => void;
}

function ConsentBanner({ onAccept, onReject }: ConsentBannerProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 backdrop-blur-sm border-t border-slate-200/60 dark:border-slate-700/60 shadow-xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iNyIgY3k9IjciIHI9IjEiLz48Y2lyY2xlIGN4PSI1MyIgY3k9IjciIHI9IjEiLz48Y2lyY2xlIGN4PSI1MyIgY3k9IjUzIiByPSIxIi8+PGNpcmNsZSBjeD0iNyIgY3k9IjUzIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="relative container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 dark:bg-blue-400/20">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Content */}
            <div className="text-sm">
              <p className="font-semibold text-slate-900 dark:text-white mb-1">
                Help us improve your experience
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We use PostHog to analyze usage patterns and improve our mortgage calculator. 
                Your data is anonymized and we don&apos;t track personally identifiable information.
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={onReject}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 transition-all duration-200 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-lg"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Accept Analytics
            </button>
          </div>
        </div>
      </div>
      
      {/* Bottom border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600"></div>
    </div>
  );
}

// Custom hook to use analytics context
export function useAnalyticsContext() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
}

// HOC for components that need analytics
export function withAnalytics<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function AnalyticsWrappedComponent(props: P) {
    const { isInitialized, consentStatus } = useAnalyticsContext();
    const analyticsHooks = useAnalytics();

    // Track component mount
    useEffect(() => {
      if (isInitialized && consentStatus === 'accepted') {
        analyticsHooks.trackUserJourneyStep({
          step: `${componentName}_mounted`,
          step_category: 'onboarding',
        });
      }
    }, [isInitialized, consentStatus, analyticsHooks]);

    return <Component {...props} />;
  };
}

// Main export with Suspense boundary
export function AnalyticsProvider(props: AnalyticsProviderProps) {
  return (
    <Suspense fallback={
      <div>{props.children}</div>
    }>
      <AnalyticsProviderInner {...props} />
    </Suspense>
  );
}