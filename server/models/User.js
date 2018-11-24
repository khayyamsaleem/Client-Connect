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
        type: String,
        required: true
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    avatar: {
        type: String
    }
})

class UserClass {
    static publicFields() {
        return ['id', 'firstName', 'middleName', 'lastName', 'userName', 'email', 'userType']
    }

    static userExists(query){
        return this.find({
            userName: query
        })
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

    static async signInOrSignUp({email, userName, firstName, lastName, userType, middleName, avatar, password}){
        const user = await this.findOne({ userName }).select(UserClass.publicFields().join(' '))
        if (user) return user
        const newUser = await this.create({
            avatar,
            email,
            userName,
            firstName,
            middleName,
            lastName,
            userType,
            password
        }, (err, u) => (err) ? console.log(err.message) : u)
        return newUser
    }

}

mongoSchema.loadClass(UserClass)

const User = mongoose.model('User', mongoSchema)
module.exports = User
