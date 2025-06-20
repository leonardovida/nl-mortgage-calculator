/**
 * Database Integration Example
 * 
 * This file demonstrates how to integrate the Supabase database
 * with the existing mortgage calculator application.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { db, createSessionData } from '@features/database/lib/supabase';
import { useAnalyticsContext } from '@features/analytics/components/AnalyticsProvider';
import {
  UserSession,
  MortgageCalculation,
  transformAppStateToCalculation,
  transformMortgageDataToResult,
} from '@features/database/types/database';
import { AppState } from '@features/calculator/types/Types';

/**
 * Enhanced Mortgage Calculator with Database Integration
 */
export function MortgageCalculatorWithDatabase() {
  const router = useRouter();
  const { isInitialized, consentStatus } = useAnalyticsContext();
  
  // Database state
  const [databaseSession, setDatabaseSession] = useState<UserSession | null>(null);
  const [currentCalculationId, setCurrentCalculationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mortgage calculator state (existing AppState)
  const [appState, setAppState] = useState<AppState>({
    price: 310000,
    interest: 4.62,
    deduction: 36.93,
    savings: 40000,
    rent: 1600,
    notary: 1200,
    valuation: 800,
    financialAdvisor: 2500,
    realStateAgent: 3327.5,
    structuralSurvey: 800,
    isFirstTimeBuyer: false,
    transferTaxRate: 2.0,
    propertyAppreciationRate: 3.0,
    comparisonPeriodYears: 10,
  });

  /**
   * Initialize database session when consent is given
   */
  useEffect(() => {
    const initializeSession = async () => {
      if (consentStatus === 'accepted' && !databaseSession) {
        setIsLoading(true);
        try {
          const sessionData = createSessionData();
          const { data: session, error } = await db.initializeSession({
            ...sessionData,
            analytics_consent_given: true,
            consent_timestamp: new Date().toISOString(),
          });

          if (error) {
            throw error;
          }

          setDatabaseSession(session);
          console.log('Database session initialized:', session?.session_id);
        } catch (err) {
          console.error('Failed to initialize database session:', err);
          setError('Failed to initialize session');
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeSession();
  }, [consentStatus, databaseSession]);

  /**
   * Enhanced parameter change handler with database tracking
   */
  const handleParameterChange = useCallback(async (
    field: keyof AppState,
    value: number | boolean
  ) => {
    const previousValue = appState[field];
    
    // Update local state
    setAppState(prev => ({ ...prev, [field]: value }));

    // Track parameter change in database
    if (databaseSession && currentCalculationId) {
      try {
        await db.trackParameterChange({
          session_id: databaseSession.id,
          calculation_id: currentCalculationId,
          parameter_name: field,
          parameter_category: getParameterCategory(field),
          field_type: typeof value === 'boolean' ? 'toggle' : 'input',
          component_name: 'MortgageCalculator',
          previous_value: String(previousValue),
          new_value: String(value),
          validation_errors: [],
        });
      } catch (err) {
        console.warn('Failed to track parameter change:', err);
      }
    }
  }, [appState, databaseSession, currentCalculationId]);

  /**
   * Enhanced calculation handler with database storage
   */
  const handleCalculationComplete = useCallback(async (
    calculationResults: any,
    annuityData: any,
    linearData: any,
    rentVsBuyData?: any
  ) => {
    if (!databaseSession) {
      console.warn('No database session available for saving calculation');
      return;
    }

    setIsLoading(true);
    try {
      const result = await db.saveCompleteCalculation(
        databaseSession.id,
        appState,
        calculationResults,
        annuityData,
        linearData,
        rentVsBuyData
      );

      if (result.success && result.calculationId) {
        setCurrentCalculationId(result.calculationId);
        console.log('Calculation saved with ID:', result.calculationId);

        // Track calculation completion event
        await db.trackAnalyticsEvent({
          session_id: databaseSession.id,
          event_type: 'mortgage_calculation_completed',
          properties: {
            calculation_id: result.calculationId,
            loan_amount: calculationResults.loan,
            property_price: appState.price,
            interest_rate: appState.interest,
            mortgage_type: 'both',
            user_segment: databaseSession.user_segment,
          },
          page_url: window.location.href,
          page_title: document.title,
        });
      } else {
        throw result.error || new Error('Failed to save calculation');
      }
    } catch (err) {
      console.error('Failed to save calculation:', err);
      setError('Failed to save calculation');
      
      // Track error event
      if (databaseSession) {
        await db.trackError({
          session_id: databaseSession.id,
          error_type: 'calculation_error',
          error_message: err instanceof Error ? err.message : String(err),
          component_name: 'MortgageCalculator',
          user_action: 'calculate',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [databaseSession, appState]);

  /**
   * Enhanced tab navigation with database tracking
   */
  const handleTabNavigation = useCallback(async (
    fromTab: string,
    toTab: string,
    tabCategory: 'info' | 'calculation'
  ) => {
    if (!databaseSession) return;

    try {
      await db.trackTabNavigation({
        session_id: databaseSession.id,
        from_tab: fromTab,
        to_tab: toTab,
        tab_category: tabCategory,
        navigation_method: 'click',
        calculation_id: currentCalculationId || undefined,
      });

      // Update session tab navigation count
      await db.updateSession(databaseSession.id, {
        tabs_navigated: (databaseSession.tabs_navigated || 0) + 1,
      });
    } catch (err) {
      console.warn('Failed to track tab navigation:', err);
    }
  }, [databaseSession, currentCalculationId]);

  /**
   * Enhanced feature usage tracking
   */
  const trackFeatureUsage = useCallback(async (
    featureName: string,
    action: string,
    value?: any,
    context?: Record<string, any>
  ) => {
    if (!databaseSession) return;

    try {
      await db.trackFeatureUsage({
        session_id: databaseSession.id,
        feature_name: featureName,
        feature_category: getFeatureCategory(featureName),
        action,
        feature_value: value ? String(value) : undefined,
        feature_context: context || {},
        calculation_id: currentCalculationId || undefined,
      });
    } catch (err) {
      console.warn('Failed to track feature usage:', err);
    }
  }, [databaseSession, currentCalculationId]);

  /**
   * Performance tracking
   */
  const trackPerformance = useCallback(async (
    metricName: string,
    value: number,
    unit: string,
    componentName?: string
  ) => {
    if (!databaseSession) return;

    try {
      await db.trackPerformanceMetric({
        session_id: databaseSession.id,
        metric_name: metricName,
        metric_value: value,
        metric_unit: unit,
        component_name: componentName,
        calculation_id: currentCalculationId || undefined,
      });
    } catch (err) {
      console.warn('Failed to track performance metric:', err);
    }
  }, [databaseSession, currentCalculationId]);

  /**
   * Session cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (databaseSession) {
        // Update final session duration
        const sessionDuration = Date.now() - new Date(databaseSession.created_at).getTime();
        db.updateSession(databaseSession.id, {
          session_duration_ms: sessionDuration,
        }).catch(err => console.warn('Failed to update session duration:', err));
      }
    };
  }, [databaseSession]);

  // Helper functions
  function getParameterCategory(parameter: keyof AppState): string {
    const categories: Record<string, string> = {
      price: 'property',
      savings: 'property',
      interest: 'mortgage',
      deduction: 'mortgage',
      rent: 'comparison',
      notary: 'costs',
      valuation: 'costs',
      financialAdvisor: 'costs',
      realStateAgent: 'costs',
      structuralSurvey: 'costs',
      transferTaxRate: 'tax',
      isFirstTimeBuyer: 'tax',
      propertyAppreciationRate: 'analysis',
      comparisonPeriodYears: 'analysis',
    };
    return categories[parameter] || 'other';
  }

  function getFeatureCategory(featureName: string): string {
    const categories: Record<string, string> = {
      first_time_buyer_toggle: 'tax_benefits',
      rent_vs_buy_analysis: 'comparison',
      mortgage_structure_comparison: 'calculation',
      tax_calculation: 'tax_benefits',
      nhg_calculation: 'insurance',
      interest_rate_analysis: 'rates',
    };
    return categories[featureName] || 'other';
  }

  return (
    <div className="mortgage-calculator-with-database">
      {/* Session Status Indicator */}
      {databaseSession && (
        <div className="session-status mb-4 p-2 bg-green-100 text-green-800 rounded">
          Session ID: {databaseSession.session_id}
          {currentCalculationId && (
            <span className="ml-2">| Calculation ID: {currentCalculationId}</span>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-message mb-4 p-2 bg-red-100 text-red-800 rounded">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="loading-indicator mb-4 p-2 bg-blue-100 text-blue-800 rounded">
          Processing...
        </div>
      )}

      {/* Your existing mortgage calculator components would go here */}
      {/* Example integration points: */}
      
      <button
        onClick={() => trackFeatureUsage('first_time_buyer_toggle', 'clicked')}
        className="feature-button"
      >
        Toggle First Time Buyer
      </button>

      <button
        onClick={() => handleTabNavigation('mortgage', 'costs', 'info')}
        className="tab-button"
      >
        Switch to Costs Tab
      </button>

      {/* Performance measurement example */}
      <button
        onClick={async () => {
          const startTime = performance.now();
          // Perform calculation...
          const endTime = performance.now();
          await trackPerformance(
            'calculation_duration',
            endTime - startTime,
            'ms',
            'MortgageCalculator'
          );
        }}
        className="calculate-button"
      >
        Calculate with Performance Tracking
      </button>
    </div>
  );
}

/**
 * Analytics Dashboard Component
 * Example of how to display analytics data from the database
 */
export function AnalyticsDashboard() {
  const [sessionSummary, setSessionSummary] = useState<any[]>([]);
  const [popularFeatures, setPopularFeatures] = useState<any[]>([]);
  const [calculationTrends, setCalculationTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setLoading(true);

        // Load session summary
        const { data: sessions } = await db.getSessionSummary({
          date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        });

        // Load popular features
        const { data: features } = await db.getPopularFeatures(10);

        // Load calculation trends
        const { data: trends } = await db.getCalculationTrends(30);

        setSessionSummary(sessions || []);
        setPopularFeatures(features || []);
        setCalculationTrends(trends || []);
      } catch (err) {
        console.error('Failed to load analytics data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, []);

  if (loading) {
    return <div className="analytics-loading">Loading analytics...</div>;
  }

  return (
    <div className="analytics-dashboard">
      <h2>Analytics Dashboard</h2>

      {/* Session Summary */}
      <section className="session-summary">
        <h3>Session Summary (Last 30 Days)</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <h4>Total Sessions</h4>
            <p>{sessionSummary.length}</p>
          </div>
          <div className="stat-card">
            <h4>Avg Calculations per Session</h4>
            <p>
              {sessionSummary.length > 0
                ? (sessionSummary.reduce((sum, s) => sum + s.actual_calculations, 0) / sessionSummary.length).toFixed(1)
                : '0'
              }
            </p>
          </div>
          <div className="stat-card">
            <h4>Avg Property Price</h4>
            <p>
              €{sessionSummary.length > 0
                ? Math.round(sessionSummary.reduce((sum, s) => sum + (s.avg_property_price || 0), 0) / sessionSummary.length).toLocaleString()
                : '0'
              }
            </p>
          </div>
        </div>
      </section>

      {/* Popular Features */}
      <section className="popular-features">
        <h3>Popular Features</h3>
        <div className="features-list">
          {popularFeatures.map((feature, index) => (
            <div key={index} className="feature-item">
              <span className="feature-name">{feature.feature_name}</span>
              <span className="feature-usage">{feature.usage_count} uses</span>
              <span className="feature-sessions">{feature.unique_sessions} sessions</span>
            </div>
          ))}
        </div>
      </section>

      {/* Calculation Trends */}
      <section className="calculation-trends">
        <h3>Calculation Trends</h3>
        <div className="trends-chart">
          {calculationTrends.map((trend, index) => (
            <div key={index} className="trend-item">
              <span className="trend-date">{new Date(trend.calculation_date).toLocaleDateString()}</span>
              <span className="trend-count">{trend.calculation_count} calculations</span>
              <span className="trend-segment">{trend.user_segment}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * Session Insights Component
 * Shows detailed insights for the current session
 */
export function SessionInsights({ sessionId }: { sessionId: string }) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const { data } = await db.getSessionInsights(sessionId);
        setInsights(data);
      } catch (err) {
        console.error('Failed to load session insights:', err);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      loadInsights();
    }
  }, [sessionId]);

  if (loading) {
    return <div>Loading session insights...</div>;
  }

  if (!insights) {
    return <div>No insights available</div>;
  }

  return (
    <div className="session-insights">
      <h3>Session Insights</h3>
      <div className="insights-grid">
        <div className="insight-item">
          <label>Total Calculations:</label>
          <span>{insights.total_calculations}</span>
        </div>
        <div className="insight-item">
          <label>Average Property Price:</label>
          <span>€{Math.round(insights.avg_property_price || 0).toLocaleString()}</span>
        </div>
        <div className="insight-item">
          <label>Most Used Feature:</label>
          <span>{insights.most_used_feature || 'None'}</span>
        </div>
        <div className="insight-item">
          <label>Session Duration:</label>
          <span>{insights.session_duration_minutes} minutes</span>
        </div>
        <div className="insight-item">
          <label>Errors:</label>
          <span>{insights.error_count}</span>
        </div>
      </div>
    </div>
  );
}

export default MortgageCalculatorWithDatabase;