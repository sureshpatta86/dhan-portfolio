'use client';

import React, { useState, useEffect } from 'react';
import { 
  HomeIcon, 
  ChartBarIcon, 
  DocumentTextIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  BanknotesIcon,
  ClockIcon,
  ShoppingCartIcon,
  DocumentChartBarIcon,
  GlobeAltIcon,
  CubeIcon,
  ArrowTrendingUpIcon,
  SignalIcon,
  DocumentDuplicateIcon,
  BellIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

// Debug: Check if all icons are properly imported
const iconDebug = {
  HomeIcon, ChartBarIcon, DocumentTextIcon, CogIcon, Bars3Icon, XMarkIcon,
  UserIcon, BanknotesIcon, ClockIcon, ShoppingCartIcon, DocumentChartBarIcon,
  GlobeAltIcon, CubeIcon, ArrowTrendingUpIcon, SignalIcon, DocumentDuplicateIcon,
  BellIcon, ChevronDownIcon, ChevronRightIcon
};

if (typeof window !== 'undefined') {
  console.log('Icon debug:', iconDebug);
  Object.entries(iconDebug).forEach(([name, icon]) => {
    if (!icon) {
      console.error(`Icon ${name} is undefined!`);
    }
  });
}
import KillSwitchIndicator from '@/components/features/trading/KillSwitchIndicator';

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ComponentType<any>;
  children?: NavigationItem[];
  badge?: string;
  status?: 'active' | 'coming-soon' | 'beta';
}

