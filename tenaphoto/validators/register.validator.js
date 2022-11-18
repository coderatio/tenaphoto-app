const {check} = require("express-validator");

exports.validate = [
    check('displayName')
        .notEmpty()
        .withMessage('The display name field is required')
        .bail()
        .isLength({ min: 3 })
        .withMessage('The display name field must be atleast 3 character long'),
    check('email')
        .notEmpty()
        .withMessage('The email field is required')
        .bail()
        .isEmail()
        .withMessage('Ivalid email provided'),
    check('password')
        .notEmpty()
        .withMessage('The password field is required')
        .bail()
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters long')
        .bail()
        .matches(/\d/)
        .withMessage('Passowrd must contain a number'),
]