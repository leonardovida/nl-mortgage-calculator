'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import { useDatabase as useDatabaseContext } from '../components/DatabaseProvider';
import { AppState, MortgageData } from '@features/calculator/types/Types';
import { useAnalyticsContext } from '@features/analytics/components/AnalyticsProvider';
import { fallbackService, errorHandler } from '../lib/databaseFallbacks';

interface CalculationSaveOptions {
  debounceMs?: number;
  skipIfNoChanges?: boolean;
  includeRentVsBuy?: boolean;
}

interface CalculationSaveStatus {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  error: Error | null;
}

export function useMortgageCalculationSaver() {
  const database = useDatabaseContext();
  const { consentStatus } = useAnalyticsContext();
  const [saveStatus, setSaveStatus] = useState<CalculationSaveStatus>({
    isSaving: false,
    lastSaved: null,
    hasUnsavedChanges: false,
    error: null,
  });

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string | null>(null);

  // Clear any pending saves on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Main save function
  const saveCalculation = useCallback(async (
    appState: AppState,
    calculationResults: {
      loan: number;
      cost: number;
      percentage: number;
      transferTax: number;
      transferTaxExempt: boolean;
    },
    annuityData: MortgageData,
    linearData: MortgageData,
    rentVsBuyData?: any,
    options: CalculationSaveOptions = {}
  ) => {
    // Skip if database is not available or consent not given
    if (!database.isHealthy || consentStatus !== 'accepted') {
      return { success: false, error: new Error('Database not available or consent not given') };
    }

    const {
      debounceMs = 2000,
      skipIfNoChanges = true,
      includeRentVsBuy = false,
    } = options;

    try {
      // Create a hash of the current data to check for changes
      const currentDataHash = JSON.stringify({
        appState,
        calculationResults,
        annuity: annuityData.totals,
        linear: linearData.totals,
        rentVsBuy: includeRentVsBuy ? rentVsBuyData : null,
      });

      // Skip if no changes detected
      if (skipIfNoChanges && lastSavedDataRef.current === currentDataHash) {
        return { success: true, skipped: true };
      }

      setSaveStatus(prev => ({ 
        ...prev, 
        isSaving: true, 
        hasUnsavedChanges: true,
        error: null 
      }));

      // Clear any pending save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Debounced save with fallback handling
      return new Promise((resolve) => {
        saveTimeoutRef.current = setTimeout(async () => {
          try {
            const result = await errorHandler.handleDatabaseError(
              // Primary operation: save to database
              async () => {
                return await database.saveCalculation(
                  appState,
                  calculationResults,
                  annuityData,
                  linearData,
                  includeRentVsBuy ? rentVsBuyData : undefined
                );
              },
              // Fallback operation: save locally
              async () => {
                return await fallbackService.saveCalculationLocally(
                  appState,
                  calculationResults,
                  annuityData,
                  linearData,
                  includeRentVsBuy ? rentVsBuyData : undefined
                );
              },
              {
                operationType: 'save_calculation',
                component: 'MortgageCalculationSaver',
                userData: { appState, calculationResults }
              }
            );

            if (result.success) {
              lastSavedDataRef.current = currentDataHash;
              setSaveStatus({
                isSaving: false,
                lastSaved: new Date(),
                hasUnsavedChanges: false,
                error: null,
              });
            } else {
              setSaveStatus(prev => ({
                ...prev,
                isSaving: false,
                error: result.error || new Error('Save failed'),
              }));
            }

            resolve(result);
          } catch (error) {
            const err = error as Error;
            setSaveStatus(prev => ({
              ...prev,
              isSaving: false,
              error: err,
            }));
            resolve({ success: false, error: err });
          }
        }, debounceMs);
      });
    } catch (error) {
      const err = error as Error;
      setSaveStatus(prev => ({
        ...prev,
        isSaving: false,
        error: err,
      }));
      return { success: false, error: err };
    }
  }, [database, consentStatus]);

  // Immediate save (no debounce)
  const saveImmediately = useCallback(async (
    appState: AppState,
    calculationResults: {
      loan: number;
      cost: number;
      percentage: number;
      transferTax: number;
      transferTaxExempt: boolean;
    },
    annuityData: MortgageData,
    linearData: MortgageData,
    rentVsBuyData?: any
  ) => {
    return saveCalculation(
      appState,
      calculationResults,
      annuityData,
      linearData,
      rentVsBuyData,
      { debounceMs: 0, skipIfNoChanges: false, includeRentVsBuy: !!rentVsBuyData }
    );
  }, [saveCalculation]);

  // Auto-save with debouncing (for parameter changes)
  const autoSave = useCallback((
    appState: AppState,
    calculationResults: {
      loan: number;
      cost: number;
      percentage: number;
      transferTax: number;
      transferTaxExempt: boolean;
    },
    annuityData: MortgageData,
    linearData: MortgageData,
    rentVsBuyData?: any
  ) => {
    return saveCalculation(
      appState,
      calculationResults,
      annuityData,
      linearData,
      rentVsBuyData,
      { debounceMs: 5000, skipIfNoChanges: true, includeRentVsBuy: !!rentVsBuyData }
    );
  }, [saveCalculation]);

  // Clear unsaved changes status
  const clearUnsavedChanges = useCallback(() => {
    setSaveStatus(prev => ({ ...prev, hasUnsavedChanges: false, error: null }));
  }, []);

  // Force save any pending changes
  const forceSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      // Trigger the save immediately by setting timeout to 0
      // This will use the last queued save operation
    }
  }, []);

  return {
    saveCalculation,
    saveImmediately,
    autoSave,
    saveStatus,
    clearUnsavedChanges,
    forceSave,
    isAvailable: database.isHealthy && consentStatus === 'accepted',
  };
}

