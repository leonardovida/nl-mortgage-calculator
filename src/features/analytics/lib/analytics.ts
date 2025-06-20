import { PostHog } from 'posthog-js';

// PostHog configuration
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY || '';
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

// Analytics event types
export type AnalyticsEventType = 
  | 'mortgage_parameter_changed'
  | 'mortgage_calculation_completed'
  | 'tab_navigation'
  | 'feature_usage'
  | 'user_session_started'
  | 'page_view'
  | 'error_occurred'
  | 'form_interaction'
  | 'user_journey_step';

// Mortgage parameter types
export type MortgageParameter = 
  | 'price'
  | 'interest'
  | 'deduction'
  | 'savings'
  | 'rent'
  | 'notary'
  | 'valuation'
  | 'financialAdvisor'
  | 'realStateAgent'
  | 'structuralSurvey'
  | 'transferTaxRate'
  | 'propertyAppreciationRate'
  | 'comparisonPeriodYears'
  | 'isFirstTimeBuyer';

// Tab types
export type TabType = 'mortgage' | 'cost' | 'interest' | 'rentbuy' | 'annuity' | 'linear' | 'graph';

// Feature types
export type FeatureType = 
  | 'first_time_buyer_toggle'
  | 'rent_vs_buy_analysis'
  | 'mortgage_structure_comparison'
  | 'tax_calculation'
  | 'nhg_calculation'
  | 'interest_rate_analysis';

// Event properties interfaces
interface MortgageParameterEvent {
  parameter: MortgageParameter;
  value: number | boolean;
  previous_value?: number | boolean;
  field_type: 'input' | 'toggle' | 'calculated';
  component: string;
}

interface TabNavigationEvent {
  from_tab?: TabType;
  to_tab: TabType;
  tab_category: 'info' | 'calculation';
  navigation_method: 'click' | 'keyboard' | 'url';
}

interface FeatureUsageEvent {
  feature: FeatureType;
  action: 'enabled' | 'disabled' | 'viewed' | 'calculated';
  value?: number | boolean | string;
  context?: Record<string, any>;
}

interface MortgageCalculationEvent {
  loan_amount: number;
  property_price: number;
  interest_rate: number;
  mortgage_type: 'annuity' | 'linear' | 'both';
  calculation_duration_ms?: number;
  user_segment?: string;
}

interface ErrorEvent {
  error_type: 'calculation_error' | 'component_error' | 'network_error' | 'validation_error';
  error_message: string;
  error_stack?: string;
  component?: string;
  user_action?: string;
}

interface FormInteractionEvent {
  field_name: string;
  interaction_type: 'focus' | 'blur' | 'change' | 'submit';
  field_value?: string | number;
  form_section: string;
  validation_errors?: string[];
}

interface UserJourneyEvent {
  step: string;
  step_category: 'onboarding' | 'configuration' | 'calculation' | 'analysis' | 'completion';
  step_number?: number;
  time_spent_seconds?: number;
  completion_rate?: number;
}

// Analytics service class
export class AnalyticsService {
  private posthog: PostHog | null = null;
  private isInitialized = false;
  private sessionStartTime: number = Date.now();
  private currentSession: string = '';

  constructor() {
    this.currentSession = this.generateSessionId();
  }

  // Initialize PostHog
  async initialize(): Promise<void> {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    try {
      const { default: posthog } = await import('posthog-js');
      
      posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        person_profiles: 'identified_only', // GDPR compliance
        capture_pageview: false, // We'll handle this manually
        capture_pageleave: true,
        disable_session_recording: false,
        session_recording: {
          maskAllInputs: true, // Privacy: mask all inputs by default
          maskInputOptions: {
            password: true,
            email: true,
          },
        },
        autocapture: false, // Disable automatic event capture
        cross_subdomain_cookie: false,
        persistence: 'localStorage+cookie',
        cookie_expiration: 365, // 1 year
        sanitize_properties: (properties) => {
          // Remove any potentially sensitive data
          const sanitized = { ...properties };
          delete sanitized.email;
          delete sanitized.phone;
          delete sanitized.ssn;
          return sanitized;
        },
        loaded: (posthog) => {
          // Set up user properties
          posthog.register({
            session_id: this.currentSession,
            app_version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            user_agent: navigator.userAgent,
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
          });
        },
      });

      this.posthog = posthog;
      this.isInitialized = true;

