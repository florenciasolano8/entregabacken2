import React, { useEffect, useState } from "react";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/users/current", {
      method: "GET",
      credentials: "include", 
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "OK") {
          setUser(data.user); 
        } else {
          setError(data.error);
        }
      })
      .catch((err) => {
        console.error("Error en la solicitud:", err);
        setError("Hubo un error al obtener los datos del usuario.");
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Perfil de Usuario</h1>
      <p>Nombre: {user.first_name} {user.last_name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserProfile;