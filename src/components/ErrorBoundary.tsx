'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Bug } from 'lucide-react';

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
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error tracking service
      // errorTrackingService.captureException(error, {
      //   extra: errorInfo,
      //   tags: { component: 'ErrorBoundary' }
      // });
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleReload = () => {
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