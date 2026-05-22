import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import client from "../api/client";

const API_BASE_URL = "http://localhost:4000";

export default function MediaViewerPage() {
  const { jobCardId, mediaId } = useParams();

  const numericJobCardId = Number(jobCardId);
  const numericMediaId = Number(mediaId);

  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!numericJobCardId || !numericMediaId) {
      setError("Invalid route parameters");
      setLoading(false);
      return;
    }

    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ CORRECT API CALL
        const res = await client.get(
          `/job-cards/${numericJobCardId}/media/${numericMediaId}`
        );

        setMedia(res.data);
      } catch (err) {
        console.error(
          "Failed to fetch media:",
          err?.response?.data || err
        );
        setError("Media not found");
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [numericJobCardId, numericMediaId]);

  if (loading) return <div className="p-4">Loading media…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!media) return <div className="p-4">Media not found</div>;

  const isImage = media.fileType === "IMAGE";
  const isVideo = media.fileType === "VIDEO";

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Media Viewer</h1>

      <div className="mb-4 text-sm text-gray-700">
        <p><strong>Type:</strong> {media.fileType}</p>
        <p><strong>Context:</strong> {media.context}</p>
        <p>
          <strong>Uploaded At:</strong>{" "}
          {new Date(media.uploadedAt).toLocaleString()}
        </p>
      </div>

      {isImage && (
        <img
          src={`${API_BASE_URL}${media.fileUrl}`}
          alt="Job Card Media"
          className="max-w-full h-auto rounded"
        />
      )}

      {isVideo && (
        <video controls className="max-w-full h-auto rounded">
          <source
            src={`${API_BASE_URL}${media.fileUrl}`}
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}
