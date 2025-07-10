'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DashboardHome from '@/components/DashboardHome';
import Holdings from '@/components/Holdings';
import Positions from '@/components/Positions';
import { ConvertPosition } from '@/components/ConvertPosition';
import TradersControl from '@/components/TradersControl';
import Funds from '@/components/Funds';
import { Statements } from '@/components/Statements';
import Orders from '@/components/Orders';
import { OrderDashboard } from '@/components/OrderDashboard';
import { OrderBook } from '@/components/OrderBook';
import { PlaceOrderForm } from '@/components/forms/PlaceOrderForm';
import { OrderEditForm } from '@/components/forms/OrderEditForm';
import SuperOrders from '@/components/SuperOrderBook';
import { SuperOrderDashboard } from '@/components/SuperOrderDashboard';
import { SuperOrderForm } from '@/components/forms/SuperOrderForm';
import { ModifySuperOrderForm } from '@/components/forms/ModifySuperOrderForm';
import { ForeverOrderDashboard } from '@/components/ForeverOrderDashboard';
import { ForeverOrderBook } from '@/components/ForeverOrderBook';
import { ForeverOrderForm } from '@/components/forms/ForeverOrderForm';
import { ForeverOrderEditForm } from '@/components/forms/ForeverOrderEditForm';
import OptionChainDashboard from '@/components/OptionChainDashboard';
import MarketHolidayCalendar from '@/components/MarketHolidayCalendar';
import type { DhanForeverOrder, DhanSuperOrder, DhanOrder } from '@/features/trading/types';

