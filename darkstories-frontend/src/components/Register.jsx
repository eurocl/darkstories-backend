import { useState } from "react";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const registrar = async () => {
    const res = await fetch("http://localhost:3001/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      alert("Usuario ya existe");
      return;
    }

    alert("Usuario creado!");
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

export default Register;