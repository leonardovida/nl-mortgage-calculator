'use client';

import { Button } from '@/components/ui/button';

/**
 * Skip Navigation component for accessibility
 * Allows keyboard users to skip directly to main content
 */
export function SkipNavigation() {
  const handleSkipToMain = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSkipToCalculator = () => {
    const calculator = document.getElementById('mortgage-calculator');
    if (calculator) {
      calculator.focus();
      calculator.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sr-only focus-within:not-sr-only">
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSkipToMain}
          className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white focus:bg-primary focus:text-white transition-colors"
        >
          Skip to main content
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSkipToCalculator}
          className="bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white focus:bg-primary focus:text-white transition-colors"
        >
          Skip to calculator
        </Button>
      </div>
    </div>
  );
}