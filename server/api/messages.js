const express = require('express')
const router = express.Router()
const redisClient = require('../redisClientLib')
const chatLib = require('../chatLib')

router.get('/messages', async (req, res) => {
    const messages = await chatLib.fetchMessages()
    res.json({success: true, messages})
})

router.get('/users', async (req, res) => {
    const users = await chatLib.fetchActiveUsers()
    res.json({success: true, users})
})

router.post('/user', async (req, res) => {
    try {
        const { user } = req.body
        const users = await chatLib.fetchActiveUsers()
        if (!users.includes(user)) {
            await chatLib.addActiveUser(user)
            const rc = await redisClient()
            const message = {
                message: `${user} is now available`,
                user: "system",
                timestamp: Date.now()
            }
            rc.publish("chatMessages", JSON.stringify(message))
            rc.publish("activeUsers", JSON.stringify(await chatLib.fetchActiveUsers()))
            await chatLib.addMessage(JSON.stringify(message))
            res.json({success: true, message: `user ${user} successfully joined`})
        } else {
            res.json({success: false, message: `${user} already joined`})
        }
    } catch (err) {
        console.log("error adding user (server)")
        res.status(500).json({success: false, message: err.message || err.toString()})
    }
})

router.delete('/user', async (req, res) => {
    try {
        const users = await chatLib.fetchActiveUsers()
        const { user } = req.body
        if(users.includes(user)){
            await chatLib.removeActiveUser(user)
            const rc = await redisClient()
            const message = {
                message: `${user} disconnected`,
                user: 'system'
            }
            rc.publish("chatMessages", JSON.stringify(message))
            rc.publish("activeUsers", JSON.stringify(await chatLib.fetchActiveUsers()))
            await chatLib.addMessage(JSON.stringify(message))
            res.json({success: true, message: `${user} removed`})
        } else {
            res.status(403).json({success: false, message: `${user} does not exist`})
        }
    } catch (err) {
        console.log("error deleting user (server)")
        res.status(500).json({success: false, message: err.message || err.toString()})
    }
})

router.post('/message', async (req, res) => {
    try {
        const { message, user } = req.body
        const msg = {
            message,
            user
        }
        const rc = await redisClient()
        await chatLib.addMessage(JSON.stringify(msg))
        res.json({success: true, message: 'message sent'})
    } catch (err) {
        console.log(err)
        res.status(500).json({success: false, message: err.message || err.toString()})
    }
})

module.exports = router