import { TestCaseReviewer } from '@/components/TestCaseReviewer'
import { MetricsDashboard } from '@/components/MetricsDashboard'
import { Sidebar } from '@/components/Sidebar'

export default function Home() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            QA Copilot Dashboard
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Test Case Reviewer</h2>
              <TestCaseReviewer />
            </div>
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Weekly Metrics</h2>
              <MetricsDashboard />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}