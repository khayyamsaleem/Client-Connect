const userApi = require('./user')
const projectApi = require('./project')
const messageApi = require('./messages')

function api(server){
    server.use('/api/users', userApi)
    server.use('/api/projects', projectApi)
    server.use('/api/messages', messageApi)
}

module.exports = api