const HomePage: React.FC = () => {
    const [currentPath, setCurrentPath] = useState('/');
    const [foreverOrderTab, setForeverOrderTab] = useState<'dashboard' | 'place' | 'book'>('dashboard');
    const [superOrderTab, setSuperOrderTab] = useState<'dashboard' | 'place' | 'book'>('dashboard');
    const [orderTab, setOrderTab] = useState<'dashboard' | 'place' | 'book'>('dashboard');
    const [orderToModify, setOrderToModify] = useState<DhanForeverOrder | null>(null);
    const [superOrderToModify, setSuperOrderToModify] = useState<DhanSuperOrder | null>(null);
    const [regularOrderToModify, setRegularOrderToModify] = useState<DhanOrder | null>(null);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isSuperEditFormOpen, setIsSuperEditFormOpen] = useState(false);
    const [isOrderEditFormOpen, setIsOrderEditFormOpen] = useState(false);

    const handleNavigate = (path: string) => {
        setCurrentPath(path);
        // Reset state when navigating away
        if (path !== '/trading/forever-order') {
            setForeverOrderTab('dashboard');
            setOrderToModify(null);
            setIsEditFormOpen(false);
        }
        if (path !== '/trading/super-order') {
            setSuperOrderTab('dashboard');
            setSuperOrderToModify(null);
            setIsSuperEditFormOpen(false);
        }
        if (path !== '/trading/orders') {
            setOrderTab('dashboard');
            setRegularOrderToModify(null);
            setIsOrderEditFormOpen(false);
        }
    };

    // Forever Order event handlers
    const handleForeverOrderPlaced = () => {
        setForeverOrderTab('dashboard');
    };

    const handleForeverOrderSelect = (order: DhanForeverOrder) => {
        // Handle order selection if needed
        console.log('Selected forever order:', order);
    };

    const handleForeverOrderModify = (order: DhanForeverOrder) => {
        setOrderToModify(order);
        setIsEditFormOpen(true);
    };

    const handleEditFormClose = () => {
        setOrderToModify(null);
        setIsEditFormOpen(false);
    };

    const handleEditFormSuccess = () => {
        setOrderToModify(null);
        setIsEditFormOpen(false);
        setForeverOrderTab('dashboard');
    };

    // Super Order event handlers
    const handleSuperOrderPlaced = () => {
        setSuperOrderTab('dashboard');
    };

    const handleSuperOrderSelect = (order: DhanSuperOrder) => {
        // Handle order selection if needed
        console.log('Selected super order:', order);
    };

    const handleSuperOrderModify = (order: DhanSuperOrder) => {
        setSuperOrderToModify(order);
        setIsSuperEditFormOpen(true);
    };

    const handleSuperEditFormClose = () => {
        setSuperOrderToModify(null);
        setIsSuperEditFormOpen(false);
    };

    const handleSuperEditFormSuccess = () => {
        setSuperOrderToModify(null);
        setIsSuperEditFormOpen(false);
        setSuperOrderTab('dashboard');
    };

    // Regular Order event handlers
    const handleOrderPlaced = () => {
        setOrderTab('dashboard');
    };

    const handleOrderSelect = (order: DhanOrder) => {
        // Handle order selection if needed
        console.log('Selected order:', order);
    };

    const handleOrderModify = (order: DhanOrder) => {
        setRegularOrderToModify(order);
        setIsOrderEditFormOpen(true);
    };

    const handleOrderEditFormClose = () => {
        setRegularOrderToModify(null);
        setIsOrderEditFormOpen(false);
    };

    const handleOrderEditFormSuccess = () => {
        setRegularOrderToModify(null);
        setIsOrderEditFormOpen(false);
        setOrderTab('dashboard');
    };

    const renderContent = () => {
        switch (currentPath) {
            case '/':
                return <DashboardHome onNavigate={handleNavigate} />;
            case '/portfolio/holdings':
                return <Holdings />;
            case '/portfolio/positions':
                return <Positions />;
            case '/portfolio/convert':
                return <ConvertPosition />;
            case '/trading/orders':
                return (
                    <div className="p-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Trading Orders</h1>
                            <p className="text-gray-600 mt-1">
                                Manage your orders, place new trades, and monitor order status
                            </p>
                        </div>

                        {/* Order Tabs */}
                        <div className="bg-white rounded-lg shadow">
                            {/* Tab Headers */}
                            <div className="border-b border-gray-200">
                                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                    {[
                                        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                                        { id: 'place', label: 'Place Order', icon: '➕' },
                                        { id: 'book', label: 'Order Book', icon: '📋' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setOrderTab(tab.id as 'dashboard' | 'place' | 'book')}
                                            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                                                orderTab === tab.id
                                                    ? 'border-green-500 text-green-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            <span>{tab.icon}</span>
                                            <span>{tab.label}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="min-h-[500px]">
                                {orderTab === 'dashboard' && (
                                    <OrderDashboard 
                                        onCreateNew={() => setOrderTab('place')}
                                        onViewAll={() => setOrderTab('book')}
                                    />
                                )}
                                {orderTab === 'place' && (
                                    <PlaceOrderForm onOrderPlaced={handleOrderPlaced} />
                                )}
                                {orderTab === 'book' && (
                                    <OrderBook 
                                        onOrderSelect={handleOrderSelect}
                                        onOrderModify={handleOrderModify}
                                        onCreateNew={() => setOrderTab('place')}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Edit Form Modal */}
                        {isOrderEditFormOpen && regularOrderToModify && (
                            <OrderEditForm 
                                order={regularOrderToModify}
                                isOpen={isOrderEditFormOpen}
                                onCloseAction={handleOrderEditFormClose}
                                onSuccessAction={handleOrderEditFormSuccess}
                            />
                        )}
                    </div>
                );
            case '/trading/trades':
                return (
                    <div className="p-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Trade Book</h1>
                            <p className="text-gray-600 mt-1">
                                Your executed trades and transaction history
                            </p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">Trade Book Feature</h3>
                            <p className="text-blue-600">
                                The trade book will show your executed trades once you start trading through the orders section.
                            </p>
                        </div>
                    </div>
                );
                case '/trading/super-order':
                return (
                    <div className="p-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Super Orders</h1>
                            <p className="text-gray-600 mt-1">
                                Advanced conditional orders with multiple legs and strategies
                            </p>
                        </div>

                        {/* Super Order Tabs */}
                        <div className="bg-white rounded-lg shadow">
                            {/* Tab Headers */}
                            <div className="border-b border-gray-200">
                                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                    {[
                                        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                                        { id: 'place', label: 'Place Order', icon: '➕' },
                                        { id: 'book', label: 'Order Book', icon: '📋' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setSuperOrderTab(tab.id as 'dashboard' | 'place' | 'book')}
                                            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                                                superOrderTab === tab.id
                                                    ? 'border-blue-500 text-blue-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            <span>{tab.icon}</span>
                                            <span>{tab.label}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="min-h-[500px]">
                                {superOrderTab === 'dashboard' && (
                                    <SuperOrderDashboard 
                                        onCreateNew={() => setSuperOrderTab('place')}
                                        onViewAll={() => setSuperOrderTab('book')}
                                    />
                                )}
                                {superOrderTab === 'place' && (
                                    <SuperOrderForm onSuccess={(orderId) => handleSuperOrderPlaced()} />
                                )}
                                {superOrderTab === 'book' && (
                                    <SuperOrders 
                                        onOrderSelect={handleSuperOrderSelect}
                                        onOrderModify={handleSuperOrderModify}
                                        onCreateNew={() => setSuperOrderTab('place')}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Edit Form Modal */}
                        {isSuperEditFormOpen && superOrderToModify && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                                    <div className="flex items-center justify-between p-4 border-b">
                                        <h3 className="text-lg font-semibold">Edit Super Order</h3>
                                        <button
                                            onClick={handleSuperEditFormClose}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <ModifySuperOrderForm 
                                        order={superOrderToModify}
                                        onSuccess={handleSuperEditFormSuccess}
                                        onCancel={handleSuperEditFormClose}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                );
            case '/trading/forever-order':
                return (
                    <div className="p-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">Forever Orders</h1>
                            <p className="text-gray-600 mt-1">
                                Long-term orders that persist across market sessions
                            </p>
                        </div>

                        {/* Forever Order Tabs */}
                        <div className="bg-white rounded-lg shadow">
                            {/* Tab Headers */}
                            <div className="border-b border-gray-200">
                                <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                    {[
                                        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
                                        { id: 'place', label: 'Place Order', icon: '➕' },
                                        { id: 'book', label: 'Order Book', icon: '📋' }
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setForeverOrderTab(tab.id as 'dashboard' | 'place' | 'book')}
                                            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                                                foreverOrderTab === tab.id
                                                    ? 'border-purple-500 text-purple-600'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            <span>{tab.icon}</span>
                                            <span>{tab.label}</span>
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="min-h-[500px]">
                                {foreverOrderTab === 'dashboard' && (
                                    <ForeverOrderDashboard 
                                        onCreateNew={() => setForeverOrderTab('place')}
                                        onViewAll={() => setForeverOrderTab('book')}
                                    />
                                )}
                                {foreverOrderTab === 'place' && (
                                    <ForeverOrderForm onOrderPlaced={handleForeverOrderPlaced} />
                                )}
                                {foreverOrderTab === 'book' && (
                                    <ForeverOrderBook 
                                        onOrderSelect={handleForeverOrderSelect}
                                        onOrderModify={handleForeverOrderModify}
                                        onCreateNew={() => setForeverOrderTab('place')}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Edit Form Modal */}
                        {isEditFormOpen && orderToModify && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                                    <div className="flex items-center justify-between p-4 border-b">
                                        <h3 className="text-lg font-semibold">Edit Forever Order</h3>
                                        <button
                                            onClick={handleEditFormClose}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <ForeverOrderEditForm 
                                        order={orderToModify}
                                        isOpen={isEditFormOpen}
                                        onCloseAction={handleEditFormClose}
                                        onSuccessAction={handleEditFormSuccess}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                );
            case '/funds':
                return <Funds />;
            case '/market/option-chain':
                return <OptionChainDashboard />;
            case '/market-holidays':
                return (
                    <div className="p-6">
                        <MarketHolidayCalendar />
                    </div>
                );
            case '/reports/statements':
                return <Statements />;
            case '/tools/traders-control':
                return <TradersControl />;
            default:
                return (
                    <div className="p-6">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-yellow-800 mb-2">Coming Soon</h2>
                            <p className="text-yellow-600">
                                This feature is under development and will be available soon.
                            </p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <DashboardLayout 
            currentPath={currentPath} 
            onNavigate={handleNavigate}
        >
            {renderContent()}
        </DashboardLayout>
    );
};

export default HomePage;