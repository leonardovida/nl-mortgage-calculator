-- Supabase Database Schema for Mortgage Calculator
-- GDPR Compliant - No PII stored, anonymous data only
-- Created: 2025-06-18

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create custom types for enums
CREATE TYPE user_segment AS ENUM ('starter', 'mid_market', 'premium', 'luxury');
CREATE TYPE device_type AS ENUM ('desktop', 'mobile', 'tablet');
CREATE TYPE browser_type AS ENUM ('chrome', 'firefox', 'safari', 'edge', 'other');
CREATE TYPE mortgage_type AS ENUM ('annuity', 'linear', 'both');
CREATE TYPE tab_category AS ENUM ('info', 'calculation');
CREATE TYPE info_tab AS ENUM ('mortgage', 'cost', 'interest', 'rentbuy');
CREATE TYPE calculation_tab AS ENUM ('annuity', 'linear', 'graph');
CREATE TYPE calculation_status AS ENUM ('pending', 'completed', 'error');

-- User Sessions Table (Anonymous)
-- Stores anonymous user sessions for analytics
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Session metadata (no PII)
    device_type device_type,
    browser_type browser_type,
    screen_resolution TEXT,
    timezone TEXT,
    language TEXT,
    user_agent_hash TEXT, -- hashed for privacy
    
    -- User characteristics
    is_returning_user BOOLEAN DEFAULT FALSE,
    user_segment user_segment,
    
    -- Session activity
    session_duration_ms INTEGER DEFAULT 0,
    page_views INTEGER DEFAULT 0,
    calculations_count INTEGER DEFAULT 0,
    tabs_navigated INTEGER DEFAULT 0,
    
    -- Consent tracking
    analytics_consent_given BOOLEAN DEFAULT FALSE,
    consent_timestamp TIMESTAMP WITH TIME ZONE,
    
    -- Referrer information (anonymized)
    referrer_domain TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    
    -- Indexes
    CONSTRAINT session_id_length CHECK (LENGTH(session_id) > 10)
);

-- Mortgage Calculations Table
-- Stores anonymous mortgage calculation parameters and results
CREATE TABLE mortgage_calculations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
    calculation_id TEXT NOT NULL, -- Client-generated ID for deduplication
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Mortgage parameters
    property_price DECIMAL(12,2) NOT NULL,
    interest_rate DECIMAL(5,3) NOT NULL,
    tax_deduction_rate DECIMAL(5,2) NOT NULL,
    savings_amount DECIMAL(12,2) NOT NULL,
    monthly_rent DECIMAL(8,2) NOT NULL,
    
    -- Purchase costs
    notary_cost DECIMAL(8,2) NOT NULL,
    valuation_cost DECIMAL(8,2) NOT NULL,
    financial_advisor_cost DECIMAL(8,2) NOT NULL,
    real_estate_agent_cost DECIMAL(8,2) NOT NULL,
    structural_survey_cost DECIMAL(8,2) NOT NULL,
    
    -- Tax settings
    is_first_time_buyer BOOLEAN NOT NULL,
    transfer_tax_rate DECIMAL(5,2) NOT NULL,
    
    -- Rent vs Buy comparison
    property_appreciation_rate DECIMAL(5,2) NOT NULL,
    comparison_period_years INTEGER NOT NULL,
    
    -- Calculated results
    loan_amount DECIMAL(12,2) NOT NULL,
    total_cost DECIMAL(12,2) NOT NULL,
    loan_to_value_percentage DECIMAL(5,2) NOT NULL,
    transfer_tax_amount DECIMAL(12,2) NOT NULL,
    transfer_tax_exempt BOOLEAN NOT NULL,
    
    -- Calculation metadata
    calculation_status calculation_status DEFAULT 'pending',
    calculation_duration_ms INTEGER,
    error_message TEXT,
    
    -- User behavior context
    user_segment user_segment,
    
    -- Constraints
    CONSTRAINT positive_price CHECK (property_price > 0),
    CONSTRAINT valid_interest_rate CHECK (interest_rate >= 0 AND interest_rate <= 20),
    CONSTRAINT valid_tax_deduction CHECK (tax_deduction_rate >= 0 AND tax_deduction_rate <= 100),
    CONSTRAINT valid_comparison_period CHECK (comparison_period_years > 0 AND comparison_period_years <= 50),
    CONSTRAINT unique_calculation_per_session UNIQUE (session_id, calculation_id)
);

