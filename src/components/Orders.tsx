/**
 * Orders Component - Order management interface
 */

'use client';

import React, { useState, useMemo } from 'react';
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

// Default client ID - change this if you need to use a different client ID
const DEFAULT_CLIENT_ID = '1101648848';

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
    dhanClientId: DEFAULT_CLIENT_ID, // Pre-populated with your client ID
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
        dhanClientId: DEFAULT_CLIENT_ID, // Keep your client ID pre-populated
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
            <p className="text-blue-700">✓ Pre-populated with your default ID ({DEFAULT_CLIENT_ID})</p>
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
                dhanClientId: DEFAULT_CLIENT_ID,
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
                dhanClientId: DEFAULT_CLIENT_ID,
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
              Client ID * <span className="text-green-600 text-xs">(Pre-filled)</span>
            </label>
            <input
              type="text"
              value={orderData.dhanClientId || ''}
              onChange={(e) => updateOrderData('dhanClientId', e.target.value)}
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-green-50"
              placeholder="e.g., 1101648848"
              required
            />
            <p className="text-xs text-green-600 mt-1">
              ✓ Your default client ID is pre-populated
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
            
            {orderData.orderType === 'STOP_LOSS' && (
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

        {orderData.orderType === 'STOP_LOSS_MARKET' && (
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

// Categorized Order Tables Component
const CategorizedOrderTables: React.FC<{ orders: DhanOrder[], onRefresh: () => void }> = ({ orders, onRefresh }) => {
  const [editingOrder, setEditingOrder] = useState<DhanOrder | null>(null);
  const cancelOrderMutation = useCancelOrder();

  // Categorize orders by status
  const categorizedOrders = useMemo(() => {
    const active = orders.filter(order => 
      order.orderStatus === 'PENDING' || order.orderStatus === 'PART_TRADED'
    );
    const completed = orders.filter(order => 
      order.orderStatus === 'TRADED'
    );
    const cancelled = orders.filter(order => 
      order.orderStatus === 'CANCELLED' || order.orderStatus === 'REJECTED'
    );
    const expired = orders.filter(order => 
      order.orderStatus === 'EXPIRED'
    );
    const others = orders.filter(order => 
      !['PENDING', 'PART_TRADED', 'TRADED', 'CANCELLED', 'REJECTED', 'EXPIRED'].includes(order.orderStatus)
    );

    return { active, completed, cancelled, expired, others };
  }, [orders]);

  const handleCancelOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await cancelOrderMutation.mutateAsync(orderId);
        alert('Order cancelled successfully!');
        onRefresh();
      } catch (error) {
        console.error('Error cancelling order:', error);
        alert('Failed to cancel order. Please try again.');
      }
    }
  };

  const handleEditSuccess = () => {
    onRefresh();
  };

  const OrderTable: React.FC<{ 
    orders: DhanOrder[], 
    title: string, 
    showActions?: boolean,
    bgColor?: string 
  }> = ({ 
    orders, 
    title, 
    showActions = false,
    bgColor = 'bg-white'
  }) => {
    if (!orders.length) {
      return (
        <div className={`${bgColor} rounded-lg shadow mb-6`}>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold flex items-center justify-between">
              {title}
              <span className="text-sm font-normal text-gray-500">(0)</span>
            </h3>
          </div>
          <div className="px-6 py-8 text-center text-gray-500">
            No {title.toLowerCase()} orders
          </div>
        </div>
      );
    }

    return (
      <div className={`${bgColor} rounded-lg shadow mb-6`}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold flex items-center justify-between">
            {title}
            <span className="text-sm font-normal text-gray-500">({orders.length})</span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
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
                {showActions && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span className="font-medium">{order.tradingSymbol || order.securityId}</span>
                      <span className="text-xs text-gray-400">{order.securityId}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col space-y-1">
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.transactionType === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {order.transactionType}
                      </span>
                      <span className="text-xs text-gray-400">{order.orderType}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span className="font-medium">{order.quantity}</span>
                      {order.filledQty > 0 && (
                        <span className="text-xs text-green-600">Filled: {order.filledQty}</span>
                      )}
                      {order.remainingQuantity > 0 && (
                        <span className="text-xs text-yellow-600">Remaining: {order.remainingQuantity}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span className="font-medium">₹{order.price}</span>
                      {order.averageTradedPrice > 0 && (
                        <span className="text-xs text-blue-600">Avg: ₹{order.averageTradedPrice}</span>
                      )}
                      {order.triggerPrice > 0 && (
                        <span className="text-xs text-orange-600">Trigger: ₹{order.triggerPrice}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <OrderStatusBadge status={order.orderStatus} />
                  </td>
                  {showActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingOrder(order)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                          title="Edit Order"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleCancelOrder(order.orderId)}
                          disabled={cancelOrderMutation.isPending}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 font-medium"
                          title="Cancel Order"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Active Orders - Most Important */}
      <OrderTable 
        orders={categorizedOrders.active} 
        title="Active Orders" 
        showActions={true}
        bgColor="bg-white border-l-4 border-l-blue-500"
      />

      {/* Completed Orders */}
      <OrderTable 
        orders={categorizedOrders.completed} 
        title="Completed Orders"
        bgColor="bg-green-50"
      />

      {/* Cancelled/Rejected Orders */}
      <OrderTable 
        orders={categorizedOrders.cancelled} 
        title="Cancelled/Rejected Orders"
        bgColor="bg-red-50"
      />

      {/* Expired Orders */}
      {categorizedOrders.expired.length > 0 && (
        <OrderTable 
          orders={categorizedOrders.expired} 
          title="Expired Orders"
          bgColor="bg-yellow-50"
        />
      )}

      {/* Other Orders */}
      {categorizedOrders.others.length > 0 && (
        <OrderTable 
          orders={categorizedOrders.others} 
          title="Other Orders"
          bgColor="bg-gray-50"
        />
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          isOpen={!!editingOrder}
          onClose={() => setEditingOrder(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

// Edit Order Modal Component
const EditOrderModal: React.FC<{
  order: DhanOrder;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ order, isOpen, onClose, onSuccess }) => {
  const [modifyData, setModifyData] = useState<Partial<ModifyOrderRequest>>({
    dhanClientId: order.dhanClientId,
    orderId: order.orderId,
    orderType: order.orderType,
    quantity: order.quantity,
    price: order.price,
    triggerPrice: order.triggerPrice,
    validity: order.validity,
    disclosedQuantity: order.disclosedQuantity,
  });

  const modifyOrderMutation = useModifyOrder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!modifyData.dhanClientId || !modifyData.orderId) {
      alert('Missing required order information');
      return;
    }

    try {
      await modifyOrderMutation.mutateAsync({
        orderId: modifyData.orderId!,
        modifyData: modifyData as ModifyOrderRequest
      });
      alert('Order modified successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error modifying order:', error);
      alert('Failed to modify order. Please try again.');
    }
  };

  const updateModifyData = (field: keyof ModifyOrderRequest, value: any) => {
    setModifyData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Edit Order</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Order ID: {order.orderId}</p>
          <p className="text-sm text-gray-600">Symbol: {order.tradingSymbol || order.securityId}</p>
          <p className="text-sm text-gray-600">Type: {order.transactionType}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order Type
            </label>
            <select
              value={modifyData.orderType || ''}
              onChange={(e) => updateModifyData('orderType', e.target.value as OrderType)}
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
              Quantity
            </label>
            <input
              type="number"
              value={modifyData.quantity || ''}
              onChange={(e) => updateModifyData('quantity', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              required
            />
          </div>

          {(modifyData.orderType === 'LIMIT' || modifyData.orderType === 'STOP_LOSS') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                step="0.01"
                value={modifyData.price || ''}
                onChange={(e) => updateModifyData('price', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter price"
                required
              />
            </div>
          )}

          {(modifyData.orderType === 'STOP_LOSS' || modifyData.orderType === 'STOP_LOSS_MARKET') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trigger Price
              </label>
              <input
                type="number"
                step="0.01"
                value={modifyData.triggerPrice || ''}
                onChange={(e) => updateModifyData('triggerPrice', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter trigger price"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Validity
            </label>
            <select
              value={modifyData.validity || ''}
              onChange={(e) => updateModifyData('validity', e.target.value as OrderValidity)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="DAY">DAY</option>
              <option value="IOC">IOC</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={modifyOrderMutation.isPending}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {modifyOrderMutation.isPending ? 'Updating...' : 'Update Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Orders Component
const Orders: React.FC = () => {
  const { data: orders, isLoading, error, refetch } = useOrderBook();

  // Debug logging
  console.log('Orders component - Loading:', isLoading);
  console.log('Orders component - Error:', error);
  console.log('Orders component - Data:', orders);
  console.log('Orders component - Data length:', orders?.length);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
        <span className="ml-3 text-gray-600">Loading orders...</span>
      </div>
    );
  }

  if (error) {
    console.error('Orders error:', error);
    return <ErrorMessage message="Failed to load orders" onRetry={refetch} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Orders Management</h2>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <PlaceOrderForm />

      {orders?.length ? (
        <CategorizedOrderTables orders={orders} onRefresh={refetch} />
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by placing your first order above.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
