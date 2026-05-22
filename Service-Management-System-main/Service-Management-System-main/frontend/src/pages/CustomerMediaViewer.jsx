import { useParams } from "react-router-dom";

export default function CustomerMediaViewer() {
  const { mediaId } = useParams();

  const mediaUrl = `http://localhost:4000/uploads/${mediaId}`;

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 20, marginBottom: 16 }}>
        Media Preview
      </h2>

      <img
        src={mediaUrl}
        alt="Uploaded media"
        style={{ maxWidth: "100%", border: "1px solid #ccc" }}
        onError={() => alert("Failed to load media")}
      />
    </div>
  );
}
