import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullname: req.body.fullname,
      password: passwordHash,
      avatarURL: req.body.avatarURL,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user.id,
      },
      "super_secret",
      {
        expiresIn: "30d",
      }
    );

    const { password, ...UserData } = user._doc;

    res.json({
      ...UserData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "Неверный ввод",
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user._doc.password
    );

    if (!isValidPassword) {
      return res.status(400).json({
        message: "Неверный ввоd",
      });
    }

    const token = jwt.sign(
      {
        _id: user.id,
      },
      "super_secret",
      {
        expiresIn: "30d",
      }
    );

    const { password, ...UserData } = user._doc;

    res.json({
      ...UserData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "Not found",
      });
    }

    const { password, ...userData } = user._doc;

    res.json({
      ...userData,
    });
  } catch (err) {
    console.log(err);
  }
};
