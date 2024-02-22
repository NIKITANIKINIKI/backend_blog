import {body} from 'express-validator'

export const registerValid=[
    body('email', 'Incorrect email').isEmail(),
    body('password', 'Your password is weak, too few symbol').isLength({min:5}),
    body('fullname', 'Your fullname is too short').isLength({min:5}),
    body('avatarURL', 'Incorrect url').optional().isURL(),
];