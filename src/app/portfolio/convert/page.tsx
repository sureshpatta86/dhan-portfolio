'use client';

import { ConvertPosition } from '@/components/features/holdings/ConvertPosition';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ConvertPositionPage() {
  const handleNavigate = (path: string) => {
    // Handle navigation if needed
    console.log('Navigate to:', path);
  };

  return (
    <DashboardLayout currentPath="/portfolio/convert" onNavigate={handleNavigate}>
      <ConvertPosition />
    </DashboardLayout>
  );
}
