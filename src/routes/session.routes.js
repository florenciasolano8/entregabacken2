import { Router } from "express";
import userModel from "../models/user.model.js";
import { isValidPassword, generateToken, createHash } from "../utils/index.js";
import handlePolicies from "../middlewares/handle-policies.js";
import bcrypt from "bcrypt";
import passport from "passport";


const router = Router();

router.post("/login", handlePolicies(["PUBLIC"]), async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await userModel.findOne({ email });

    if (!userFound)
      return res.status(404).send({ error: "Usuario no encontrado" });

    if (!isValidPassword(password, userFound.password))
      return res.status(400).send({ error: "Credenciales no válidas" });

    const user = { ...userFound };
    delete user._doc.password;

    const token = generateToken(user._doc);

    res.cookie("authCookie", token, { httpOnly: true });

    res.status(200).send({ status: "Ok", token });
  } catch (error) {
    res
      .status(500)
      .send({ status: "Error interno del servidor", error: error.message });
  }
});

router.post("/register", async (req, res) => {
  const { first_name, last_name, age, email, password } = req.body;

  try {
    const userExists = await userModel.findOne({ email });

    if (userExists)
      return res.status(400).json({ error: "El usuario ya existe" });

    // Encripto
    const hashedPassword = createHash(password);

    const newUser = await userModel.create({
      first_name,
      last_name,
      age,
      email,
      password: hashedPassword, 
    });

    res.status(201).json({ status: "OK", user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ status: "Error interno del servidor", error: error.message });
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
