'use client';

import { useState } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface ReviewResult {
  structureValidation: {
    isValid: boolean;
    feedback: string;
  };
  edgeCases: string[];
  riskScore: number;
  suggestions: string[];
}

export function TestCaseReviewer() {
  const [testCase, setTestCase] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);

  const handleReview = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testCase }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error reviewing test case:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="testCase" className="block text-sm font-medium text-gray-700">
          Test Case
        </label>
        <textarea
          id="testCase"
          rows={6}
          className="mt-1 input-field"
          placeholder="Paste your test case here..."
          value={testCase}
          onChange={(e) => setTestCase(e.target.value)}
        />
      </div>

      <button
        onClick={handleReview}
        disabled={loading || !testCase}
        className="btn-primary w-full"
      >
        {loading ? 'Reviewing...' : 'Review Test Case'}
      </button>

      {result && (
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center mb-2">
              {result.structureValidation.isValid ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
              )}
              <h3 className="font-medium">Structure Validation</h3>
            </div>
            <p className="text-sm text-gray-600">{result.structureValidation.feedback}</p>
          </div>

          <div className="card">
            <h3 className="font-medium mb-2">Edge Cases</h3>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {result.edgeCases.map((edgeCase, index) => (
                <li key={index}>{edgeCase}</li>
              ))}
            </ul>
          </div>

          <div className="card">
            <h3 className="font-medium mb-2">Risk Score</h3>
            <div className="flex items-center">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${result.riskScore}%` }}
                ></div>
              </div>
              <span className="ml-2 text-sm text-gray-600">{result.riskScore}%</span>
            </div>
          </div>

          <div className="card">
            <h3 className="font-medium mb-2">Suggestions</h3>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {result.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 