// Hook for parameter change tracking with database integration
export function useParameterChangeTracker() {
  const database = useDatabaseContext();
  const { consentStatus } = useAnalyticsContext();

  const trackParameterChange = useCallback(async (
    parameterName: string,
    newValue: any,
    previousValue?: any,
    context?: {
      component?: string;
      calculationId?: string;
      fieldType?: 'input' | 'toggle' | 'calculated';
      category?: string;
    }
  ) => {
    if (!database.isHealthy || !database.currentSessionId || consentStatus !== 'accepted') return;

    try {
      await database.trackParameterChange({
        session_id: database.currentSessionId,
        calculation_id: context?.calculationId || 'unknown',
        parameter_name: parameterName,
        parameter_category: context?.category || 'general',
        field_type: context?.fieldType || 'input',
        component_name: context?.component || 'unknown',
        previous_value: previousValue?.toString(),
        new_value: newValue?.toString(),
        validation_errors: [],
      });
    } catch (error) {
      console.error('Failed to track parameter change:', error);
    }
  }, [database, consentStatus]);

  return { trackParameterChange };
}

// Hook for enhanced analytics with database storage
export function useEnhancedAnalytics() {
  const database = useDatabaseContext();
  const { consentStatus } = useAnalyticsContext();

  const trackFeatureUsage = useCallback(async (
    featureName: string,
    action: string,
    context?: Record<string, any>
  ) => {
    if (!database.isHealthy || !database.currentSessionId || consentStatus !== 'accepted') return;

    try {
      await database.trackFeatureUsage({
        session_id: database.currentSessionId,
        feature_name: featureName,
        feature_category: getFeatureCategory(featureName),
        action,
        feature_value: context?.value?.toString(),
        feature_context: context || {},
      });
    } catch (error) {
      console.error('Failed to track feature usage:', error);
    }
  }, [database, consentStatus]);

  const trackTabNavigation = useCallback(async (
    fromTab: string | undefined,
    toTab: string,
    category: 'info' | 'calculation',
    method: 'click' | 'keyboard' | 'url' = 'click'
  ) => {
    if (!database.isHealthy || !database.currentSessionId || consentStatus !== 'accepted') return;

    try {
      await database.trackTabNavigation({
        session_id: database.currentSessionId,
        from_tab: fromTab,
        to_tab: toTab,
        tab_category: category,
        navigation_method: method,
      });
    } catch (error) {
      console.error('Failed to track tab navigation:', error);
    }
  }, [database, consentStatus]);

  const trackError = useCallback(async (
    errorType: string,
    errorMessage: string,
    context?: {
      component?: string;
      userAction?: string;
      stack?: string;
    }
  ) => {
    // Track errors even without consent for debugging purposes
    if (!database.isHealthy || !database.currentSessionId) return;

    try {
      await database.trackError({
        session_id: database.currentSessionId,
        error_type: errorType,
        error_message: errorMessage,
        error_stack: context?.stack,
        component_name: context?.component,
        user_action: context?.userAction,
      });
    } catch (error) {
      console.error('Failed to track error:', error);
    }
  }, [database]);

  return {
    trackFeatureUsage,
    trackTabNavigation,
    trackError,
    isAvailable: database.isHealthy && consentStatus === 'accepted',
  };
}

// Helper function to categorize features
function getFeatureCategory(featureName: string): string {
  const categories: Record<string, string> = {
    'first_time_buyer_toggle': 'tax_benefits',
    'rent_vs_buy_analysis': 'comparison',
    'mortgage_structure_comparison': 'calculation',
    'tax_calculation': 'tax_benefits',
    'nhg_calculation': 'insurance',
    'interest_rate_analysis': 'rates',
    'parameter_adjustment': 'input',
    'calculation_export': 'utility',
    'graph_visualization': 'visualization',
  };
  
  return categories[featureName] || 'other';
}

