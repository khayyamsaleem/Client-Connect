require('dotenv').config()
const redis = require("redis")
const promise = require("bluebird")

const REDIS_URL = process.env.REDIS_URL || "http://localhost:6379"

promise.promisifyAll(redis.RedisClient.prototype)
promise.promisifyAll(redis.Multi.prototype)

const client = async () => {
    const connector = await redis.createClient(REDIS_URL)
    connector.on("error", () => {
        console.log("redis connection failed")
        return {}
    })
    const conn = connector.on("connect", () => {
        return connector
    })
    return conn
}

module.exports = client