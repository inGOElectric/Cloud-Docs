import "./MediaGallery.css";

const API_BASE = "http://localhost:4000";

export default function MediaGallery({ media }) {
  if (!media || media.length === 0) {
    return <p className="empty-media">No media uploaded yet.</p>;
  }

  return (
    <div className="media-grid">
      {media.map((item) => {
        const fileName = item.filePath.split("/").pop();
        const fileUrl = `${API_BASE}/uploads/${fileName}`;

        const isImage = item.fileType === "IMAGE";
        const isVideo = item.fileType === "VIDEO";

        return (
          <div className="media-card" key={item.id}>
            {isImage && (
              <img
                src={fileUrl}
                alt={item.fileName}
                onClick={() => window.open(fileUrl, "_blank")}
              />
            )}

            {isVideo && (
              <video controls>
                <source src={fileUrl} type="video/mp4" />
                Your browser does not support video playback.
              </video>
            )}

            <div className="media-meta">
              <span className="media-context">{item.context}</span>
              <span className="media-date">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
