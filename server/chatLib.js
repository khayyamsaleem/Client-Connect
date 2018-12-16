const client = require('./redisClientLib')

const fetchMessages = async () => {
    try {
        const rc = await client()
        const messages = await rc.lrangeAsync("messages", 0, -1)
        return messages
    } catch (err) {
        console.log("error getting messages!")
        console.error(err)
    }
}

const addMessage = async message => {
    try {
        const rc = await client()
        const result = await rc
                                .multi()
                                .rpush("messages", message)
                                .execAsync()
        return result
    } catch (err) {
        console.log("error adding message")
        console.error(err)
    }
}

const fetchActiveUsers = async () => {
    try {
        const rc = await client()
        const users = await rc.smembersAsync("users")
        return users
    } catch (err) {
        console.log("error fetching active users")
        console.error(err)
    }
}

const addActiveUser = async user => {
    try {
        const rc = await client()
        const result = await rc.multi().sadd("users", user).execAsync()
        if (result[0] === 1){
            return {success: true, message: "successfully added user"}
        }
        return {success: false, message: "user already added"}
    } catch (err) {
        console.log(`attempting to add ${user}`)
        console.log("error adding active user")
        console.error(err)
    }
}

const removeActiveUser = async user => {
    try {
        const rc = await client()
        const result = await rc.multi().srem("users", user).execAsync()
        if (result === 1){
            console.log(`successfully disconnected ${user}`)
            return {success: true, message: "user removed"}
        } else {
            return {success: false, message: "user not in list"}
        }
    } catch (err) {
        console.log("error removing active user")
        console.error(err)
    }
}

module.exports = {
    fetchMessages,
    addMessage,
    fetchActiveUsers,
    addActiveUser,
    removeActiveUser
}