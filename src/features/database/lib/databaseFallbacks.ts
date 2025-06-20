'use client';

import { AppState, MortgageData } from '@features/calculator/types/Types';

// Local storage keys for fallback data
const STORAGE_KEYS = {
  CALCULATIONS: 'mortgage_calc_saved_calculations',
  SESSION_DATA: 'mortgage_calc_session_data',
  USER_PREFERENCES: 'mortgage_calc_user_preferences',
  ANALYTICS_QUEUE: 'mortgage_calc_analytics_queue',
};

// Types for local storage data
interface SavedCalculation {
  id: string;
  timestamp: number;
  appState: AppState;
  calculationResults: {
    loan: number;
    cost: number;
    percentage: number;
    transferTax: number;
    transferTaxExempt: boolean;
  };
  annuityData: MortgageData;
  linearData: MortgageData;
  rentVsBuyData?: any;
}

interface AnalyticsQueueItem {
  id: string;
  timestamp: number;
  eventType: string;
  data: any;
  retryCount: number;
}

interface SessionData {
  sessionId: string;
  startTime: number;
  calculationCount: number;
  lastActivityTime: number;
}

/**
 * Local Storage Fallback System
 * Provides offline-first data storage with sync capabilities
 */
export class DatabaseFallbackService {
  private isLocalStorageAvailable = false;

  constructor() {
    this.isLocalStorageAvailable = this.checkLocalStorageAvailability();
  }

  private checkLocalStorageAvailability(): boolean {
    try {
      if (typeof window === 'undefined') return false;
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Save calculation data locally
   */
  async saveCalculationLocally(
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
  ): Promise<{ success: boolean; calculationId?: string; error?: Error }> {
    if (!this.isLocalStorageAvailable) {
      return { success: false, error: new Error('Local storage not available') };
    }

    try {
      const calculation: SavedCalculation = {
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        appState,
        calculationResults,
        annuityData,
        linearData,
        rentVsBuyData,
      };

      const existingCalculations = this.getLocalCalculations();
      const updatedCalculations = [calculation, ...existingCalculations];

      // Keep only the last 10 calculations to avoid storage bloat
      const trimmedCalculations = updatedCalculations.slice(0, 10);

      localStorage.setItem(STORAGE_KEYS.CALCULATIONS, JSON.stringify(trimmedCalculations));

      return { success: true, calculationId: calculation.id };
    } catch (error) {
      console.error('Failed to save calculation locally:', error);
      return { success: false, error: error as Error };
    }
  }

  /**
   * Get locally saved calculations
   */
  getLocalCalculations(): SavedCalculation[] {
    if (!this.isLocalStorageAvailable) return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CALCULATIONS);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to retrieve local calculations:', error);
      return [];
    }
  }

