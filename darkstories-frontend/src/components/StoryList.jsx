import StoryCard from "./StoryCard";

function StoryList({ historias }) {
  if (!historias || historias.length === 0) {
    return <p>No hay historias todavía</p>;
  }

  return (
    <div className="card">
      <h2>Mis historias</h2>

      {historias.map((h) => (
        <StoryCard key={h._id} historia={h} />
      ))}
    </div>
  );
}

export default StoryList;