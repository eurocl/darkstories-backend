import StoryCard from "./StoryCard";

function StoryList({ historias, onClickStory }) {
  if (!historias || historias.length === 0) {
    return <p>No hay historias todavía</p>;
  }

  return (
    <div className="grid">
      {historias.map((h) => (
        <div key={h._id} onClick={() => onClickStory(h)}>
          <StoryCard historia={h} />
        </div>
      ))}
    </div>
  );
}

export default StoryList;