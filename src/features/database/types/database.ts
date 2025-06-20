/**
 * Supabase Database Types
 * Auto-generated TypeScript types for the mortgage calculator database schema
 * GDPR Compliant - No PII stored, anonymous data only
 */

// Enum types from the database
export type UserSegment = 'starter' | 'mid_market' | 'premium' | 'luxury';
export type DeviceType = 'desktop' | 'mobile' | 'tablet';
export type BrowserType = 'chrome' | 'firefox' | 'safari' | 'edge' | 'other';
export type MortgageType = 'annuity' | 'linear' | 'both';
export type TabCategory = 'info' | 'calculation';
export type InfoTab = 'mortgage' | 'cost' | 'interest' | 'rentbuy';
export type CalculationTab = 'annuity' | 'linear' | 'graph';
export type CalculationStatus = 'pending' | 'completed' | 'error';

// Database table interfaces
export interface UserSession {
  id: string;
  session_id: string;
  created_at: string;
  updated_at: string;
  
  // Session metadata (no PII)
  device_type?: DeviceType;
  browser_type?: BrowserType;
  screen_resolution?: string;
  timezone?: string;
  language?: string;
  user_agent_hash?: string;
  
  // User characteristics
  is_returning_user: boolean;
  user_segment?: UserSegment;
  
  // Session activity
  session_duration_ms: number;
  page_views: number;
  calculations_count: number;
  tabs_navigated: number;
  
  // Consent tracking
  analytics_consent_given: boolean;
  consent_timestamp?: string;
  
  // Referrer information (anonymized)
  referrer_domain?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface MortgageCalculation {
  id: string;
  session_id: string;
  calculation_id: string;
  created_at: string;
  
  // Mortgage parameters
  property_price: number;
  interest_rate: number;
  tax_deduction_rate: number;
  savings_amount: number;
  monthly_rent: number;
  
  // Purchase costs
  notary_cost: number;
  valuation_cost: number;
  financial_advisor_cost: number;
  real_estate_agent_cost: number;
  structural_survey_cost: number;
  
  // Tax settings
  is_first_time_buyer: boolean;
  transfer_tax_rate: number;
  
  // Rent vs Buy comparison
  property_appreciation_rate: number;
  comparison_period_years: number;
  
  // Calculated results
  loan_amount: number;
  total_cost: number;
  loan_to_value_percentage: number;
  transfer_tax_amount: number;
  transfer_tax_exempt: boolean;
  
  // Calculation metadata
  calculation_status: CalculationStatus;
  calculation_duration_ms?: number;
  error_message?: string;
  user_segment?: UserSegment;
}

export interface MonthlyPaymentData {
  month: number;
  balance: number;
  grossPaid: number;
  capitalPaid: number;
  interest: number;
  deduction: number;
  netPaid: number;
}

export interface MortgageResult {
  id: string;
  calculation_id: string;
  mortgage_type: MortgageType;
  created_at: string;
  
  // Totals for the mortgage type
  total_paid_gross: number;
  total_paid_net: number;
  total_interest_gross: number;
  total_interest_net: number;
  total_invested_gross: number;
  total_invested_net: number;
  
  // Monthly payment data
  monthly_payments: MonthlyPaymentData[];
}

export interface AnalyticsEvent {
  id: string;
  session_id: string;
  event_type: string;
  created_at: string;
  
  // Event properties (flexible structure)
  properties: Record<string, any>;
  
  // Common event metadata
  page_url?: string;
  page_title?: string;
  referrer?: string;
  
  // User context
  device_type?: DeviceType;
  browser_type?: BrowserType;
}

export interface TabNavigationEvent {
  id: string;
  session_id: string;
  created_at: string;
  
  // Navigation details
  from_tab?: string;
  to_tab: string;
  tab_category: TabCategory;
  navigation_method: string;
  
  // Timing
  time_spent_on_previous_tab?: number;
  
  // Context
  calculation_id?: string;
}

export interface FeatureUsageEvent {
  id: string;
  session_id: string;
  created_at: string;
  
  // Feature details
  feature_name: string;
  feature_category: string;
  action: string;
  
  // Feature value/context
  feature_value?: string;
  feature_context: Record<string, any>;
  
  // Associated calculation
  calculation_id?: string;
}

export interface ParameterChangeEvent {
  id: string;
  session_id: string;
  calculation_id: string;
  created_at: string;
  
  // Parameter details
  parameter_name: string;
  parameter_category: string;
  field_type: string;
  component_name: string;
  
  // Value changes
  previous_value?: string;
  new_value: string;
  
  // Validation
  validation_errors: string[];
}

export interface ErrorEvent {
  id: string;
  session_id: string;
  created_at: string;
  
  // Error details
  error_type: string;
  error_message: string;
  error_stack?: string;
  
  // Context
  component_name?: string;
  user_action?: string;
  calculation_id?: string;
  
  // Environment
  browser_type?: BrowserType;
  device_type?: DeviceType;
  user_agent_hash?: string;
}

export interface RentVsBuyAnalysis {
  id: string;
  calculation_id: string;
  created_at: string;
  
