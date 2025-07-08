'use client';

import React from 'react';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { useTradersControlStore } from '@/lib/store/tradersControl';

const KillSwitchIndicator: React.FC = () => {
  const { killSwitchStatus } = useTradersControlStore();

  if (!killSwitchStatus.isActive) {
    return null;
  }

  return (
    <div className="bg-red-600 text-white px-3 py-1 rounded-full flex items-center text-sm font-medium animate-pulse">
      <ShieldExclamationIcon className="h-4 w-4 mr-1" />
      KILL SWITCH ACTIVE
    </div>
  );
};

export default KillSwitchIndicator;
