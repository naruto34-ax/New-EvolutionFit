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
      <h3 style={{ marginBottom: 16 }}>Fotos de progreso</h3>

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
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #d1d5db",
          }}
        />

        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="URL de la imagen"
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #d1d5db",
          }}
        />
      </div>

      <button
        onClick={handleAddPhoto}
        style={{
          padding: "12px 18px",
          border: "none",
          borderRadius: 8,
          background: "#16a34a",
          color: "#fff",
          cursor: "pointer",
          marginBottom: 20,
        }}
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
            style={{
              background: "#f9fafb",
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid #e5e7eb",
            }}
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
              <strong>{photo.caption}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
