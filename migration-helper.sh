#!/bin/bash

# Component Import Migration Helper
# This script helps update import statements to use the new component structure

echo "🔄 Component Import Migration Helper"
echo "===================================="

# Define the new import paths mapping
declare -A COMPONENT_MAP=(
    # Dashboard Components
    ["DashboardHome"]="@/components/features/dashboard"
    ["ForeverOrderDashboard"]="@/components/features/dashboard" 
    ["OptionChainDashboard"]="@/components/features/dashboard"
    ["OrderDashboard"]="@/components/features/dashboard"
    ["OrdersDashboard"]="@/components/features/dashboard"
    ["SuperOrderDashboard"]="@/components/features/dashboard"
    
    # Order Components
    ["OrderBook"]="@/components/features/orders"
    ["OrderBookNew"]="@/components/features/orders"
    ["OrderBookOld"]="@/components/features/orders"
    ["Orders"]="@/components/features/orders"
    ["ForeverOrderBook"]="@/components/features/orders"
    ["SuperOrderBook"]="@/components/features/orders"
    
    # Holdings Components
    ["Holdings"]="@/components/features/holdings"
    ["Positions"]="@/components/features/holdings"
    ["ConvertPosition"]="@/components/features/holdings"
    ["Funds"]="@/components/features/holdings"
    ["Statements"]="@/components/features/holdings"
    
    # Market Components
    ["MarketStatusIndicator"]="@/components/features/market"
    ["MarketHolidayCalendar"]="@/components/features/market"
    ["HolidayWidget"]="@/components/features/market"
    ["HolidaySources"]="@/components/features/market"
    
    # Options Components
    ["OptionChain"]="@/components/features/options"
    ["OptionChainAdvanced"]="@/components/features/options"
    
    # Trading Components
    ["TradersControl"]="@/components/features/trading"
    ["KillSwitchIndicator"]="@/components/features/trading"
    
    # UI Components
    ["ChunkErrorBoundary"]="@/components/ui"
    ["PositionsList"]="@/components/ui"
    ["QuickTradeModal"]="@/components/ui"
    
    # Forms
    ["OrderForm"]="@/components/features/orders"
    ["OrderEditForm"]="@/components/features/orders"
    ["EditOrderForm"]="@/components/features/orders"
    ["PlaceOrderForm"]="@/components/features/orders"
    ["ForeverOrderForm"]="@/components/features/orders"
    ["ForeverOrderEditForm"]="@/components/features/orders"
    ["SuperOrderForm"]="@/components/features/orders"
    ["ModifySuperOrderForm"]="@/components/features/orders"
    ["ConvertPositionModal"]="@/components/features/holdings"
)

echo "📝 To update imports in your files, use patterns like:"
echo ""
echo "Old import:"
echo "import { DashboardHome } from '@/components/DashboardHome';"
echo ""
echo "New import:"
echo "import { DashboardHome } from '@/components/features/dashboard';"
echo ""
echo "Or use the main barrel import:"
echo "import { DashboardHome } from '@/components';"
echo ""

echo "🎯 Quick Reference - New Import Paths:"
echo "======================================"
printf "%-25s | %s\n" "Component" "New Import Path"
echo "----------------------------------------|----------------------------------------"

for component in "${!COMPONENT_MAP[@]}"; do
    printf "%-25s | %s\n" "$component" "${COMPONENT_MAP[$component]}"
done

echo ""
echo "✅ Component restructuring complete!"
echo "📁 New structure is feature-based and more maintainable"
echo "📖 See src/components/README.md for detailed usage guidelines"
