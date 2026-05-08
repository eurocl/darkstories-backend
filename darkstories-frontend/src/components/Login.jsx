import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://backend-hola-fqzv.onrender.com";

function Login({ setUsuario }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const iniciarSesion = async () => {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      alert("Credenciales incorrectas");
      return;
    }

    const data = await res.json();

    setUsuario(data);
    localStorage.setItem("user", JSON.stringify(data));

    navigate("/");
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>

      <input
        type="text"
        placeholder="Usuario"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={iniciarSesion}>
        Iniciar sesión
      </button>
    </div>
  );
}

export default Login;