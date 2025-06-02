'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Metrics {
  timeSaved: number;
  errorsFlagged: number;
  testCasesReviewed: number;
  weeklyTrend: {
    labels: string[];
    timeSaved: number[];
    errorsFlagged: number[];
  };
}

export function MetricsDashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics');
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading metrics...</div>;
  }

  if (!metrics) {
    return <div className="text-center py-4">Failed to load metrics</div>;
  }

  const timeSavedData = {
    labels: metrics.weeklyTrend.labels,
    datasets: [
      {
        label: 'Time Saved (hours)',
        data: metrics.weeklyTrend.timeSaved,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const errorsFlaggedData = {
    labels: metrics.weeklyTrend.labels,
    datasets: [
      {
        label: 'Errors Flagged',
        data: metrics.weeklyTrend.errorsFlagged,
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Time Saved</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {metrics.timeSaved}h
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Errors Flagged</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {metrics.errorsFlagged}
          </p>
        </div>
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Test Cases Reviewed</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">
            {metrics.testCasesReviewed}
          </p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Weekly Time Saved</h3>
        <Line
          data={timeSavedData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
          }}
        />
      </div>

      <div className="card">
        <h3 className="text-sm font-medium text-gray-500 mb-4">Weekly Errors Flagged</h3>
        <Bar
          data={errorsFlaggedData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
            },
          }}
        />
      </div>
    </div>
  );
} 