-- Mortgage Results Table
-- Stores detailed monthly payment data for both annuity and linear mortgages
CREATE TABLE mortgage_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    calculation_id UUID REFERENCES mortgage_calculations(id) ON DELETE CASCADE,
    mortgage_type mortgage_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Totals for the mortgage type
    total_paid_gross DECIMAL(12,2) NOT NULL,
    total_paid_net DECIMAL(12,2) NOT NULL,
    total_interest_gross DECIMAL(12,2) NOT NULL,
    total_interest_net DECIMAL(12,2) NOT NULL,
    total_invested_gross DECIMAL(12,2) NOT NULL,
    total_invested_net DECIMAL(12,2) NOT NULL,
    
    -- Monthly payment data (JSON for flexibility)
    monthly_payments JSONB NOT NULL,
    
    -- Indexes for JSON queries
    CONSTRAINT unique_result_per_calculation_type UNIQUE (calculation_id, mortgage_type)
);

-- User Analytics Events Table
-- Stores anonymous user interaction events for analytics
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Event properties (flexible JSON structure)
    properties JSONB NOT NULL DEFAULT '{}',
    
    -- Common event metadata
    page_url TEXT,
    page_title TEXT,
    referrer TEXT,
    
    -- User context
    device_type device_type,
    browser_type browser_type
);

-- Tab Navigation Events Table
-- Specialized table for tracking tab navigation patterns
CREATE TABLE tab_navigation_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Navigation details
    from_tab TEXT,
    to_tab TEXT,
    tab_category tab_category NOT NULL,
    navigation_method TEXT DEFAULT 'click',
    
    -- Timing
    time_spent_on_previous_tab INTEGER, -- milliseconds
    
    -- Context
    calculation_id UUID REFERENCES mortgage_calculations(id) ON DELETE SET NULL
);

-- Feature Usage Events Table
-- Tracks usage of specific calculator features
CREATE TABLE feature_usage_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Feature details
    feature_name TEXT NOT NULL,
    feature_category TEXT NOT NULL,
    action TEXT NOT NULL, -- 'enabled', 'disabled', 'viewed', 'calculated'
    
    -- Feature value/context
    feature_value TEXT,
    feature_context JSONB DEFAULT '{}',
    
    -- Associated calculation
    calculation_id UUID REFERENCES mortgage_calculations(id) ON DELETE SET NULL
);

-- Parameter Change Events Table
-- Tracks changes to mortgage parameters for analytics
CREATE TABLE parameter_change_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
    calculation_id UUID REFERENCES mortgage_calculations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Parameter details
    parameter_name TEXT NOT NULL,
    parameter_category TEXT NOT NULL,
    field_type TEXT NOT NULL, -- 'input', 'toggle', 'calculated'
    component_name TEXT NOT NULL,
    
    -- Value changes
    previous_value TEXT,
    new_value TEXT NOT NULL,
    
    -- Validation
    validation_errors JSONB DEFAULT '[]'
);

-- Error Events Table
-- Tracks errors for debugging and monitoring
CREATE TABLE error_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Error details
    error_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    error_stack TEXT,
    
    -- Context
    component_name TEXT,
    user_action TEXT,
    calculation_id UUID REFERENCES mortgage_calculations(id) ON DELETE SET NULL,
    
    -- Environment
    browser_type browser_type,
    device_type device_type,
    user_agent_hash TEXT
);

