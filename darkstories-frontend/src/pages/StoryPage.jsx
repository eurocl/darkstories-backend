import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../story.css";

function StoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  // 🧠 modal state
  const [showConfirm, setShowConfirm] = useState(false);
  const [capituloAEliminar, setCapituloAEliminar] = useState(null);

  // 📥 traer historia
  useEffect(() => {
    fetch(`http://localhost:3001/story/${id}`)
      .then(res => res.json())
      .then(data => setStory(data))
      .catch(err => console.error(err));
  }, [id]);

  // 🗑️ eliminar historia
  const eliminarHistoria = async () => {
    const confirmar = window.confirm("¿Eliminar esta historia?");
    if (!confirmar) return;

    try {
      await fetch(`http://localhost:3001/stories/${id}`, {
        method: "DELETE",
      });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  // ✏️ editar
  const irAEditar = (chapterId) => {
    navigate(`/story/${id}/chapter/${chapterId}`);
  };

  // ➕ nuevo capítulo
  const crearNuevoCapitulo = () => {
    navigate(`/story/${id}/new`);
  };

  // 👉 abrir modal
  const eliminarCapitulo = (chapterId, titulo) => {
    setCapituloAEliminar({ id: chapterId, titulo });
    setShowConfirm(true);
  };

  // 👉 confirmar eliminación
  const confirmarEliminar = async () => {
    if (!capituloAEliminar) return;

    const chapterId = capituloAEliminar.id;

    // 🔥 animación
    setRemovingId(chapterId);

    setTimeout(async () => {
      try {
        await fetch(`http://localhost:3001/stories/${id}/chapters/${chapterId}`, {
          method: "DELETE",
        });

        setStory(prev => ({
          ...prev,
          chapters: prev.chapters.filter(c => c._id !== chapterId)
        }));

        setRemovingId(null);
        setShowConfirm(false);
        setCapituloAEliminar(null);
      } catch (error) {
        console.error(error);
      }
    }, 300);
  };

  // 👉 cancelar
  const cancelarEliminar = () => {
    setShowConfirm(false);
    setCapituloAEliminar(null);
  };

  if (!story) return <p>Cargando...</p>;

  return (
    <div className="container">

      {/* HEADER */}
      <div className="story-header">
        <h2>📖 {story.title}</h2>

        <button className="delete-story" onClick={eliminarHistoria}>
          🗑️
        </button>
      </div>

      {/* PORTADA */}
      {story.cover && (
        <img
          src={`http://localhost:3001${story.cover}`}
          alt="portada"
          style={{ width: "200px", borderRadius: "10px" }}
        />
      )}

      {/* SINOPSIS */}
      <p>{story.synopsis}</p>

      {/* CAPÍTULOS */}
      <div className="chapters-list">
        {(story.chapters || []).map((c) => (
          <div
            key={c._id}
            className={`chapter-item ${removingId === c._id ? "removing" : ""}`}
          >
            <span className="chapter-title">
              📌 {c.title || "Sin título"}
            </span>

            <div className="chapter-actions">
              <button onClick={() => irAEditar(c._id)}>✏️</button>

              <button onClick={() => eliminarCapitulo(c._id, c.title)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* NUEVO CAP */}
      <button onClick={crearNuevoCapitulo} className="new-chapter">
        ➕ Nuevo capítulo
      </button>

      {/* 🔥 MODAL */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>⚠️ Eliminar capítulo</h3>

            <p>
              ¿Eliminar{" "}
              <strong>
                {capituloAEliminar?.titulo || "este capítulo"}
              </strong>
              ?
            </p>

            <div className="modal-buttons">
              <button className="cancel" onClick={cancelarEliminar}>
                Cancelar
              </button>

              <button className="confirm" onClick={confirmarEliminar}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default StoryPage;