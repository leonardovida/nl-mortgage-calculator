# PostHog Analytics Integration

## Overview

This document outlines the comprehensive PostHog analytics integration implemented for the Dutch Mortgage Calculator. The integration provides detailed insights into user behavior, mortgage calculation patterns, feature usage, and application performance while maintaining GDPR compliance.

## Architecture

### Core Components

1. **Analytics Service** (`src/lib/analytics.ts`)
   - Centralized PostHog SDK wrapper
   - Event tracking utilities and type definitions
   - Privacy-compliant configuration
   - Session management and user segmentation

2. **Analytics Provider** (`src/components/AnalyticsProvider.tsx`)
   - React context for analytics state management
   - GDPR consent banner and consent management
   - Analytics initialization and cleanup
   - Page view tracking

3. **Analytics Input Components** (`src/components/AnalyticsInputField.tsx`)
   - Enhanced form inputs with interaction tracking
   - Parameter change tracking with debouncing
   - Validation error tracking
   - User engagement analytics

## Event Schema

### Primary Event Types

#### 1. Mortgage Parameter Changes
```typescript
Event: 'mortgage_parameter_changed'
Properties:
  - parameter: string (price, interest, savings, etc.)
  - value: number | boolean
  - previous_value: number | boolean
  - field_type: 'input' | 'toggle' | 'calculated'
  - component: string
  - parameter_category: string
```

#### 2. Tab Navigation
```typescript
Event: 'tab_navigation'
Properties:
  - from_tab: string
  - to_tab: string
  - tab_category: 'info' | 'calculation'
  - navigation_method: 'click' | 'keyboard' | 'url'
```

#### 3. Feature Usage
```typescript
Event: 'feature_usage'
Properties:
  - feature: string
  - action: 'enabled' | 'disabled' | 'viewed' | 'calculated'
  - value: number | boolean | string
  - context: object
  - feature_category: string
```

#### 4. Mortgage Calculation Completion
```typescript
Event: 'mortgage_calculation_completed'
Properties:
  - loan_amount: number
  - property_price: number
  - interest_rate: number
  - mortgage_type: 'annuity' | 'linear' | 'both'
  - calculation_duration_ms: number
  - user_segment: 'starter' | 'mid_market' | 'premium' | 'luxury'
  - loan_to_value_ratio: number
```

#### 5. Error Tracking
```typescript
Event: 'error_occurred'
Properties:
  - error_type: 'calculation_error' | 'component_error' | 'network_error' | 'validation_error'
  - error_message: string
  - error_stack: string
  - component: string
  - user_action: string
```

#### 6. User Journey Steps
```typescript
Event: 'user_journey_step'
Properties:
  - step: string
  - step_category: 'onboarding' | 'configuration' | 'calculation' | 'analysis' | 'completion'
  - step_number: number
  - time_spent_seconds: number
  - completion_rate: number
```

### Feature-Specific Events

#### First-Time Buyer Tax Benefits
- Track toggle interactions
- Monitor exemption calculations
- Measure savings impact on user behavior

#### Rent vs Buy Analysis
- Track comparison parameter changes
- Monitor feature engagement duration
- Analyze break-even point preferences

#### Mortgage Structure Comparison
- Track viewing patterns between annuity and linear
- Monitor graph interaction
- Analyze preferred calculation methods

## User Segmentation

### Automatic Segmentation
- **Property Price Ranges**: Starter (<€300k), Mid-market (€300k-€500k), Premium (€500k-€800k), Luxury (>€800k)
- **Device Type**: Desktop, Tablet, Mobile
- **User Type**: New visitor, Returning user
- **Geographic**: Based on timezone and language preferences

### Custom Properties
- First-time buyer status
- Preferred mortgage type (based on usage patterns)
- Calculation complexity (number of parameters modified)
- Feature adoption rate

## Privacy & GDPR Compliance

### Consent Management
- **Consent Banner**: Displayed on first visit
- **Granular Control**: Users can accept or decline analytics
- **Persistent Choice**: Consent status stored in localStorage
- **Anonymous Tracking**: No personally identifiable information collected

### Data Protection Features
- **Input Masking**: All form inputs are masked in session recordings
- **Data Sanitization**: Automatic removal of sensitive data from events
- **Retention Policy**: Data retention follows PostHog's standard policies
- **Anonymous User IDs**: Users tracked with anonymous session IDs only

### Privacy-First Configuration
```typescript
// PostHog Configuration
{
  person_profiles: 'identified_only',
  capture_pageview: false, // Manual tracking only
  session_recording: {
    maskAllInputs: true,
    maskInputOptions: {
      password: true,
      email: true,
    },
  },
  autocapture: false, // No automatic event capture
}
```

