import { useState } from "react";

const API_URL = "https://backend-hola-fqzv.onrender.com";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const registrar = async () => {
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al crear usuario");
        return;
      }

      alert("Usuario creado!");
      setUsername("");
      setPassword("");
    } catch (err) {
      console.log(err);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="auth-card">
      <h2>Registro</h2>

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

      <button onClick={registrar}>
        Registrarse
      </button>
    </div>
  );
}

export default Register;