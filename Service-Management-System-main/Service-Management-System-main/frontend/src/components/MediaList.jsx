import { Link } from "react-router-dom";

export default function MediaList({ jobCardId, media = [] }) {
  if (!media || media.length === 0) {
    return <div className="text-gray-500 text-sm">No media uploaded yet.</div>;
  }

  const formatContext = (context) => {
    if (!context) return "General";
    return context.replace(/_/g, " ");
  };

  const getFileName = (fileUrl) => {
    if (!fileUrl) return "unknown-file";
    return fileUrl.split("/").pop();
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Media List</h3>
      
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">File Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Type</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Context</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Uploaded At</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {media.map((m) => (
            <tr key={m.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2 truncate">
                {getFileName(m.fileUrl)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {m.fileType || "unknown"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {formatContext(m.context)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {m.uploadedAt
                  ? new Date(m.uploadedAt).toLocaleDateString()
                  : "—"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <Link
                  to={`/job-cards/${jobCardId}/media/${m.id}`}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