  /**
   * Queue analytics event for later sync
   */
  queueAnalyticsEvent(eventType: string, data: any): void {
    if (!this.isLocalStorageAvailable) return;

    try {
      const queuedEvent: AnalyticsQueueItem = {
        id: `queue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        eventType,
        data,
        retryCount: 0,
      };

      const existingQueue = this.getAnalyticsQueue();
      const updatedQueue = [...existingQueue, queuedEvent];

      // Keep only the last 50 events to avoid storage bloat
      const trimmedQueue = updatedQueue.slice(-50);

      localStorage.setItem(STORAGE_KEYS.ANALYTICS_QUEUE, JSON.stringify(trimmedQueue));
    } catch (error) {
      console.error('Failed to queue analytics event:', error);
    }
  }

  /**
   * Get queued analytics events
   */
  getAnalyticsQueue(): AnalyticsQueueItem[] {
    if (!this.isLocalStorageAvailable) return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ANALYTICS_QUEUE);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to retrieve analytics queue:', error);
      return [];
    }
  }

  /**
   * Clear queued analytics events after successful sync
   */
  clearAnalyticsQueue(eventIds: string[]): void {
    if (!this.isLocalStorageAvailable) return;

    try {
      const currentQueue = this.getAnalyticsQueue();
      const filteredQueue = currentQueue.filter(event => !eventIds.includes(event.id));
      localStorage.setItem(STORAGE_KEYS.ANALYTICS_QUEUE, JSON.stringify(filteredQueue));
    } catch (error) {
      console.error('Failed to clear analytics queue:', error);
    }
  }

  /**
   * Save session data
   */
  saveSessionData(sessionData: SessionData): void {
    if (!this.isLocalStorageAvailable) return;

    try {
      localStorage.setItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Failed to save session data:', error);
    }
  }

  /**
   * Get session data
   */
  getSessionData(): SessionData | null {
    if (!this.isLocalStorageAvailable) return null;

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SESSION_DATA);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to retrieve session data:', error);
      return null;
    }
  }

  /**
   * Save user preferences
   */
  saveUserPreferences(preferences: Record<string, any>): void {
    if (!this.isLocalStorageAvailable) return;

    try {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save user preferences:', error);
    }
  }

  /**
   * Get user preferences
   */
  getUserPreferences(): Record<string, any> {
    if (!this.isLocalStorageAvailable) return {};

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to retrieve user preferences:', error);
      return {};
    }
  }

  /**
   * Clear all local data
   */
  clearAllLocalData(): void {
    if (!this.isLocalStorageAvailable) return;

    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Failed to clear local data:', error);
    }
  }

  /**
   * Get storage usage information
   */
  getStorageUsage(): { used: number; available: number; percentage: number } {
    if (!this.isLocalStorageAvailable) {
      return { used: 0, available: 0, percentage: 0 };
    }

    try {
      let used = 0;
      Object.values(STORAGE_KEYS).forEach(key => {
        const value = localStorage.getItem(key);
        if (value) {
          used += new Blob([value]).size;
        }
      });

      // Estimate available storage (localStorage typically has 5-10MB limit)
      const estimatedLimit = 5 * 1024 * 1024; // 5MB
      const available = estimatedLimit - used;
      const percentage = (used / estimatedLimit) * 100;

      return { used, available, percentage };
    } catch (error) {
      console.error('Failed to calculate storage usage:', error);
      return { used: 0, available: 0, percentage: 0 };
    }
  }

  /**
   * Export data for user download
   */
  exportUserData(): string {
    const data = {
      calculations: this.getLocalCalculations(),
      sessionData: this.getSessionData(),
      userPreferences: this.getUserPreferences(),
      analyticsQueue: this.getAnalyticsQueue(),
      exportTimestamp: Date.now(),
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Import user data
   */
  importUserData(jsonData: string): { success: boolean; error?: Error } {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.calculations && Array.isArray(data.calculations)) {
        localStorage.setItem(STORAGE_KEYS.CALCULATIONS, JSON.stringify(data.calculations));
      }

      if (data.userPreferences && typeof data.userPreferences === 'object') {
        localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(data.userPreferences));
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }
}

// Create and export singleton instance
export const fallbackService = new DatabaseFallbackService();

/**
 * Enhanced error handler with retry logic and fallback mechanisms
 */
export class DatabaseErrorHandler {
  private maxRetries = 3;
  private retryDelay = 1000; // Base delay in ms

  async handleDatabaseError<T>(
    operation: () => Promise<T>,
    fallbackOperation: () => Promise<T> | T,
    context: {
      operationType: string;
      component: string;
      userData?: any;
    }
  ): Promise<T> {
    let lastError: Error | null = null;

    // Try the primary operation with retries
    for (let attempt = 0; attempt < this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        console.warn(`Database operation failed (attempt ${attempt + 1}/${this.maxRetries}):`, error);

        // Wait before retry with exponential backoff
        if (attempt < this.maxRetries - 1) {
          await new Promise(resolve => 
            setTimeout(resolve, this.retryDelay * Math.pow(2, attempt))
          );
        }
      }
    }

    // All retries failed, try fallback
    console.error(`All database retries failed for ${context.operationType}, using fallback:`, lastError);

    try {
      const fallbackResult = await fallbackOperation();
      
      // Track the fallback usage
      this.trackFallbackUsage(context, lastError);
      
      return fallbackResult;
    } catch (fallbackError) {
      console.error('Fallback operation also failed:', fallbackError);
      
      // Track complete failure
      this.trackCompleteFailure(context, lastError, fallbackError as Error);
      
      throw new Error(
        `Both primary and fallback operations failed. Primary: ${lastError?.message}, Fallback: ${(fallbackError as Error).message}`
      );
    }
  }

  private trackFallbackUsage(context: any, primaryError: Error | null): void {
    try {
      fallbackService.queueAnalyticsEvent('database_fallback_used', {
        operation_type: context.operationType,
        component: context.component,
        primary_error: primaryError?.message,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Failed to track fallback usage:', error);
    }
  }

  private trackCompleteFailure(
    context: any, 
    primaryError: Error | null, 
    fallbackError: Error
  ): void {
    try {
      fallbackService.queueAnalyticsEvent('database_complete_failure', {
        operation_type: context.operationType,
        component: context.component,
        primary_error: primaryError?.message,
        fallback_error: fallbackError.message,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Failed to track complete failure:', error);
    }
  }
}

// Create and export error handler instance
export const errorHandler = new DatabaseErrorHandler();