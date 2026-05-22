import { useEffect, useState } from "react";
import client from "../../api/client";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await client.get("/admin/dashboard-stats");
      setStats(res.data);
    } catch (err) {
      console.error("ERROR:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-6 text-white">Loading dashboard...</div>;
  }

  const chartData = stats?.trends || [];

  return (
    <div className="p-6 bg-[#01263B] min-h-screen text-white space-y-6">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Overview</h1>
      </div>

      {/* 📊 KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Service Bookings" value={stats?.serviceBookings} color="green" icon="🛠️" />
        <StatCard title="Active Job Cards" value={stats?.activeJobCards} color="blue" icon="⚙️" />
        <StatCard title="Complaints" value={stats?.complaints} color="red" icon="⚠️" />
        <StatCard title="Customers" value={stats?.customers} color="yellow" icon="👤" />
      </div>

      {/* ⚠ ALERT + CHART */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* ALERT */}
        <div className="bg-red-900/20 border border-red-500 p-5 rounded-xl">
          <h3 className="text-red-400 font-semibold mb-3">
            ⚠ Attention Required
          </h3>

          <ul className="space-y-2 text-sm">
            {stats?.complaints > 0 && (
  <li>• {stats.complaints} complaints need attention</li>
)}

{stats?.activeJobCards > 20 && (
  <li>• High workload: {stats.activeJobCards} active jobs</li>
)}

{stats?.technicianPerformance?.some(t => t.percentage < 10) && (
  <li>• Some technicians have low performance</li>
)}

{(!stats?.complaints && !stats?.activeJobCards) && (
  <li className="text-green-400">• Everything running smoothly</li>
)}
          </ul>
        </div>

        {/* CHART */}
        <div className="bg-[#0A3A55] p-5 rounded-xl md:col-span-2">
          <h3 className="mb-3 font-semibold">Weekly Service Trend</h3>

          {chartData.length === 0 ? (
            <p className="text-gray-400">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#1f4a5f" />
                <XAxis dataKey="name" stroke="#ccc" />

                <Tooltip
                  content={({ active, payload, label }) => {
                   if (!active || !payload || payload.length < 2) return null;

                  return (
                      <div className="bg-white text-black p-2 rounded shadow text-sm">
                        <p className="font-semibold">{label}</p>
                        <p>🟢 Service: {payload[0]?.value ?? 0}</p>
                        <p>🔵 Test Ride: {payload[1]?.value ?? 0}</p>
                </div>
            );
     }}
 />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="service"
                  stroke="#22c55e"
                  strokeWidth={2}
                />

                <Line
                  type="monotone"
                  dataKey="testRide"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 📅 OPERATIONS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* TODAY */}
        <div className="bg-[#0A3A55] p-5 rounded-xl">
          <h3 className="mb-4 font-semibold">Today’s Schedule</h3>

          {/* SERVICE */}
          <div className="mb-4">
            <p className="text-green-400 text-sm mb-2">Service Bookings</p>

            {stats?.todayService?.length === 0 ? (
              <p className="text-gray-400 text-sm">No service bookings today</p>
            ) : (
              <div className="space-y-2">
                {stats.todayService.map((item) => (
                  <div key={item.id} className="flex justify-between bg-[#01263B] p-2 rounded text-sm">
                    <span>{item.vehiclePart}</span>
                    <span>{item.timeSlot}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TEST RIDES */}
          <div>
            <p className="text-blue-400 text-sm mb-2">Test Rides</p>

            {stats?.todayTestRide?.length === 0 ? (
              <p className="text-gray-400 text-sm">No test rides today</p>
            ) : (
              <div className="space-y-2">
                {stats.todayTestRide.map((item) => (
                  <div key={item.id} className="flex justify-between bg-[#01263B] p-2 rounded text-sm">
                    <span>{item.bikeName}</span>
                    <span>{item.timeSlot}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

   {/* TECHNICIAN PERFORMANCE */}
<div className="bg-[#0A3A55] p-5 rounded-xl">
  <h3 className="mb-4 font-semibold">Monthly Technician Performance</h3>

  {stats?.technicianPerformance?.length === 0 ? (
    <p className="text-gray-400 text-sm">No technician data</p>
  ) : (
    <div className="space-y-3">
      {stats?.technicianPerformance?.map((tech) => (
        <div
          key={tech.id}
          className="bg-[#01263B] p-3 rounded"
        >
          {/* Name + % */}
          <div className="flex justify-between mb-1">
            <p className="font-medium">{tech.name}</p>
            <p className="text-sm text-gray-300">
              {tech.percentage}%
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-gray-700 rounded">
            <div
              className={`h-2 rounded ${
                tech.status === "HIGH"
                  ? "bg-green-400"
                  : tech.status === "NORMAL"
                  ? "bg-yellow-400"
                  : "bg-red-400"
              }`}
              style={{ width: `${tech.percentage}%` }}
            ></div>
          </div>

          {/* Status */}
          <p className="text-xs mt-1 text-gray-400">
            {tech.completed} jobs completed
          </p>
        </div>
      ))}
    </div>
  )}
</div>
</div>

      {/* 📌 SECONDARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MiniStat label="Vehicles" value={stats?.vehicles} />
        <MiniStat label="Users" value={stats?.users} />
        <MiniStat label="Work Logs" value={stats?.workLogs} />
        <MiniStat label="Test Rides" value={stats?.testRides} />
        <MiniStat label="Job Cards" value={stats?.jobCards} />
        <MiniStat label="Inspections" value={stats?.inspections} />
        <MiniStat label="Parts Replaced" value={stats?.partsReplaced} />
      </div>

    </div>
  );
}

/* KPI */
function StatCard({ title, value, color, icon }) {
  const colors = {
    green: "text-green-400",
    red: "text-red-400",
    blue: "text-blue-400",
    yellow: "text-yellow-400",
  };

  return (
    <div className="bg-[#0A3A55] rounded-xl p-5 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-300">{title}</p>
        <h2 className="text-2xl font-bold mt-1">{value ?? 0}</h2>
        <p className={`text-xs ${colors[color]}`}>Live</p>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  );
}

/* MINI */
function MiniStat({ label, value }) {
  return (
    <div className="bg-[#0A3A55] p-4 rounded-lg text-center">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-lg font-bold text-cyan-400">{value ?? 0}</p>
    </div>
  );
}