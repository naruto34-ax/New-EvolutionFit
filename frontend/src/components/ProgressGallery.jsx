import React, { useState } from "react";

const initialPhotos = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80",
    caption: "Semana 1",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    caption: "Semana 3",
  },
];

export default function ProgressGallery() {
  const [photos, setPhotos] = useState(initialPhotos);
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleAddPhoto = () => {
    if (!imageUrl.trim()) return;

    const newPhoto = {
      id: Date.now(),
      url: imageUrl,
      caption: caption || "Nueva foto",
    };

    setPhotos((prev) => [newPhoto, ...prev]);
    setCaption("");
    setImageUrl("");
  };

  return (
    <div style={{ maxWidth: 760, margin: "24px auto", padding: 20 }}>
      <h3 style={{ marginBottom: 16, color: "#f1f2ff" }}>Fotos de progreso</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Título o descripción"
          style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.04)", color: "#f1f2ff" }}
        />

        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="URL de la imagen"
          style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.04)", color: "#f1f2ff" }}
        />
      </div>

      <button
        onClick={handleAddPhoto}
        style={{ padding: "12px 18px", border: "none", borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", cursor: "pointer", marginBottom: 20 }}
      >
        Agregar foto
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        {photos.map((photo) => (
          <div
            key={photo.id}
            style={{ background: "rgba(255,255,255,.04)", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,.10)" }}
          >
            <img
              src={photo.url}
              alt={photo.caption}
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                display: "block",
              }}
            />
            <div style={{ padding: 12 }}>
              <strong style={{ color: "#f1f2ff" }}>{photo.caption}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
