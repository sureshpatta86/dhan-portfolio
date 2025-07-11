# Components Architecture

This directory contains all the React components organized in a feature-based, scalable architecture.

## Directory Structure

```
src/components/
├── features/              # Feature-specific components
│   ├── dashboard/         # Dashboard-related components
│   ├── holdings/          # Holdings, positions, funds components
│   ├── market/            # Market data, holidays, status components
│   ├── options/           # Options chain and related components
│   ├── orders/            # Order management components
│   └── trading/           # Trading controls and indicators
├── ui/                    # Reusable UI components
├── layout/               # Layout components
├── providers/            # React context providers
└── index.ts             # Barrel exports for all components
```

## Import Guidelines

### Feature-based Imports (Recommended)
```typescript
// Import from specific features
import { DashboardHome, OrderDashboard } from '@/components/features/dashboard';
import { OrderBook, OrderForm } from '@/components/features/orders';
import { Holdings, Funds } from '@/components/features/holdings';

// Import from feature index
import { MarketStatusIndicator } from '@/components/features/market';
```

### Component-level Imports
```typescript
// Direct component imports
import { DashboardHome } from '@/components/features/dashboard/DashboardHome';
import { OrderBook } from '@/components/features/orders/OrderBook';
```

### Main Index Imports (For external use)
```typescript
// Import from main components index
import { 
  DashboardHome, 
  OrderBook, 
  Holdings,
  MarketStatusIndicator 
} from '@/components';
```

## Component Organization

### Features Directory
Each feature directory contains:
- **Main Components**: Primary UI components for that feature
- **Forms**: Form components specific to that feature
- **index.ts**: Barrel exports for clean imports

### UI Directory
Contains reusable, generic UI components that can be used across features:
- Error boundaries
- Modal components
- Generic list components

### Layout Directory
Contains layout components that define the overall structure:
- Dashboard layout
- Page layouts
- Navigation components

### Providers Directory
Contains React context providers:
- Theme providers
- Authentication providers
- Data providers

## Benefits of This Structure

1. **Feature Isolation**: Related components are grouped together
2. **Scalability**: Easy to add new features without cluttering
3. **Maintainability**: Clear separation of concerns
4. **Import Clarity**: Logical import paths
5. **Reusability**: Shared UI components in dedicated directory
6. **Type Safety**: Better TypeScript support with organized exports

## Migration Notes

- All components maintain their original functionality
- Import paths need to be updated in consuming files
- Backup files (.backup, .original) are preserved in their new locations
- Both named and default exports are supported where applicable

## File Naming Conventions

- **Components**: PascalCase (e.g., `DashboardHome.tsx`)
- **Index files**: lowercase (e.g., `index.ts`)
- **Feature directories**: lowercase (e.g., `dashboard`, `orders`)

## Adding New Components

1. **Feature Component**: Add to appropriate feature directory
2. **Reusable Component**: Add to `ui` directory
3. **Layout Component**: Add to `layout` directory
4. **Update Exports**: Add to relevant index files
5. **Documentation**: Update this README if needed
