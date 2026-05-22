import { Link } from "react-router-dom";

export default function CustomerMediaList({ media = [] }) {
  if (!Array.isArray(media) || media.length === 0) {
    return <p className="text-gray-500">No media uploaded.</p>;
  }

  const getFileName = (url) => {
    if (!url) return "";
    return url.split("/").pop();
  };

  return (
    <table className="w-full border border-gray-300 mt-4">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-3 py-2 text-left">File</th>
          <th className="border px-3 py-2 text-left">Action</th>
        </tr>
      </thead>
      <tbody>
        {media.map((m) => {
          const fileName = getFileName(m.fileUrl);

          return (
            <tr key={m.id} className="border-t">
              <td className="border px-3 py-2">
                {fileName || "unknown"}
              </td>
              <td className="border px-3 py-2">
                <Link
                  to={`/customer/media/${fileName}`}
                  className="text-blue-600 underline"
                >
                  View
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
