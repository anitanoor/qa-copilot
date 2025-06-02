import { NextResponse } from 'next/server';

// Mock data - In a real application, this would come from a database
const mockMetrics = {
  timeSaved: 24.5,
  errorsFlagged: 156,
  testCasesReviewed: 89,
  weeklyTrend: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    timeSaved: [5.2, 8.7, 12.3, 24.5],
    errorsFlagged: [32, 45, 78, 156],
  },
};

export async function GET() {
  try {
    // In a real application, you would:
    // 1. Query your database for metrics
    // 2. Calculate time saved based on historical data
    // 3. Aggregate error counts
    // 4. Generate weekly trends

    return NextResponse.json(mockMetrics);
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
} 