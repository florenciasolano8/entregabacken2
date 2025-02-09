import express from "express";
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser";
import sessionRouter from "./routes/session.routes.js";
import userRouter from "./routes/user.routes.js";
import { initializePassport } from "./config/passport.config.js"; 
import passport from "passport";


const app = express();
app.set("PORT", 3000);
const uri = "mongodb://127.0.0.1:27017/user";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());


app.use("/api/users", userRouter); 

initializePassport(); 
app.get("/", (req, res) => {
  res.json({ title: "Home Page!!" });
});
app.use("/session", sessionRouter);

//listeners
connectDB(uri);
app.listen(app.get("PORT"), () => {
  console.log(`Server on port http://localhost:${app.get("PORT")}`);
});
