/**
 * Supabase Client and Database Service
 * Handles all database operations for the mortgage calculator
 * GDPR Compliant - Anonymous data only
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  UserSession,
  MortgageCalculation,
  MortgageResult,
  AnalyticsEvent,
  TabNavigationEvent,
  FeatureUsageEvent,
  ParameterChangeEvent,
  ErrorEvent,
  RentVsBuyAnalysis,
  PerformanceMetric,
  UserSessionInsert,
  MortgageCalculationInsert,
  MortgageResultInsert,
  AnalyticsEventInsert,
  TabNavigationEventInsert,
  FeatureUsageEventInsert,
  ParameterChangeEventInsert,
  ErrorEventInsert,
  RentVsBuyAnalysisInsert,
  PerformanceMetricInsert,
  SessionSummary,
  PopularFeature,
  CalculationTrend,
  SessionInsights,
  SessionFilter,
  CalculationFilter,
  AnalyticsFilter,
  DatabaseResponse,
  DatabaseListResponse,
  getUserSegment,
  getDeviceType,
  getBrowserType,
  hashUserAgent,
  transformAppStateToCalculation,
  transformMortgageDataToResult,
} from '../types/database';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

// Create Supabase client only if configured
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // No user authentication needed
        autoRefreshToken: false,
      },
      realtime: {
        params: {
          eventsPerSecond: 10, // Rate limiting for real-time events
        },
      },
    })
  : null;

/**
 * Database Service Class
 * Provides methods for all database operations with error handling and logging
 */
export class DatabaseService {
  private client: SupabaseClient | null;
  private currentSessionId: string | null = null;

  constructor(client: SupabaseClient | null) {
    this.client = client;
  }

