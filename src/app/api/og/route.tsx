import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const price = searchParams.get('price')
    const interest = searchParams.get('interest')
    const deduction = searchParams.get('deduction')

    const formattedPrice = price 
      ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(Number(price))
      : null

    const title = formattedPrice && interest
      ? `${formattedPrice} at ${interest}% Interest`
      : 'Mortgage Calculator Netherlands'

    const subtitle = formattedPrice && interest
      ? 'Compare Annuity vs Linear Mortgage'
      : 'Calculate Dutch Mortgage Payments'

    // Import ImageResponse dynamically for edge runtime
    const { ImageResponse } = await import('next/og')

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            backgroundImage: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            position: 'relative',
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0)',
              backgroundSize: '50px 50px',
            }}
          />
          
          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.95)',
              borderRadius: '24px',
              padding: '60px',
              margin: '40px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              textAlign: 'center',
              maxWidth: '900px',
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#8b5cf6',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '32px',
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
              </svg>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: formattedPrice ? '54px' : '64px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '16px',
                lineHeight: '1.1',
              }}
            >
              {title}
            </h1>
            
            {/* Subtitle */}
            <p
              style={{
                fontSize: '32px',
                color: '#6b7280',
                marginBottom: '24px',
                fontWeight: '500',
              }}
            >
              {subtitle}
            </p>

            {/* Features */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '32px',
                marginTop: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    backgroundColor: '#8b5cf6',
                    borderRadius: '50%',
                  }}
                />
                <span style={{ fontSize: '18px', color: '#6b7280' }}>
                  Annuity & Linear
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    backgroundColor: '#8b5cf6',
                    borderRadius: '50%',
                  }}
                />
                <span style={{ fontSize: '18px', color: '#6b7280' }}>
                  Tax Deductions
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    backgroundColor: '#8b5cf6',
                    borderRadius: '50%',
                  }}
                />
                <span style={{ fontSize: '18px', color: '#6b7280' }}>
                  NHG Support
                </span>
              </div>
            </div>

            {/* Domain */}
            <div
              style={{
                marginTop: '32px',
                fontSize: '20px',
                color: '#8b5cf6',
                fontWeight: '600',
              }}
            >
              mortgage-calculator-nl.vercel.app
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.error('Error generating OG image:', e.message)
    return new Response('Failed to generate image', {
      status: 500,
    })
  }
}