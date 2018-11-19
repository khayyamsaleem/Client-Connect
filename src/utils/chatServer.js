const server = require('http').createServer()
const io - require('socket.io')(server)

io.on('connection', client => {
    client.on('register', handleRegister)
    client.on('join', handleJoin)
    client.on('leave', handleLeave)
    client.on('disconnect', )
    client.on('error', (err) => {
        console.log(`Received error from client ${client.id}`)
        console.log(err)
    })
})

server.listen(3001, err => {
    if (err) throw err
    console.log(`Chat server listening on 3001`)
})
