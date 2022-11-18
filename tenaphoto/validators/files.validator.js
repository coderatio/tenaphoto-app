const {check} = require("express-validator")

exports.validate = [
    check('recipient')
        .notEmpty()
        .withMessage('The recipient field is required')
        .bail()
        .isUUID()
        .withMessage('Invalid recipient provided'),
    check('file')
        .notEmpty()
        .withMessage('The file field is required')
]