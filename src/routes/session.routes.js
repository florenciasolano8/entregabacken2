import { Router } from "express";
import userModel from "../models/user.model.js";
import { generateToken } from "../utils/index.js"; 
import bcrypt from "bcrypt";
import passport from "passport";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await userModel.findOne({ email });

    if (!userFound) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const isPasswordValid = await bcrypt.compare(password, userFound.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Credenciales no válidas" });
    }

    const token = generateToken({ _id: userFound._id, email: userFound.email });

    res.cookie("authCookie", token, { httpOnly: true });

    res.status(200).json({ status: "OK", token });
  } catch (error) {
    res.status(500).json({ status: "Error interno", error: error.message });
  }
});

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ status: "error", message: "Usuario no autenticado" });
      }

      res.status(200).json({ status: "OK", user: req.user });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error interno del servidor", error: error.message });
    }
  }
);

export default router;
