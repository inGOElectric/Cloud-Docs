import { useEffect, useState } from "react";
import client from "../api/client";
import MediaList from "./MediaList";

export default function JobCardMedia({ jobCardId }) {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [file, setFile] = useState(null);
  const [mediaContext, setMediaContext] = useState("GENERAL");

  const loadMedia = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await client.get(`/job-cards/${jobCardId}/media`);
      setMedia(res.data);
    } catch (err) {
      console.error("Load media failed:", err?.response?.data || err);
      setError("Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobCardId) loadMedia();
  }, [jobCardId]);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file); // ⚠️ MUST BE "file"
    formData.append("context", mediaContext);

    try {
      setUploading(true);
      setError("");

      await client.post(
        `/job-cards/${jobCardId}/media`,
        formData
      );

      setFile(null);
      loadMedia();
    } catch (err) {
      console.error("Upload failed:", err?.response?.data || err);
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-5">
  <h3 className="mb-4 text-sm font-semibold text-gray-800">
    Upload Media
  </h3>

  {/* File selector */}
 <div className="flex items-center gap-3">
  <label className="inline-flex cursor-pointer items-center rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
    Select file
    <input
      type="file"
      accept="image/*,video/*"
      className="hidden"
      onChange={(e) => setFile(e.target.files?.[0] || null)}
    />
  </label>

  <span className="text-sm text-gray-500">
    {file ? file.name : "No file selected"}
  </span>
</div>

  {/* Context */}
  <div className="mt-4">
    <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
      Media Context
    </label>
    <select
      value={mediaContext}
      onChange={(e) => setMediaContext(e.target.value)}
      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    >
      <option value="GENERAL">General</option>
      <option value="INSPECTION">Inspection</option>
      <option value="COMPLAINT">Complaint</option>
      <option value="PART_REPLACEMENT">Part Replacement</option>
    </select>
  </div>

  {/* Action */}
  <div className="mt-4 flex justify-end">
    <button
      onClick={handleUpload}
      disabled={!file || uploading}
      className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {uploading ? "Uploading..." : "Upload"}
    </button>
  </div>
</div>
      {loading ? (
        <p>Loading media...</p>
      ) : (   
        <MediaList media={media} jobCardId={jobCardId} />

      )}
    </div>
  );
}