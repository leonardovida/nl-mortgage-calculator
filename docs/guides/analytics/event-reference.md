# PostHog Event Reference

## Quick Reference Guide

This document provides a quick reference for all PostHog events tracked in the Dutch Mortgage Calculator application.

## Event Categories

### 1. User Interaction Events

#### `mortgage_parameter_changed`
**Description**: Tracks when users modify mortgage calculation parameters
**Frequency**: High (on every input change with 1s debounce)
**Use Case**: Understand user input patterns and preferred mortgage configurations

**Properties**:
- `parameter`: Field name (price, interest, savings, etc.)
- `value`: New value entered
- `previous_value`: Previous value for comparison
- `field_type`: Type of input (input, toggle, calculated)
- `component`: Component name where change occurred
- `parameter_category`: Grouped category (property, mortgage, costs, tax, analysis)

**Example**:
```json
{
  "event": "mortgage_parameter_changed",
  "properties": {
    "parameter": "price",
    "value": 450000,
    "previous_value": 310000,
    "field_type": "input",
    "component": "Mortgage",
    "parameter_category": "property"
  }
}
```

#### `form_interaction`
**Description**: Tracks detailed form field interactions (focus, blur, validation)
**Frequency**: Medium
**Use Case**: UX optimization and input field analytics

**Properties**:
- `field_name`: Name of the form field
- `interaction_type`: Type of interaction (focus, blur, change, submit)
- `field_value`: Current field value
- `form_section`: Section of the form (property_details, costs, etc.)
- `validation_errors`: Array of validation errors if any

#### `tab_navigation`
**Description**: Tracks user navigation between different tabs
**Frequency**: Medium
**Use Case**: Understand user journey and feature discovery patterns

**Properties**:
- `from_tab`: Previous tab name
- `to_tab`: New tab name
- `tab_category`: Category (info, calculation)
- `navigation_method`: How user navigated (click, keyboard, url)

### 2. Feature Usage Events

#### `feature_usage`
**Description**: Tracks usage of specific application features
**Frequency**: Medium
**Use Case**: Feature adoption analysis and product optimization

**Properties**:
- `feature`: Feature name (first_time_buyer_toggle, rent_vs_buy_analysis, etc.)
- `action`: User action (enabled, disabled, viewed, calculated)
- `value`: Feature-specific value
- `context`: Additional context object
- `feature_category`: Grouped category (tax_benefits, comparison, calculation, etc.)

**Key Features Tracked**:
- First-time buyer tax exemption toggle
- Rent vs buy analysis view
- Mortgage structure comparison
- Tax calculation features
- NHG calculations
- Interest rate analysis

### 3. Calculation Events

#### `mortgage_calculation_completed`
**Description**: Tracks completion of mortgage calculations
**Frequency**: Medium (debounced to 2s)
**Use Case**: Understand calculation patterns and user segments

**Properties**:
- `loan_amount`: Calculated loan amount
- `property_price`: Property price entered
- `interest_rate`: Interest rate used
- `mortgage_type`: Type calculated (annuity, linear, both)
- `calculation_duration_ms`: Time taken for calculation
- `user_segment`: User segment (starter, mid_market, premium, luxury)
- `loan_to_value_ratio`: LTV ratio percentage

### 4. User Journey Events

#### `user_session_started`
**Description**: Tracks when user sessions begin
**Frequency**: Once per session
**Use Case**: Session analysis and user flow tracking

**Properties**:
- `session_id`: Unique session identifier
- `session_start_time`: Timestamp of session start
- `is_returning_user`: Whether user has visited before
- `device_type`: Device category (desktop, tablet, mobile)
- `browser_type`: Browser type (chrome, firefox, safari, edge)

#### `user_journey_step`
**Description**: Tracks specific steps in the user journey
**Frequency**: Medium
**Use Case**: User flow optimization and conversion analysis

**Properties**:
- `step`: Step name (app_initialized, calculation_completed, etc.)
- `step_category`: Category (onboarding, configuration, calculation, analysis, completion)
- `step_number`: Sequential step number if applicable
- `time_spent_seconds`: Time spent on this step
- `completion_rate`: Progress completion percentage

#### `page_view`
**Description**: Tracks page views with context
**Frequency**: Low (on route changes)
**Use Case**: Traffic analysis and entry point optimization

**Properties**:
- `page_name`: Page identifier
- `page_title`: Document title
- `page_url`: Full URL
- `has_price`: Whether URL contains price parameter
- `has_interest`: Whether URL contains interest parameter
- `url_params_count`: Number of URL parameters present

### 5. Error Events

#### `error_occurred`
**Description**: Tracks application errors for debugging and reliability monitoring
**Frequency**: Low (only on errors)
**Use Case**: Error monitoring and application reliability

