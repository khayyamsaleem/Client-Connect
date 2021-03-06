require('dotenv').config()

const PORT = process.env.PORT || 3000
const dev = process.env.NODE_DEV !== 'production'

const nextApp = require('next')({ dev })
const handle = nextApp.getRequestHandler()

const bodyParser = require('body-parser')
const session = require('express-session')
const mongoSessionStore = require('connect-mongo')
const mongoose = require('mongoose')
const redis = require('redis')

const logger = require('./logs')
const api = require('./api')

const MONGO_URL = dev ? process.env.MONGO_URL_TEST : process.env.MONGO_URL
const REDIS_URL = process.env.REDIS_URL || `http://localhost:6379`
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
    server = app.listen(PORT, () => logger.info(`server running @ ${ROOT_URL}`))


    const io = require('socket.io').listen(server)

    
    const redisClient = redis.createClient(REDIS_URL)


    //check redis conn
    redisClient.on('connect', function() {
        console.log('Redis client connected');
    });

    // error if Redis conn fails
    redisClient.on("error", function (err) {
        console.log("Error " + err);
    });
    
    
    // redis test function
    redisClient.set('my test key', 'my test value', redis.print);
    redisClient.get('my test key', function (error, result) {
        if (error) {
            console.log(error);
            throw error;
        }
        console.log('GET result ->' + result);
    });
    

    // object to hold users connected to socket.io
    const users = {}
    let username = ''
    let receiver = ''

    // message history to cache in redis, array of message objects

    io.on('connection', function (client) {
        let socketid = client.id
        let msgHist = []

        client.on('SEND_MESSAGE', async function (data) {
            curr_user = data.from
            curr_rcvr = data.to
            // loop through username from socket data, build new string to save usernames and their socket id
            let temp1 = ''
            for(var i = 0; i < curr_user.length; i++){
                temp1 += curr_user[i]
            }
            username = temp1
            users[username] = socketid
            temp1 = ''
            delete users['']

            dataHist = data.message
            msgHist.push(dataHist)
        
            io.emit('RECEIVE_MESSAGE', data)
        })

        client.on('disconnect', function() {
            //remove user from active list of user when they disconnect (any time they leave profile page)
            delete users[username]
            console.log("DISCONNECTED")

            //stringify message history to cache in redis
            msgHist = JSON.stringify(msgHist)
            redisClient.set("Chat:History", msgHist, redis.print);
            
 
        })
    })

})
