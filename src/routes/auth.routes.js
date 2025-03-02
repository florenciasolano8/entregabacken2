import { Router } from "express";
import UserRepository from "../repositories/user.repository.js";
import { isValidPassword, generateToken } from "../utils/index.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserRepository.findByEmail(email);
    if (!user || !(await isValidPassword(password, user.password))) {
      return res.status(401).json({ error: "Email o contraseña incorrectos" });
    }

    const token = generateToken({ _id: user._id, role: user.role });
    res.cookie("authCookie", token, { httpOnly: true }).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
