const handlePolicies = (policies) => (req, res, next) => {
  let token = req.cookies["authCookie"] || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      error: "Acceso denegado. Token no proporcionado o vencido"
    });
  }

  const user = verifyToken(token);

  if (!user) {
    return res.status(401).json({
      status: "error",
      error: "Acceso denegado. Token inválido o expirado"
    });
  }

  if (!policies.includes(user.role.toUpperCase())) {
    return res.status(403).json({
      status: "error",
      error: "Acceso prohibido. No tienes los permisos necesarios"
    });
  }

  req.user = user;
  next();
};
export default handlePolicies;
