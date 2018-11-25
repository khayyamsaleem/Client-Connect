const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    email: {
        type: String,
        required: true
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
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
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

    static async userExists(query){
        const u = await this.find({userName : query})
        if(u.length > 0)
            return true
        else
            return false
    }

    static async seedUser(u){
        const {firstName, lastName, email, userName, userType, password, joinDate} = u
        let hashedPassword = this.generateHash(password)
        if (await this.userExists(userName)) return {success: false, error: "User already in DB"}
        const created = await this.create({
            firstName,
            lastName,
            email,
            userName,
            userType,
            password: hashedPassword,
            joinDate
        })
        return created
    }

    static async getUser(userName){
        return await this.findOne({userName})
    }

    static async search(query) {
        return await this.find(
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

    static async signInOrSignUp({email, userName, firstName, lastName, userType, middleName, password}){
        const user = await this.findOne({ userName }).select(UserClass.publicFields().join(' '))
        if (user) return user
        let hashedPassword = this.generateHash(password)
        const newUser = await this.create({
            email : email,
            userName : userName,
            firstName : firstName,
            middleName : middleName,
            lastName : lastName,
            userType : userType,
            password: hashedPassword
        })
        return newUser
    }

    static generateHash(password){
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
    }

    static verifyPassword(password, hashedPassword){
        return bcrypt.compareSync(password, hashedPassword)
    }

}

userSchema.loadClass(UserClass)

const User = mongoose.model('User', userSchema)
module.exports = User
