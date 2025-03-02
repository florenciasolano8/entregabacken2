import dotenv from "dotenv";
dotenv.config(); 
import express from "express";
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser";
import sessionRouter from "./routes/session.routes.js";
import userRouter from "./routes/user.routes.js";
import { initializePassport } from "./config/passport.config.js"; 
import passport from "passport";

const app = express();
app.set("PORT", process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/users", userRouter); 
initializePassport();
app.get("/", (req, res) => {
  res.json({ title: "Home Page!!" });
});
app.use("/api/session", sessionRouter);

connectDB(process.env.MONGODB_URI); 

// Inicia el servidor
app.listen(app.get("PORT"), () => {
  console.log(`Server running on http://localhost:${app.get("PORT")}`);
});
