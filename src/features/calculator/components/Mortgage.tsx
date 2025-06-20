'use client';

import { useState } from 'react';
import { InputField } from './InputField';
import { AnalyticsInputField } from '@features/analytics/components/AnalyticsInputField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalyticsContext } from '@features/analytics/components/AnalyticsProvider';

type Props = {
  price: number;
  savings: number;
  cost: number;
  loan: number;
  interest: number;
  percentage: number;
  deduction: number;
  rent: number;
  annuity: {
    totalPaidGross: number;
    totalPaidNet: number;
    totalInterestGross: number;
    totalInterestNet: number;
    totalInvestedGross: number;
    totalInvestedNet: number;
  };
  linear: {
    totalPaidGross: number;
    totalPaidNet: number;
    totalInterestGross: number;
    totalInterestNet: number;
    totalInvestedGross: number;
    totalInvestedNet: number;
  };
  onChange: (field: string, value: number) => void;
};

export function Mortgage(props: Props) {
  const { isInitialized, consentStatus } = useAnalyticsContext();
  const shouldUseAnalytics = isInitialized && consentStatus === 'accepted';
  const [showAdvanced, setShowAdvanced] = useState(false);

  function ColumnInputField(input: {
    title: string;
    prepend: string;
    append?: string;
    value: number;
    field: string | null;
    disabled?: boolean;
  }) {
    // Use analytics-enabled input for editable fields when analytics is enabled
    if (shouldUseAnalytics && input.field && !input.disabled) {
      return (
        <AnalyticsInputField
          disabled={input.disabled}
          title={input.title}
          prepend={input.prepend}
          append={input.append}
          value={input.value}
          parameterName={input.field as any}
          component="Mortgage"
          fieldType="input"
          formSection={showAdvanced ? "advanced_inputs" : "basic_inputs"}
          onChange={(value) =>
            input.field && props.onChange(input.field, parseFloat(value))
          }
        />
      );
    }

    // Fallback to regular InputField for disabled fields or when analytics is disabled
    return (
      <InputField
        disabled={input.disabled}
        title={input.title}
        prepend={input.prepend}
        append={input.append}
        value={input.value}
        onChange={(value) =>
          input.field && props.onChange(input.field, parseFloat(value))
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Inputs - Always Visible */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                Mortgage Calculator
              </CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Enter your basic property and loan information
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Netherlands Market</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="space-y-4">
              <ColumnInputField
                title="House price"
                prepend="€"
                value={props.price}
                field={'price'}
              />
              <ColumnInputField
                title="Own savings"
                prepend="€"
                value={props.savings}
                field={'savings'}
              />
            </div>
            <div className="space-y-4">
              <ColumnInputField
                title="Interest rate"
                prepend="%"
                value={props.interest}
                field={'interest'}
              />
              <ColumnInputField
                title="Current rent"
                prepend="€"
                value={props.rent}
                field={'rent'}
              />
            </div>
            <div className="space-y-4">
              <ColumnInputField
                title="Required loan"
                prepend="€"
                value={props.loan}
                field={null}
                disabled
              />
              <ColumnInputField
                title="Purchase cost"
                prepend="€"
                value={props.cost}
                field={null}
                disabled
              />
            </div>
            <div className="space-y-4">
              <ColumnInputField
                title="Loan to Value (%)"
                prepend=""
                value={Math.round(props.percentage * 100)}
                field={null}
                disabled
              />
              <ColumnInputField
                title="Remaining savings"
                prepend="€"
                value={props.savings - props.cost}
                field={null}
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Toggle Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
        >
          <svg 
            className={`w-4 h-4 transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <span>{showAdvanced ? 'Hide Advanced' : 'Show Advanced'} Options</span>
        </button>
      </div>

      {/* Advanced Inputs - Collapsible */}
      {showAdvanced && (
        <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Advanced Mortgage Terms */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">Advanced Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ColumnInputField
                  title="Interest deduction"
                  prepend="%"
                  value={props.deduction}
                  field={'deduction'}
                />
                <ColumnInputField
                  title="Total rent investment (30y)"
                  prepend="€"
                  value={props.rent * 360}
                  field={null}
                  disabled
                />
                <ColumnInputField
                  title="Rent vs mortgage (gross)"
                  prepend="€"
                  value={props.rent * 360 - props.annuity.totalInvestedGross}
                  field={null}
                  disabled
                />
                <ColumnInputField
                  title="Rent vs mortgage (net)"
                  prepend="€"
                  value={props.rent * 360 - props.annuity.totalInvestedNet}
                  field={null}
                  disabled
                />
              </CardContent>
            </Card>

            {/* Annuity Summary */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">Annuity Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ColumnInputField
                  title="Total repaid (gross)"
                  prepend="€"
                  value={props.annuity.totalPaidGross}
                  field={null}
                  disabled
                />
                <ColumnInputField
                  title="Total interest (gross)"
                  prepend="€"
                  value={props.annuity.totalInterestGross}
                  field={null}
                  disabled
                />
                <ColumnInputField
                  title="Total invested (gross)"
                  prepend="€"
                  value={props.annuity.totalInvestedGross}
                  field={null}
                  disabled
                />
                <ColumnInputField
                  title="Total repaid (net)"
                  prepend="€"
                  value={props.annuity.totalPaidNet}
                  field={null}
                  disabled
                />
                <ColumnInputField
                  title="Total interest (net)"
                  prepend="€"
                  value={props.annuity.totalInterestNet}
                  field={null}
                  disabled
                />
                <ColumnInputField
                  title="Total invested (net)"
                  prepend="€"
                  value={props.annuity.totalInvestedNet}
                  field={null}
                  disabled
                />
              </CardContent>
            </Card>

            {/* Linear Summary */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-lg">Linear Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ColumnInputField
                  title="Total repaid (gross)"
                  prepend="€"
                  value={props.linear.totalPaidGross}
                  field={null}
                  disabled
                />
                <ColumnInputField
                  title="Total interest (gross)"
                  prepend="€"
                  value={props.linear.totalInterestGross}
                  field={null}
                  disabled
                />
                <ColumnInputField
                  title="Total invested (gross)"
                  prepend="€"
                  value={props.linear.totalInvestedGross}
                  field={null}
                  disabled
                />
                <ColumnInputField
                  title="Total repaid (net)"
                  prepend="€"
                  value={props.linear.totalPaidNet}
                  field={null}
                  disabled
                />
                <ColumnInputField
                  title="Total interest (net)"
                  prepend="€"
                  value={props.linear.totalInterestNet}
                  field={null}
                  disabled
                />
                <ColumnInputField
                  title="Total invested (net)"
                  prepend="€"
                  value={props.linear.totalInvestedNet}
                  field={null}
                  disabled
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
