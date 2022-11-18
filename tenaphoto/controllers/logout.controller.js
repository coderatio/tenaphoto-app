const {firebaseAuth} = require("../common/firebase-config");
const {success, failed, badRequest} = require("../supports/responses");

exports.index = (request, response) => {
    const { uid } = request.headers

    if (!uid) {
        return failed(response, 'Invalid records. Cannot logout at the moment!')
    }

    return firebaseAuth().revokeRefreshTokens(uid)
        .then(() => firebaseAuth().getUser(uid))
        .then(user => user)
        .then(() => success(response,'Signed-out successfully'))
        .catch(error => {
            console.log(error)
            if (error.code === 'auth/user-not-found') {
                return badRequest(response, 'Invalid logout data')
            }

            return failed(response, 'Unable to logout')
        })
}