const userApi = require('./user')
const projectApi = require('./project')

function api(server){
    server.use('/api/users', userApi)
    server.use('/api/projects', projectApi)
}

module.exports = api