      // Track session start
      this.trackUserSessionStarted();

    } catch (error) {
      console.error('Failed to initialize PostHog:', error);
    }
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generic event tracking
  private track(eventType: AnalyticsEventType, properties: Record<string, any> = {}): void {
    if (!this.posthog || !this.isInitialized) {
      console.warn('PostHog not initialized. Event not tracked:', eventType);
      return;
    }

    const baseProperties = {
      timestamp: Date.now(),
      session_id: this.currentSession,
      session_duration: Date.now() - this.sessionStartTime,
      url: window.location.href,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
    };

    this.posthog.capture(eventType, {
      ...baseProperties,
      ...properties,
    });
  }

  // Mortgage parameter tracking
  trackMortgageParameterChanged(event: MortgageParameterEvent): void {
    this.track('mortgage_parameter_changed', {
      parameter: event.parameter,
      value: event.value,
      previous_value: event.previous_value,
      field_type: event.field_type,
      component: event.component,
      parameter_category: this.getParameterCategory(event.parameter),
    });
  }

  // Tab navigation tracking
  trackTabNavigation(event: TabNavigationEvent): void {
    this.track('tab_navigation', {
      from_tab: event.from_tab,
      to_tab: event.to_tab,
      tab_category: event.tab_category,
      navigation_method: event.navigation_method,
    });
  }

  // Feature usage tracking
  trackFeatureUsage(event: FeatureUsageEvent): void {
    this.track('feature_usage', {
      feature: event.feature,
      action: event.action,
      value: event.value,
      context: event.context,
      feature_category: this.getFeatureCategory(event.feature),
    });
  }

  // Mortgage calculation tracking
  trackMortgageCalculationCompleted(event: MortgageCalculationEvent): void {
    this.track('mortgage_calculation_completed', {
      loan_amount: event.loan_amount,
      property_price: event.property_price,
      interest_rate: event.interest_rate,
      mortgage_type: event.mortgage_type,
      calculation_duration_ms: event.calculation_duration_ms,
      user_segment: event.user_segment || this.getUserSegment(event.property_price),
      loan_to_value_ratio: (event.loan_amount / event.property_price) * 100,
    });
  }

  // Error tracking
  trackError(event: ErrorEvent): void {
    this.track('error_occurred', {
      error_type: event.error_type,
      error_message: event.error_message,
      error_stack: event.error_stack,
      component: event.component,
      user_action: event.user_action,
    });
  }

  // Form interaction tracking
  trackFormInteraction(event: FormInteractionEvent): void {
    this.track('form_interaction', {
      field_name: event.field_name,
      interaction_type: event.interaction_type,
      field_value: event.field_value,
      form_section: event.form_section,
      validation_errors: event.validation_errors,
    });
  }

  // User journey tracking
  trackUserJourneyStep(event: UserJourneyEvent): void {
    this.track('user_journey_step', {
      step: event.step,
      step_category: event.step_category,
      step_number: event.step_number,
      time_spent_seconds: event.time_spent_seconds,
      completion_rate: event.completion_rate,
    });
  }

  // Page view tracking
  trackPageView(pageName: string, additionalProperties: Record<string, any> = {}): void {
    this.track('page_view', {
      page_name: pageName,
      page_title: document.title,
      page_url: window.location.href,
      ...additionalProperties,
    });
  }

  // Session tracking
  trackUserSessionStarted(): void {
    this.track('user_session_started', {
      session_id: this.currentSession,
      session_start_time: this.sessionStartTime,
      is_returning_user: this.isReturningUser(),
      device_type: this.getDeviceType(),
      browser_type: this.getBrowserType(),
    });
  }

  // Helper methods
  private getParameterCategory(parameter: MortgageParameter): string {
    const categories = {
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

  private getFeatureCategory(feature: FeatureType): string {
    const categories = {
      first_time_buyer_toggle: 'tax_benefits',
      rent_vs_buy_analysis: 'comparison',
      mortgage_structure_comparison: 'calculation',
      tax_calculation: 'tax_benefits',
      nhg_calculation: 'insurance',
      interest_rate_analysis: 'rates',
    };
    return categories[feature] || 'other';
  }

  private getUserSegment(propertyPrice: number): string {
    if (propertyPrice < 300000) return 'starter';
    if (propertyPrice < 500000) return 'mid_market';
    if (propertyPrice < 800000) return 'premium';
    return 'luxury';
  }

  private isReturningUser(): boolean {
    return localStorage.getItem('mortgage_calc_returning_user') === 'true';
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
    return 'desktop';
  }

  private getBrowserType(): string {
    const userAgent = navigator.userAgent;
    if (userAgent.includes('Chrome')) return 'chrome';
    if (userAgent.includes('Firefox')) return 'firefox';
    if (userAgent.includes('Safari')) return 'safari';
    if (userAgent.includes('Edge')) return 'edge';
    return 'other';
  }

  // Identify user (for authenticated users)
  identifyUser(userId: string, properties: Record<string, any> = {}): void {
    if (!this.posthog) return;
    
    this.posthog.identify(userId, {
      ...properties,
      first_seen: new Date().toISOString(),
    });
  }

  // Set user properties
  setUserProperties(properties: Record<string, any>): void {
    if (!this.posthog) return;
    
    this.posthog.setPersonProperties(properties);
  }

  // Group analytics (for business features)
  groupUser(groupType: string, groupKey: string, properties: Record<string, any> = {}): void {
    if (!this.posthog) return;
    
    this.posthog.group(groupType, groupKey, properties);
  }

  // Feature flag evaluation
  isFeatureEnabled(flagKey: string): boolean {
    if (!this.posthog) return false;
    
    return this.posthog.isFeatureEnabled(flagKey) || false;
  }

  // Shutdown analytics
  shutdown(): void {
    if (this.posthog) {
      this.posthog.capture('user_session_ended', {
        session_id: this.currentSession,
        session_duration: Date.now() - this.sessionStartTime,
      });
    }
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// React hooks for analytics
export const useAnalytics = () => {
  return {
    trackMortgageParameterChanged: analytics.trackMortgageParameterChanged.bind(analytics),
    trackTabNavigation: analytics.trackTabNavigation.bind(analytics),
    trackFeatureUsage: analytics.trackFeatureUsage.bind(analytics),
    trackMortgageCalculationCompleted: analytics.trackMortgageCalculationCompleted.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackFormInteraction: analytics.trackFormInteraction.bind(analytics),
    trackUserJourneyStep: analytics.trackUserJourneyStep.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    identifyUser: analytics.identifyUser.bind(analytics),
    setUserProperties: analytics.setUserProperties.bind(analytics),
    isFeatureEnabled: analytics.isFeatureEnabled.bind(analytics),
  };
};