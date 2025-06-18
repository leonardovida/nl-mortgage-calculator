import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mortgage Calculator Netherlands',
    short_name: 'Mortgage Calc NL',
    description: 'Free Dutch mortgage calculator comparing annuity and linear mortgage structures. Calculate monthly payments, interest, tax deductions, and total costs for Netherlands property purchases.',
    start_url: '/',
    display: 'standalone',
    theme_color: '#8b5cf6',
    background_color: '#ffffff',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en',
    categories: ['finance', 'productivity', 'utilities'],
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      }
    ],
    screenshots: [
      {
        src: '/screenshots/desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        // form_factor: 'wide', // Not supported in MetadataRoute.Manifest type
        // label: 'Desktop view of mortgage calculator' // Not supported in MetadataRoute.Manifest type
      },
      {
        src: '/screenshots/mobile.png',
        sizes: '390x844',
        type: 'image/png',
        // form_factor: 'narrow', // Not supported in MetadataRoute.Manifest type
        // label: 'Mobile view of mortgage calculator' // Not supported in MetadataRoute.Manifest type
      }
    ],
    shortcuts: [
      {
        name: 'Calculate Mortgage',
        short_name: 'Calculate',
        description: 'Quick access to mortgage calculation',
        url: '/?utm_source=homescreen',
        icons: [
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          }
        ]
      }
    ],
    related_applications: [],
    prefer_related_applications: false,
    display_override: ['standalone', 'minimal-ui']
    // edge_side_panel: { // Not supported in MetadataRoute.Manifest type
    //   preferred_width: 400
    // }
  };
}