  // Analysis parameters
  property_price: number;
  monthly_rent: number;
  property_appreciation_rate: number;
  comparison_period_years: number;
  
  // Results summary
  break_even_year?: number;
  total_buying_cost: number;
  total_renting_cost: number;
  net_worth_difference: number;
  
  // Year-by-year breakdown
  yearly_breakdown: YearlyBreakdown[];
}

export interface YearlyBreakdown {
  year: number;
  buying_cost: number;
  renting_cost: number;
  property_value: number;
  mortgage_balance: number;
  equity: number;
  net_worth_buying: number;
  net_worth_renting: number;
}

export interface PerformanceMetric {
  id: string;
  session_id: string;
  created_at: string;
  
  // Metric details
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  
  // Context
  calculation_id?: string;
  component_name?: string;
  
  // Environment
  device_type?: DeviceType;
  browser_type?: BrowserType;
}

// View types for analytics queries
export interface SessionSummary {
  id: string;
  session_id: string;
  created_at: string;
  device_type?: DeviceType;
  browser_type?: BrowserType;
  user_segment?: UserSegment;
  is_returning_user: boolean;
  calculations_count: number;
  page_views: number;
  session_duration_ms: number;
  actual_calculations: number;
  avg_property_price?: number;
  error_count: number;
}

export interface PopularFeature {
  feature_name: string;
  feature_category: string;
  action: string;
  usage_count: number;
  unique_sessions: number;
  usage_date: string;
}

export interface CalculationTrend {
  calculation_date: string;
  user_segment?: UserSegment;
  calculation_count: number;
  avg_property_price: number;
  avg_loan_amount: number;
  avg_interest_rate: number;
  first_time_buyer_count: number;
  tax_exempt_count: number;
}

export interface PerformanceDashboard {
  time_bucket: string;
  metric_name: string;
  avg_value: number;
  min_value: number;
  max_value: number;
  median_value: number;
  p95_value: number;
  sample_count: number;
}

// Function result types
export interface SessionInsights {
  total_calculations: number;
  avg_property_price?: number;
  most_used_feature?: string;
  session_duration_minutes: number;
  error_count: number;
}

// Insert types (for creating new records)
export type UserSessionInsert = Omit<UserSession, 'id' | 'created_at' | 'updated_at'>;
export type MortgageCalculationInsert = Omit<MortgageCalculation, 'id' | 'created_at'>;
export type MortgageResultInsert = Omit<MortgageResult, 'id' | 'created_at'>;
export type AnalyticsEventInsert = Omit<AnalyticsEvent, 'id' | 'created_at'>;
export type TabNavigationEventInsert = Omit<TabNavigationEvent, 'id' | 'created_at'>;
export type FeatureUsageEventInsert = Omit<FeatureUsageEvent, 'id' | 'created_at'>;
export type ParameterChangeEventInsert = Omit<ParameterChangeEvent, 'id' | 'created_at'>;
export type ErrorEventInsert = Omit<ErrorEvent, 'id' | 'created_at'>;
export type RentVsBuyAnalysisInsert = Omit<RentVsBuyAnalysis, 'id' | 'created_at'>;
export type PerformanceMetricInsert = Omit<PerformanceMetric, 'id' | 'created_at'>;

// Update types (for updating existing records)
export type UserSessionUpdate = Partial<Omit<UserSession, 'id' | 'session_id' | 'created_at'>>;
export type MortgageCalculationUpdate = Partial<Omit<MortgageCalculation, 'id' | 'session_id' | 'calculation_id' | 'created_at'>>;

// Database response types
export interface DatabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface DatabaseListResponse<T> {
  data: T[] | null;
  error: Error | null;
  count?: number;
}

// Utility types for common queries
export interface MortgageCalculationWithResults extends MortgageCalculation {
  mortgage_results: MortgageResult[];
  rent_vs_buy_analysis?: RentVsBuyAnalysis;
}

export interface SessionWithCalculations extends UserSession {
  mortgage_calculations: MortgageCalculation[];
  analytics_events: AnalyticsEvent[];
  error_events: ErrorEvent[];
}

// Query filter types
export interface SessionFilter {
  user_segment?: UserSegment;
  device_type?: DeviceType;
  browser_type?: BrowserType;
  date_from?: string;
  date_to?: string;
  is_returning_user?: boolean;
  has_calculations?: boolean;
  has_errors?: boolean;
}

export interface CalculationFilter {
  user_segment?: UserSegment;
  price_min?: number;
  price_max?: number;
  interest_rate_min?: number;
  interest_rate_max?: number;
  is_first_time_buyer?: boolean;
  date_from?: string;
  date_to?: string;
  calculation_status?: CalculationStatus;
}

export interface AnalyticsFilter {
  event_type?: string;
  feature_name?: string;
  parameter_name?: string;
  error_type?: string;
  date_from?: string;
  date_to?: string;
  session_id?: string;
}

// Analytics aggregation types
export interface EventAggregation {
  event_type: string;
  count: number;
  unique_sessions: number;
  avg_value?: number;
  date: string;
}

export interface FeatureAggregation {
  feature_name: string;
  feature_category: string;
  total_usage: number;
  unique_users: number;
  avg_session_usage: number;
  retention_rate: number;
}

export interface ParameterAggregation {
  parameter_name: string;
  parameter_category: string;
  change_count: number;
  avg_change_frequency: number;
  most_common_value: string;
  value_distribution: Record<string, number>;
}

// Export all types as a single namespace for convenience
export namespace Database {
  export type UserSessionType = UserSession;
  export type MortgageCalculationType = MortgageCalculation;
  export type MortgageResultType = MortgageResult;
  export type AnalyticsEventType = AnalyticsEvent;
  export type TabNavigationEventType = TabNavigationEvent;
  export type FeatureUsageEventType = FeatureUsageEvent;
  export type ParameterChangeEventType = ParameterChangeEvent;
  export type ErrorEventType = ErrorEvent;
  export type RentVsBuyAnalysisType = RentVsBuyAnalysis;
  export type PerformanceMetricType = PerformanceMetric;
  
