/**
 * Orders Component - Order management interface
 */

'use client';

import React, { useState } from 'react';
import { 
  useOrderBook, 
  usePlaceOrder, 
  useModifyOrder, 
  useCancelOrder,
  usePlaceSlicedOrder 
} from '@/features/trading/hooks';
import type { 
  DhanOrder, 
  PlaceOrderRequest, 
  ModifyOrderRequest,
  TransactionType,
  ExchangeSegment,
  ProductType,
  OrderType,
  OrderValidity 
} from '@/features/trading/types';
import { LoadingSpinner, ErrorMessage } from '@/lib/components/ui/LoadingStates';

// Order Status Badge Component
const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TRADED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      case 'PART_TRADED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};

// Place Order Form Component
const PlaceOrderForm: React.FC = () => {
  const [orderData, setOrderData] = useState<Partial<PlaceOrderRequest>>({
    transactionType: 'BUY',
    exchangeSegment: 'NSE_EQ',
    productType: 'INTRADAY',
    orderType: 'MARKET',
    validity: 'DAY',
    quantity: 1,
    disclosedQuantity: 0,
    afterMarketOrder: false,
  });

  const placeOrderMutation = usePlaceOrder();
  const placeSlicedOrderMutation = usePlaceSlicedOrder();

  const handleSubmit = async (e: React.FormEvent, isSliced = false) => {
    e.preventDefault();
    
    if (!orderData.dhanClientId || !orderData.securityId || !orderData.quantity) {
      alert('Please fill all required fields');
      return;
    }

    const orderRequest = orderData as PlaceOrderRequest;
    
    try {
      if (isSliced) {
        await placeSlicedOrderMutation.mutateAsync(orderRequest);
        alert('Sliced order placed successfully!');
      } else {
        await placeOrderMutation.mutateAsync(orderRequest);
        alert('Order placed successfully!');
      }
      
      // Reset form
      setOrderData({
        transactionType: 'BUY',
        exchangeSegment: 'NSE_EQ',
        productType: 'INTRADAY',
        orderType: 'MARKET',
        validity: 'DAY',
        quantity: 1,
        disclosedQuantity: 0,
        afterMarketOrder: false,
      });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const updateOrderData = (field: keyof PlaceOrderRequest, value: any) => {
    setOrderData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Place New Order</h3>
      
      {/* Quick Reference Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-blue-900 mb-2">📋 Quick Reference</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <p className="font-medium text-blue-800 mb-1">Common Security IDs:</p>
            <ul className="text-blue-700 space-y-0.5">
              <li>• <strong>TCS</strong> (Tata Consultancy Services): 11536</li>
              <li>• <strong>RELIANCE</strong> (Reliance Industries): 3456</li>
              <li>• <strong>INFY</strong> (Infosys): 4963</li>
              <li>• <strong>HDFCBANK</strong> (HDFC Bank): 1333</li>
              <li>• <strong>SBIN</strong> (State Bank of India): 3045</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-blue-800 mb-1">Your Client ID:</p>
            <p className="text-blue-700">Find your 10-digit client ID in your Dhan account dashboard</p>
            <p className="font-medium text-blue-800 mb-1 mt-2">Security ID:</p>
            <p className="text-blue-700">Use Dhan's instrument master or search for the stock symbol</p>
            <p className="font-medium text-blue-800 mb-1 mt-2">💡 Tip:</p>
            <p className="text-blue-700">Security IDs remain constant - you can save frequently used ones</p>
          </div>
        </div>
        
        {/* Quick Fill Examples */}
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="font-medium text-blue-800 mb-2 text-xs">Quick Fill Examples:</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOrderData({
                dhanClientId: '1101648848',
                securityId: '11536',
                transactionType: 'BUY',
                exchangeSegment: 'NSE_EQ',
                productType: 'INTRADAY',
                orderType: 'LIMIT',
                validity: 'DAY',
                quantity: 10,
                price: 100,
                disclosedQuantity: 0,
                afterMarketOrder: false,
              })}
              className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs rounded transition-colors"
            >
              TCS Example
            </button>
            <button
              type="button"
              onClick={() => setOrderData({
                dhanClientId: '1101648848',
                securityId: '3456',
                transactionType: 'BUY',
                exchangeSegment: 'NSE_EQ',
                productType: 'CNC',
                orderType: 'MARKET',
                validity: 'DAY',
                quantity: 5,
                disclosedQuantity: 0,
                afterMarketOrder: false,
              })}
              className="px-2 py-1 bg-green-100 hover:bg-green-200 text-green-800 text-xs rounded transition-colors"
            >
              RELIANCE Example
            </button>
          </div>
        </div>
      </div>
      
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client ID *
            </label>
            <input
              type="text"
              value={orderData.dhanClientId || ''}
              onChange={(e) => updateOrderData('dhanClientId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 1101648848"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Your Dhan client ID (10-digit number from your account)
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Security ID *
            </label>
            <input
              type="text"
              value={orderData.securityId || ''}
              onChange={(e) => updateOrderData('securityId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 11536 for TCS"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Security ID from Dhan (TCS: 11536, RELIANCE: 3456, INFY: 4963, etc.)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transaction Type *
            </label>
            <select
              value={orderData.transactionType || 'BUY'}
              onChange={(e) => updateOrderData('transactionType', e.target.value as TransactionType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exchange Segment *
            </label>
            <select
              value={orderData.exchangeSegment || 'NSE_EQ'}
              onChange={(e) => updateOrderData('exchangeSegment', e.target.value as ExchangeSegment)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="NSE_EQ">NSE_EQ</option>
              <option value="NSE_FNO">NSE_FNO</option>
              <option value="BSE_EQ">BSE_EQ</option>
              <option value="BSE_FNO">BSE_FNO</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Type *
            </label>
            <select
              value={orderData.productType || 'INTRADAY'}
              onChange={(e) => updateOrderData('productType', e.target.value as ProductType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CNC">CNC</option>
              <option value="INTRADAY">INTRADAY</option>
              <option value="MARGIN">MARGIN</option>
              <option value="MTF">MTF</option>
              <option value="CO">CO</option>
              <option value="BO">BO</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Type *
            </label>
            <select
              value={orderData.orderType || 'MARKET'}
              onChange={(e) => updateOrderData('orderType', e.target.value as OrderType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="MARKET">MARKET</option>
              <option value="LIMIT">LIMIT</option>
              <option value="STOP_LOSS">STOP_LOSS</option>
              <option value="STOP_LOSS_MARKET">STOP_LOSS_MARKET</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Validity *
            </label>
            <select
              value={orderData.validity || 'DAY'}
              onChange={(e) => updateOrderData('validity', e.target.value as OrderValidity)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DAY">DAY</option>
              <option value="IOC">IOC</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity *
            </label>
            <input
              type="number"
              value={orderData.quantity || 1}
              onChange={(e) => updateOrderData('quantity', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>
        </div>

        {(orderData.orderType === 'LIMIT' || orderData.orderType === 'STOP_LOSS') && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={orderData.price || ''}
                onChange={(e) => updateOrderData('price', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price"
                required
              />
            </div>
            
            {(orderData.orderType === 'STOP_LOSS' || orderData.orderType === 'STOP_LOSS_MARKET') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trigger Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={orderData.triggerPrice || ''}
                  onChange={(e) => updateOrderData('triggerPrice', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter trigger price"
                  required
                />
              </div>
            )}
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, false)}
            disabled={placeOrderMutation.isPending}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {placeOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
          </button>
          
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={placeSlicedOrderMutation.isPending}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {placeSlicedOrderMutation.isPending ? 'Placing Sliced Order...' : 'Place Sliced Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

// Order Book Table Component
const OrderBookTable: React.FC<{ orders: DhanOrder[] }> = ({ orders }) => {
  const cancelOrderMutation = useCancelOrder();

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrderMutation.mutateAsync(orderId);
        alert('Order cancelled successfully!');
      } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Failed to cancel order. Please try again.');
      }
    }
  };

  if (!orders?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No orders found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Symbol
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Qty
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.orderId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {order.orderId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.tradingSymbol || order.securityId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex flex-col">
                  <span className={`text-xs px-2 py-1 rounded ${
                    order.transactionType === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {order.transactionType}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">{order.orderType}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex flex-col">
                  <span>{order.quantity}</span>
                  {order.filledQty > 0 && (
                    <span className="text-xs text-green-600">Filled: {order.filledQty}</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex flex-col">
                  <span>₹{order.price}</span>
                  {order.averageTradedPrice > 0 && (
                    <span className="text-xs text-blue-600">Avg: ₹{order.averageTradedPrice}</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <OrderStatusBadge status={order.orderStatus} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {(order.orderStatus === 'PENDING' || order.orderStatus === 'PART_TRADED') && (
                  <button
                    onClick={() => handleCancelOrder(order.orderId)}
                    disabled={cancelOrderMutation.isPending}
                    className="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main Orders Component
const Orders: React.FC = () => {
  const { data: orders, isLoading, error, refetch } = useOrderBook();

  if (isLoading) {
    return <LoadingSpinner message="Loading orders..." />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load orders" onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      <PlaceOrderForm />

      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Order Book</h3>
        </div>
        <OrderBookTable orders={orders || []} />
      </div>
    </div>
  );
};

export default Orders;
