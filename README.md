# Portfolio Analysis Application

A comprehensive Next.js application for portfolio analysis and trading operations, built with modern web technologies including TypeScript, Tailwind CSS, TanStack Query, and Zustand for state management.

## 🚀 Features

- **Portfolio Management**: View and manage holdings, positions, and portfolio performance
- **Trading Operations**: Execute trades, manage funds, and monitor trading activities
- **Position Conversion**: Convert equity positions to different product types
- **Statement Generation**: Generate and view trading statements and reports
- **Real-time Data**: Live portfolio updates and trading data synchronization
- **Error Handling**: Comprehensive error boundaries and chunk loading error recovery
- **Modern UI**: Beautiful and responsive design with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for utility-first styling
- **State Management**: Zustand for lightweight state management
- **Data Fetching**: TanStack Query for server state management
- **UI Components**: Custom component library with Heroicons
- **Error Handling**: React Error Boundaries with chunk loading recovery

## 📁 Project Structure

```
portfolio-analysis/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── api/                       # API routes
│   │   │   ├── portfolio/             # Portfolio management APIs
│   │   │   │   ├── convert-position/  # Position conversion endpoint
│   │   │   │   ├── holdings/          # Holdings data endpoint
│   │   │   │   └── positions/         # Positions data endpoint
│   │   │   └── trading/               # Trading APIs
│   │   │       ├── funds/             # Funds management endpoint
│   │   │       ├── ledger/            # Ledger data endpoint
│   │   │       └── trades/            # Trade execution endpoints
│   │   ├── portfolio/                 # Portfolio pages
│   │   ├── reports/                   # Reporting pages
│   │   ├── api-debug/                 # API debugging utilities
│   │   ├── globals.css                # Global styles
│   │   ├── layout.tsx                 # Root layout component
│   │   └── page.tsx                   # Home page
│   ├── components/                    # React components
│   │   ├── common/                    # Shared components
│   │   │   ├── ChunkErrorBoundary.tsx # Error boundary for chunk loading
│   │   │   └── PositionsList.tsx      # Positions list component
│   │   ├── forms/                     # Form components
│   │   │   └── ConvertPositionModal.tsx # Position conversion modal
│   │   ├── layout/                    # Layout components
│   │   │   └── DashboardLayout.tsx    # Dashboard layout
│   │   ├── ConvertPosition.tsx        # Position conversion component
│   │   ├── DashboardHome.tsx          # Dashboard home component
│   │   ├── Funds.tsx                  # Funds management component
│   │   ├── Holdings.tsx               # Holdings display component
│   │   ├── Positions.tsx              # Positions display component
│   │   ├── Statements.tsx             # Statements component
│   │   └── TradersControl.tsx         # Trading controls component
│   ├── features/                      # Feature-based modules
│   │   ├── portfolio/                 # Portfolio feature
│   │   │   ├── hooks.ts               # Portfolio hooks
│   │   │   ├── services.ts            # Portfolio services
│   │   │   ├── types.ts               # Portfolio types
│   │   │   └── utils.ts               # Portfolio utilities
│   │   └── trading/                   # Trading feature
│   │       ├── hooks.ts               # Trading hooks
│   │       ├── services.ts            # Trading services
│   │       └── types.ts               # Trading types
│   ├── lib/                           # Shared libraries
│   │   ├── api/                       # API utilities
│   │   │   └── client.ts              # API client configuration
│   │   ├── components/                # Shared UI components
│   │   │   └── ui/                    # UI component library
│   │   ├── config/                    # Configuration files
│   │   │   └── app.ts                 # App configuration
│   │   ├── hooks/                     # Custom hooks
│   │   │   ├── useChunkLoadErrorHandler.ts # Chunk error handler
│   │   │   ├── useServiceWorker.ts    # Service worker hook
│   │   │   └── [other hooks]          # Various custom hooks
│   │   ├── providers/                 # Context providers
│   │   │   ├── index.tsx              # Main providers wrapper
│   │   │   └── react-query.tsx        # React Query provider
│   │   ├── store/                     # State management
│   │   │   ├── index.ts               # Store configuration
│   │   │   └── tradersControl.ts      # Trading control store
│   │   ├── types/                     # TypeScript types
│   │   │   ├── index.ts               # Common types
│   │   │   └── trading.ts             # Trading types
│   │   └── utils/                     # Utility functions
│   │       └── positionUtils.ts       # Position utilities
│   └── styles/                        # Style files
├── public/                            # Static assets
│   ├── sw.js                          # Service worker for chunk handling
│   └── favicon.ico                    # Favicon
├── docs/                              # Documentation
│   ├── API_404_RESOLUTION.md          # API 404 error resolution
│   ├── ARCHITECTURE.md                # System architecture
│   ├── CHUNK_LOAD_ERROR_RESOLUTION.md # Chunk loading error fixes
│   ├── CONVERT_POSITION_GUIDE.md      # Position conversion guide
│   ├── FUNDS_ISSUE_RESOLUTION.md      # Funds issue resolution
│   ├── LEDGER_400_ERROR_FIX.md        # Ledger 400 error fixes
│   ├── MIGRATION_SUMMARY.md           # Migration summary
│   └── STRUCTURE_IMPROVEMENTS.md      # Structure improvements
├── next.config.js                     # Next.js configuration
├── package.json                       # Dependencies and scripts
├── tailwind.config.ts                 # Tailwind CSS configuration
├── tsconfig.json                      # TypeScript configuration
└── README.md                          # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd portfolio-analysis
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:3000` to see your application in action.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🏗️ Architecture

