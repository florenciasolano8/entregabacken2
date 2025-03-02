import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import connectDB from "./config/database.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import { initializePassport } from "./config/passport.config.js";

import sessionRouter from "./routes/session.routes.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import ticketRouter from "./routes/ticket.routes.js";

const app = express();
app.set("PORT", process.env.PORT || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.use("/api/users", userRouter);
app.use("/api/session", sessionRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/tickets", ticketRouter);

app.get("/", (req, res) => {
  res.json({ title: "Home Page!!" });
});

connectDB(process.env.MONGODB_URI);

app.listen(app.get("PORT"), () => {
  console.log(`Server running on http://localhost:${app.get("PORT")}`);
});