  export type SessionSummaryType = SessionSummary;
  export type PopularFeatureType = PopularFeature;
  export type CalculationTrendType = CalculationTrend;
  export type PerformanceDashboardType = PerformanceDashboard;
  
  export type SessionInsightsType = SessionInsights;
  export type MonthlyPaymentDataType = MonthlyPaymentData;
  export type YearlyBreakdownType = YearlyBreakdown;
}

// Type guards for runtime type checking
export function isUserSegment(value: string): value is UserSegment {
  return ['starter', 'mid_market', 'premium', 'luxury'].includes(value);
}

export function isDeviceType(value: string): value is DeviceType {
  return ['desktop', 'mobile', 'tablet'].includes(value);
}

export function isBrowserType(value: string): value is BrowserType {
  return ['chrome', 'firefox', 'safari', 'edge', 'other'].includes(value);
}

export function isMortgageType(value: string): value is MortgageType {
  return ['annuity', 'linear', 'both'].includes(value);
}

export function isCalculationStatus(value: string): value is CalculationStatus {
  return ['pending', 'completed', 'error'].includes(value);
}

// Helper functions for data transformation
export function transformAppStateToCalculation(
  appState: any, // From the existing AppState type
  sessionId: string,
  calculationId: string,
  results: { loan: number; cost: number; percentage: number; transferTax: number; transferTaxExempt: boolean }
): MortgageCalculationInsert {
  return {
    session_id: sessionId,
    calculation_id: calculationId,
    property_price: appState.price,
    interest_rate: appState.interest,
    tax_deduction_rate: appState.deduction,
    savings_amount: appState.savings,
    monthly_rent: appState.rent,
    notary_cost: appState.notary,
    valuation_cost: appState.valuation,
    financial_advisor_cost: appState.financialAdvisor,
    real_estate_agent_cost: appState.realStateAgent,
    structural_survey_cost: appState.structuralSurvey,
    is_first_time_buyer: appState.isFirstTimeBuyer,
    transfer_tax_rate: appState.transferTaxRate,
    property_appreciation_rate: appState.propertyAppreciationRate,
    comparison_period_years: appState.comparisonPeriodYears,
    loan_amount: results.loan,
    total_cost: results.cost,
    loan_to_value_percentage: results.percentage,
    transfer_tax_amount: results.transferTax,
    transfer_tax_exempt: results.transferTaxExempt,
    calculation_status: 'completed',
    user_segment: getUserSegment(appState.price)
  };
}

export function transformMortgageDataToResult(
  mortgageData: any, // From the existing MortgageData type
  calculationId: string,
  mortgageType: MortgageType
): MortgageResultInsert {
  return {
    calculation_id: calculationId,
    mortgage_type: mortgageType,
    total_paid_gross: mortgageData.totals.totalPaidGross,
    total_paid_net: mortgageData.totals.totalPaidNet,
    total_interest_gross: mortgageData.totals.totalInterestGross,
    total_interest_net: mortgageData.totals.totalInterestNet,
    total_invested_gross: mortgageData.totals.totalInvestedGross,
    total_invested_net: mortgageData.totals.totalInvestedNet,
    monthly_payments: mortgageData.monthly
  };
}

export function getUserSegment(price: number): UserSegment {
  if (price < 300000) return 'starter';
  if (price < 500000) return 'mid_market';
  if (price < 800000) return 'premium';
  return 'luxury';
}

export function getDeviceType(userAgent: string): DeviceType {
  if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

export function getBrowserType(userAgent: string): BrowserType {
  if (userAgent.includes('Chrome')) return 'chrome';
  if (userAgent.includes('Firefox')) return 'firefox';
  if (userAgent.includes('Safari')) return 'safari';
  if (userAgent.includes('Edge')) return 'edge';
  return 'other';
}

export function hashUserAgent(userAgent: string): string {
  // Simple hash function for user agent anonymization
  let hash = 0;
  for (let i = 0; i < userAgent.length; i++) {
    const char = userAgent.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}