  /**
   * Initialize a new user session
   */
  async initializeSession(sessionData: Partial<UserSessionInsert>): Promise<DatabaseResponse<UserSession>> {
    if (!this.client) {
      return { data: null, error: new Error('Supabase client not configured') };
    }

    try {
      const sessionInsert: UserSessionInsert = {
        session_id: sessionData.session_id || this.generateSessionId(),
        device_type: sessionData.device_type,
        browser_type: sessionData.browser_type,
        screen_resolution: sessionData.screen_resolution,
        timezone: sessionData.timezone,
        language: sessionData.language,
        user_agent_hash: sessionData.user_agent_hash,
        is_returning_user: sessionData.is_returning_user || false,
        user_segment: sessionData.user_segment,
        session_duration_ms: 0,
        page_views: 0,
        calculations_count: 0,
        tabs_navigated: 0,
        analytics_consent_given: sessionData.analytics_consent_given || false,
        consent_timestamp: sessionData.consent_timestamp,
        referrer_domain: sessionData.referrer_domain,
        utm_source: sessionData.utm_source,
        utm_medium: sessionData.utm_medium,
        utm_campaign: sessionData.utm_campaign,
      };

      const { data, error } = await this.client
        .from('user_sessions')
        .insert(sessionInsert)
        .select()
        .single();

      if (data) {
        this.currentSessionId = data.id;
      }

      return { data, error };
    } catch (error) {
      console.error('Error initializing session:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update session metadata
   */
  async updateSession(
    sessionId: string,
    updates: Partial<UserSession>
  ): Promise<DatabaseResponse<UserSession>> {
    if (!this.client) {
      return { data: null, error: new Error('Supabase client not configured') };
    }

    try {
      const { data, error } = await this.client
        .from('user_sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error updating session:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Save mortgage calculation
   */
  async saveMortgageCalculation(
    calculation: MortgageCalculationInsert
  ): Promise<DatabaseResponse<MortgageCalculation>> {
    if (!this.client) {
      return { data: null, error: new Error('Supabase client not configured') };
    }

    try {
      const { data, error } = await this.client
        .from('mortgage_calculations')
        .insert(calculation)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error saving mortgage calculation:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Save mortgage results (annuity and linear)
   */
  async saveMortgageResults(
    results: MortgageResultInsert[]
  ): Promise<DatabaseResponse<MortgageResult[]>> {
    if (!this.client) {
      return { data: null, error: new Error('Supabase client not configured') };
    }

    try {
      const { data, error } = await this.client
        .from('mortgage_results')
        .insert(results)
        .select();

      return { data, error };
    } catch (error) {
      console.error('Error saving mortgage results:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Save rent vs buy analysis
   */
  async saveRentVsBuyAnalysis(
    analysis: RentVsBuyAnalysisInsert
  ): Promise<DatabaseResponse<RentVsBuyAnalysis>> {
    if (!this.client) {
      return { data: null, error: new Error('Supabase client not configured') };
    }

    try {
      const { data, error } = await this.client
        .from('rent_vs_buy_analysis')
        .insert(analysis)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error saving rent vs buy analysis:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Track analytics event
   */
  async trackAnalyticsEvent(
    event: AnalyticsEventInsert
  ): Promise<DatabaseResponse<AnalyticsEvent>> {
    if (!this.client) {
      return { data: null, error: new Error('Supabase client not configured') };
    }

    try {
      const { data, error } = await this.client
        .from('analytics_events')
        .insert(event)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error tracking analytics event:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Track tab navigation
   */
  async trackTabNavigation(
    event: TabNavigationEventInsert
  ): Promise<DatabaseResponse<TabNavigationEvent>> {
    if (!this.client) {
      return { data: null, error: new Error('Supabase client not configured') };
    }

    try {
      const { data, error } = await this.client
        .from('tab_navigation_events')
        .insert(event)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error tracking tab navigation:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Track feature usage
   */
  async trackFeatureUsage(
    event: FeatureUsageEventInsert
  ): Promise<DatabaseResponse<FeatureUsageEvent>> {
    if (!this.client) {
      return { data: null, error: new Error('Supabase client not configured') };
    }

    try {
      const { data, error } = await this.client
        .from('feature_usage_events')
        .insert(event)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error tracking feature usage:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Track parameter change
   */
  async trackParameterChange(
    event: ParameterChangeEventInsert
  ): Promise<DatabaseResponse<ParameterChangeEvent>> {
    if (!this.client) {
      return { data: null, error: new Error('Supabase client not configured') };
    }

    try {
      const { data, error } = await this.client
        .from('parameter_change_events')
        .insert(event)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error tracking parameter change:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Track error event
   */
  async trackError(
    event: ErrorEventInsert
  ): Promise<DatabaseResponse<ErrorEvent>> {
    if (!this.client) {
      return { data: null, error: new Error('Supabase client not configured') };
    }

    try {
      const { data, error } = await this.client
        .from('error_events')
        .insert(event)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error tracking error event:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Track performance metric
   */
  async trackPerformanceMetric(
    metric: PerformanceMetricInsert
  ): Promise<DatabaseResponse<PerformanceMetric>> {
    if (!this.client) {
      return { data: null, error: new Error('Supabase client not configured') };
    }

    try {
      const { data, error } = await this.client
        .from('performance_metrics')
        .insert(metric)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Error tracking performance metric:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get session summary
   */
  async getSessionSummary(
    filter?: SessionFilter
  ): Promise<DatabaseListResponse<SessionSummary>> {
    if (!this.client) {
      return { data: null, error: new Error('Supabase client not configured') };
    }

    try {
      let query = this.client
        .from('session_summary')
        .select('*');

      if (filter) {
        if (filter.user_segment) query = query.eq('user_segment', filter.user_segment);
        if (filter.device_type) query = query.eq('device_type', filter.device_type);
        if (filter.browser_type) query = query.eq('browser_type', filter.browser_type);
        if (filter.date_from) query = query.gte('created_at', filter.date_from);
        if (filter.date_to) query = query.lte('created_at', filter.date_to);
        if (filter.is_returning_user !== undefined) query = query.eq('is_returning_user', filter.is_returning_user);
        if (filter.has_calculations) query = query.gt('actual_calculations', 0);
        if (filter.has_errors) query = query.gt('error_count', 0);
      }

      const { data, error, count } = await query;

      return { data, error, count: count ?? undefined };
    } catch (error) {
      console.error('Error getting session summary:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get popular features
   */
  async getPopularFeatures(
    limit: number = 20
  ): Promise<DatabaseListResponse<PopularFeature>> {
    if (!this.client) {
      return { data: null, error: new Error('Supabase client not configured') };
    }

    try {
      const { data, error } = await this.client
        .from('popular_features')
        .select('*')
        .order('usage_count', { ascending: false })
        .limit(limit);

      return { data, error };
    } catch (error) {
      console.error('Error getting popular features:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get calculation trends
   */
  async getCalculationTrends(
    days: number = 30
  ): Promise<DatabaseListResponse<CalculationTrend>> {
    if (!this.client) {
      return { data: null, error: new Error('Supabase client not configured') };
    }

    try {
      const { data, error } = await this.client
        .from('calculation_trends')
        .select('*')
        .gte('calculation_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
        .order('calculation_date', { ascending: false });

      return { data, error };
    } catch (error) {
      console.error('Error getting calculation trends:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get session insights
   */
  async getSessionInsights(sessionId: string): Promise<DatabaseResponse<SessionInsights>> {
    if (!this.client) {
      return { data: null, error: new Error('Supabase client not configured') };
    }

    try {
      const { data, error } = await this.client
        .rpc('get_session_insights', { session_uuid: sessionId });

      return { data: data?.[0] || null, error };
    } catch (error) {
      console.error('Error getting session insights:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get mortgage calculations with filters
   */
  async getMortgageCalculations(
    filter?: CalculationFilter
  ): Promise<DatabaseListResponse<MortgageCalculation>> {
    if (!this.client) {
      return { data: null, error: new Error('Supabase client not configured') };
    }

    try {
      let query = this.client
        .from('mortgage_calculations')
        .select('*');

      if (filter) {
        if (filter.user_segment) query = query.eq('user_segment', filter.user_segment);
        if (filter.price_min) query = query.gte('property_price', filter.price_min);
        if (filter.price_max) query = query.lte('property_price', filter.price_max);
        if (filter.interest_rate_min) query = query.gte('interest_rate', filter.interest_rate_min);
        if (filter.interest_rate_max) query = query.lte('interest_rate', filter.interest_rate_max);
        if (filter.is_first_time_buyer !== undefined) query = query.eq('is_first_time_buyer', filter.is_first_time_buyer);
        if (filter.date_from) query = query.gte('created_at', filter.date_from);
        if (filter.date_to) query = query.lte('created_at', filter.date_to);
        if (filter.calculation_status) query = query.eq('calculation_status', filter.calculation_status);
      }

      const { data, error, count } = await query;

      return { data, error, count: count ?? undefined };
    } catch (error) {
      console.error('Error getting mortgage calculations:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get analytics events with filters
   */
  async getAnalyticsEvents(
    filter?: AnalyticsFilter
  ): Promise<DatabaseListResponse<AnalyticsEvent>> {
    if (!this.client) {
      return { data: null, error: new Error('Supabase client not configured') };
    }

    try {
      let query = this.client
        .from('analytics_events')
        .select('*');

      if (filter) {
        if (filter.event_type) query = query.eq('event_type', filter.event_type);
        if (filter.session_id) query = query.eq('session_id', filter.session_id);
        if (filter.date_from) query = query.gte('created_at', filter.date_from);
        if (filter.date_to) query = query.lte('created_at', filter.date_to);
      }

      const { data, error, count } = await query;

      return { data, error, count: count ?? undefined };
    } catch (error) {
      console.error('Error getting analytics events:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Batch save complete calculation data with enhanced error handling
   */
  async saveCompleteCalculation(
    sessionId: string,
    appState: any,
    calculationResults: any,
    annuityData: any,
    linearData: any,
    rentVsBuyData?: any
  ): Promise<{ success: boolean; calculationId?: string; error?: Error }> {
    try {
      const calculationId = this.generateCalculationId();
      const startTime = Date.now();
      
      // Transform and save mortgage calculation
      const calculationInsert = transformAppStateToCalculation(
        appState,
        sessionId,
        calculationId,
        calculationResults
      );

      // Add calculation timing
      calculationInsert.calculation_duration_ms = Date.now() - startTime;

      const { data: calculation, error: calcError } = await this.saveMortgageCalculation(calculationInsert);
      if (calcError || !calculation) {
        throw calcError || new Error('Failed to save calculation');
      }

      // Save mortgage results
      const results = [
        transformMortgageDataToResult(annuityData, calculation.id, 'annuity'),
        transformMortgageDataToResult(linearData, calculation.id, 'linear'),
      ];

      const { error: resultsError } = await this.saveMortgageResults(results);
      if (resultsError) {
        throw resultsError;
      }

      // Save rent vs buy analysis if provided
      if (rentVsBuyData) {
        const rentVsBuyInsert: RentVsBuyAnalysisInsert = {
          calculation_id: calculation.id,
          property_price: appState.price,
          monthly_rent: appState.rent,
          property_appreciation_rate: appState.propertyAppreciationRate,
          comparison_period_years: appState.comparisonPeriodYears,
          break_even_year: rentVsBuyData.breakEvenYear,
          total_buying_cost: rentVsBuyData.totalBuyingCost,
          total_renting_cost: rentVsBuyData.totalRentingCost,
          net_worth_difference: rentVsBuyData.netWorthDifference,
          yearly_breakdown: rentVsBuyData.yearlyBreakdown,
        };

        const { error: rentVsBuyError } = await this.saveRentVsBuyAnalysis(rentVsBuyInsert);
        if (rentVsBuyError) {
          console.warn('Failed to save rent vs buy analysis:', rentVsBuyError);
        }
      }

      // Update session calculation count
      const calculationCount = await this.getSessionCalculationCount(sessionId);
      await this.updateSession(sessionId, {
        calculations_count: calculationCount + 1,
      });

      return { success: true, calculationId: calculation.id };
    } catch (error) {
      console.error('Error saving complete calculation:', error);
      
      // Track the error
      try {
        await this.trackError({
          session_id: sessionId,
          error_type: 'database_save_error',
          error_message: (error as Error).message,
          error_stack: (error as Error).stack,
          component_name: 'DatabaseService',
          user_action: 'save_calculation',
        });
      } catch (trackError) {
        console.error('Failed to track save error:', trackError);
      }

      return { success: false, error: error as Error };
    }
  }

  /**
   * Save calculation with retry logic
   */
  async saveCalculationWithRetry(
    sessionId: string,
    appState: any,
    calculationResults: any,
    annuityData: any,
    linearData: any,
    rentVsBuyData?: any,
    maxRetries: number = 3
  ): Promise<{ success: boolean; calculationId?: string; error?: Error; retries?: number }> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const result = await this.saveCompleteCalculation(
          sessionId,
          appState,
          calculationResults,
          annuityData,
          linearData,
          rentVsBuyData
        );

        if (result.success) {
          return { ...result, retries: attempt };
        }

        lastError = result.error || new Error('Unknown error');
        
        // Wait before retry (exponential backoff)
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      } catch (error) {
        lastError = error as Error;
        
        // Wait before retry
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    return { success: false, error: lastError!, retries: maxRetries };
  }

  /**
   * Get recent calculations for a session
   */
  async getRecentCalculations(
    sessionId: string,
    limit: number = 5
  ): Promise<DatabaseListResponse<MortgageCalculation>> {
    if (!this.client) {
      return { data: null, error: new Error('Supabase client not configured') };
    }

    try {
      const { data, error } = await this.client
        .from('mortgage_calculations')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(limit);

      return { data, error };
    } catch (error) {
      console.error('Error getting recent calculations:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get calculation with full results
   */
  async getCalculationWithResults(
    calculationId: string
  ): Promise<DatabaseResponse<any>> {
    if (!this.client) {
      return { data: null, error: new Error('Supabase client not configured') };
    }

    try {
      const { data: calculation, error: calcError } = await this.client
        .from('mortgage_calculations')
        .select('*')
        .eq('id', calculationId)
        .single();

      if (calcError || !calculation) {
        return { data: null, error: calcError || new Error('Calculation not found') };
      }

      const { data: results, error: resultsError } = await this.client
        .from('mortgage_results')
        .select('*')
        .eq('calculation_id', calculationId);

      const { data: rentVsBuy, error: rentVsBuyError } = await this.client
        .from('rent_vs_buy_analysis')
        .select('*')
        .eq('calculation_id', calculationId)
        .single();

      return {
        data: {
          calculation,
          results: results || [],
          rentVsBuyAnalysis: rentVsBuy || null,
        },
        error: null,
      };
    } catch (error) {
      console.error('Error getting calculation with results:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Delete old calculations to manage storage
   */
  async cleanupOldCalculations(daysToKeep: number = 90): Promise<{ deletedCount: number; error?: Error }> {
    if (!this.client) {
      return { deletedCount: 0, error: new Error('Supabase client not configured') };
    }

    try {
      const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000).toISOString();

      // Get calculations to delete
      const { data: calculationsToDelete, error: selectError } = await this.client
        .from('mortgage_calculations')
        .select('id')
        .lt('created_at', cutoffDate);

      if (selectError || !calculationsToDelete) {
        return { deletedCount: 0, error: selectError || new Error('Failed to select calculations') };
      }

      if (calculationsToDelete.length === 0) {
        return { deletedCount: 0 };
      }

      const calculationIds = calculationsToDelete.map(calc => calc.id);

      // Delete related data first (foreign key constraints)
      await this.client
        .from('mortgage_results')
        .delete()
        .in('calculation_id', calculationIds);

      await this.client
        .from('rent_vs_buy_analysis')
        .delete()
        .in('calculation_id', calculationIds);

      // Delete calculations
      const { error: deleteError } = await this.client
        .from('mortgage_calculations')
        .delete()
        .in('id', calculationIds);

      if (deleteError) {
        return { deletedCount: 0, error: deleteError };
      }

      return { deletedCount: calculationsToDelete.length };
    } catch (error) {
      console.error('Error cleaning up old calculations:', error);
      return { deletedCount: 0, error: error as Error };
    }
  }

  /**
   * Helper methods
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCalculationId(): string {
    return `calc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async getSessionCalculationCount(sessionId: string): Promise<number> {
    if (!this.client) return 0;

    const { count } = await this.client
      .from('mortgage_calculations')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', sessionId);

    return count || 0;
  }
}

// Create and export database service instance
export const db = new DatabaseService(supabase);

/**
 * Helper functions for browser environment detection
 */
export function createSessionData(): Partial<UserSessionInsert> {
  if (typeof window === 'undefined') {
    return {};
  }

  const userAgent = navigator.userAgent;
  
  return {
    device_type: getDeviceType(userAgent),
    browser_type: getBrowserType(userAgent),
    screen_resolution: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language,
    user_agent_hash: hashUserAgent(userAgent),
    is_returning_user: localStorage.getItem('mortgage_calc_returning_user') === 'true',
    referrer_domain: document.referrer ? new URL(document.referrer).hostname : undefined,
    // UTM parameters would be extracted from URL
    utm_source: new URLSearchParams(window.location.search).get('utm_source') || undefined,
    utm_medium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
    utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined,
  };
}

/**
 * Real-time subscriptions for analytics (optional)
 */
export function subscribeToSessionEvents(
  sessionId: string,
  callback: (payload: any) => void
) {
  if (!supabase) {
    console.warn('Supabase not configured - real-time subscriptions unavailable');
    return null;
  }

  return supabase
    .channel(`session:${sessionId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'analytics_events',
        filter: `session_id=eq.${sessionId}`,
      },
      callback
    )
    .subscribe();
}

/**
 * Health check function
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  if (!supabase) {
    console.warn('Supabase not configured - running in offline mode');
    return false;
  }

  try {
    const { error } = await supabase
      .from('user_sessions')
      .select('id')
      .limit(1);

    return !error;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Export types for convenience
export * from '../types/database';