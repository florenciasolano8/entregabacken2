import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import userModel from "../models/user.model.js";

const JWT_SECRET = "micodigosecreto"; 

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

passport.use(
  "current", 
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const user = await userModel.findById(jwt_payload.id);
      if (!user) {
        return done(null, false); 
      }
      return done(null, user); 
    } catch (error) {
      return done(error, false); 
    }
  })
);

const initializePassport = () => {
  passport.initialize();
};

export { initializePassport };
