'use client';

import { NumericFormat } from 'react-number-format';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const intervals = [
  'Fix rate',
  'NHG',
  '≤55%',
  '≤60%',
  '≤65%',
  '≤70%',
  '≤75%',
  '≤80%',
  '≤85%',
  '≤90%',
  '≤95%',
  '≤100%',
];

export const interests = [
  {
    '0': '10',
    '1': '4.20',
    '55': '4.45',
    '60': '4.47',
    '65': '4.57',
    '70': '4.58',
    '75': '4.59',
    '80': '4.60',
    '85': '4.61',
    '90': '4.62',
    '95': '4.63',
    '100': '4.68',
  },
  {
    '0': '20',
    '1': '4.45',
    '55': '4.66',
    '60': '4.69',
    '65': '4.76',
    '70': '4.77',
    '75': '4.78',
    '80': '4.79',
    '85': '4.85',
    '90': '4.94',
    '95': '4.98',
    '100': '5.03',
  },
];

function TableNumber(props: { value: string; suffix: string | '€' }) {
  return (
    <TableCell className="text-right font-mono">
      <NumericFormat
        value={props.value}
        displayType={'text'}
        thousandSeparator={true}
        suffix={props.suffix}
        decimalScale={2}
      />
    </TableCell>
  );
}

export default function Interest() {
  return (
    <div className="space-y-6">
      {/* Reference Interest Rates Card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Reference Interest Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  {intervals.map((interval) => {
                    return interval === 'NHG' ? (
                      <TableHead key={interval} className="text-center font-semibold">
                        <a
                          href="https://www.nhg.nl/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2"
                        >
                          NHG
                        </a>
                      </TableHead>
                    ) : (
                      <TableHead key={interval} className="text-center font-semibold whitespace-nowrap">
                        {interval}
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {interests.map((interest, i) => {
                  return (
                    <TableRow key={i} className="hover:bg-muted/50">
                      {Object.values(interest).map((item, j) =>
                        j > 0 ? (
                          <TableNumber key={j} value={item} suffix={'%'} />
                        ) : (
                          <TableCell key={j} className="font-semibold text-center">
                            <NumericFormat
                              value={item}
                              displayType={'text'}
                              thousandSeparator={true}
                              suffix={' years'}
                              decimalScale={0}
                            />
                          </TableCell>
                        ),
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Interest Rate Sources Card */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Interest Rate Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <a
                href="https://www.ikbenfrits.nl/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-center underline underline-offset-2"
              >
                Compare mortgage rates
              </a>
            </div>
            <div className="flex items-center justify-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <a
                href="https://www.ing.nl/particulier/hypotheken/actuele-hypotheekrente/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-center underline underline-offset-2"
              >
                ING
              </a>
            </div>
            <div className="flex items-center justify-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <a
                href="https://www.rabobank.nl/particulieren/hypotheek/hypotheekrente/rente-annuiteitenhypotheek-en-lineaire-hypotheek/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-center underline underline-offset-2"
              >
                Rabobank
              </a>
            </div>
            <div className="flex items-center justify-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
              <a
                href="https://www.abnamro.nl/nl/prive/hypotheken/actuele-hypotheekrente/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-center underline underline-offset-2"
              >
                ABN-AMRO
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
