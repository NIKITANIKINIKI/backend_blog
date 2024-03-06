import express from "express";
import mongoose from "mongoose";

import { registerValid, loginValid, postCreateValid } from "./validations.js";

import checkAuth from "./utils/checkAuth.js";
import * as UserControllers from "./controllers/UserControllers.js";
import * as PostControllers from './controllers/PostController.js'

mongoose
  .connect(
    "mongodb+srv://admin_nik_big_dick:super_dick@cluster0.flcp3k5.mongodb.net/myblog?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("ok"))
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());


app.post("/auth/register", registerValid, UserControllers.register);
app.post("/auth/login", loginValid, UserControllers.login);
app.get("/auth/me", checkAuth, UserControllers.getMe);

app.get("/posts", PostControllers.getAll);
app.get("/posts/:id", PostControllers.getOne);
app.post("/posts",checkAuth, postCreateValid, PostControllers.create);
app.delete("/posts/:id",checkAuth, PostControllers.remove);
app.patch("/posts/:id",checkAuth, PostControllers.update);

app.listen(3000, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("OK!");
});
