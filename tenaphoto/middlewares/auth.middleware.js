const { firebaseAuth } = require("../common/firebase-config");
const { unauthorized } = require('../supports/responses')

exports.intercept = async (request, response, next) => {
    const idToken = request.header('IdToken')
    let message = 'Unauthorized access'

    if (!idToken) {
        console.log(idToken)
        return unauthorized(response, message)
    }

    try {
        request.user = await firebaseAuth().verifyIdToken(idToken)
        next()
    }


    catch (error) {
        if (error.code === 'auth/argument-error') {
            message = 'Invalid access token provided.'
            return unauthorized(response, message)
        }

        return unauthorized(response, message)
    }
}