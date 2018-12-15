const express = require('express')
const router = express.Router()
const logger = require('../logs')
const Project = require('../models/Project')
const User = require('../models/User')

router.post('/new', async (req, res) => {
    const { title, description, skills, currentUser } = req.body
    const newProj = new Project({title, description, skills, owner: currentUser._id})
    const user = await User.findById(currentUser._id)
    newProj.save(async (err) => {
        if (err) {
            res.status(500).json({ success: false, err: err.message || err.toString() })
        } else {
            await user.projects.push(newProj._id)
            user.save((err) => {
                if (err) {
                    res.status(500).json({ success: false, err: err.message || err.toString() })
                } else {
                    res.json({ success: true, message: `Registered ${title} to ${currentUser.firstName}` })
                }
            })
        }
    })
})

router.get('/get', async (req, res) => {
    const { userId } = req.query
    const user = await User.findById(userId)
    const projects = await Project.find({
        $or : [
            { owner : user._id },
            { freelancer: user._id }
        ]
    })
    res.json({
        success: true,
        projects
    })
})

router.post('/assign-freelancer-to-project', async (req, res) => {
    const { userId, projectId } = req.body
    const project = await Project.findById(projectId)
    const user = await User.findById(userId)
    project.freelancer = user._id
    project.save(async (err) => {
        if (err) {
            res.status(500).json({success: false, err: err.message || err.toString()})
        } else {
            user.projects.push(projectId)
            user.save(async (err) => {
                if (err) {
                    res.status(500).json({success: false, err: err.message || err.toString()})
                } else {
                    res.json({success: true, message: 'added Freelancer to project'})
                }
            })
        }
    })
})

module.exports = router