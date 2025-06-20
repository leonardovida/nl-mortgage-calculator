'use client';

import { InputField } from './InputField';
import { AnalyticsInputField, AnalyticsToggle } from '@features/analytics/components/AnalyticsInputField';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAnalyticsContext } from '@features/analytics/components/AnalyticsProvider';

export const MAX_NHG = 405000;
export const NHG_FEE = 0.006;

type Props = {
  price: number;
  savings: number;
  loan: number;
  notary: number;
  valuation: number;
  financialAdvisor: number;
  realStateAgent: number;
  structuralSurvey: number;
  isFirstTimeBuyer: boolean;
  transferTaxRate: number;
  transferTax: number;
  transferTaxExempt: boolean;
  onChange: (field: string, value: number) => void;
  onBooleanChange: (field: string, value: boolean) => void;
};

export function Costs(props: Props) {
  const { isInitialized, consentStatus } = useAnalyticsContext();
  const shouldUseAnalytics = isInitialized && consentStatus === 'accepted';
  
  const bankGuarantee = 0.001 * props.price;
  const nhg = props.price > MAX_NHG ? 0 : NHG_FEE * props.loan;

  return (
    <div className="space-y-6">
      {/* Mobile-first responsive 2-column grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fixed Costs Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Fixed Costs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* First-time buyer toggle */}
            {shouldUseAnalytics ? (
              <AnalyticsToggle
                title="First-time buyer"
                value={props.isFirstTimeBuyer}
                onChange={(value) => props.onBooleanChange('isFirstTimeBuyer', value)}
                parameterName="isFirstTimeBuyer"
                component="Costs"
                formSection="tax_settings"
                description={props.isFirstTimeBuyer ? "No transfer tax for houses under €525,000" : undefined}
              />
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  First-time buyer
                </label>
                <Button
                  variant={props.isFirstTimeBuyer ? "default" : "outline"}
                  size="sm"
                  onClick={() => props.onBooleanChange('isFirstTimeBuyer', !props.isFirstTimeBuyer)}
                  className="w-full"
                >
                  {props.isFirstTimeBuyer ? "Yes" : "No"}
                </Button>
                {props.isFirstTimeBuyer && (
                  <p className="text-xs text-muted-foreground">
                    No transfer tax for houses under €525,000
                  </p>
                )}
              </div>
            )}

            {/* Transfer tax rate (only shown if not exempt) */}
            {!props.transferTaxExempt && (
              shouldUseAnalytics ? (
                <AnalyticsInputField
                  title="Transfer tax rate"
                  append="%"
                  value={props.transferTaxRate}
                  parameterName="transferTaxRate"
                  component="Costs"
                  fieldType="input"
                  formSection="tax_settings"
                  onChange={(value) =>
                    props.onChange('transferTaxRate', parseFloat(value))
                  }
                />
              ) : (
                <InputField
                  title="Transfer tax rate"
                  append="%"
                  value={props.transferTaxRate}
                  onChange={(value) =>
                    props.onChange('transferTaxRate', parseFloat(value))
                  }
                />
              )
            )}

            {/* Transfer tax amount */}
            <div className="space-y-2">
              <InputField
                title={`Transfer tax ${props.transferTaxExempt ? '(EXEMPT)' : ''}`}
                prepend="€"
                disabled
                value={props.transferTax}
                onChange={() => {}}
              />
              {props.transferTaxExempt && (
                <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Savings: €{(props.price * 0.02).toLocaleString()}
                </p>
              )}
            </div>
{shouldUseAnalytics ? (
              <AnalyticsInputField
                title="Valuation"
                prepend="€"
                value={props.valuation}
                parameterName="valuation"
                component="Costs"
                fieldType="input"
                formSection="fixed_costs"
                onChange={(value) =>
                  props.onChange('valuation', parseInt(value, 10))
                }
              />
            ) : (
              <InputField
                title="Valuation"
                prepend="€"
                value={props.valuation}
                onChange={(value) =>
                  props.onChange('valuation', parseInt(value, 10))
                }
              />
            )}
            {shouldUseAnalytics ? (
              <AnalyticsInputField
                title="Real estate agent"
                prepend="€"
                value={props.realStateAgent}
                parameterName="realStateAgent"
                component="Costs"
                fieldType="input"
                formSection="fixed_costs"
                onChange={(value) =>
                  props.onChange('realStateAgent', parseInt(value, 10))
                }
              />
            ) : (
              <InputField
                title="Real estate agent"
                prepend="€"
                value={props.realStateAgent}
                onChange={(value) =>
                  props.onChange('realStateAgent', parseInt(value, 10))
                }
              />
            )}
            <InputField
              title="Bank guarantee"
              prepend="€"
              disabled
              value={bankGuarantee}
              onChange={() => {}}
            />
          </CardContent>
        </Card>

        {/* Professional Services Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Professional Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
{shouldUseAnalytics ? (
              <AnalyticsInputField
                title="Notary"
                prepend="€"
                value={props.notary}
                parameterName="notary"
                component="Costs"
                fieldType="input"
                formSection="professional_services"
                onChange={(value) => props.onChange('notary', parseInt(value, 10))}
              />
            ) : (
              <InputField
                title="Notary"
                prepend="€"
                value={props.notary}
                onChange={(value) => props.onChange('notary', parseInt(value, 10))}
              />
            )}
            {shouldUseAnalytics ? (
              <AnalyticsInputField
                title="Financial advisor"
                prepend="€"
                value={props.financialAdvisor}
                parameterName="financialAdvisor"
                component="Costs"
                fieldType="input"
                formSection="professional_services"
                onChange={(value) =>
                  props.onChange('financialAdvisor', parseInt(value, 10))
                }
              />
            ) : (
              <InputField
                title="Financial advisor"
                prepend="€"
                value={props.financialAdvisor}
                onChange={(value) =>
                  props.onChange('financialAdvisor', parseInt(value, 10))
                }
              />
            )}
            <InputField
              title="NHG"
              prepend="€"
              disabled
              value={nhg}
              onChange={() => {}}
            />
{shouldUseAnalytics ? (
              <AnalyticsInputField
                title="Structural survey"
                prepend="€"
                value={props.structuralSurvey}
                parameterName="structuralSurvey"
                component="Costs"
                fieldType="input"
                formSection="professional_services"
                onChange={(value) =>
                  props.onChange('structuralSurvey', parseInt(value, 10))
                }
              />
            ) : (
              <InputField
                title="Structural survey"
                prepend="€"
                value={props.structuralSurvey}
                onChange={(value) =>
                  props.onChange('structuralSurvey', parseInt(value, 10))
                }
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
