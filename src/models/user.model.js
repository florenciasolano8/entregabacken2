import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  first_name: String,
  last_name: String,
  age: Number,
  email: {type: String, unique:true},
  password: String,
  role: { type: String ,default:"user"},
});

export default model("User", UserSchema);
