const express = require('express')
const router = express.Router()
const logger = require('../logs')
const User = require('../models/User')

router.post('/login', async (req, res) => {
    const {userName, password} = req.body
    const u = User.signInOrSignUp({userName})
})

router.post('/register', async (req, res) => {
    try {
        const { email, firstName, lastName, userName, middleName, userType} = req.body
        const u = await User.signInOrSignUp({email, userName, firstName, lastName, userType, middleName})
        res.json(u)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error : err.message || err.toString() })
    }
})

router.post('/exists', async (req, res) => {
    try {
        res.json({ exists: await User.userExists(req.body.query)})
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
        res.status(500).json({ error : err.message || err.toString() })
    }
})


module.exports = router
