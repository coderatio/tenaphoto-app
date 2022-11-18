const admin = require('firebase-admin')
const { initializeApp: webApp } = require('firebase/app')
const { getAuth } = require('firebase-admin/auth')
const { getApp, getApps } = require('firebase-admin/app')
const { getStorage } = require('firebase-admin/storage');
const { config } = require('./config')
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = config.firebase.serviceAccount


// Initialize Firebase
const initializeApp = () => {
    return !getApps().length
        ? admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: config.firebase.storageBucket
        }) : getApp()
}
exports.firebaseAuth = () => {
   const app = initializeApp()

    return getAuth(app)
}

exports.firebaseDB = () => {
    return getFirestore(initializeApp())
}

exports.getStorage = () => {
    return getStorage(initializeApp()).bucket(config.firebase.storageBucket)
}

exports.webApp = () => {
    return webApp(config.firebase)
}