import { body } from "express-validator";

export const registerValid = [
  body("email", "Incorrect email").isEmail(),
  body("password", "Your password is weak, too few symbol").isLength({
    min: 5,
  }),
  body("fullname", "Your fullname is too short").isLength({ min: 5 }),
  body("avatarURL", "Incorrect url").optional().isURL(),
];

export const loginValid = [
  body("email", "Incorrect email").isEmail(),
  body("password", "Your password is weak, too few symbol").isLength({
    min: 5,
  }),
];

export const postCreateValid=[
    body('title', 'Enter the title').isLength({min:3}).isString(),
    body('text', 'Enter article text').isLength({min: 3}).isString(),
    body('tags', 'Enter correct tag format').optional().isArray(),
    body('imageUrl', 'Incorrect link').optional()
]