**Properties**:
- `error_type`: Error category (calculation_error, component_error, network_error, validation_error)
- `error_message`: Error message text
- `error_stack`: Stack trace for debugging
- `component`: Component where error occurred
- `user_action`: User action that triggered error

**Error Types**:
- **calculation_error**: Math/calculation related errors
- **component_error**: React component rendering errors
- **network_error**: API or resource loading errors
- **validation_error**: Input validation failures

## User Segmentation Properties

### Automatic User Properties
- `session_id`: Unique session identifier
- `app_version`: Application version
- `environment`: Runtime environment (development, production)
- `user_agent`: Browser user agent string
- `screen_resolution`: Screen dimensions
- `timezone`: User timezone
- `language`: Browser language
- `device_type`: Device category
- `browser_type`: Browser identification

### Custom User Segments
- **Price Segment**: Based on property price
  - `starter`: < €300,000
  - `mid_market`: €300,000 - €500,000
  - `premium`: €500,000 - €800,000
  - `luxury`: > €800,000

- **User Type**: Based on visit history
  - `new_visitor`: First-time visitor
  - `returning_user`: Has visited before

## Event Volume Guidelines

### High Volume Events (Debounced)
- `mortgage_parameter_changed`: 1 second debounce
- `form_interaction`: Real-time with intelligent filtering
- `mortgage_calculation_completed`: 2 second debounce

### Medium Volume Events
- `tab_navigation`: Immediate tracking
- `feature_usage`: Immediate tracking
- `user_journey_step`: Immediate tracking

### Low Volume Events
- `user_session_started`: Once per session
- `page_view`: On route changes only
- `error_occurred`: Only when errors occur

## Privacy & GDPR Compliance

### Data Collection Principles
- **Anonymous by Default**: No PII collected without explicit consent
- **Consent-Driven**: Analytics only active after user consent
- **Transparent**: Clear disclosure of data collection practices
- **Minimal**: Only collect data necessary for product improvement

### Sensitive Data Handling
- **Input Masking**: All form inputs masked in session recordings
- **Data Sanitization**: Automatic removal of email, phone, SSN patterns
- **Secure Storage**: Data stored according to PostHog's security standards
- **Retention Limits**: Data retention follows configured policies

## Implementation Examples

### Basic Parameter Tracking
```typescript
// Track when user changes property price
analytics.trackMortgageParameterChanged({
  parameter: 'price',
  value: 450000,
  previous_value: 310000,
  field_type: 'input',
  component: 'Mortgage',
});
```

### Feature Usage Tracking
```typescript
// Track first-time buyer toggle
analytics.trackFeatureUsage({
  feature: 'first_time_buyer_toggle',
  action: 'enabled',
  value: true,
  context: {
    property_price: 450000,
    potential_tax_savings: 9000,
  },
});
```

### User Journey Tracking
```typescript
// Track calculation completion
analytics.trackUserJourneyStep({
  step: 'calculation_completed',
  step_category: 'calculation',
  time_spent_seconds: 45,
  completion_rate: 0.8,
});
```

### Error Tracking
```typescript
// Track calculation error
analytics.trackError({
  error_type: 'calculation_error',
  error_message: 'Invalid interest rate: NaN',
  component: 'MortgageCalculator',
  user_action: 'interest_rate_calculation',
});
```

## Dashboard & Analysis

### Key Metrics to Monitor
1. **User Engagement**
   - Session duration
   - Feature adoption rates
   - Tab navigation patterns
   - Calculation completion rates

2. **Product Performance**
   - Error rates by component
   - Calculation performance
   - Feature usage trends
   - User segment behavior

3. **Business Insights**
   - Popular property price ranges
   - Mortgage type preferences
   - Tax benefit utilization
   - Rent vs buy analysis usage

### Recommended PostHog Dashboards
1. **User Journey Dashboard**: Track user flow and conversion
2. **Feature Adoption Dashboard**: Monitor feature usage and adoption
3. **Error Monitoring Dashboard**: Track application reliability
4. **Product Analytics Dashboard**: Core product metrics and trends

## Best Practices

### Event Naming
- Use descriptive, consistent snake_case names
- Include action and object: `mortgage_parameter_changed`
- Group related events with common prefixes
- Keep names concise but clear

### Property Naming
- Use snake_case for all property names
- Be descriptive: `property_price` not `price`
- Include units when relevant: `time_spent_seconds`
- Use consistent data types across events

### Data Quality
- Always include required properties
- Validate data before sending events
- Use enums for categorical data
- Include context for better analysis

### Performance
- Implement appropriate debouncing for high-frequency events
- Avoid tracking in tight loops
- Handle analytics errors gracefully
- Don't block user interactions for analytics