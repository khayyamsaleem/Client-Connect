const mongoose = require('mongoose')
const { Schema } = mongoose

const mongoSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    userType: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    middleName: String,
    lastName: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    joinDate: {
        type: Date,
        default: Date.now
    }
})

class UserClass {
    static publicFields() {
        return ['id', 'firstName', 'middleName', 'lastName', 'userName', 'email', 'userType']
    }

    static userExists(query){
        if(this.find({userName: query}))
            return true
        else
            throw `User ${query} not found!`
    }

    static search(query) {
        return this.find(
            {
                $or: [
                    { userName: { $regex: query, $options: 'i' } },
                    { firstName: { $regex: query, $options: 'i'} },
                    { lastName: { $regex: query, $options: 'i'} },
                    { email: { $regex: query, $options: 'i' } },
                ],
            },
            UserClass.publicFields().join(' '),
        )
    }

    static async signInOrSignUp({email, userName, firstName, lastName, userType, middleName}){
        const user = await this.findOne({ userName }).select(UserClass.publicFields().join(' '))
        if (user) return user
        const newUser = await this.create({
            email,
            userName,
            firstName,
            middleName,
            lastName,
            userType
        }, (err, u) => (err) ? console.log(err.message) : u)
        return newUser
    }

}

mongoSchema.loadClass(UserClass)

const User = mongoose.model('User', mongoSchema)
module.exports = User
