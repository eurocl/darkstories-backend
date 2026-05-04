import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setUsuario }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const iniciarSesion = async () => {
    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const text = await res.text();
      console.log("Respuesta cruda:", text);

      if (!res.ok) {
        alert("Credenciales incorrectas");
        return;
      }

      const data = JSON.parse(text);

      setUsuario(data);
      localStorage.setItem("usuario", JSON.stringify(data));

      navigate("/");
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  return (
  <div className="auth-card">
    <h2>Login</h2>

    <input type="text" placeholder="Usuario" />
    <input type="password" placeholder="Contraseña" />

    <button>Iniciar sesión</button>
  </div>
);
}

export default Login;