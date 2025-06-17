
import { InputField } from './InputField';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

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
  function ColumnInputField(input: {
    title: string;
    prepend: string;
    append?: string;
    value: number;
    field: string | null;
    disabled?: boolean;
  }) {
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
      {/* Mobile-first responsive grid layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Property Details Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <ColumnInputField
              title="Purchase cost"
              prepend="€"
              value={props.cost}
              field={null}
              disabled
            />
            <ColumnInputField
              title="Remaining = Savings - Cost"
              prepend="€"
              value={props.savings - props.cost}
              field={null}
              disabled
            />
            <ColumnInputField
              title="Required loan"
              prepend="€"
              value={props.loan}
              field={null}
              disabled
            />
            <ColumnInputField
              title="Loan / Price Rate (%)"
              prepend="%"
              value={props.percentage * 100}
              field={null}
              disabled
            />
          </CardContent>
        </Card>

        {/* Mortgage Terms Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Mortgage Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ColumnInputField
              title="Interest"
              prepend="%"
              value={props.interest}
              field={'interest'}
            />
            <ColumnInputField
              title="Interest deduction"
              prepend="%"
              value={props.deduction}
              field={'deduction'}
            />
            <ColumnInputField
              title="Current rent"
              prepend="€"
              value={props.rent}
              field={'rent'}
            />
            <ColumnInputField
              title="Total invested on rent (30 years)"
              prepend="€"
              value={props.rent * 360}
              field={null}
            />
            <ColumnInputField
              title="Total rent - Total cost (gross)"
              prepend="€"
              value={props.rent * 360 - props.annuity.totalInvestedGross}
              field={null}
              disabled
            />
            <ColumnInputField
              title="Total rent - Total cost (net)"
              prepend="€"
              value={props.rent * 360 - props.annuity.totalInvestedNet}
              field={null}
              disabled
            />
          </CardContent>
        </Card>

        {/* Annuity Summary Card */}
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

        {/* Linear Summary Card */}
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
  );
}
