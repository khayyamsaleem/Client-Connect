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
    server = app.listen(PORT, () => logger.info(`server running @ ${ROOT_URL}`))


    const io = require('socket.io').listen(server)

    
    var redis = require('node-redis')
    var redisClient = redis.createClient()

    redisClient.on('connect', function() {
        console.log('Redis client connected');
    });

    
    redisClient.on("error", function (err) {
        console.log("Error " + err);
    });
    
    //test connection
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
    const rooms = {}
    username = ''
    reciever = ''

    // message history to cache in redis
    msgHist = []

    io.on('connection', function (client) {
        let socketid = client.id

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

            console.log(users)
            dataHist = data.message
            msgHist.push(dataHist)
        
            io.emit('RECIEVE_MESSAGE', data)
        })

        client.on('disconnect', function() {
            //remove user from active list of user when they disconnect (any time they leave profile page)
            delete users[username]
            console.log('User disconnected')
            console.log(msgHist)
            msgHist = JSON.stringify(msgHist)
        
            redisClient.set("Chat:History", msgHist, redis.print);
            
 
        })
    })

})
