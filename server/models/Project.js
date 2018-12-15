const mongoose = require('mongoose')
const { Schema } = mongoose

const projectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true
    },
    freelancer: {
        type: Schema.Types.ObjectId
    }
})

const Project = mongoose.model('Project', projectSchema)
module.exports = Project