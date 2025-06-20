'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  db, 
  createSessionData, 
  checkDatabaseHealth,
  DatabaseService,
  type DatabaseResponse,
  type UserSession,
  type MortgageCalculation,
  type MortgageResult,
  type RentVsBuyAnalysis,
  type UserSessionInsert,
  type MortgageCalculationInsert,
  type AnalyticsEventInsert,
  type TabNavigationEventInsert,
  type FeatureUsageEventInsert,
  type ParameterChangeEventInsert,
  type ErrorEventInsert,
} from '../lib/supabase';
import { AppState, MortgageData } from '@features/calculator/types/Types';

interface DatabaseContextType {
  // Status
  isInitialized: boolean;
  isHealthy: boolean;
  currentSessionId: string | null;
  lastError: Error | null;

  // Session management
  initializeSession: () => Promise<void>;
  updateSessionActivity: () => Promise<void>;
  endSession: () => Promise<void>;

  // Data operations
  saveCalculation: (
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
  ) => Promise<{ success: boolean; calculationId?: string; error?: Error }>;

  // Analytics integration
  trackAnalyticsEvent: (event: AnalyticsEventInsert) => Promise<void>;
  trackTabNavigation: (event: TabNavigationEventInsert) => Promise<void>;
  trackFeatureUsage: (event: FeatureUsageEventInsert) => Promise<void>;
  trackParameterChange: (event: ParameterChangeEventInsert) => Promise<void>;
  trackError: (event: ErrorEventInsert) => Promise<void>;

  // Data retrieval
  getCalculationHistory: (limit?: number) => Promise<MortgageCalculation[]>;
  getSessionSummary: () => Promise<any>;

  // Utility
  clearError: () => void;
  healthCheck: () => Promise<boolean>;
}

const DatabaseContext = createContext<DatabaseContextType | null>(null);

interface DatabaseProviderProps {
  children: React.ReactNode;
  consentGiven?: boolean;
}

