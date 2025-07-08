import React, { useState, useEffect } from 'react';
import { useConvertPosition } from '@/features/portfolio';
import type { DhanPosition, ConvertPositionRequest } from '@/features/portfolio/types';
import { getAvailableProductTypes, validateConversion } from '@/lib/utils/positionUtils';

interface ConvertModalProps {
  position: DhanPosition | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ConvertPositionModal({ position, isOpen, onClose, onSuccess }: ConvertModalProps) {
  const { mutate: convertPosition, isPending: isLoading, error, isSuccess: success, reset } = useConvertPosition();
  const [convertQty, setConvertQty] = useState('');
  const [toProductType, setToProductType] = useState<'CNC' | 'INTRADAY' | 'MARGIN'>('CNC');
  const [showToast, setShowToast] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (position) {
      setConvertQty(position.netQty.toString());
      setValidationError(null);
      
      // Get available product types for this position
      const availableTypes = getAvailableProductTypes(position.productType, position.exchangeSegment);
      if (availableTypes.length > 0) {
        setToProductType(availableTypes[0] as any);
      }
    }
  }, [position]);

  useEffect(() => {
    if (success) {
      setShowToast(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        reset();
      }, 2000);
    }
  }, [success, onSuccess, onClose, reset]);

  useEffect(() => {
    if (position && toProductType) {
      const validation = validateConversion(
        position.productType,
        toProductType,
        position.positionType,
        position.exchangeSegment
      );
      
      setValidationError(validation.isValid ? null : validation.reason || null);
    }
  }, [position, toProductType]);

  if (!isOpen || !position) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmConversion = async () => {
    if (!position) return;

    setShowConfirmation(false);

    const request: ConvertPositionRequest = {
      dhanClientId: position.dhanClientId,
      fromProductType: position.productType as any,
      exchangeSegment: position.exchangeSegment as any,
      positionType: position.positionType as any,
      securityId: position.securityId,
      tradingSymbol: position.tradingSymbol,
      convertQty: parseInt(convertQty),
      toProductType: toProductType,
    };

    try {
      await convertPosition(request);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const maxQty = Math.abs(position.netQty);
  const isValidQty = parseInt(convertQty) > 0 && parseInt(convertQty) <= maxQty;
  const canSubmit = isValidQty && !validationError && !isLoading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Convert Position</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Position Info */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900">{position.tradingSymbol}</h3>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div>
              <span className="text-gray-600">Current: </span>
              <span className="font-medium">{position.productType}</span>
            </div>
            <div>
              <span className="text-gray-600">Net Qty: </span>
              <span className="font-medium">{position.netQty}</span>
            </div>
          </div>
        </div>

        {!showConfirmation ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity to Convert
              </label>
              <input
                type="number"
                value={convertQty}
                onChange={(e) => setConvertQty(e.target.value)}
                max={maxQty}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Max: {maxQty}</p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Convert To
              </label>
              <select
                value={toProductType}
                onChange={(e) => setToProductType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {getAvailableProductTypes(position.productType, position.exchangeSegment).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {validationError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{validationError}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{error.message}</p>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Converting...' : 'Convert'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">Confirm Conversion</h3>
              <p className="text-yellow-700 text-sm">
                Convert {convertQty} shares from {position.productType} to {toProductType}?
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                disabled={isLoading}
              >
                Back
              </button>
              <button
                onClick={handleConfirmConversion}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Converting...' : 'Confirm'}
              </button>
            </div>
          </div>
        )}

        {showToast && (
          <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
            <span className="block sm:inline">Position converted successfully!</span>
          </div>
        )}
      </div>
    </div>
  );
}
