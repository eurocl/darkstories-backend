import { Link } from "react-router-dom";
import "../story.css";

function StoryCard({ historia }) {
  if (!historia) return null;

  return (
    <div className="story-card">
      
      {/* PORTADA */}
      <div className="story-cover">
        {historia.cover ? (
          <img
            src={`http://localhost:3001${historia.cover}`}
            alt="portada"
          />
        ) : (
          <div className="no-cover">Sin portada</div>
        )}
      </div>

      {/* INFO */}
      <div className="story-info">
        <h2 className="story-title">
          {historia.title || "Sin título"}
        </h2>

        <div className="story-synopsis">
          {historia.synopsis || "Sin sinopsis"}
        </div>

        <Link to={`/story/${historia._id}`}>
          <button className="story-button">
            ✍️ Escribir o editar
          </button>
        </Link>
      </div>

    </div>
  );
}

export default StoryCard;