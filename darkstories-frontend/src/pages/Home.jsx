import { useState, useEffect } from "react";

function Home({ usuario }) {
  const [texto, setTexto] = useState("");
  const [historias, setHistorias] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/stories")
      .then(res => res.json())
      .then(data => setHistorias(data))
      .catch(err => console.log(err));
  }, []);

  const agregarHistoria = async () => {
    if (texto.trim() === "") return;

    const res = await fetch("http://localhost:3001/stories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: texto,
        userId: usuario?._id || null,
        synopsis: texto
      }),
    });

    const nueva = await res.json();
    setHistorias([...historias, nueva]);
    setTexto("");
  };

  return (
    <>
      {/* 🔥 BANNER SOLO HOME */}
      <div className="home-banner">
        <img src="/banner.jpg" alt="banner" />
        <div className="banner-overlay"></div>
      </div>

      {/* CONTENIDO */}
      <div className="container">
        {usuario ? (
          <p>Bienvenido, {usuario.username}</p>
        ) : (
          <p>🔒 Debes iniciar sesión</p>
        )}

        <textarea
          placeholder="Escribí tu historia oscura..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />

        <button onClick={agregarHistoria}>
          Guardar historia
        </button>

        <ul>
          {historias.map((h) => (
            <li key={h._id}>
              {h.title || h.description}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default Home;