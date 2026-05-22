export default function SalesDashboard() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Sales Dashboard</h1>
        <p className="text-gray-600 text-sm">Sales performance and leads</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Leads */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Leads</h2>
          <p className="text-gray-600 text-sm mb-3">Sales leads and prospects</p>
          {/* TODO: Implement lead management */}
          <p className="text-yellow-600 text-xs">TODO: Build leads management system</p>
        </div>

        {/* Section 2: Sales Pipeline */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Sales Pipeline</h2>
          <p className="text-gray-600 text-sm mb-3">Deal tracking and progress</p>
          {/* TODO: Implement pipeline management */}
          <p className="text-yellow-600 text-xs">TODO: Build sales pipeline interface</p>
        </div>

        {/* Section 3: Performance */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Performance</h2>
          <p className="text-gray-600 text-sm mb-3">Sales metrics and targets</p>
          {/* TODO: Implement performance tracking */}
          <p className="text-yellow-600 text-xs">TODO: Show sales performance metrics</p>
        </div>

        {/* Section 4: Reports */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Reports</h2>
          <p className="text-gray-600 text-sm mb-3">Sales reports and analytics</p>
          {/* TODO: Implement sales reports */}
          <p className="text-yellow-600 text-xs">TODO: Build sales analytics</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-blue-800 text-sm">
          Sales features are coming soon. CRM and lead management will be available in the next update.
        </p>
      </div>
    </div>
  );
}
