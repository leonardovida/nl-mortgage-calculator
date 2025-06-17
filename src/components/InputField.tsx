
import * as React from 'react';
import { NumericFormat } from 'react-number-format';

type InputFieldProps = {
  title: string;
  prepend?: string;
  append?: string;
  value: string | number;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

/**
 * Modern InputField component with shadcn/ui inspired design
 * Features:
 * - Mobile-friendly with proper touch targets (h-12 on mobile, h-10 on desktop)
 * - Accessible with proper labeling and focus states
 * - Support for prepend/append text (€, %, etc.)
 * - NumericFormat integration for number handling
 * - Clean modern design with subtle shadows and transitions
 * - Disabled state handling
 * - Dark mode support
 */
export function InputField({
  title,
  prepend,
  append,
  value,
  onChange,
  disabled = false,
  className = '',
  ...props
}: InputFieldProps) {
  const inputId = `input-${title.replace(/\s+/g, '-').toLowerCase()}`;
  
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
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            const cleanValue = e.currentTarget.value.replace(/,/g, '');
            onChange(cleanValue);
          }}
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
