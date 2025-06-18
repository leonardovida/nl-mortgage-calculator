# 🏠 Mortgage Calculator (Next.js)

A modern, fast, and comprehensive mortgage calculator for the Netherlands market. Compare Annuity and Linear mortgage structures with detailed monthly payment breakdowns, tax deductions, and cost analysis.

> This is the Next.js migration of the original React/Vite mortgage calculator.

## ✨ Features

- **Mortgage Comparison**: Side-by-side comparison of Annuity vs Linear mortgages
- **Detailed Calculations**: Monthly payment breakdowns with interest, capital, and tax deductions
- **Cost Analysis**: Complete overview of purchase costs (notary, valuation, taxes)
- **Interactive Charts**: Visual representation of payment structures over time
- **Dutch Tax System**: Built-in support for Dutch mortgage interest deduction (hypotheekrenteaftrek)
- **NHG Integration**: Automatic National Mortgage Guarantee calculations
- **URL Sharing**: Shareable URLs with pre-filled calculations

## 🚀 Live Demo

Visit [whathemortgage.com](https://whathemortgage.com/) to try the calculator.

## 🛠️ Development

This project uses [Bun](https://bun.sh/) for fast package management and development.

### Prerequisites

- [Bun](https://bun.sh/) (latest version)
- Node.js 18+ (for compatibility)

### Quick Start

```bash
# Install dependencies
bun install

# Start development server
bun dev

# Build for production
bun build

# Start production server
bun start

# Run linting
bun run lint
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server on localhost:3000 |
| `bun build` | Build for production |
| `bun start` | Start production server |
| `bun run lint` | Run ESLint |

## 🏗️ Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Runtime**: Bun
- **Styling**: Tailwind CSS
- **Charts**: Recharts (to be migrated)
- **Testing**: Bun Test + React Testing Library (to be migrated)
- **Linting**: ESLint + Next.js Config
- **Deployment**: Vercel

## 📁 Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── globals.css      # Global styles
│   ├── components/          # React components (to be migrated)
│   ├── lib/                 # Utility functions
│   └── types/               # TypeScript type definitions
└── public/                  # Static assets
```

## 🧮 Calculation Logic

### Annuity Mortgage
- Fixed monthly payments over loan duration
- Higher initial interest, lower initial capital repayment
- Uses PMT (Payment) formula for calculations

### Linear Mortgage  
- Fixed capital repayment, decreasing interest
- Lower total interest paid over loan duration
- Equal capital payments with decreasing total monthly cost

### Dutch Tax Benefits
- Mortgage interest deduction (hypotheekrenteaftrek)
- NHG (National Mortgage Guarantee) fee calculations
- Transfer tax and other Dutch-specific costs

## 🚀 Deployment

The application is designed to be deployed on Vercel:

```bash
# Build and deploy
bun run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linting (`bun run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built for the Dutch mortgage market
- Calculations based on standard Dutch mortgage practices
- Migrated from React/Vite to Next.js 14 for improved performance and SEO