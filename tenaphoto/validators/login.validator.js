const {check} = require("express-validator");
exports.validate = [
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
        .matches(/\d/)
        .withMessage('Passowrd must contain a number'),
]