const {firebaseAuth} = require("../common/firebase-config");
const {success, badRequest} = require("../supports/responses");

exports.index = async (request, response) => {
    const { perPage } = request.query
    const { user } = request

    return listAllUsers(perPage).then((listUserResult) => {
        const usersJson = listUserResult.users.map(user => user.toJSON())
        const users = []
        usersJson.forEach((user) => users.push({
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoUrl: user.photoUrl,
            metadata: user.metadata
        }))

        return success(response, 'Users retreived', users.filter(_user => user.uid !== _user.uid))
    }).catch(error => {
        console.log(error)

        return badRequest(response, 'Failed to get users')
    })
}


const listAllUsers = (perPage, nextPageToken) => {
    return firebaseAuth()
        .listUsers(parseInt(perPage) || 100, nextPageToken)
        .then((listUsersResult) => {
            if (listUsersResult.pageToken) {
                // List next batch of users.
                return listAllUsers(listUsersResult.pageToken);
            }

            return listUsersResult
        })
        .catch((error) => {
            console.log('Error listing users:', error);

            return error
        });
};