import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import client from "../api/client";

export default function WorkLog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [taskName, setTaskName] = useState("");
  const [technicianName, setTechnicianName] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load work logs for job card
  const load = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const res = await client.get(`/job-cards/${id}/work-log`);
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(
        "Load work log error:",
        err.response?.status,
        err.response?.data || err.message
      );
      setError("Failed to load work logs");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const create = async () => {
    if (!taskName.trim() || !technicianName.trim()) return;

    try {
      setError("");

      await client.post(`/job-cards/${id}/work-log`, {
        taskName,
        technicianName,
      });

      setTaskName("");
      setTechnicianName("");
      load();
    } catch (err) {
      console.error(
        "Create work log error:",
        err.response?.status,
        err.response?.data || err.message
      );
      setError("Failed to create task");
    }
  };

  const start = async (logId) => {
    try {
      setError("");
      await client.patch(`/work-log/${logId}/start`);
      load();
    } catch (err) {
      console.error(
        "Start work log error:",
        err.response?.status,
        err.response?.data || err.message
      );
      setError("Failed to start task");
    }
  };

  const complete = async (logId) => {
    try {
      setError("");
      await client.patch(`/work-log/${logId}/complete`);
      load();
    } catch (err) {
      console.error(
        "Complete work log error:",
        err.response?.status,
        err.response?.data || err.message
      );
      setError("Failed to complete task");
    }
  };

  const activeLogs = logs.filter(
    (l) => l.status === "PENDING" || l.status === "IN_PROGRESS"
  );
  const completedLogs = logs.filter((l) => l.status === "COMPLETED");

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Work Log</h2>
        <button
          onClick={() => navigate(`/job-cards/${id}`)}
          className="text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {/* Add task */}
      <div className="mb-6 p-4 bg-blue-50 rounded space-y-3">
        <h3 className="font-semibold">Add Work Task</h3>
        <div className="flex gap-2">
          <input
            className="border px-3 py-2 flex-1 rounded"
            placeholder="Task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") create();
            }}
          />
          <input
            className="border px-3 py-2 flex-1 rounded"
            placeholder="Technician name"
            value={technicianName}
            onChange={(e) => setTechnicianName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") create();
            }}
          />
          <button
            onClick={create}
            disabled={!taskName.trim() || !technicianName.trim() || loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 whitespace-nowrap"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Active / Pending */}
      {activeLogs.length > 0 && (
        <>
          <h3 className="font-semibold mb-3 text-lg">Active / Pending Tasks</h3>
          <div className="space-y-2 mb-6">
            {activeLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 border rounded bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition"
              >
                <div className="flex-1">
                  <div className="font-medium text-lg">{log.taskName}</div>
                  <div className="text-sm text-gray-600">
                    👤 {log.technicianName}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {log.status === "PENDING" ? "⏳ Pending" : "⏱️ In Progress"}
                  </div>
                </div>

                <div className="flex gap-2">
                  {log.status === "PENDING" && (
                    <button
                      onClick={() => start(log.id)}
                      className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm font-medium"
                    >
                      Start
                    </button>
                  )}
                  {log.status === "IN_PROGRESS" && (
                    <button
                      onClick={() => complete(log.id)}
                      className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm font-medium"
                    >
                      ✓ Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Completed */}
      {completedLogs.length > 0 && (
        <>
          <h3 className="font-semibold mb-3 text-lg">Completed Tasks</h3>
          <div className="space-y-2">
            {completedLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 border rounded bg-green-50"
              >
                <div className="font-medium line-through text-gray-600">
                  {log.taskName}
                </div>
                <div className="text-sm text-gray-600">
                  👤 {log.technicianName}
                </div>
                {log.durationMin != null && (
                  <div className="text-sm text-gray-500 mt-1">
                    ⏱️ Duration: {log.durationMin} minutes
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && logs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No work logs yet. Create one above to get started.
        </div>
      )}

      {loading && (
        <div className="text-center py-8 text-gray-500">Loading work logs…</div>
      )}
    </div>
  );
}
