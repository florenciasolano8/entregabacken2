import { Router } from "express";
import userModel from "../models/user.model.js";
import handlePolicies from "../middlewares/handle-policies.js";
import passport from "passport";
const router = Router();


router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  async (req, res) => {
    try {
      console.log(req.user);
      res.status(200).json({ status: "OK", user: req.user });
    } catch (error) {
      res.status(500).json({ status: "error", message: "Error interno del servidor", error: error.message });
    }
  }
);



router.get("/", handlePolicies(["ADMIN", "PROFESOR", "USER PREMIUM"]), async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).send({ status: "OK", users });
  } catch (error) {
    res.status(500).send({ status: "Error interno del servidor", error: error.message });
  }
});



router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findOne({ _id: id });
    if (!user) {
      return res.status(404).send({ status: "Error", message: "Usuario no encontrado" });
    }
    res.status(200).send({ status: "OK", user: user });
  } catch (error) {
    res.status(500).send({ status: "Error interno del servidor", error: error.message });
  }
});

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;
  try {
    const newUser = new userModel({ first_name, last_name, email, password, age });
    await newUser.save();
    res.status(201).send({ status: "OK", message: "Usuario creado exitosamente", user: newUser });
  } catch (error) {
    res.status(500).send({ status: "Error interno del servidor", error: error.message });
  }
});

export default router;
