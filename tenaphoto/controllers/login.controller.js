const { validationResult } = require("../supports/helper")
const { webApp } = require("../common/firebase-config");
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth')
const {success} = require("../supports/responses");

exports.login = (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) {
        return response.status(406).json(result.errors)
    }

    const { email, password } = request.body

     return signInWithEmailAndPassword(getAuth(webApp()), email, password)
        .then(async (userCredential) => {
            return success(response, 'Loggedin successfully', {
                uid: userCredential.user.uid,
                displayName: userCredential.user.displayName,
                email: email,
                idToken: await userCredential.user.getIdToken()
            })
        }).catch((error) => {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                return response.status(401).json({
                    state: 'failed',
                    message: 'Invalid credentials'
                })
            }

            console.log(error)

            return response.status(500).json({
                state: 'failed',
                message: 'Unable to login. Please try again later!'
            })
         })
}