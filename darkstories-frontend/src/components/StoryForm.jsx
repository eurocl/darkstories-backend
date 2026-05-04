import { useState } from "react";

function StoryForm({ usuario, setHistorias }) {
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [cover, setCover] = useState(null);

  const crearHistoria = async () => {
    if (!title || !usuario) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("synopsis", synopsis);
    formData.append("userId", usuario._id);
    if (cover) {
      formData.append("cover", cover);
    }

    const res = await fetch("http://localhost:3001/stories", {
      method: "POST",
      body: formData,
    });

    const nueva = await res.json();

    // ✅ actualizar lista
    setHistorias(prev => [...prev, nueva]);

    // ✅ limpiar formulario
    setTitle("");
    setSynopsis("");
    setCover(null);
  };

  return (
    <div className="card">
      <h3>Nueva historia</h3>

      <input
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Sinopsis"
        value={synopsis}
        onChange={(e) => setSynopsis(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setCover(e.target.files[0])}
      />

      <button onClick={crearHistoria}>
        Crear historia
      </button>
    </div>
  );
}

export default StoryForm;