export function DatabaseProvider({ children, consentGiven = false }: DatabaseProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isHealthy, setIsHealthy] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentSession, setCurrentSession] = useState<UserSession | null>(null);
  const [lastError, setLastError] = useState<Error | null>(null);
  const [sessionStartTime] = useState<number>(Date.now());

  // Initialize database connection and session
  const initializeSession = useCallback(async () => {
    try {
      // Check database health first
      const healthy = await checkDatabaseHealth();
      setIsHealthy(healthy);

      if (!healthy) {
        console.warn('Database health check failed, continuing with offline mode');
        setIsInitialized(true);
        return;
      }

      // Create session data
      const sessionData = createSessionData();
      
      // Initialize session in database
      const sessionInsert: UserSessionInsert = {
        session_id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...sessionData,
        is_returning_user: sessionData.is_returning_user || false,
        analytics_consent_given: consentGiven,
        consent_timestamp: consentGiven ? new Date().toISOString() : undefined,
        session_duration_ms: 0,
        page_views: 1,
        calculations_count: 0,
        tabs_navigated: 0,
      };

      const { data: session, error } = await db.initializeSession(sessionInsert);
      
      if (error) {
        console.error('Failed to initialize session:', error);
        setLastError(error);
        // Continue with offline mode
        setIsInitialized(true);
        return;
      }

      if (session) {
        setCurrentSession(session);
        setCurrentSessionId(session.id);
        
        // Mark user as returning for next visit
        if (typeof window !== 'undefined') {
          localStorage.setItem('mortgage_calc_returning_user', 'true');
        }
      }

      setIsInitialized(true);
      setLastError(null);
    } catch (error) {
      console.error('Error initializing database session:', error);
      setLastError(error as Error);
      setIsInitialized(true); // Continue with offline mode
    }
  }, [consentGiven]);

  // Update session activity
  const updateSessionActivity = useCallback(async () => {
    if (!currentSessionId || !isHealthy) return;

    try {
      const sessionDuration = Date.now() - sessionStartTime;
      await db.updateSession(currentSessionId, {
        session_duration_ms: sessionDuration,
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to update session activity:', error);
      setLastError(error as Error);
    }
  }, [currentSessionId, isHealthy, sessionStartTime]);

  // End session
  const endSession = useCallback(async () => {
    if (!currentSessionId || !isHealthy) return;

    try {
      const sessionDuration = Date.now() - sessionStartTime;
      await db.updateSession(currentSessionId, {
        session_duration_ms: sessionDuration,
        updated_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }, [currentSessionId, isHealthy, sessionStartTime]);

  // Save calculation data
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
    rentVsBuyData?: any
  ) => {
    if (!currentSessionId || !isHealthy) {
      return { success: false, error: new Error('Database not available') };
    }

    try {
      const result = await db.saveCompleteCalculation(
        currentSessionId,
        appState,
        calculationResults,
        annuityData,
        linearData,
        rentVsBuyData
      );

      if (result.success) {
        // Update session calculation count
        await updateSessionActivity();
      }

      return result;
    } catch (error) {
      console.error('Failed to save calculation:', error);
      setLastError(error as Error);
      return { success: false, error: error as Error };
    }
  }, [currentSessionId, isHealthy, updateSessionActivity]);

  // Analytics integration methods
  const trackAnalyticsEvent = useCallback(async (event: AnalyticsEventInsert) => {
    if (!currentSessionId || !isHealthy || !consentGiven) return;

    try {
      await db.trackAnalyticsEvent({
        ...event,
        session_id: currentSessionId,
      });
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }
  }, [currentSessionId, isHealthy, consentGiven]);

  const trackTabNavigation = useCallback(async (event: TabNavigationEventInsert) => {
    if (!currentSessionId || !isHealthy || !consentGiven) return;

    try {
      await db.trackTabNavigation({
        ...event,
        session_id: currentSessionId,
      });
    } catch (error) {
      console.error('Failed to track tab navigation:', error);
    }
  }, [currentSessionId, isHealthy, consentGiven]);

  const trackFeatureUsage = useCallback(async (event: FeatureUsageEventInsert) => {
    if (!currentSessionId || !isHealthy || !consentGiven) return;

    try {
      await db.trackFeatureUsage({
        ...event,
        session_id: currentSessionId,
      });
    } catch (error) {
      console.error('Failed to track feature usage:', error);
    }
  }, [currentSessionId, isHealthy, consentGiven]);

  const trackParameterChange = useCallback(async (event: ParameterChangeEventInsert) => {
    if (!currentSessionId || !isHealthy || !consentGiven) return;

    try {
      await db.trackParameterChange({
        ...event,
        session_id: currentSessionId,
      });
    } catch (error) {
      console.error('Failed to track parameter change:', error);
    }
  }, [currentSessionId, isHealthy, consentGiven]);

  const trackError = useCallback(async (event: ErrorEventInsert) => {
    if (!currentSessionId || !isHealthy) return;

    try {
      await db.trackError({
        ...event,
        session_id: currentSessionId,
      });
    } catch (error) {
      console.error('Failed to track error event:', error);
    }
  }, [currentSessionId, isHealthy]);

  // Data retrieval methods
  const getCalculationHistory = useCallback(async (limit: number = 10): Promise<MortgageCalculation[]> => {
    if (!currentSessionId || !isHealthy) return [];

    try {
      const { data } = await db.getMortgageCalculations({
        date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // Last 30 days
      });
      return data?.slice(0, limit) || [];
    } catch (error) {
      console.error('Failed to get calculation history:', error);
      return [];
    }
  }, [currentSessionId, isHealthy]);

  const getSessionSummary = useCallback(async () => {
    if (!currentSessionId || !isHealthy) return null;

    try {
      const { data } = await db.getSessionInsights(currentSessionId);
      return data;
    } catch (error) {
      console.error('Failed to get session summary:', error);
      return null;
    }
  }, [currentSessionId, isHealthy]);

  // Utility methods
  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  const healthCheck = useCallback(async (): Promise<boolean> => {
    try {
      const healthy = await checkDatabaseHealth();
      setIsHealthy(healthy);
      return healthy;
    } catch (error) {
      setIsHealthy(false);
      return false;
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Update session activity periodically
  useEffect(() => {
    if (!isInitialized) return;

    const interval = setInterval(() => {
      updateSessionActivity();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [isInitialized, updateSessionActivity]);

  // End session on unmount
  useEffect(() => {
    return () => {
      endSession();
    };
  }, [endSession]);

  const contextValue: DatabaseContextType = {
    isInitialized,
    isHealthy,
    currentSessionId,
    lastError,
    initializeSession,
    updateSessionActivity,
    endSession,
    saveCalculation,
    trackAnalyticsEvent,
    trackTabNavigation,
    trackFeatureUsage,
    trackParameterChange,
    trackError,
    getCalculationHistory,
    getSessionSummary,
    clearError,
    healthCheck,
  };

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase(): DatabaseContextType {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}