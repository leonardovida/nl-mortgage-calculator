'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log error to console and optionally to external service
    console.error('Application error:', error);
    
    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error tracking service
      // errorTrackingService.captureException(error);
    }
  }, [error]);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const isCalculationError = error.message.includes('calculation') || 
                           error.message.includes('mortgage') ||
                           error.message.includes('interest') ||
                           error.message.includes('payment');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-xl">
            {isCalculationError ? 'Calculation Error' : 'Something went wrong'}
          </CardTitle>
          <CardDescription>
            {isCalculationError
              ? 'There was an error processing your mortgage calculation. Please check your inputs and try again.'
              : 'We apologize for the inconvenience. An unexpected error occurred.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md mb-4">
            <p className="font-mono text-xs break-all">
              Error: {error.message}
            </p>
            {error.digest && (
              <p className="font-mono text-xs mt-1 opacity-70">
                ID: {error.digest}
              </p>
            )}
          </div>
          <p className="text-sm text-center text-muted-foreground">
            If this problem persists, please refresh the page or contact support.
          </p>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button 
            onClick={reset} 
            className="flex-1"
            variant="default"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button 
            onClick={handleGoHome} 
            variant="outline"
            className="flex-1"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}