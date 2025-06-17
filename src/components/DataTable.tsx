
import { MonthMortgageData } from '../common/Types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

type TableProps = {
  data: Array<MonthMortgageData>;
};

function TableNumber(props: { value: number }) {
  return (
    <TableCell className="text-right font-mono tabular-nums whitespace-nowrap px-4">
      €{(Math.round(props.value * 100) / 100).toFixed(2)}
    </TableCell>
  );
}

export function DataTable(props: TableProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">
          Monthly Mortgage Breakdown
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Swipe horizontally to view all columns on mobile
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <div className="overflow-x-auto scroll-smooth">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center sticky left-0 bg-background z-10 border-r">
                    #
                  </TableHead>
                  <TableHead className="text-right min-w-[120px]">
                    Balance
                  </TableHead>
                  <TableHead className="text-right min-w-[100px]">
                    Gross
                  </TableHead>
                  <TableHead className="text-right min-w-[100px]">
                    Capital
                  </TableHead>
                  <TableHead className="text-right min-w-[100px]">
                    Interest
                  </TableHead>
                  <TableHead className="text-right min-w-[110px]">
                    Tax Return
                  </TableHead>
                  <TableHead className="text-right min-w-[100px]">
                    Net
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {props.data.map((item, i) => (
                  <TableRow key={i} className="hover:bg-muted/50">
                    <TableCell className="text-center font-medium w-12 sticky left-0 bg-background z-10 border-r">
                      {i + 1}
                    </TableCell>
                    <TableNumber value={item.balance} />
                    <TableNumber value={item.grossPaid} />
                    <TableNumber value={item.capitalPaid} />
                    <TableNumber value={item.interest} />
                    <TableNumber value={item.deduction} />
                    <TableNumber value={item.netPaid} />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}