The application follows a feature-based architecture with clear separation of concerns:

- **App Router**: Uses Next.js 13+ App Router for file-based routing
- **API Routes**: RESTful API endpoints for portfolio and trading operations
- **Component Architecture**: Reusable components with TypeScript interfaces
- **State Management**: Zustand for global state, TanStack Query for server state
- **Error Handling**: Comprehensive error boundaries and recovery mechanisms

## 📊 Key Features

### Portfolio Management
- **Holdings View**: Display current holdings with real-time updates
- **Positions Tracking**: Monitor open positions and P&L
- **Performance Analytics**: Portfolio performance metrics and charts

### Trading Operations
- **Order Management**: Place, modify, and cancel orders
- **Funds Management**: View and manage trading funds
- **Trade History**: Complete trading history and ledger

### Position Conversion
- **Product Type Conversion**: Convert between different product types
- **Batch Operations**: Convert multiple positions simultaneously
- **Validation**: Comprehensive validation before conversion

### Reporting
- **Statement Generation**: Generate trading statements
- **Export Options**: Export data in various formats
- **Historical Data**: Access historical trading data

## 🛡️ Error Handling

The application includes robust error handling:

- **Chunk Loading Errors**: Automatic recovery from JavaScript chunk loading failures
- **API Error Handling**: Comprehensive error handling for API requests
- **Network Resilience**: Retry mechanisms for failed requests
- **User Feedback**: Clear error messages and loading states

## 📚 Documentation

Detailed documentation is available in the `/docs` folder:

- **[API 404 Resolution](docs/API_404_RESOLUTION.md)** - Fixing API 404 errors
- **[Architecture Overview](docs/ARCHITECTURE.md)** - System architecture details
- **[Chunk Load Error Resolution](docs/CHUNK_LOAD_ERROR_RESOLUTION.md)** - Fixing chunk loading errors
- **[Position Conversion Guide](docs/CONVERT_POSITION_GUIDE.md)** - Position conversion documentation
- **[Funds Issue Resolution](docs/FUNDS_ISSUE_RESOLUTION.md)** - Funds management troubleshooting
- **[Ledger 400 Error Fix](docs/LEDGER_400_ERROR_FIX.md)** - Ledger API error resolution
- **[Migration Summary](docs/MIGRATION_SUMMARY.md)** - Migration documentation
- **[Structure Improvements](docs/STRUCTURE_IMPROVEMENTS.md)** - Code structure improvements

## 🔧 Development

### Code Organization

The project follows these conventions:

- **Feature-based structure**: Code is organized by features (portfolio, trading)
- **TypeScript**: All code is written in TypeScript for type safety
- **Component composition**: Reusable components with clear interfaces
- **Custom hooks**: Logic is extracted into custom hooks for reusability

### Testing

Run tests with:
```bash
npm test
```

### Building for Production

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚨 Troubleshooting

If you encounter issues:

1. **Clear Next.js cache**: `rm -rf .next`
2. **Reinstall dependencies**: `rm -rf node_modules && npm install`
3. **Check documentation**: Refer to the relevant docs in the `/docs` folder
4. **Check console**: Look for error messages in the browser console

For specific issues, check the documentation in the `/docs` folder for detailed troubleshooting guides.