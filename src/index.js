const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 4000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
  console.log('New websocket connection')

  socket.emit('message', 'welcome')
  socket.broadcast.emit('message', 'a new user has joined')

  socket.on('sendMessage', (message, cb) => {
    const filter = new Filter()

    if(filter.isProfane(message)){
      return cb('Profanity is not allowed')
    }
    io.emit('message', message)
    cb('delivered')
  })

  socket.on('shareLocation', (res, cb) => {
      io.emit('message', `https://google.com/maps?q=${res.latitude},${res.longitude} `)
      cb()
  })

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left')
  })
})

server.listen(port, () => {
  console.log(`server is up on port ${port}`)
})