-- Rent vs Buy Analysis Table
-- Stores detailed rent vs buy comparison results
CREATE TABLE rent_vs_buy_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    calculation_id UUID REFERENCES mortgage_calculations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Analysis parameters
    property_price DECIMAL(12,2) NOT NULL,
    monthly_rent DECIMAL(8,2) NOT NULL,
    property_appreciation_rate DECIMAL(5,2) NOT NULL,
    comparison_period_years INTEGER NOT NULL,
    
    -- Results summary
    break_even_year INTEGER,
    total_buying_cost DECIMAL(12,2) NOT NULL,
    total_renting_cost DECIMAL(12,2) NOT NULL,
    net_worth_difference DECIMAL(12,2) NOT NULL,
    
    -- Year-by-year breakdown (JSON)
    yearly_breakdown JSONB NOT NULL
);

-- Performance Metrics Table
-- Tracks calculation performance for optimization
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metric details
    metric_name TEXT NOT NULL,
    metric_value DECIMAL(10,3) NOT NULL,
    metric_unit TEXT NOT NULL, -- 'ms', 'bytes', 'count', etc.
    
    -- Context
    calculation_id UUID REFERENCES mortgage_calculations(id) ON DELETE SET NULL,
    component_name TEXT,
    
    -- Environment
    device_type device_type,
    browser_type browser_type
);

-- Create indexes for performance
CREATE INDEX idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_created_at ON user_sessions(created_at);
CREATE INDEX idx_user_sessions_user_segment ON user_sessions(user_segment);
CREATE INDEX idx_user_sessions_device_type ON user_sessions(device_type);

CREATE INDEX idx_mortgage_calculations_session_id ON mortgage_calculations(session_id);
CREATE INDEX idx_mortgage_calculations_created_at ON mortgage_calculations(created_at);
CREATE INDEX idx_mortgage_calculations_user_segment ON mortgage_calculations(user_segment);
CREATE INDEX idx_mortgage_calculations_property_price ON mortgage_calculations(property_price);
CREATE INDEX idx_mortgage_calculations_loan_amount ON mortgage_calculations(loan_amount);

CREATE INDEX idx_mortgage_results_calculation_id ON mortgage_results(calculation_id);
CREATE INDEX idx_mortgage_results_mortgage_type ON mortgage_results(mortgage_type);

CREATE INDEX idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_properties ON analytics_events USING GIN(properties);

CREATE INDEX idx_tab_navigation_session_id ON tab_navigation_events(session_id);
CREATE INDEX idx_tab_navigation_created_at ON tab_navigation_events(created_at);
CREATE INDEX idx_tab_navigation_tab_category ON tab_navigation_events(tab_category);

CREATE INDEX idx_feature_usage_session_id ON feature_usage_events(session_id);
CREATE INDEX idx_feature_usage_feature_name ON feature_usage_events(feature_name);
CREATE INDEX idx_feature_usage_created_at ON feature_usage_events(created_at);

CREATE INDEX idx_parameter_change_session_id ON parameter_change_events(session_id);
CREATE INDEX idx_parameter_change_calculation_id ON parameter_change_events(calculation_id);
CREATE INDEX idx_parameter_change_parameter_name ON parameter_change_events(parameter_name);
CREATE INDEX idx_parameter_change_created_at ON parameter_change_events(created_at);

CREATE INDEX idx_error_events_session_id ON error_events(session_id);
CREATE INDEX idx_error_events_error_type ON error_events(error_type);
CREATE INDEX idx_error_events_created_at ON error_events(created_at);

CREATE INDEX idx_rent_vs_buy_calculation_id ON rent_vs_buy_analysis(calculation_id);
CREATE INDEX idx_rent_vs_buy_created_at ON rent_vs_buy_analysis(created_at);

CREATE INDEX idx_performance_metrics_session_id ON performance_metrics(session_id);
CREATE INDEX idx_performance_metrics_metric_name ON performance_metrics(metric_name);
CREATE INDEX idx_performance_metrics_created_at ON performance_metrics(created_at);

-- Create functions for data management
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_sessions_updated_at 
    BEFORE UPDATE ON user_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to anonymize old data (GDPR compliance)