## Integration Points

### Form Components
- **Mortgage.tsx**: Property details and mortgage terms tracking
- **Costs.tsx**: Purchase costs and tax settings tracking
- **RentVsBuy.tsx**: Comparison analysis tracking
- **InputField**: Enhanced with interaction analytics

### Navigation & User Flow
- **MortgageCalculator.tsx**: Main component with tab navigation tracking
- **Tab Components**: Individual tab engagement tracking
- **Page Views**: Automatic page view tracking with context

### Error Tracking
- **ErrorBoundary.tsx**: Comprehensive error tracking and recovery analytics
- **Component Errors**: Automatic error categorization and tracking
- **User Recovery**: Track user actions after errors

## Analytics Insights & Use Cases

### Product Analytics
1. **User Engagement Patterns**
   - Most used features and tabs
   - Time spent in different sections
   - Drop-off points in user journey

2. **Mortgage Calculation Patterns**
   - Common property price ranges
   - Popular interest rate ranges
   - Preferred mortgage structures

3. **Feature Adoption**
   - First-time buyer benefit usage
   - Rent vs buy analysis engagement
   - Advanced feature utilization

### Performance Monitoring
1. **Calculation Performance**
   - Average calculation completion times
   - Complex calculation patterns
   - Performance bottlenecks

2. **Error Analytics**
   - Error frequency and types
   - Component reliability metrics
   - User recovery success rates

### User Experience Optimization
1. **Navigation Analysis**
   - Tab switching patterns
   - User flow optimization opportunities
   - Feature discovery metrics

2. **Input Field Analytics**
   - Field completion rates
   - Validation error patterns
   - User input behaviors

## Event Naming Conventions

### Event Names
- Use snake_case format
- Include action and object: `mortgage_parameter_changed`
- Be descriptive but concise
- Group related events with prefixes

### Property Names
- Use snake_case format
- Be descriptive: `property_price` not `price`
- Include units when relevant: `time_spent_seconds`
- Use consistent naming across events

### Categories and Tags
- **Parameter Categories**: property, mortgage, costs, tax, analysis
- **Component Categories**: input, navigation, calculation, error
- **User Journey Categories**: onboarding, configuration, calculation, analysis, completion

## Implementation Examples

### Tracking Mortgage Parameter Changes
```typescript
analytics.trackMortgageParameterChanged({
  parameter: 'price',
  value: 350000,
  previous_value: 310000,
  field_type: 'input',
  component: 'Mortgage',
});
```

### Tracking Feature Usage
```typescript
analytics.trackFeatureUsage({
  feature: 'first_time_buyer_toggle',
  action: 'enabled',
  value: true,
  context: {
    property_price: 450000,
    potential_savings: 9000,
  },
});
```

### Tracking Tab Navigation
```typescript
analytics.trackTabNavigation({
  from_tab: 'mortgage',
  to_tab: 'rentbuy',
  tab_category: 'info',
  navigation_method: 'click',
});
```

## Testing & Validation

### Development Environment
- Analytics events logged to console
- Test PostHog project for development
- Event validation and debugging

### Production Environment
- Full PostHog integration
- Performance monitoring
- Error tracking and alerting

## Maintenance & Best Practices

### Regular Reviews
1. **Monthly Analytics Review**
   - Event volume and quality
   - User behavior trends
   - Performance metrics

2. **Quarterly Schema Review**
   - Event schema updates
   - New feature tracking requirements
   - Data structure optimization

### Performance Considerations
- **Event Debouncing**: Prevent excessive events from rapid user interactions
- **Lazy Loading**: PostHog loaded only when needed
- **Error Handling**: Prevent analytics errors from affecting user experience

### Data Quality
- **Event Validation**: Ensure all required properties are included
- **Consistent Naming**: Follow established naming conventions
- **Documentation**: Keep this document updated with changes

## Future Enhancements

### Advanced Analytics
- **Funnel Analysis**: Track user journey completion rates
- **Cohort Analysis**: Track user retention and behavior changes
- **A/B Testing**: Feature flag integration for testing

### Machine Learning Insights
- **Predictive Analytics**: Predict user preferences and optimize experience
- **Anomaly Detection**: Identify unusual user behavior patterns
- **Personalization**: Customize experience based on usage patterns

### Extended Tracking
- **External Integrations**: Track referral sources and campaign effectiveness
- **Cross-Device Tracking**: Track users across multiple devices
- **Advanced Segmentation**: More sophisticated user categorization