const userApi = require('./user')

function api(server){
    server.use('/api/users', userApi)
}

module.exports = api