CREATE OR REPLACE FUNCTION anonymize_old_sessions()
RETURNS void AS $$
BEGIN
    -- Anonymize sessions older than 2 years
    UPDATE user_sessions 
    SET 
        user_agent_hash = 'anonymized',
        referrer_domain = 'anonymized',
        utm_source = NULL,
        utm_medium = NULL,
        utm_campaign = NULL
    WHERE created_at < NOW() - INTERVAL '2 years';
    
    -- Delete error events older than 1 year
    DELETE FROM error_events 
    WHERE created_at < NOW() - INTERVAL '1 year';
    
    -- Delete detailed analytics events older than 1 year
    DELETE FROM analytics_events 
    WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Function to get user segment based on property price
CREATE OR REPLACE FUNCTION get_user_segment(price DECIMAL)
RETURNS user_segment AS $$
BEGIN
    CASE 
        WHEN price < 300000 THEN RETURN 'starter'::user_segment;
        WHEN price < 500000 THEN RETURN 'mid_market'::user_segment;
        WHEN price < 800000 THEN RETURN 'premium'::user_segment;
        ELSE RETURN 'luxury'::user_segment;
    END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to generate session insights
CREATE OR REPLACE FUNCTION get_session_insights(session_uuid UUID)
RETURNS TABLE (
    total_calculations INTEGER,
    avg_property_price DECIMAL,
    most_used_feature TEXT,
    session_duration_minutes INTEGER,
    error_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(mc.id)::INTEGER as total_calculations,
        AVG(mc.property_price) as avg_property_price,
        (SELECT feature_name FROM feature_usage_events 
         WHERE session_id = session_uuid 
         GROUP BY feature_name 
         ORDER BY COUNT(*) DESC 
         LIMIT 1) as most_used_feature,
        (us.session_duration_ms / 60000)::INTEGER as session_duration_minutes,
        (SELECT COUNT(*) FROM error_events WHERE session_id = session_uuid)::INTEGER as error_count
    FROM user_sessions us
    LEFT JOIN mortgage_calculations mc ON us.id = mc.session_id
    WHERE us.id = session_uuid
    GROUP BY us.id, us.session_duration_ms;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies for data protection
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortgage_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortgage_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tab_navigation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE parameter_change_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rent_vs_buy_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (public read/write for analytics)
CREATE POLICY "Allow anonymous access to user_sessions" ON user_sessions
    FOR ALL USING (true);

CREATE POLICY "Allow anonymous access to mortgage_calculations" ON mortgage_calculations
    FOR ALL USING (true);

CREATE POLICY "Allow anonymous access to mortgage_results" ON mortgage_results
    FOR ALL USING (true);

CREATE POLICY "Allow anonymous access to analytics_events" ON analytics_events
    FOR ALL USING (true);

CREATE POLICY "Allow anonymous access to tab_navigation_events" ON tab_navigation_events
    FOR ALL USING (true);

CREATE POLICY "Allow anonymous access to feature_usage_events" ON feature_usage_events
    FOR ALL USING (true);

CREATE POLICY "Allow anonymous access to parameter_change_events" ON parameter_change_events
    FOR ALL USING (true);

CREATE POLICY "Allow anonymous access to error_events" ON error_events
    FOR ALL USING (true);

CREATE POLICY "Allow anonymous access to rent_vs_buy_analysis" ON rent_vs_buy_analysis
    FOR ALL USING (true);

CREATE POLICY "Allow anonymous access to performance_metrics" ON performance_metrics
    FOR ALL USING (true);

-- Create views for common analytics queries
CREATE VIEW session_summary AS
SELECT 
    us.id,
    us.session_id,
    us.created_at,
    us.device_type,
    us.browser_type,
    us.user_segment,
    us.is_returning_user,
    us.calculations_count,
    us.page_views,
    us.session_duration_ms,
    COUNT(mc.id) as actual_calculations,
    AVG(mc.property_price) as avg_property_price,
    COUNT(ee.id) as error_count
FROM user_sessions us
LEFT JOIN mortgage_calculations mc ON us.id = mc.session_id
LEFT JOIN error_events ee ON us.id = ee.session_id
GROUP BY us.id, us.session_id, us.created_at, us.device_type, us.browser_type, 
         us.user_segment, us.is_returning_user, us.calculations_count, 
         us.page_views, us.session_duration_ms;

CREATE VIEW popular_features AS
SELECT 
    feature_name,
    feature_category,
    action,
    COUNT(*) as usage_count,
    COUNT(DISTINCT session_id) as unique_sessions,
    DATE_TRUNC('day', created_at) as usage_date
FROM feature_usage_events
GROUP BY feature_name, feature_category, action, DATE_TRUNC('day', created_at)
ORDER BY usage_count DESC;

CREATE VIEW calculation_trends AS
SELECT 
    DATE_TRUNC('day', created_at) as calculation_date,
    user_segment,
    COUNT(*) as calculation_count,
    AVG(property_price) as avg_property_price,
    AVG(loan_amount) as avg_loan_amount,
    AVG(interest_rate) as avg_interest_rate,
    COUNT(*) FILTER (WHERE is_first_time_buyer = true) as first_time_buyer_count,
    COUNT(*) FILTER (WHERE transfer_tax_exempt = true) as tax_exempt_count
FROM mortgage_calculations
GROUP BY DATE_TRUNC('day', created_at), user_segment
ORDER BY calculation_date DESC, user_segment;

-- Create materialized view for performance metrics dashboard
CREATE MATERIALIZED VIEW performance_dashboard AS
SELECT 
    DATE_TRUNC('hour', created_at) as time_bucket,
    metric_name,
    AVG(metric_value) as avg_value,
    MIN(metric_value) as min_value,
    MAX(metric_value) as max_value,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY metric_value) as median_value,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY metric_value) as p95_value,
    COUNT(*) as sample_count
