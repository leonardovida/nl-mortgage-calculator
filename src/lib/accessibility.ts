/**
 * Accessibility utilities and constants for the mortgage calculator
 */

// ARIA labels and descriptions for mortgage calculator elements
export const ARIA_LABELS = {
  // Main sections
  mortgageInfo: 'Mortgage information input section',
  mortgageStructure: 'Mortgage structure comparison section',
  results: 'Calculation results section',
  
  // Input fields
  propertyPrice: 'Property price in euros. Enter the total purchase price of the property.',
  interestRate: 'Annual interest rate percentage. Current mortgage interest rate offered by your lender.',
  taxDeduction: 'Tax deduction percentage. Dutch mortgage interest tax deduction rate based on your income bracket.',
  savings: 'Available savings amount in euros. Total amount you have available for down payment and costs.',
  rent: 'Current monthly rent in euros. Your current housing cost for comparison purposes.',
  notaryCost: 'Notary fees in euros. Legal costs for property transfer documentation.',
  valuationCost: 'Property valuation cost in euros. Required appraisal fee for mortgage approval.',
  financialAdvisorCost: 'Financial advisor fee in euros. Cost of mortgage consultation services.',
  realEstateAgentCost: 'Real estate agent commission in euros. Buyer agent fees including VAT.',
  structuralSurveyCost: 'Structural survey cost in euros. Property inspection and condition report.',
  
  // Buttons and controls
  calculate: 'Calculate mortgage payments and update results',
  reset: 'Reset all form values to default',
  toggleMortgageType: 'Switch between annuity and linear mortgage types',
  
  // Data display
  monthlyPayment: 'Monthly mortgage payment amount after tax deductions',
  totalInterest: 'Total interest payments over the complete mortgage term',
  totalCost: 'Total cost of the mortgage including all fees and interest',
  loanAmount: 'Required loan amount after deducting savings and costs',
  loanToValueRatio: 'Loan to value ratio as percentage of property price',
  
  // Charts and graphs
  mortgageChart: 'Interactive chart showing mortgage payment breakdown over time. Use arrow keys to navigate data points.',
  chartLegend: 'Chart legend explaining data series colors and patterns',
  
  // Table navigation
  previousMonth: 'View previous month data in payment schedule',
  nextMonth: 'View next month data in payment schedule',
  sortColumn: 'Sort table by this column',
  
  // Error states
  calculationError: 'Error message for invalid calculation inputs',
  networkError: 'Network connection error message',
  validationError: 'Form validation error requiring attention',
  
  // Skip links
  skipToMain: 'Skip to main content section',
  skipToCalculator: 'Skip directly to mortgage calculator',
  skipToResults: 'Skip to calculation results',
  
  // Live regions
  calculationStatus: 'Calculation status updates',
  errorAnnouncements: 'Error and validation announcements',
  successAnnouncements: 'Success and completion announcements',
} as const;

// ARIA descriptions for complex elements
export const ARIA_DESCRIPTIONS = {
  mortgageComparison: 'This table compares annuity and linear mortgage structures showing monthly payments, interest, and principal over the loan term',
  interestChart: 'Line chart displaying how interest payments change over time for both mortgage types',
  paymentBreakdown: 'Detailed breakdown of monthly payment components including principal, interest, and net amounts after tax deduction',
  costCalculator: 'Calculator for additional property purchase costs including notary, valuation, and advisor fees',
} as const;

// Screen reader announcements
export const SCREEN_READER_MESSAGES = {
  calculationComplete: 'Mortgage calculation completed. Results are now available.',
  errorOccurred: 'An error occurred during calculation. Please check your inputs.',
  dataUpdated: 'Mortgage data has been updated based on your changes.',
  tabChanged: 'Active tab changed. New content is now displayed.',
} as const;

/**
 * Utility function to generate unique IDs for form elements
 */
export function generateId(prefix: string, suffix?: string): string {
  const base = prefix.toLowerCase().replace(/\s+/g, '-');
  const timestamp = Date.now().toString(36);
  return suffix ? `${base}-${suffix}-${timestamp}` : `${base}-${timestamp}`;
}

/**
 * Utility function to announce messages to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove the announcement after it's been read
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Focus management utilities
 */
export const focusUtils = {
  /**
   * Trap focus within a container element
   */
  trapFocus: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  },

  /**
   * Move focus to the first focusable element in a container
   */
  focusFirst: (container: HTMLElement) => {
    const firstFocusable = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement;
    firstFocusable?.focus();
  },

  /**
   * Manage focus for tab navigation
   */
  handleTabKeydown: (e: KeyboardEvent, onPrevious: () => void, onNext: () => void) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        onPrevious();
      } else {
        onNext();
      }
    }
  },
};

/**
 * Keyboard navigation constants
 */
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End',
} as const;

/**
 * Color contrast utilities for accessibility
 */
export const colorUtils = {
  /**
   * Check if a color combination meets WCAG contrast requirements
   */
  meetsContrastRequirement: (foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
    // This is a simplified check - in production, you'd use a proper contrast calculation library
    const requiredRatio = level === 'AAA' ? 7 : 4.5;
    // Implementation would go here
    return true; // Placeholder
  },
};

/**
 * Reduced motion utilities
 */
export const motionUtils = {
  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion: (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
  
  /**
   * Get animation duration based on user preference
   */
  getAnimationDuration: (normalDuration: number): number => {
    return motionUtils.prefersReducedMotion() ? 0 : normalDuration;
  },
};

/**
 * Form validation accessibility utilities
 */
export const validationUtils = {
  /**
   * Create accessible error message for form fields
   */
  createErrorMessage: (fieldId: string, message: string): string => {
    return `${fieldId}-error`;
  },
  
  /**
   * Get ARIA attributes for form field with validation
   */
  getFieldAriaAttributes: (fieldId: string, hasError: boolean, errorMessage?: string) => {
    const attributes: Record<string, string> = {};
    
    if (hasError && errorMessage) {
      attributes['aria-invalid'] = 'true';
      attributes['aria-describedby'] = `${fieldId}-error`;
    }
    
    return attributes;
  },
};