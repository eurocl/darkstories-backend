import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import StoryPage from "./pages/StoryPage";
import Profile from "./pages/Profile";

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const userGuardado = localStorage.getItem("usuario");
    if (userGuardado) {
      setUsuario(JSON.parse(userGuardado));
    }
  }, []);

  return (
    <>
      <div className="container">
        {/* NAV */}
        <nav>
          <Link to="/">Inicio</Link> |{" "}
          <Link to="/register">Registro</Link> |{" "}
          <Link to="/login">Login</Link> |{" "}
          <Link to="/profile">
            {usuario ? `👤 ${usuario.username}` : "Perfil"}
          </Link>
        </nav>

        {/* 🔥 IMPORTANTE: Routes dentro del container */}
        <Routes>
          <Route path="/" element={<Home usuario={usuario} />} />

          <Route
            path="/profile"
            element={
              <Profile usuario={usuario} setUsuario={setUsuario} />
            }
          />

          <Route path="/story/:id" element={<StoryPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setUsuario={setUsuario} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;