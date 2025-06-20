'use client';

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
import { Skeleton } from '@/components/ui/skeleton';

export function DataTableSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">
          <Skeleton className="h-6 w-48" />
        </CardTitle>
        <Skeleton className="h-4 w-72 mt-1" />
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
                {Array.from({ length: 12 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-muted/50">
                    <TableCell className="text-center font-medium w-12 sticky left-0 bg-background z-10 border-r">
                      {i + 1}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums whitespace-nowrap px-4">
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums whitespace-nowrap px-4">
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums whitespace-nowrap px-4">
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums whitespace-nowrap px-4">
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums whitespace-nowrap px-4">
                      <Skeleton className="h-4 w-18 ml-auto" />
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums whitespace-nowrap px-4">
                      <Skeleton className="h-4 w-16 ml-auto" />
                    </TableCell>
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