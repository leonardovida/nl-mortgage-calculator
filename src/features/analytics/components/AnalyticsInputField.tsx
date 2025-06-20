'use client';

import * as React from 'react';
import { useState, useRef, useCallback } from 'react';
import { NumericFormat } from 'react-number-format';
import { useAnalytics } from '../lib/analytics';
import { useAnalyticsContext } from './AnalyticsProvider';
import { MortgageParameter } from '../lib/analytics';

type AnalyticsInputFieldProps = {
  title: string;
  prepend?: string;
  append?: string;
  value: string | number;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  // Analytics specific props
  parameterName?: MortgageParameter;
  component: string;
  fieldType?: 'input' | 'toggle' | 'calculated';
  formSection: string;
};

/**
 * Enhanced InputField component with comprehensive analytics tracking
 * Tracks all user interactions including focus, blur, changes, and validation errors
 */
export function AnalyticsInputField({
  title,
  prepend,
  append,
  value,
  onChange,
  disabled = false,
  className = '',
  parameterName,
  component,
  fieldType = 'input',
  formSection,
  ...props
}: AnalyticsInputFieldProps) {
  const inputId = `input-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const { isInitialized, consentStatus } = useAnalyticsContext();
  const analytics = useAnalytics();
  
  // Analytics state
  const [previousValue, setPreviousValue] = useState<string | number>(value);
  const [focusStartTime, setFocusStartTime] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Track form interactions if analytics is enabled
  const trackFormInteraction = useCallback((
    interactionType: 'focus' | 'blur' | 'change' | 'submit',
    fieldValue?: string | number,
    validationErrors?: string[]
  ) => {
    if (isInitialized && consentStatus === 'accepted') {
      analytics.trackFormInteraction({
        field_name: parameterName || title.toLowerCase().replace(/\s+/g, '_'),
        interaction_type: interactionType,
        field_value: fieldValue,
        form_section: formSection,
        validation_errors: validationErrors,
      });
    }
  }, [isInitialized, consentStatus, analytics, parameterName, title, formSection]);

  // Track mortgage parameter changes
  const trackParameterChange = useCallback((newValue: string | number) => {
    if (isInitialized && consentStatus === 'accepted' && parameterName) {
      // Debounce parameter tracking to avoid excessive events
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        analytics.trackMortgageParameterChanged({
          parameter: parameterName,
          value: typeof newValue === 'string' ? parseFloat(newValue) || 0 : newValue,
          previous_value: typeof previousValue === 'string' ? parseFloat(previousValue) || 0 : previousValue,
          field_type: fieldType,
          component: component,
        });
      }, 1000); // 1 second debounce
    }
  }, [isInitialized, consentStatus, analytics, parameterName, previousValue, fieldType, component]);

  // Handle focus events
  const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setFocusStartTime(Date.now());
    setHasInteracted(true);
    trackFormInteraction('focus', e.currentTarget.value);
  }, [trackFormInteraction]);

  // Handle blur events
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    const cleanValue = e.currentTarget.value.replace(/,/g, '');
    const focusEndTime = Date.now();
    const focusDuration = focusStartTime ? focusEndTime - focusStartTime : 0;
    
    // Track field interaction duration
    trackFormInteraction('blur', cleanValue);
    
    // Track parameter change if value actually changed
    if (cleanValue !== previousValue.toString()) {
      trackParameterChange(cleanValue);
      setPreviousValue(cleanValue);
    }
    
    // Track focus duration for UX insights
    if (isInitialized && consentStatus === 'accepted' && focusDuration > 0) {
      analytics.trackUserJourneyStep({
        step: `field_interaction_${parameterName || title.toLowerCase().replace(/\s+/g, '_')}`,
        step_category: 'configuration',
        time_spent_seconds: Math.round(focusDuration / 1000),
      });
    }
    
    setFocusStartTime(null);
    onChange(cleanValue);
  }, [trackFormInteraction, trackParameterChange, previousValue, onChange, focusStartTime, isInitialized, consentStatus, analytics, parameterName, title]);

  // Handle change events (for real-time feedback)
  const handleChange = useCallback((values: any) => {
    const { value: newValue } = values;
    if (hasInteracted) {
      trackFormInteraction('change', newValue);
    }
  }, [trackFormInteraction, hasInteracted]);

  // Validate input and track validation errors
  const validateInput = useCallback((inputValue: string | number): string[] => {
    const errors: string[] = [];
    const numValue = typeof inputValue === 'string' ? parseFloat(inputValue) : inputValue;
    
    if (parameterName === 'price' && numValue < 50000) {
      errors.push('Property price seems unusually low');
    }
    if (parameterName === 'interest' && (numValue < 0.1 || numValue > 15)) {
      errors.push('Interest rate outside normal range (0.1% - 15%)');
    }
    if (parameterName === 'savings' && numValue < 0) {
      errors.push('Savings cannot be negative');
    }
    
    return errors;
  }, [parameterName]);

  // Enhanced onChange with validation
  const handleValidatedChange = useCallback((cleanValue: string) => {
    const validationErrors = validateInput(cleanValue);
    
    if (validationErrors.length > 0 && hasInteracted) {
      trackFormInteraction('change', cleanValue, validationErrors);
    }
    
    onChange(cleanValue);
  }, [validateInput, trackFormInteraction, hasInteracted, onChange]);

  // Cleanup debounce timer
  React.useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <div className={`space-y-2 ${className}`}>
      <label 
        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
        htmlFor={inputId}
      >
        {title}
      </label>
      <div className="relative">
        {prepend && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium select-none">
              {prepend}
            </span>
          </div>
        )}
        <NumericFormat
          id={inputId}
          inputMode="decimal"
          decimalScale={2}
          thousandSeparator={true}
          value={value}
          disabled={disabled}
          className={`
            w-full h-12 md:h-10 px-3 py-2 text-sm
            border border-slate-300 dark:border-slate-600
            bg-white dark:bg-slate-900
            text-slate-900 dark:text-slate-100
            placeholder-slate-400 dark:placeholder-slate-500
            rounded-md shadow-sm
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
            dark:focus:ring-blue-400/20 dark:focus:border-blue-400
            disabled:cursor-not-allowed disabled:opacity-50 
            disabled:bg-slate-50 dark:disabled:bg-slate-800
            ${prepend ? 'pl-8' : ''}
            ${append ? 'pr-12' : ''}
          `.replace(/\s+/g, ' ').trim()}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onValueChange={handleChange}
          {...props}
        />
        {append && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none">
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium select-none">
              {append}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced toggle button with analytics
type AnalyticsToggleProps = {
  title: string;
  value: boolean;
  onChange: (value: boolean) => void;
  parameterName: MortgageParameter;
  component: string;
  formSection: string;
  className?: string;
  description?: string;
};

export function AnalyticsToggle({
  title,
  value,
  onChange,
  parameterName,
  component,
  formSection,
  className = '',
  description,
}: AnalyticsToggleProps) {
  const { isInitialized, consentStatus } = useAnalyticsContext();
  const analytics = useAnalytics();

  const handleToggle = useCallback(() => {
    const newValue = !value;
    onChange(newValue);

    // Track toggle interaction
    if (isInitialized && consentStatus === 'accepted') {
      analytics.trackMortgageParameterChanged({
        parameter: parameterName,
        value: newValue,
        previous_value: value,
        field_type: 'toggle',
        component: component,
      });

      analytics.trackFormInteraction({
        field_name: parameterName,
        interaction_type: 'change',
        field_value: newValue.toString(),
        form_section: formSection,
      });
    }
  }, [value, onChange, isInitialized, consentStatus, analytics, parameterName, component, formSection]);

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-foreground">
        {title}
      </label>
      <button
        type="button"
        onClick={handleToggle}
        className={`
          w-full px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
          ${value 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
          }
        `}
      >
        {value ? "Yes" : "No"}
      </button>
      {description && (
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}