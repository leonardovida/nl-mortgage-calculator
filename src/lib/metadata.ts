import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mortgage-calculator-nl.vercel.app'

interface MortgageParams {
  price?: number
  interest?: number
  deduction?: number
  savings?: number
  rent?: number
}

export function generateDynamicMetadata(params: MortgageParams): Metadata {
  const { price, interest, deduction, savings, rent } = params
  
  // Only generate dynamic metadata if we have meaningful parameters
  if (!price && !interest) {
    return {}
  }

  const formattedPrice = price ? new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) : null

  const formattedInterest = interest ? `${interest}%` : null

  // Generate dynamic title and description
  let title = 'Mortgage Calculator Netherlands'
  let description = 'Calculate mortgage payments for Netherlands property purchase'

  if (formattedPrice && formattedInterest) {
    title = `${formattedPrice} Property at ${formattedInterest} Interest | Mortgage Calculator NL`
    description = `Calculate mortgage payments for a ${formattedPrice} property in Netherlands at ${formattedInterest} interest rate. Compare annuity vs linear mortgage structures with tax deductions.`
  } else if (formattedPrice) {
    title = `${formattedPrice} Property Mortgage Calculator | Netherlands`
    description = `Calculate mortgage payments for a ${formattedPrice} property in Netherlands. Compare annuity vs linear mortgage structures with Dutch tax deductions.`
  } else if (formattedInterest) {
    title = `${formattedInterest} Interest Rate Mortgage Calculator | Netherlands`
    description = `Calculate mortgage payments at ${formattedInterest} interest rate in Netherlands. Compare annuity vs linear mortgage structures with tax deductions.`
  }

  // Generate dynamic URL for sharing
  const searchParams = new URLSearchParams()
  if (price) searchParams.set('price', price.toString())
  if (interest) searchParams.set('interest', interest.toString())
  if (deduction) searchParams.set('deduction', deduction.toString())
  if (savings) searchParams.set('savings', savings.toString())
  if (rent) searchParams.set('rent', rent.toString())
  
  const dynamicUrl = `${baseUrl}?${searchParams.toString()}`

  return {
    title,
    description,
    alternates: {
      canonical: dynamicUrl,
    },
    openGraph: {
      title,
      description,
      url: dynamicUrl,
      images: [
        {
          url: `/api/og?${searchParams.toString()}`,
          width: 1200,
          height: 630,
          alt: title,
        }
      ],
    },
    twitter: {
      title,
      description,
      images: [`/api/og?${searchParams.toString()}`],
    },
    other: {
      'calculator:price': price?.toString() || '',
      'calculator:interest': interest?.toString() || '',
      'calculator:deduction': deduction?.toString() || '',
    },
  }
}

export function generateMortgageJsonLd(params: MortgageParams) {
  const { price, interest, deduction } = params

  if (!price || !interest) {
    return null
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    name: `Mortgage Calculator for €${price?.toLocaleString()} Property`,
    description: `Calculate mortgage payments for a €${price?.toLocaleString()} property at ${interest}% interest rate in Netherlands`,
    provider: {
      '@type': 'Organization',
      name: 'Mortgage Calculator NL',
    },
    url: `${baseUrl}?price=${price}&interest=${interest}&deduction=${deduction}`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      description: 'Free mortgage calculation service',
    },
    audience: {
      '@type': 'Audience',
      geographicArea: {
        '@type': 'Country',
        name: 'Netherlands',
      },
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'propertyPrice',
        value: price,
        unitCode: 'EUR',
      },
      {
        '@type': 'PropertyValue',
        name: 'interestRate',
        value: interest,
        unitCode: 'P1',
      },
      {
        '@type': 'PropertyValue',
        name: 'taxDeduction',
        value: deduction,
        unitCode: 'P1',
      },
    ],
  }
}