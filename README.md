# 🏠 Mortgage Calculator

A modern, fast, and comprehensive mortgage calculator for the Netherlands market. Compare Annuity and Linear mortgage structures with detailed monthly payment breakdowns, tax deductions, and cost analysis.

[![CI/CD](https://github.com/santiago-pan/mortgage-calculator/actions/workflows/pr-checks.yml/badge.svg)](https://github.com/santiago-pan/mortgage-calculator/actions/workflows/pr-checks.yml)

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

# Run tests
bun test

# Type check
bun run typecheck

# Lint code
bun run lint

# Format code
bun run format
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server on localhost:3000 |
| `bun build` | Build for production |
| `bun test` | Run test suite |
| `bun run lint` | Run ESLint |
| `bun run lint:fix` | Fix ESLint issues |
| `bun run format` | Format code with Prettier |
| `bun run typecheck` | Run TypeScript type checking |
| `bun run deploy` | Deploy to AWS S3 (requires AWS CLI setup) |

## 🏗️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Runtime**: Bun
- **Styling**: Bulma CSS + Sass
- **Charts**: Recharts
- **Routing**: React Router v6
- **Testing**: Bun Test + React Testing Library
- **Linting**: ESLint + Prettier
- **CI/CD**: GitHub Actions

## 📁 Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── Costs.tsx       # Purchase costs component
│   │   ├── DataTable.tsx   # Payment schedule table
│   │   ├── Graph.tsx       # Chart visualization
│   │   ├── InputField.tsx  # Reusable input component
│   │   ├── Interest.tsx    # Interest information
│   │   └── Mortgage.tsx    # Main mortgage form
│   ├── common/
│   │   ├── Formulas.tsx    # Mortgage calculation logic
│   │   ├── Types.tsx       # TypeScript type definitions
│   │   └── __tests__/      # Unit tests
│   ├── App.tsx             # Main application component
│   └── index.tsx           # Application entry point
├── .github/workflows/       # GitHub Actions CI/CD
├── public/                 # Static assets
└── dist/                   # Production build output
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

## 🧪 Testing

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun test --coverage
```

Tests cover mortgage calculation accuracy, edge cases, and UI component behavior.

## 🚀 Deployment

The application is deployed to AWS S3 with CloudFront CDN:

```bash
# Build and deploy (requires AWS CLI configuration)
bun run deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`bun test && bun run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

All PRs are automatically checked with our CI pipeline including linting, type checking, and tests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built for the Dutch mortgage market
- Calculations based on standard Dutch mortgage practices
- UI components using Bulma CSS framework