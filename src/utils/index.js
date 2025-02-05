import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = "micodigosecreto";

export const createHash = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export const isValidPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (user) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "12h" });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null; 
  }
};
