'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';
import { analytics } from '@features/analytics/lib/analytics';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Track error with PostHog analytics
    this.trackError(error, errorInfo);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });
  }

  private trackError = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // Determine error type based on error message and context
      let errorType: 'calculation_error' | 'component_error' | 'network_error' | 'validation_error' = 'component_error';
      
      const errorMessage = error.message.toLowerCase();
      const componentStack = errorInfo.componentStack?.toLowerCase() || '';
      
      if (errorMessage.includes('calculation') || 
          errorMessage.includes('mortgage') || 
          errorMessage.includes('interest') || 
          errorMessage.includes('payment') ||
          errorMessage.includes('infinity') ||
          errorMessage.includes('nan')) {
        errorType = 'calculation_error';
      } else if (errorMessage.includes('fetch') || 
                 errorMessage.includes('network') ||
                 errorMessage.includes('load')) {
        errorType = 'network_error';
      } else if (errorMessage.includes('invalid') ||
                 errorMessage.includes('validation') ||
                 errorMessage.includes('required')) {
        errorType = 'validation_error';
      }

      // Extract component name from stack
      const componentMatch = componentStack.match(/at (\w+)/);
      const componentName = componentMatch ? componentMatch[1] : 'Unknown';

      // Track the error
      analytics.trackError({
        error_type: errorType,
        error_message: error.message,
        error_stack: error.stack,
        component: componentName,
        user_action: this.getUserAction(componentStack),
      });

      // Track user journey step for error recovery
      analytics.trackUserJourneyStep({
        step: 'error_encountered',
        step_category: 'calculation',
        time_spent_seconds: 0,
      });

    } catch (trackingError) {
      // Don't let tracking errors break the error boundary
      console.warn('Failed to track error:', trackingError);
    }
  };

  private getUserAction = (componentStack: string): string => {
    if (componentStack.includes('mortgage')) return 'mortgage_calculation';
    if (componentStack.includes('costs')) return 'cost_calculation';
    if (componentStack.includes('rent')) return 'rent_vs_buy_analysis';
    if (componentStack.includes('graph')) return 'chart_rendering';
    if (componentStack.includes('table')) return 'data_table_rendering';
    return 'unknown_action';
  };

  private handleReset = () => {
    // Track error recovery attempt
    try {
      analytics.trackUserJourneyStep({
        step: 'error_recovery_attempted',
        step_category: 'calculation',
        completion_rate: 0.5, // User attempted recovery
      });
    } catch (error) {
      console.warn('Failed to track error recovery:', error);
    }
    
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
    // Track page reload attempt
    try {
      analytics.trackUserJourneyStep({
        step: 'page_reload_attempted',
        step_category: 'calculation',
        completion_rate: 0.25, // User chose to reload instead of retry
      });
    } catch (error) {
      console.warn('Failed to track page reload:', error);
    }
    
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      const isMortgageError = this.state.error?.message.includes('mortgage') ||
                             this.state.error?.message.includes('calculation') ||
                             this.state.error?.message.includes('interest') ||
                             this.state.error?.message.includes('payment');

      return (
        <Card className="w-full max-w-2xl mx-auto mt-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
              <div>
                <CardTitle>
                  {isMortgageError ? 'Calculation Error' : 'Component Error'}
                </CardTitle>
                <CardDescription>
                  {isMortgageError
                    ? 'There was an error with the mortgage calculation. This might be due to invalid input values or a calculation overflow.'
                    : 'An unexpected error occurred while rendering this component.'
                  }
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isMortgageError && (
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <h4 className="font-medium text-amber-800 mb-2">Common causes:</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Property price or loan amount is too high</li>
                    <li>• Interest rate is invalid (negative or extremely high)</li>
                    <li>• Loan term is invalid (0 or negative months)</li>
                    <li>• Input values contain non-numeric characters</li>
                  </ul>
                </div>
              )}
              
              <details className="bg-muted p-4 rounded-md">
                <summary className="cursor-pointer font-medium text-sm flex items-center gap-2">
                  <Bug className="h-4 w-4" />
                  Error Details (for developers)
                </summary>
                <div className="mt-3 text-xs font-mono space-y-2">
                  <div>
                    <strong>Error:</strong>
                    <pre className="mt-1 overflow-auto bg-background p-2 rounded text-destructive">
                      {this.state.error?.message}
                    </pre>
                  </div>
                  {this.state.error?.stack && (
                    <div>
                      <strong>Stack Trace:</strong>
                      <pre className="mt-1 overflow-auto bg-background p-2 rounded text-xs max-h-32">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 overflow-auto bg-background p-2 rounded text-xs max-h-32">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={this.handleReset} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={this.handleReload} variant="outline" className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Page
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

// HOC for easier usage
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

// Hook for error reporting
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Manual error report:', error, errorInfo);
    
    if (process.env.NODE_ENV === 'production') {
      // Send to error tracking service
      // errorTrackingService.captureException(error, {
      //   extra: errorInfo,
      //   tags: { source: 'manual' }
      // });
    }
  };
}