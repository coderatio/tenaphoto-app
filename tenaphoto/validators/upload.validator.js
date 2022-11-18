const {check} = require("express-validator");
exports.validate = [
    check('file')
        .custom((value, {req}) => {
            return typeof req.file?.originalname !== "undefined"
        }).withMessage('File cannot be empty'),
    check('tags')
        .isString()
        .withMessage('Tags must be string with comma separation')
]