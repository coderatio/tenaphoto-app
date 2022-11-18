const { validationResult } = require("../supports/helper.js");
const {firebaseAuth} = require("../common/firebase-config.js");
const {v4: uuidv4 } = require('uuid')

exports.register = async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) {
        return response.status(406).json(result.errors)
    }

    const { displayName, email, password} = request.body

    // Create user's account on Firebabse
    return firebaseAuth().createUser({ displayName, email, password, uid: uuidv4() })
        .then((user) => {
            return response.status(201).json({
                state: 'success',
                message: 'Account created successfully',
                data: {
                    id: user.uid,
                    displayName,
                    email
                }
            })
        }).catch((error) => {
            let field = 'email'
            if (error.code) {
                if (error.code.includes('password')) {
                    field = 'password'
                }

                const fieldErrors = []
                fieldErrors[field] = [{
                    field,
                    message: error.message,
                    value: request.body[field],
                }]

                return response.status(406).json({
                    state: 'failed',
                    message: 'Validation failed',
                    errors: Object.assign({}, fieldErrors)
                })
            }

            return response.status(500).json({
                state: 'failed',
                message: 'An internal server error occured',
                errorMessage: error.message,
            })
        })
}