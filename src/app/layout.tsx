import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AnalyticsProvider } from '@features/analytics/components/AnalyticsProvider';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: true,
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://mortgage-calculator-nl.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Mortgage Calculator Netherlands | Compare Annuity vs Linear Mortgages',
    template: '%s | Mortgage Calculator NL'
  },
  description: 'Free Dutch mortgage calculator comparing annuity and linear mortgage structures. Calculate monthly payments, interest, tax deductions, and total costs for Netherlands property purchases. Supports NHG calculations and Dutch tax system.',
  keywords: [
    // English terms
    'mortgage calculator',
    'netherlands mortgage',
    'dutch mortgage calculator',
    'annuity mortgage',
    'linear mortgage',
    'mortgage comparison',
    'property calculator',
    'home loan calculator',
    'netherlands property',
    'dutch real estate',
    'mortgage payments',
    'interest calculator',
    'tax deduction calculator',
    'NHG calculator',
    // Dutch terms
    'hypotheek calculator',
    'hypotheek berekenen',
    'annuïteiten hypotheek',
    'lineaire hypotheek',
    'hypotheek vergelijken',
    'maandlasten berekenen',
    'hypotheekrente',
    'hypotheekrenteaftrek',
    'NHG hypotheek',
    'woning kopen',
    'eigenwoningforfait',
    'hypotheekkosten'
  ],
  authors: [{ name: 'Mortgage Calculator NL', url: baseUrl }],
  creator: 'Mortgage Calculator NL',
  publisher: 'Mortgage Calculator NL',
  category: 'Finance',
  classification: 'Financial Calculator',
  applicationName: 'Mortgage Calculator NL',
  referrer: 'origin-when-cross-origin',
  appleWebApp: {
    capable: true,
    title: 'Mortgage Calculator NL',
    statusBarStyle: 'default',
    startupImage: [
      {
        url: '/icons/icon-192x192.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        url: '/icons/icon-384x384.png', 
        media: '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)',
      },
    ],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: baseUrl,
    languages: {
      'en-US': baseUrl,
      'nl-NL': `${baseUrl}/nl`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['nl_NL'],
    url: baseUrl,
    siteName: 'Mortgage Calculator Netherlands',
    title: 'Mortgage Calculator Netherlands | Compare Annuity vs Linear Mortgages',
    description: 'Free Dutch mortgage calculator comparing annuity and linear mortgage structures. Calculate monthly payments, interest, tax deductions, and total costs for Netherlands property purchases.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mortgage Calculator Netherlands - Compare Annuity vs Linear Mortgages',
        type: 'image/png',
      },
      {
        url: '/og-image-square.png',
        width: 1200,
        height: 1200,
        alt: 'Mortgage Calculator Netherlands',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@MortgageCalcNL',
    creator: '@MortgageCalcNL',
    title: 'Mortgage Calculator Netherlands | Compare Annuity vs Linear Mortgages',
    description: 'Free Dutch mortgage calculator comparing annuity and linear mortgage structures. Calculate monthly payments, interest, tax deductions, and total costs.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      'facebook-domain-verification': process.env.NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION || '',
    },
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Mortgage Calc NL',
    'application-name': 'Mortgage Calculator NL',
    'msapplication-TileColor': '#8b5cf6',
    'theme-color': '#8b5cf6',
  },
};

// JSON-LD structured data for the application
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Mortgage Calculator Netherlands',
  description: 'Free Dutch mortgage calculator comparing annuity and linear mortgage structures. Calculate monthly payments, interest, tax deductions, and total costs for Netherlands property purchases.',
  url: baseUrl,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
  },
  provider: {
    '@type': 'Organization',
    name: 'Mortgage Calculator NL',
    url: baseUrl,
  },
  featureList: [
    'Annuity mortgage calculator',
    'Linear mortgage calculator',
    'Dutch tax deduction calculator',
    'NHG (National Mortgage Guarantee) support',
    'Monthly payment breakdown',
    'Interest payment analysis',
    'Total cost comparison',
    'Property purchase cost calculator'
  ],
  audience: {
    '@type': 'Audience',
    geographicArea: {
      '@type': 'Country',
      name: 'Netherlands',
    },
  },
  inLanguage: ['en', 'nl'],
  dateCreated: '2024-01-01',
  dateModified: new Date().toISOString().split('T')[0],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#8b5cf6" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#7c3aed" media="(prefers-color-scheme: dark)" />
        <meta name="color-scheme" content="light dark" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Performance monitoring */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Log Core Web Vitals
                function logWebVitals(metric) {
                  if (typeof gtag !== 'undefined') {
                    gtag('event', metric.name, {
                      event_category: 'Web Vitals',
                      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                      event_label: metric.id,
                    });
                  }
                }
                
                // Measure and log performance metrics
                if ('performance' in window && 'addEventListener' in window) {
                  window.addEventListener('load', () => {
                    // Log page load time
                    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                    console.log('Page load time:', loadTime + 'ms');
                  });
                }
              `,
            }}
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
      >
        <AnalyticsProvider>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">
              {children}
            </div>
          </div>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
