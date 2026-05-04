import { useNavigate, Navigate } from "react-router-dom";

function Profile({ usuario, setUsuario }) {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    navigate("/login");
  };

  if (!usuario) return <Navigate to="/login" />;

  return (
    <div className="container">

      {/* 🔥 BANNER */}
      

      <h2>👤 Perfil</h2>

      <div className="card">
        <p><strong>Usuario:</strong> {usuario.username}</p>
        <p><strong>ID:</strong> {usuario._id}</p>

        <button onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>

    </div>
  );
}

export default Profile;