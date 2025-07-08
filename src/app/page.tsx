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

const HomePage: React.FC = () => {
    const [currentPath, setCurrentPath] = useState('/');

    const handleNavigate = (path: string) => {
        setCurrentPath(path);
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
            case '/funds':
                return <Funds />;
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