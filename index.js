import express from "express";
import mongoose from "mongoose";
import multer from "multer";

import { registerValid, loginValid, postCreateValid } from "./validations.js";

import checkAuth from "./utils/checkAuth.js";
import handleErrors from "./utils/handleErrors.js";
import {UserControllers, PostControllers} from "./controllers/index.js";


mongoose
  .connect(
    "mongodb+srv://admin_nik_big_dick:super_dick@cluster0.flcp3k5.mongodb.net/myblog?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("ok"))
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());


const storage=multer.diskStorage({
  destination:(_,__, cb) => {
    cb(null, 'uploads')
  },
  filename:(_,file,cb) => {
    cb(null, file.originalname)
  }
})

const upload=multer({storage})
app.use('/uploads', express.static('uploads'))


app.post("/auth/register", registerValid,handleErrors, UserControllers.register);
app.post("/auth/login", loginValid, handleErrors, UserControllers.login);
app.get("/auth/me", checkAuth, UserControllers.getMe);

app.post('/upload',checkAuth, upload.single('image'), (req, res)=>{
  res.json({
    url:`/uploads/${req.file.originalname}`
  })
})

app.get("/posts", PostControllers.getAll);
app.get("/posts/:id", PostControllers.getOne);
app.post("/posts",checkAuth, postCreateValid,handleErrors, PostControllers.create);
app.delete("/posts/:id",checkAuth, PostControllers.remove);
app.patch("/posts/:id",checkAuth, postCreateValid,handleErrors, PostControllers.update);

app.listen(3000, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("OK!");
});
