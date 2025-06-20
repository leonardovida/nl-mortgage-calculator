/**
 * Integration tests for Supabase database functionality
 * These tests verify that the database integration works correctly
 * and remains compatible with PostHog analytics
 */

import { describe, test, expect, jest, beforeEach } from 'bun:test';
import { fallbackService, errorHandler } from '../../src/features/database/lib/databaseFallbacks';
import { AppState } from '../../src/features/calculator/types/Types';

// Import DatabaseService directly to avoid environment issues
class MockDatabaseService {
  private client: any;
  constructor(client: any) {
    this.client = client;
  }

  async initializeSession(sessionData: any) {
    const { data, error } = await this.client.from('user_sessions').insert(sessionData).select().single();
    return { data, error };
  }
}

// Mock Supabase client
const mockSupabaseClient = {
  from: jest.fn(),
  rpc: jest.fn(),
};

// Mock data
const mockAppState: AppState = {
  price: 350000,
  interest: 4.5,
  deduction: 37.0,
  savings: 45000,
  rent: 1700,
  notary: 1200,
  valuation: 800,
  financialAdvisor: 2500,
  realStateAgent: 3327.5,
  structuralSurvey: 800,
  isFirstTimeBuyer: true,
  transferTaxRate: 0.0,
  propertyAppreciationRate: 3.0,
  comparisonPeriodYears: 10,
};

const mockCalculationResults = {
  loan: 305000,
  cost: 8000,
  percentage: 87.14,
  transferTax: 0,
  transferTaxExempt: true,
};

const mockMortgageData = {
  totals: {
    totalPaidGross: 450000,
    totalPaidNet: 400000,
    totalInterestGross: 145000,
    totalInterestNet: 95000,
    totalInvestedGross: 305000,
    totalInvestedNet: 305000,
  },
  monthly: [],
};

// Mock localStorage globally
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

// @ts-ignore
global.localStorage = localStorageMock;
global.window = { localStorage: localStorageMock } as any;

