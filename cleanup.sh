#!/bin/bash

# Cleanup Script - Remove Old Dashboard Components
# Run this to delete unused training dashboard components

echo "🧹 Cleaning up old dashboard components..."

# Remove old components that are no longer needed
rm -f components/ProfileCard.tsx
rm -f components/StatsCard.tsx
rm -f components/AlertCard.tsx
rm -f components/TrainingList.tsx
rm -f components/DashboardCard.tsx

echo "✅ Cleanup complete!"
echo ""
echo "Removed components:"
echo "  - ProfileCard.tsx"
echo "  - StatsCard.tsx"
echo "  - AlertCard.tsx"
echo "  - TrainingList.tsx"
echo "  - DashboardCard.tsx"
echo ""
echo "Active components:"
echo "  ✓ FireReportForm.tsx"
echo "  ✓ EmergencyContact.tsx"
echo "  ✓ SafetyInstructions.tsx"
echo "  ✓ CrisisBot.tsx"
echo "  ✓ Header.tsx"
echo "  ✓ icons/Icons.tsx"
