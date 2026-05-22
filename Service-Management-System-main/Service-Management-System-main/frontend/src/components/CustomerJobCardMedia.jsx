export default function CustomerJobCardMedia({ media = [] }) {
  if (!Array.isArray(media) || media.length === 0) {
    return <p className="muted">No media uploaded.</p>;
  }

  return (
    <div className="jobcard-section">
      <h3>Media</h3>
      <ul>
        {media.map((m) => (
          <li key={m.id}>
            <a
              href={m.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {m.fileName || m.fileUrl.split("/").pop()}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
