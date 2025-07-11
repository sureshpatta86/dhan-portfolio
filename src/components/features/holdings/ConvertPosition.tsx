import React, { useState } from 'react';
import { usePositions } from '@/features/portfolio';
import { LoadingSkeleton } from '@/lib/components/ui/LoadingStates';
import { ConvertPositionModal } from './forms/ConvertPositionModal';
import { PositionsList } from '../../ui/PositionsList';
import type { DhanPosition } from '@/features/portfolio/types';

export function ConvertPosition() {
  const { data: positions = [], isLoading, error, refetch } = usePositions();
  const [selectedPosition, setSelectedPosition] = useState<DhanPosition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConvert = (position: DhanPosition) => {
    setSelectedPosition(position);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedPosition(null);
    setIsModalOpen(false);
  };

  const handleConversionSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Convert Position</h1>
        <LoadingSkeleton type="cards" count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Convert Position</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
          <p className="text-red-600">{error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Filter out positions that can be converted (exclude closed positions)
  const convertiblePositions = (positions || []).filter(
    (position: DhanPosition) => position.positionType !== 'CLOSED' && position.netQty !== 0
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Convert Position</h1>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
        >
          Refresh
        </button>
      </div>

      <PositionsList
        positions={convertiblePositions}
        onConvert={handleConvert}
        isLoading={isLoading}
      />

      <ConvertPositionModal
        position={selectedPosition}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleConversionSuccess}
      />
    </div>
  );
}

export default ConvertPosition;