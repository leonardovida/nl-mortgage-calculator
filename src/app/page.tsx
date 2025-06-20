import { Metadata } from 'next';
import { ClientMortgageCalculator } from '@components/common/ClientMortgageCalculator';
import { generateDynamicMetadata, generateMortgageJsonLd } from '@/lib/metadata';

type SearchParams = {
  price?: string;
  interest?: string;
  deduction?: string;
  savings?: string;
  rent?: string;
}

type Props = {
  searchParams: SearchParams;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = {
    price: searchParams.price ? Number(searchParams.price) : undefined,
    interest: searchParams.interest ? Number(searchParams.interest) : undefined,
    deduction: searchParams.deduction ? Number(searchParams.deduction) : undefined,
    savings: searchParams.savings ? Number(searchParams.savings) : undefined,
    rent: searchParams.rent ? Number(searchParams.rent) : undefined,
  };

  return generateDynamicMetadata(params);
}

export default function Home({ searchParams }: Props) {
  // Generate JSON-LD for structured data if we have mortgage parameters
  const params = {
    price: searchParams.price ? Number(searchParams.price) : undefined,
    interest: searchParams.interest ? Number(searchParams.interest) : undefined,
    deduction: searchParams.deduction ? Number(searchParams.deduction) : undefined,
  };

  const jsonLd = generateMortgageJsonLd(params);

  return <ClientMortgageCalculator jsonLd={jsonLd} />;
}