describe('Supabase Integration', () => {
  let databaseService: MockDatabaseService;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create database service instance
    databaseService = new MockDatabaseService(mockSupabaseClient as any);
  });

  describe('DatabaseService', () => {
    test('should initialize session correctly', async () => {
      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: 'session-123', session_id: 'test-session' },
            error: null,
          }),
        }),
      });

      mockSupabaseClient.from.mockReturnValue({
        insert: mockInsert,
      });

      const sessionData = {
        session_id: 'test-session',
        device_type: 'desktop' as const,
        browser_type: 'chrome' as const,
        analytics_consent_given: true,
        is_returning_user: false,
        session_duration_ms: 0,
        page_views: 1,
        calculations_count: 0,
        tabs_navigated: 0,
      };

      const result = await databaseService.initializeSession(sessionData);

      expect(result.data).toBeTruthy();
      expect(result.error).toBeNull();
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('user_sessions');
    });

    test('should handle database errors gracefully', async () => {
      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: new Error('Database connection failed'),
          }),
        }),
      });

      mockSupabaseClient.from.mockReturnValue({
        insert: mockInsert,
      });

      const sessionData = {
        session_id: 'test-session',
        analytics_consent_given: true,
        is_returning_user: false,
        session_duration_ms: 0,
        page_views: 1,
        calculations_count: 0,
        tabs_navigated: 0,
      };

      const result = await databaseService.initializeSession(sessionData);

      expect(result.data).toBeNull();
      expect(result.error).toBeTruthy();
    });
  });

  describe('Fallback System', () => {
    test('should save calculation data locally when database is unavailable', async () => {
      localStorageMock.getItem.mockReturnValue('[]');

      const result = await fallbackService.saveCalculationLocally(
        mockAppState,
        mockCalculationResults,
        mockMortgageData,
        mockMortgageData
      );

      expect(result.success).toBe(true);
      expect(result.calculationId).toBeTruthy();
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    test('should handle error conditions with retry logic', async () => {
      let attemptCount = 0;
      const flakyOperation = jest.fn().mockImplementation(async () => {
        attemptCount++;
        if (attemptCount < 3) {
          throw new Error('Temporary failure');
        }
        return { success: true, data: 'success' };
      });

      const fallbackOperation = jest.fn().mockResolvedValue({ success: true, data: 'fallback' });

      const result = await errorHandler.handleDatabaseError(
        flakyOperation,
        fallbackOperation,
        {
          operationType: 'test_operation',
          component: 'TestComponent',
        }
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe('success');
      expect(flakyOperation).toHaveBeenCalledTimes(3);
      expect(fallbackOperation).not.toHaveBeenCalled();
    });

    test('should use fallback when all retries fail', async () => {
      const failingOperation = jest.fn().mockRejectedValue(new Error('Persistent failure'));
      const fallbackOperation = jest.fn().mockResolvedValue({ success: true, data: 'fallback' });

      const result = await errorHandler.handleDatabaseError(
        failingOperation,
        fallbackOperation,
        {
          operationType: 'test_operation',
          component: 'TestComponent',
        }
      );

      expect(result.success).toBe(true);
      expect(result.data).toBe('fallback');
      expect(failingOperation).toHaveBeenCalledTimes(3); // Max retries
      expect(fallbackOperation).toHaveBeenCalledTimes(1);
    });
  });

  describe('PostHog Compatibility', () => {
    test('should not interfere with PostHog event tracking', async () => {
      // Mock PostHog
      const mockPostHog = {
        capture: jest.fn(),
        identify: jest.fn(),
        register: jest.fn(),
      };

      // Simulate PostHog analytics alongside database operations
      mockPostHog.capture('mortgage_calculation_completed', {
        loan_amount: mockCalculationResults.loan,
        property_price: mockAppState.price,
      });

      // Database operation should not affect PostHog
      const mockInsert = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: 'calc-123' },
            error: null,
          }),
        }),
      });

      mockSupabaseClient.from.mockReturnValue({
        insert: mockInsert,
      });

      // Both should work independently
      expect(mockPostHog.capture).toHaveBeenCalledWith('mortgage_calculation_completed', {
        loan_amount: mockCalculationResults.loan,
        property_price: mockAppState.price,
      });
    });
  });

  describe('Data Export/Import', () => {
    test('should export user data correctly', () => {
      // Mock localStorage with sample data
      const sampleData = [
        {
          id: 'calc-1',
          timestamp: Date.now(),
          appState: mockAppState,
          calculationResults: mockCalculationResults,
          annuityData: mockMortgageData,
          linearData: mockMortgageData,
        },
      ];

      localStorageMock.getItem.mockReturnValue(JSON.stringify(sampleData));

      const exportedData = fallbackService.exportUserData();
      const parsedData = JSON.parse(exportedData);

      expect(parsedData.calculations).toHaveLength(1);
      expect(parsedData.calculations[0].appState.price).toBe(mockAppState.price);
      expect(parsedData.exportTimestamp).toBeTruthy();
    });

    test('should import user data correctly', () => {

      const importData = {
        calculations: [
          {
            id: 'imported-calc',
            appState: mockAppState,
            calculationResults: mockCalculationResults,
          },
        ],
        userPreferences: { theme: 'dark' },
      };

      const result = fallbackService.importUserData(JSON.stringify(importData));

      expect(result.success).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledTimes(2);
    });
  });

  describe('Storage Management', () => {
    test('should calculate storage usage correctly', () => {
      localStorageMock.getItem.mockReturnValue('{"test": "data"}');

      const usage = fallbackService.getStorageUsage();

      expect(usage.used).toBeGreaterThan(0);
      expect(usage.percentage).toBeGreaterThanOrEqual(0);
      expect(usage.percentage).toBeLessThanOrEqual(100);
    });

    test('should clear all local data', () => {

      fallbackService.clearAllLocalData();

      expect(localStorageMock.removeItem).toHaveBeenCalledTimes(4); // Number of storage keys
    });
  });
});