const navigation: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/',
    icon: HomeIcon,
    status: 'active'
  },
  {
    name: 'Portfolio',
    icon: ChartBarIcon,
    status: 'active',
    children: [
      { name: 'Holdings', href: '/portfolio/holdings', icon: DocumentTextIcon, status: 'active' },
      { name: 'Positions', href: '/portfolio/positions', icon: ArrowTrendingUpIcon, status: 'active' },
      { name: 'Convert Position', href: '/portfolio/convert', icon: CubeIcon, status: 'active' }
    ]
  },
  {
    name: 'Trading',
    icon: ShoppingCartIcon,
    status: 'active',
    children: [
      { name: 'Place Order', href: '/trading/orders', icon: ShoppingCartIcon, status: 'active' },
      { name: 'Orders', href: '/trading/orders', icon: DocumentDuplicateIcon, status: 'active' },
      { name: 'Trade Book', href: '/trading/trades', icon: DocumentDuplicateIcon, status: 'active' },
      { name: 'Super Order', href: '/trading/super-order', icon: DocumentDuplicateIcon, status: 'active' },
      { name: 'Forever Order', href: '/trading/forever-order', icon: ClockIcon, status: 'active' }
    ]
  },
  {
    name: 'Funds',
    href: '/funds',
    icon: BanknotesIcon,
    status: 'active'
  },
  {
    name: 'Market Data',
    icon: GlobeAltIcon,
    status: 'active',
    children: [
      { name: 'Option Chain', href: '/market/option-chain', icon: CubeIcon, status: 'active' },
      { name: 'Market Holidays', href: '/market-holidays', icon: CalendarIcon, status: 'active' },
      { name: 'Market Quote', href: '/market/quote', icon: SignalIcon, status: 'coming-soon' },
      { name: 'Live Feed', href: '/market/live-feed', icon: SignalIcon, status: 'coming-soon', badge: 'Real-time' },
      { name: 'Market Depth', href: '/market/depth', icon: ChartBarIcon, status: 'coming-soon' },
      { name: 'Historical Data', href: '/market/historical', icon: DocumentChartBarIcon, status: 'coming-soon' }
    ]
  },
  {
    name: 'Reports',
    icon: DocumentTextIcon,
    status: 'active',
    children: [
      { name: 'Statements', href: '/reports/statements', icon: DocumentTextIcon, status: 'active' },
      { name: 'Trade Book', href: '/reports/tradebook', icon: DocumentDuplicateIcon, status: 'coming-soon' }
    ]
  },
  {
    name: 'Tools',
    icon: CogIcon,
    status: 'active',
    children: [
      { name: 'EDIS', href: '/tools/edis', icon: DocumentTextIcon, status: 'coming-soon' },
      { name: "Trader's Control", href: '/tools/traders-control', icon: CogIcon, status: 'active' },
      { name: 'Order Updates', href: '/tools/order-updates', icon: BellIcon, status: 'coming-soon', badge: 'Live' }
    ]
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: UserIcon,
    status: 'coming-soon'
  }
];

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  // Initialize with consistent empty state to avoid hydration mismatch
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Set default expanded items after component mounts (client-side only)
  useEffect(() => {
    setIsHydrated(true);
    // Small delay to ensure hydration is complete
    setTimeout(() => {
      setExpandedItems(['Portfolio']);
    }, 0);
  }, []);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const getStatusColor = (status?: string) => {
    // Return consistent classes for SSR/CSR
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'beta':
        return 'text-blue-600';
      case 'coming-soon':
        return 'text-gray-400';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBadge = (status?: string) => {
    if (status === 'beta') {
      return <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">Beta</span>;
    }
    if (status === 'coming-soon') {
      return <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">Soon</span>;
    }
    return null;
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    // Only use expanded state after hydration to avoid mismatch
    const isExpanded = isHydrated ? expandedItems.includes(item.name) : false;
    const hasChildren = Boolean(item.children && item.children.length > 0);
    const isActive = item.href === currentPath;
    const isDisabled = item.status === 'coming-soon';
    
    // Build className strings deterministically to match server/client exactly
    let buttonClassName = 'w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group';
    
    if (level > 0) {
      buttonClassName += ' ml-4 pl-8';
    }
    
    if (isActive) {
      buttonClassName += ' bg-blue-50 text-blue-700 border-r-2 border-blue-700';
    } else if (isDisabled && !hasChildren) {
      buttonClassName += ' text-gray-400 cursor-not-allowed';
    } else {
      buttonClassName += ' text-gray-700 hover:bg-gray-50 hover:text-gray-900';
    }
    
    // Build icon className deterministically
    const iconColorClass = getStatusColor(item.status);
    const iconClassName = `mr-3 h-5 w-5 ${iconColorClass}`;

    return (
      <div key={item.name}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.name);
            } else if (item.href && !isDisabled) {
              onNavigate(item.href);
            }
          }}
          disabled={isDisabled && !hasChildren}
          className={buttonClassName}
          suppressHydrationWarning
        >
          <div className="flex items-center">
            {item.icon ? (
              <item.icon className={iconClassName} />
            ) : (
              <div className={iconClassName}>⚠️</div>
            )}
            <span className={level > 0 ? 'text-sm' : ''}>{item.name}</span>
            {item.badge && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                {item.badge}
              </span>
            )}
            {getStatusBadge(item.status)}
          </div>
          {hasChildren && (
            <div className="flex items-center">
              {/* Always render ChevronRightIcon initially to avoid hydration mismatch */}
              <ChevronRightIcon 
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                  isHydrated && isExpanded ? 'transform rotate-90' : ''
                }`}
              />
            </div>
          )}
        </button>
        
        {hasChildren && isExpanded && isHydrated && (
          <div className="mt-1 space-y-1">
            {item.children!.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo Section */}
      <div className="flex items-center px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <ChartBarIcon className="h-5 w-5 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-lg font-bold text-gray-900">DhanHQ</h1>
            <p className="text-xs text-gray-500">Portfolio Analytics</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map(item => renderNavigationItem(item))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          API Connected
        </div>
        <p className="text-xs text-gray-400 mt-1">v2.0 • Last sync: Just now</p>
      </div>
    </div>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  currentPath, 
  onNavigate 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-0 z-50 ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-lg font-semibold">DhanHQ</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <Sidebar currentPath={currentPath} onNavigate={onNavigate} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        <Sidebar currentPath={currentPath} onNavigate={onNavigate} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
              <div className="lg:ml-0 ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Portfolio Dashboard</h1>
                <p className="text-sm text-gray-500">Monitor your trading portfolio and market data</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <KillSwitchIndicator />
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <BellIcon className="h-6 w-6" />
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