FROM performance_metrics
GROUP BY DATE_TRUNC('hour', created_at), metric_name
ORDER BY time_bucket DESC, metric_name;

-- Create unique index on materialized view
CREATE UNIQUE INDEX idx_performance_dashboard_unique 
ON performance_dashboard (time_bucket, metric_name);

-- Function to refresh performance dashboard
CREATE OR REPLACE FUNCTION refresh_performance_dashboard()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY performance_dashboard;
END;
$$ LANGUAGE plpgsql;

-- Schedule automatic cleanup (requires pg_cron extension)
-- This would be configured in Supabase dashboard or via cron job
-- SELECT cron.schedule('cleanup-old-data', '0 2 * * *', 'SELECT anonymize_old_sessions();');
-- SELECT cron.schedule('refresh-dashboard', '0 * * * *', 'SELECT refresh_performance_dashboard();');

-- Comments for documentation
COMMENT ON TABLE user_sessions IS 'Anonymous user sessions for analytics (GDPR compliant)';
COMMENT ON TABLE mortgage_calculations IS 'Mortgage calculation parameters and basic results';
COMMENT ON TABLE mortgage_results IS 'Detailed monthly payment data for mortgage calculations';
COMMENT ON TABLE analytics_events IS 'Generic analytics events with flexible properties';
COMMENT ON TABLE tab_navigation_events IS 'Tab navigation patterns for UX analysis';
COMMENT ON TABLE feature_usage_events IS 'Feature usage tracking for product insights';
COMMENT ON TABLE parameter_change_events IS 'Parameter changes for behavior analysis';
COMMENT ON TABLE error_events IS 'Error tracking for debugging and monitoring';
COMMENT ON TABLE rent_vs_buy_analysis IS 'Detailed rent vs buy comparison results';
COMMENT ON TABLE performance_metrics IS 'Application performance metrics';

COMMENT ON FUNCTION get_user_segment IS 'Categorizes users based on property price ranges';
COMMENT ON FUNCTION get_session_insights IS 'Provides summary insights for a user session';
COMMENT ON FUNCTION anonymize_old_sessions IS 'GDPR compliance function to anonymize old data';
COMMENT ON FUNCTION refresh_performance_dashboard IS 'Updates the performance metrics dashboard';