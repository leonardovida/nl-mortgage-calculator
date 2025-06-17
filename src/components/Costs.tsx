
import { InputField } from './InputField';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

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
  onChange: (field: string, value: number) => void;
};

export function Costs(props: Props) {
  const bankGuarantee = 0.001 * props.price;
  const transferTax = 0.02 * props.price;
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
            <InputField
              title="Transfer tax"
              prepend="€"
              disabled
              value={transferTax}
              onChange={() => {}}
            />
            <InputField
              title="Valuation"
              prepend="€"
              value={props.valuation}
              onChange={(value) =>
                props.onChange('valuation', parseInt(value, 10))
              }
            />
            <InputField
              title="Real estate agent"
              prepend="€"
              value={props.realStateAgent}
              onChange={(value) =>
                props.onChange('realStateAgent', parseInt(value, 10))
              }
            />
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
            <InputField
              title="Notary"
              prepend="€"
              value={props.notary}
              onChange={(value) => props.onChange('notary', parseInt(value, 10))}
            />
            <InputField
              title="Financial advisor"
              prepend="€"
              value={props.financialAdvisor}
              onChange={(value) =>
                props.onChange('financialAdvisor', parseInt(value, 10))
              }
            />
            <InputField
              title="NHG"
              prepend="€"
              disabled
              value={nhg}
              onChange={() => {}}
            />
            <InputField
              title="Structural survey"
              prepend="€"
              value={props.structuralSurvey}
              onChange={(value) =>
                props.onChange('structuralSurvey', parseInt(value, 10))
              }
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
