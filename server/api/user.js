const express = require('express')
const router = express.Router()
const logger = require('../logs')
const User = require('../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport')

router.post('/login', async (req, res) => {
    const {userName, password} = req.body
    const u = User.signInOrSignUp({userName})
    const match = await bcrypt.compare(password, u.password)
    if (match) {
        const payload = {id, userName, firstName, lastName, avatar} = u
        jwt.sign(payload, 'secret', {
            expiresIn: 3600
        }, (err, token) => {
            if (err) console.error(err)
            else res.json({success: true, token: `Bearer ${token}`})
        })
    } else {
        res.status(400).json({success: false, error: "Incorrect Password"})
    }
})

router.post('/register', async (req, res) => {
    try {
        const { email, firstName, lastName, userName, middleName, userType, password } = req.body
        const avatar = gravatar.url(email, {s: '200', r: 'pg', d:'mm'})
        let hashedPassword;
        bcrypt.genSalt(10, (err, salt) => {
            if(err) console.error('There was an error', err);
            else {
                bcrypt.hash(password, salt, (err, hash) => {
                    if(err) console.error('There was an error', err)
                    else hashedPassword = hash
                })
            }
        })
        const u = await User.signInOrSignUp({email, userName, firstName, lastName, userType, middleName, avatar, hashedPassword})
        res.json(u)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error : err.message || err.toString() })
    }
})

router.post('/exists', async (req, res) => {
    try {
        res.json(await User.userExists(req.body.query))
    } catch (err) {
        console.error(err)
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

router.get('/profile', passport.authenticate('jwt', { session: false}), (req, res) => {
    const {userName, firstName, lastName, email} = req.user
    return res.json({userName, firstName, lastName, email})
})

module.exports = router
