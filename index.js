import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import bcrypt from 'bcrypt'

import { registerValid } from "./validations/auth.js";
import UserModel from "./models/User.js";

mongoose
  .connect(
    "mongodb+srv://admin_nik_big_dick:super_dick@cluster0.flcp3k5.mongodb.net/myblog?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("ok"))
  .catch((err) => console.log(err));

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello!sss");
});

app.post("/auth/register", registerValid, async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullname: req.body.fullname,
      password: passwordHash,
      avatarURL: req.body.avatarURL,
    });

    const user = await doc.save();

    const token=jwt.sign(
      {
        _id:user.id
      },
      'super_secret',
      {
        expiresIn:'30d'
      }
    )

    res.json({
      ...user._doc,
      token
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
});

app.listen(3000, (error) => {
  if (error) {
    return console.log(error);
  }
  console.log("OK!");
});
