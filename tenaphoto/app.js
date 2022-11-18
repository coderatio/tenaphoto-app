const {config} = require('./common/config')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const multer = require("multer")
const app = express()
const port = config.port
const host = config.host || '127.0.0.1'

// Validators
const RegisterValidator = require("./validators/register.validator")
const LoginValidator = require('./validators/login.validator')
const FilesValidator = require('./validators/files.validator')
const UploadValidator = require('./validators/upload.validator')

// Controllers
const RegisterController = require("./controllers/register.controller")
const LoginController = require('./controllers/login.controller')
const LogoutController = require('./controllers/logout.controller')
const ProfileController = require('./controllers/profile.controller')
const UploadController = require('./controllers/upload.controller')
const FilesController = require('./controllers/files.controller')
const UsersController = require('./controllers/users.controller')

// Middlewares
const AuthMiddleware = require('./middlewares/auth.middleware')
const { handleErrors } = require("./supports/helper");

app.use(cors({ origin: config.corsDomain }))
app.use(express.json())
app.use('/me', AuthMiddleware.intercept)

app.get('/', (req, res) => {
    res.send({
        state: 'success',
        message: 'TenaPhoto Api'
    })
})

app.post('/register', RegisterValidator.validate, RegisterController.register)
app.post('/login', LoginValidator.validate, LoginController.login)
app.get('/logout', LogoutController.index)
app.get('/me', ProfileController.index)

// Upload
const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });
app.post('/me/upload', upload.single('file'), UploadValidator.validate, UploadController.index)
app.get('/me/files', FilesController.index)
app.get('/me/users', UsersController.index)
app.post('/me/files/share', FilesValidator.validate, FilesController.share)


handleErrors(app)


app.listen(port, () => console.log(`App listening on http://${host}:${port}`))