require('dotenv').config()

const PORT = process.env.PORT || 3000
const dev = process.env.NODE_DEV !== 'production'

const nextApp = require('next')({ dev })
const handle = nextApp.getRequestHandler()

const bodyParser = require('body-parser')
const session = require('express-session')
const mongoSessionStore = require('connect-mongo')
const mongoose = require('mongoose')

const logger = require('./logs')
const api = require('./api')


const MONGO_URL = dev ? process.env.MONGO_URL_TEST : process.env.MONGO_URL
const ROOT_URL = dev ? `http://localhost:${PORT}` : process.env.PROD_URL

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
}

mongoose.connect(
  MONGO_URL,
  options
)

const sessionSecret = process.env.SESSION_SECRET

nextApp.prepare().then(() => {
    const app = require('express')()
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended : true }))
    const MongoStore = mongoSessionStore(session)

    const sess = {
        name: 'clientconnect.sid',
        secret: sessionSecret,
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            ttl: 14 * 24 * 60 * 60, // save session 14 days
        }),
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 14 * 24 * 60 * 60 * 1000, // expires in 14 days
        },
    }

    api(app)

    if (!dev) {
        app.set('trust proxy', 1); // trust first proxy
        sess.cookie.secure = true; // serve secure cookies
    }

    app.use(session(sess))



    app.get('*', (req, res) => {
        return handle(req, res)
    })


    app.listen(PORT, () => logger.info(`server running @ ${ROOT_URL}`))
})
