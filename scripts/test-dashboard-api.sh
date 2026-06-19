#!/bin/bash

echo "=========================================="
echo "Testing Dashboard API"
echo "=========================================="
echo ""

echo "1. Testing GET /api/dashboard/statistics (all departments)"
echo "   URL: http://localhost:4000/api/dashboard/statistics"
echo ""
curl -s http://localhost:4000/api/dashboard/statistics | head -30
echo ""
echo ""

echo "2. Testing GET /api/dashboard/statistics?department=IT Department"
echo "   URL: http://localhost:4000/api/dashboard/statistics?department=IT%20Department"
echo ""
curl -s "http://localhost:4000/api/dashboard/statistics?department=IT%20Department" | head -30
echo ""
echo ""

echo "3. Testing GET /api/dashboard/statistics?department=HR Department"
echo "   URL: http://localhost:4000/api/dashboard/statistics?department=HR%20Department"
echo ""
curl -s "http://localhost:4000/api/dashboard/statistics?department=HR%20Department" | head -30
echo ""
echo ""

echo "=========================================="
echo "Test completed!"
echo "=========================================="
echo ""
echo "If you see 'success: true' in the responses above, the API is working correctly."
echo "If you see errors, please make sure:"
echo "  1. Backend server is running (npm run dev in backend folder)"
echo "  2. Database is running and accessible"
echo "  3. Prisma client is generated (npm run prisma:generate in backend folder)"
