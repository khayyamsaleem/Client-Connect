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
    },
    skills: {
        type: [String],
        default: []
    },
    complete: {
        type: Boolean,
        required: true,
        default: false
    }
})

const Project = mongoose.model('Project', projectSchema)
module.exports = Project