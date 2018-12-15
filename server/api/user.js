const express = require('express')
const router = express.Router()
const logger = require('../logs')
const User = require('../models/User')
const UserSession = require('../models/UserSession')

router.post('/login', async (req, res) => {
    const { userName, password } = req.body
    const u = await User.getUser(userName)
    if (!User.verifyPassword(password, u.password)) {
        res.json({ auth_error: 'Invalid Password!' })

    } else {
        const userSession = new UserSession()
        userSession.userId = u._id
        userSession.save((err, doc) => {
            if (err) {
                logger.error(err)
                return res.status(500).json({ success: false, error: 'Server Error' })
            }
            return res.json({ success: true, message: "Logged In", token: doc._id })
        })
    }
})

router.get('/verify', async (req, res) => {
    const { token } = req.query
    UserSession.find({
        _id: token,
        isDeleted: false
    }, (err, sessions) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                success: false,
                message: 'Error: Server error'
            })
        }
        if (sessions.length != 1) {
            return res.json({
                success: false,
                message: 'Error: Invalid token'
            })
        } else {
            return res.json({
                success: true,
                message: 'TOKEN VERIFIED'
            })
        }
    })
})

router.get('/logout', async (req, res) => {
    const { token } = req.query
    UserSession.findOneAndUpdate({
        _id: token,
        isDeleted: false
    },
    {
        $set: { isDeleted: true }
    }, null, (err, sessions) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: err })
        }
        return res.json({ success: true, message: "Logged Out" })
    })
})

router.post('/register', async (req, res) => {
    try {
        const { email, firstName, lastName, userName, middleName, userType, password } = req.body
        const u = await User.signInOrSignUp({ email, userName, firstName, lastName, userType, middleName, password })
        res.json(u)
    } catch (err) {
        logger.error(err)
        res.status(500).json({ error: err.message || err.toString() })
    }
})

router.post('/exists', async (req, res) => {
    try {
        res.json({ exists: await User.userExists(req.body.userName) })
    } catch (err) {
        res.status(500).json({ error: err.message || err.toString() })
    }
})

router.post('/search', async (req, res) => {
    try {
        const { query } = req.body
        const u = await User.search(query)
        res.json(u)
    } catch (err) {
        res.status(500).json({ error: err.message || err.toString() })
    }
})

router.post('/admin/seed-user', async (req, res) => {
    try {
        const u = await User.seedUser(req.body.user)
        res.json(u)
    } catch (err) {
        res.status(500).json({ error: err.message || err.toString() })
    }
})

router.put('/update', async (req, res) => {
    try {
        const u = await User.getUser(req.body.userName)
        const r = await User.updateField(u, req.body.field, req.body.newValue)
        res.json(r)
    } catch (err) {
        res.status(500).json({error: err.message || err.toString() })
    }
})

router.get('/get', async (req, res) => {
    try {
        const { token } = req.query
        const sess = await UserSession.findById(token)
        if (sess.isDeleted) {
            console.log("error, tried to fetch user for logged-out user")
            return res.json({ success: false, err: 'Not Logged In!' })
        }
        const currentUser = await User.findById(sess.userId)
        res.json({ success: true, currentUser })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message || err.toString() })
    }
})

router.post('/update-skills', async (req, res) => {
    const { userId, skills } = req.body
    User.updateOne({ _id: userId }, { $set: { skills } }, (err, result) => {
        if (err) throw err
        res.json({ success: true, message: `Updated skills of user with userId ${userId}`, result })
    })
})

module.exports = router
