const {dateAdd} = require("../supports/helper");
require('dotenv').config()

const {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID,
    PORT,
    HOST,
    CORS_DOMAIN,
    SERVICE_ACCOUNT,
    FIREBASE_UPLOADS_PATH,
    SIGNURL_TIME,
    SIGNURL_INTERVAL,
    FILES_DB,
} = process.env

exports.config =  {
    port: PORT,
    host: HOST,
    corsDomain: CORS_DOMAIN.split(','),
    db: {
        files: FILES_DB
    },
    firebase: {
        apiKey: FIREBASE_API_KEY,
        authDomain: FIREBASE_AUTH_DOMAIN,
        projectId: FIREBASE_PROJECT_ID,
        storageBucket: FIREBASE_STORAGE_BUCKET,
        messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
        appId: FIREBASE_APP_ID,
        measurementId: FIREBASE_MEASUREMENT_ID,
        uploadsPath: FIREBASE_UPLOADS_PATH,
        serviceAccount: JSON.parse(SERVICE_ACCOUNT) // This should be kept private!!
    },
    files: {
        signUrl: {
            time: SIGNURL_TIME,
            interval: SIGNURL_INTERVAL,
        },
        singUrlExpiresObject: {
            version: 'v4',
            action: 'read',
            expires:  dateAdd(new Date(), 'second',30), // 5 minutes default
        }
    }
}