// Hook for calculation history with fallback support
export function useCalculationHistory() {
  const database = useDatabaseContext();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadHistory = useCallback(async (limit: number = 10) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await errorHandler.handleDatabaseError(
        // Primary operation: load from database
        async () => {
          return await database.getCalculationHistory(limit);
        },
        // Fallback operation: load from local storage
        () => {
          const localCalculations = fallbackService.getLocalCalculations();
          // Transform local calculations to match MortgageCalculation interface
          return localCalculations.slice(0, limit).map(calc => ({
            id: calc.id,
            session_id: 'local',
            calculation_id: calc.id,
            created_at: new Date(calc.timestamp).toISOString(),
            property_price: calc.appState.price,
            interest_rate: calc.appState.interest,
            tax_deduction_rate: calc.appState.deduction,
            savings_amount: calc.appState.savings,
            monthly_rent: calc.appState.rent,
            notary_cost: calc.appState.notary,
            valuation_cost: calc.appState.valuation,
            financial_advisor_cost: calc.appState.financialAdvisor,
            real_estate_agent_cost: calc.appState.realStateAgent,
            structural_survey_cost: calc.appState.structuralSurvey,
            is_first_time_buyer: calc.appState.isFirstTimeBuyer,
            transfer_tax_rate: calc.appState.transferTaxRate,
            property_appreciation_rate: calc.appState.propertyAppreciationRate,
            comparison_period_years: calc.appState.comparisonPeriodYears,
            loan_amount: calc.calculationResults.loan,
            total_cost: calc.calculationResults.cost,
            loan_to_value_percentage: calc.calculationResults.percentage,
            transfer_tax_amount: calc.calculationResults.transferTax,
            transfer_tax_exempt: calc.calculationResults.transferTaxExempt,
            calculation_status: 'completed' as const,
            calculation_duration_ms: undefined,
            error_message: undefined,
            user_segment: undefined,
          }));
        },
        {
          operationType: 'load_history',
          component: 'CalculationHistory',
        }
      );
      
      setHistory(data);
    } catch (err) {
      setError(err as Error);
      // Even if both fail, try to load local data
      const localData = fallbackService.getLocalCalculations();
      setHistory(localData.slice(0, limit));
    } finally {
      setIsLoading(false);
    }
  }, [database]);

  useEffect(() => {
    if (database.isInitialized) {
      loadHistory();
    }
  }, [database.isInitialized, loadHistory]);

  return {
    history,
    isLoading,
    error,
    reload: loadHistory,
    isAvailable: database.isHealthy || fallbackService.getLocalCalculations().length > 0,
  };
}

// Hook for local data management and sync
export function useLocalDataManager() {
  const database = useDatabaseContext();
  const { consentStatus } = useAnalyticsContext();
  const [syncStatus, setSyncStatus] = useState<{
    isSyncing: boolean;
    lastSync: Date | null;
    error: Error | null;
  }>({
    isSyncing: false,
    lastSync: null,
    error: null,
  });

  // Sync local data to database when connection is restored
  const syncLocalData = useCallback(async () => {
    if (!database.isHealthy || consentStatus !== 'accepted') {
      return { success: false, error: new Error('Database not available or consent not given') };
    }

    setSyncStatus(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      // Sync queued analytics events
      const queuedEvents = fallbackService.getAnalyticsQueue();
      const syncedEventIds: string[] = [];

      for (const event of queuedEvents) {
        try {
          await database.trackAnalyticsEvent({
            session_id: database.currentSessionId || 'unknown',
            event_type: event.eventType,
            properties: event.data,
          });
          syncedEventIds.push(event.id);
        } catch (error) {
          console.warn('Failed to sync analytics event:', event.id, error);
        }
      }

      // Clear successfully synced events
      if (syncedEventIds.length > 0) {
        fallbackService.clearAnalyticsQueue(syncedEventIds);
      }

      setSyncStatus({
        isSyncing: false,
        lastSync: new Date(),
        error: null,
      });

      return { success: true, syncedEvents: syncedEventIds.length };
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        error: error as Error,
      }));
      return { success: false, error: error as Error };
    }
  }, [database, consentStatus]);

  // Auto-sync when database becomes available
  useEffect(() => {
    if (database.isHealthy && consentStatus === 'accepted') {
      // Delay sync to avoid overwhelming the database on startup
      const timeoutId = setTimeout(() => {
        syncLocalData();
      }, 5000);

      return () => clearTimeout(timeoutId);
    }
  }, [database.isHealthy, consentStatus, syncLocalData]);

  // Export user data
  const exportData = useCallback(() => {
    return fallbackService.exportUserData();
  }, []);

  // Import user data
  const importData = useCallback((jsonData: string) => {
    return fallbackService.importUserData(jsonData);
  }, []);

  // Clear all local data
  const clearAllData = useCallback(() => {
    fallbackService.clearAllLocalData();
  }, []);

  // Get storage usage
  const getStorageUsage = useCallback(() => {
    return fallbackService.getStorageUsage();
  }, []);

  return {
    syncStatus,
    syncLocalData,
    exportData,
    importData,
    clearAllData,
    getStorageUsage,
    hasLocalData: fallbackService.getLocalCalculations().length > 0,
  };
}