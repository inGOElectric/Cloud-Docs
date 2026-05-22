export default function SupplyChainDashboard() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Supply Chain Dashboard</h1>
        <p className="text-gray-600 text-sm">Inventory and parts management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Inventory */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Inventory</h2>
          <p className="text-gray-600 text-sm mb-3">Parts and components stock</p>
          {/* TODO: Implement inventory management */}
          <p className="text-yellow-600 text-xs">TODO: Build inventory tracking system</p>
        </div>

        {/* Section 2: Orders */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Orders</h2>
          <p className="text-gray-600 text-sm mb-3">Parts orders and procurement</p>
          {/* TODO: Implement order management */}
          <p className="text-yellow-600 text-xs">TODO: Build order management interface</p>
        </div>

        {/* Section 3: Suppliers */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Suppliers</h2>
          <p className="text-gray-600 text-sm mb-3">Supplier information and contacts</p>
          {/* TODO: Implement supplier management */}
          <p className="text-yellow-600 text-xs">TODO: Add supplier database</p>
        </div>

        {/* Section 4: Analytics */}
        <div className="border rounded p-4">
          <h2 className="text-lg font-semibold mb-3">Analytics</h2>
          <p className="text-gray-600 text-sm mb-3">Supply chain metrics</p>
          {/* TODO: Implement supply chain analytics */}
          <p className="text-yellow-600 text-xs">TODO: Build analytics dashboard</p>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-blue-800 text-sm">
          Supply Chain features are coming soon. Inventory management will be available in the next update.
        </p>
      </div>
    </div>
  );
}
