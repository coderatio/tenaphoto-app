const { config } = require('../common/config')
const { success, badRequest, validation} = require('../supports/responses')
const { getStorage, firebaseDB} = require('../common/firebase-config')
const { dateAdd, validationResult} = require("../supports/helper");


exports.index = async (request, response) => {
    try {
        const { user } = request
        const prefix = `${config.firebase.uploadsPath}/${user.uid}`

        // Lists files in the bucket, filtered by a prefix
        const [ files ] = await getStorage().getFiles({ prefix })
        const formattedFiles = files.map((file) => {
            return {
                name: file.name,
                size: file.size
            }
        })

        const sharedWithMe = await firebaseDB()
            .collection(`${config.db.files}/${user.uid}/files`)
            .get()

        const sharedFiles = []
        if (!sharedWithMe.empty) {
            sharedWithMe.forEach((doc) => {
                const file = doc.data()

                sharedFiles.push({
                    name: file.file,
                    sender: file.sender,
                    recipient: file.recipient,
                    message: file.message,
                })
            })
        }

        const allFiles = await Promise.all(
            sharedFiles.concat(formattedFiles)
                .map(async (file, index) => {
                    const signUrlOptions = config.files.singUrlExpiresObject
                    signUrlOptions.expires = dateAdd(new Date(), 'second', config.files.signUrl.time)

                    const url = await getStorage()
                        .file(file.name)
                        .getSignedUrl(signUrlOptions)

                    let metadata = file?.metadata
                    if (!metadata) {
                        metadata = await getStorage()
                            .file(file.name)
                            .getMetadata()
                    }


                    return {
                        id: index,
                        name: file.name,
                        size: file?.size,
                        sender: file?.sender,
                        message: file?.message,
                        urlExpiresAt: signUrlOptions.expires.toUTCString(),
                        metadata: {
                            ownerId: metadata[0].metadata.ownerId,
                            tags: metadata[0].metadata?.tags
                        },
                        url
                    }
        }))

        return success(response, 'Files retreived', allFiles.sort().reverse())
    } catch (error) {
        console.log(error)
        return badRequest(response, 'Failed to get files')
    }
}


// Share files handler
exports.share = async (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty()) {
        return validation(response, result.errors.errors)
    }

    const { user } = request
    const { recipient, file, message } = request.body

    const filesDb = config.db.files
    const data = {
        recipient,
        sender: user.uid,
        file,
        message,
        sharedAt: (new Date()).toISOString()
    }

    const splittedFile = file.split('/')
    const fileDoc = splittedFile[3]

    return firebaseDB().collection(filesDb)
        .doc(recipient)
        .collection('files')
        .doc()
        .set(data, { merge: true })
        .then((result) => {
            return success(response, 'File shared successfully', {
                ...data,
                sharedAt: result.writeTime.toDate().toISOString(),
            })
        })
        .catch(error => {
            console.log(error)
            return badRequest(response, error.message)
        })
}