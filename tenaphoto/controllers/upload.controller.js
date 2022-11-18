const { config } = require('../common/config')
const { success, badRequest, build, validation} = require('../supports/responses')
const { getStorage } = require('../common/firebase-config')
const {httpCode} = require("../constants/httpCode");
const {validationResult} = require("../supports/helper");

exports.index = async (request, response) => {
    try {
        const file = request.file;
        const { user } = request

        const result = validationResult(request)
        if (!result.isEmpty()) {
            return validation(response, result.errors)
        }

        // Format the filename
        const timestamp = Date.now();
        const type = file.originalname.split(".")[1];
        const fileName = `${timestamp}.${type}`;
        const storagePath = `${config.firebase.uploadsPath}/${user.uid}/${fileName}`

        const path = `https://firebasestorage.googleapis.com/v0/b/${config.firebase.storageBucket}/o`

        const blob = await getStorage().file(storagePath)
        const blobStream = blob.createWriteStream({
            resumable: false,
            metadata: {
                firebaseStorageDownloadTokens: user.uid,
                metadata: {
                    ownerId: user.uid,
                    tags: request.body?.tags || ''
                }
            }
        });

        blobStream.on("error", (err) => {
            response.status(500).send({ message: err.message });
        });

        blobStream.on('finish', async (data) => {
            success(response, 'File uploaded successfully', {
                fileName,
                owner: {
                    uid: user.uid,
                    email: user.email,
                },
                publicUrl: `${path}/${user.uid}%2F${fileName}?alt=media`
            })
        })

        blobStream.end(file.buffer);
    } catch (error) {
        console.log(error)
        return badRequest(response, 'Failed to upload file')
    }
}