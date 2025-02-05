import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import userModel from "../models/user.model.js";

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["authCookie"];
  }
  return token;
};

const initializePassport = () => {
  passport.use(
    "current",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), 
        secretOrKey: "micodigosecreto", 
      },
      async (jwt_payload, done) => {
        try {
          if (!jwt_payload || !jwt_payload._id) {
            return done(null, false, { message: "Token inválido" });
          }

          const user = await userModel.findById(jwt_payload._id).select("-password");

          if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
          }

          return done(null, user);
        } catch (error) {
          return done(error, false, { message: "Error interno" });
        }
      }
    )
  );
};

export default initializePassport;
